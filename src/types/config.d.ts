// 用来给 Coze 鉴权
interface IJWTConfig {
  appId: string,
  userId: string,
  keyid: string,
  privateKey: string,
}

interface IWorkflows {
  [key: string]: string;
  fileUploader: string; // 用来上传临时文件
}

interface IOSSConfig {
  oss: {
    bucket: string;
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    cdnUrl: string;
  }
}

export interface IGlobalConfig {
  baseUrl: string; // 默认值 https://api.coze.cn,
  workflows?: IWorkflows;
  jwt?: IJWTConfig;
  aliyun?: IOSSConfig
}
