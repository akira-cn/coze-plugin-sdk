import Client from 'ali-oss';
import path from 'node:path';
import mime from 'mime';
import fs from 'node:fs/promises';
import { detectMimeType } from '../media';
import { getGlobalConfig, getTempPath } from '../core';

export interface UploadFileResponse {
  HttpCode: number;
  Message: string;
  url?: string;
}

export async function uploadFile(buffer: Buffer | string, filename: string, dir: string = 'resource'): Promise<UploadFileResponse> {
  dir = `${dir}/${Math.random().toString(36).slice(2, 12)}`;
  filename = decodeURI(filename);
  buffer = typeof buffer ==='string'? Buffer.from(buffer) : buffer;

  const ossConfig = getGlobalConfig('aliyun')?.oss;
  if (!ossConfig) {
    return { HttpCode: 500, Message: '未配置阿里云OSS' };
  }
  
  const client = new Client({
    region: ossConfig.region, // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
    accessKeyId: ossConfig.accessKeyId, // 确保已设置环境变量OSS_ACCESS_KEY_ID。
    accessKeySecret: ossConfig.accessKeySecret, // 确保已设置环境变量OSS_ACCESS_KEY_SECRET。
    bucket: ossConfig.bucket, // 示例：'my-bucket-name'，填写存储空间名称。
  });

  const cdnUrl = ossConfig.cdnUrl;

  try {
    const data: UploadFileResponse = { HttpCode: 201, Message: '上传成功' };
    const filepath = path.join(dir, filename);
    const res = await client.put(filepath, buffer);
    if (res.res.status >= 200 && res.res.status < 300) {
      data.url = `${cdnUrl}/${filepath}`;
    }
    return data;
  } catch (ex: any) {
    return { HttpCode: 500, Message: ex, url: filename };
  }
}

export async function uploadFromTempFile(tmpFile: string, autoClear = true): Promise<UploadFileResponse> {
  const buffer = await fs.readFile(tmpFile);
  try {
    const res = await uploadFile(buffer, path.basename(tmpFile));
    return res;
  } finally {
    if(autoClear) {
      const tmpDir = getTempPath(tmpFile);
      console.log('removing tmp dir...', tmpDir);
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  }
}

// 通过 URL 上传文件
export async function uploadFromURL(
  file: string,
): Promise<UploadFileResponse> {
  const res = await fetch(file);
  const contentType = res.headers.get('Content-Type');
  let ext = '';
  if(contentType) {
    ext = `.${mime.getExtension(contentType)}` || '';
  }
  const arrayBuffer = await res.arrayBuffer();
  const match = file.match(/([^./]*?\.[^./]*)~tplv/);
  const buffer = Buffer.from(arrayBuffer);

  let filename = match?.[1];
  if (ext && filename && !filename.endsWith(ext)) {
    filename += `${ext}`;
  }

  if (!filename) {
    if (!ext || ext === '.bin') {
      const mimeType = detectMimeType(buffer) || '';
      const extension = (mimeType.split('/'))[1];
      ext = extension ? `.${extension}` : '';
    }
    filename = `${Math.random().toString(36).slice(2, 10)}${ext}`;
  }

  return await uploadFile(buffer, filename);
}