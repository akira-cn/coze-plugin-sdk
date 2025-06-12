// 用来给 Coze 鉴权
export interface IJWTConfig {
  appId: string,
  userId: string,
  keyid: string,
  privateKey: string,
}

export interface IWorkflows {
  [key: string]: string;
  fileUploader: string; // 用来上传临时文件
}

export interface IOSSConfig {
  oss: {
    bucket: string;
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    cdnUrl: string;
  }
}

export interface IBrowserConfig {
  apiKey: string; // browserless token
}

export interface IViduConfig {
  apiKey: string; // vidu API密钥
}

export interface IGlobalConfig {
  baseUrl: string; // 默认值 https://api.coze.cn,
  workflows?: IWorkflows;
  jwt?: IJWTConfig;
  aliyun?: IOSSConfig;
  browser?: IBrowserConfig;
  vidu?: IViduConfig;
}
