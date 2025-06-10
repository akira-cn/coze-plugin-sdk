import Client from 'ali-oss';
import path from 'node:path';

export interface UploadFileResponse {
  HttpCode: number;
  Message: string;
  url?: string;
}

export interface OssConfig {
  OSS_ACCESS_KEY_ID: string,
  OSS_ACCESS_KEY_SECRET: string,
  OSS_STORAGE_HOST_URL: string,
  OSS_CDN_URL: string,
  OSS_REGION: string,
  OSS_BUCKET: string,
}

export async function uploadFile(ossConfig: OssConfig, buffer: Buffer | string, filename: string, dir: string = 'resource'): Promise<UploadFileResponse> {
  dir = `${dir}/${Math.random().toString(36).slice(2, 12)}`;
  
  const client = new Client({
    region: ossConfig.OSS_REGION, // 示例：'oss-cn-hangzhou'，填写Bucket所在地域。
    accessKeyId: ossConfig.OSS_ACCESS_KEY_ID, // 确保已设置环境变量OSS_ACCESS_KEY_ID。
    accessKeySecret: ossConfig.OSS_ACCESS_KEY_SECRET, // 确保已设置环境变量OSS_ACCESS_KEY_SECRET。
    bucket: ossConfig.OSS_BUCKET, // 示例：'my-bucket-name'，填写存储空间名称。
  });

  const cdnUrl = ossConfig.OSS_CDN_URL;

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