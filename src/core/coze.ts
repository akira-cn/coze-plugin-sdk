import path from 'node:path';
import fs from 'node:fs';
import { getJWTToken, type JWTToken } from '@coze/api';
import axios from 'axios';
import FormData from 'form-data';
import mime from 'mime';
import { v4 as uuidv4 } from 'uuid';
import { getGlobalConfig } from './config';

let tokenBuffer: JWTToken|null = null;

export async function applyToken(): Promise<JWTToken> {
  const now = Date.now();
  if (tokenBuffer && tokenBuffer.expires_in * 1000 > now) {
    return tokenBuffer;
  }

  const config = getGlobalConfig('jwt');
  const baseUrl = getGlobalConfig('baseUrl');
  if (!config) {
    throw new Error('JWT 配置不存在');
  }

  const payload = {
    baseURL: baseUrl,
    appId: config.appId,
    aud: new URL(baseUrl).host,
    keyid: config.keyid,
    privateKey: config.privateKey,
    sessionName: config.userId,
  };

  // 如果缓存不存在或即将过期，获取新 token
  tokenBuffer = await getJWTToken(payload);
  return tokenBuffer;
}

export function getTempPath(tmpPath: string): string {
  const match = tmpPath.match(/^(\/tmp\/.*?)\//);
  if (!match) {
    throw new Error('无法找到目录，这个文件不是临时文件');
  }
  const tmpDir = match[1];
  return tmpDir;
}

export async function uploadFile(tmpFile: string, autoClear = true): Promise<{ url: string }> {
  try {
    const jwtToken = (await applyToken()).access_token;
    const buffer = fs.readFileSync(tmpFile);

    const parsedFile = path.parse(tmpFile);

    const ext = parsedFile.ext || '';

    // 构建 form-data
    const form = new FormData();
    form.append('file', buffer, {
      filename: parsedFile.name + ext,
      contentType: mime.getType(ext) || 'application/octet-stream',
    });

    const baseURL = getGlobalConfig('baseUrl');

    // 提交请求
    const response = await axios.post(`${baseURL}/v1/files/upload`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    const data = response.data;

    const file_id = data.data.id;

    const workflowApi = 'https://api.coze.cn/v1/workflow/run';
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    };

    const workflows = getGlobalConfig('workflows');
    if (!workflows) {
      throw new Error('workflows 配置不存在');
    }

    const body = {
      workflow_id: workflows?.fileUploader,
      parameters: {
        file: JSON.stringify({ file_id }),
      },
    };

    const ret = await fetch(workflowApi, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    try {
      const resData = await ret.json();
      if(resData.code > 299) {
        throw new Error(resData.msg);
      }
      const { url } = JSON.parse(resData.data);

      return {
        url,
      };
    } catch(ex) {
      throw ex;
    }
  } finally {
    // 上传完成后删掉整个目录
    if(autoClear) {
      const tmpDir = getTempPath(tmpFile);
      console.log('removing tmp dir...', tmpDir);
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }
}

export function createTempDir(): string {
  const tempDir = path.join('/', 'tmp', uuidv4());
  fs.mkdirSync(tempDir, { recursive: true });
  return tempDir;
}

interface ILocalFile {
  file: string;
  contentType?: string;
  createOutput: (ext: string) => string;
}

export async function downloadFile(url: string, filename: string, tempDir = createTempDir()): Promise<ILocalFile> {
  if(url.startsWith('/tmp')) {
    // 这是本地文件，直接返回，这样的话才能允许ffmpeg的几个方法串行使用
    return {
      file: url,
      createOutput: (filename: string): string => {
        const tmpDir = path.join(getTempPath(url), uuidv4());
        fs.mkdirSync(tmpDir, { recursive: true });
        return path.join(tmpDir, filename);
      },
    };
  }
  const filePath = path.join(tempDir, filename);
  try {
    const response = await axios({ url, method: 'GET', responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    await new Promise<void>((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', (err: Error) => reject(err));
    });
    const ret: ILocalFile = {
      file: filePath,
      // 用 createOutput 创建的文件可以随着 output 上传自动删除，不会留在 tmp 目录下
      // 确保不会重名
      createOutput: (filename: string): string => {
        const tmpDir = path.join(getTempPath(filePath), uuidv4());
        fs.mkdirSync(tmpDir, { recursive: true });
        return path.join(tmpDir, filename);
      },
    };
    const contentType = response.headers['content-type'];
    if(contentType) ret.contentType = contentType;
    return ret;
  } catch(ex) {
    await fs.rmSync(tempDir, { recursive: true, force: true });
    throw ex;
  }
}

export async function downloadFiles(files: { url:string, filename:string }[]): Promise<ILocalFile[]> {
  const tempDir = createTempDir();
  const ret = await Promise.all(files.map((file) => downloadFile(file.url, file.filename, tempDir)));
  return ret;
}