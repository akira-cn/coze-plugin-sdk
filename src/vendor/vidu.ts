import { sleep, getGlobalConfig } from '../core';
import { detectMimeType } from '../media';

enum ViduResultState {
  created = 'created',
  queueing = 'queueing',
  processing = 'processing',
  success = 'success',
  failed = 'failed',
  timeout = 'timeout',
}

export interface IViduResult {
  task_id: string;
  state: ViduResultState;
  creations: {
    id: string;
    cover_url: string;
    url: string;
    watermarked_url: string;
  }[];
  errorMsg: string;
}

export interface IViduCreationOptions {
  model: string,
  images?: string[],
  style?: string,
  prompt?: string,
  duration?: number,
  seed?: number,
  resolution?: string,
  movement_amplitude?: string,
  callback_url?: string,
  timeout?: number,
  bgm?: boolean,
}

export interface IAudioTextOptions {
  model: string,
  prompt: string,
  duration?: number,
  seed?: number,
  callback_url?: string,
}

export interface IAudioTimingOptions {
  model: string,
  timing_prompts: Array<{ from:number, to:number, prompt: string }>,
  duration?: number,
  seed?: number,
  callback_url?: string,
}

export async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch image. Status: ${res.status}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mime = detectMimeType(buffer);

  if (!mime) {
    throw new Error('Unsupported or unknown image type.');
  }

  const base64 = buffer.toString('base64');
  return `data:${mime};base64,${base64}`;
}

export async function getViduResult(taskId: string,  timeout: number = 180): Promise<IViduResult> {
  const apiKey = getGlobalConfig('vidu')?.apiKey;
  if(!apiKey) {
    throw new Error('请先配置 vidu apiKey');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${apiKey}`,
  };
  const stateUrl = `https://api.vidu.cn/ent/v2/tasks/${taskId}/creations`;

  const startTime = Date.now();
  let errorMsg = '';
  let creations: { id: string, cover_url: string, url: string, watermarked_url: string }[] = [];
  let state: ViduResultState = ViduResultState.created;

  do {
    await sleep(100); // sleep 100ms
    const result = await (await fetch(stateUrl, {
      headers,
      method: 'GET',
    })).json();
    state = result.state;
    if(state === 'failed') {
      errorMsg = result.err_code;
      break;
    }
    if(state === 'success') {
      creations = result.creations;
      break;
    }
    const timeCost = Date.now() - startTime;
    if(timeCost > timeout * 1000) {
      state = ViduResultState.timeout;
      break;
    }
  } while(1);

  return {
    task_id: taskId,
    state,
    creations,
    errorMsg,
  };
}

// 文生图
async function generateVideo(api: string, imageUrls: string[], options: IViduCreationOptions): Promise<IViduResult|{ errorMsg: unknown }> {
  const apiKey = getGlobalConfig('vidu')?.apiKey;
  if(!apiKey) {
    throw new Error('请先配置 vidu apiKey');
  }

  const images = await Promise.all(imageUrls.map(fetchImageAsBase64));

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${apiKey}`,
  };

  const { model, prompt, style, duration, seed, resolution, movement_amplitude, callback_url, timeout, bgm } = options;

  const payload: IViduCreationOptions = {
    model,
  };

  if(images && images.length > 0) payload.images = images;
  if(style) payload.style = style;
  if(prompt) payload.prompt = prompt;
  if(duration) payload.duration = duration;
  if(seed != null) payload.seed = seed;
  if(resolution) payload.resolution = resolution;
  if(movement_amplitude) payload.movement_amplitude = movement_amplitude;
  if(callback_url) payload.callback_url = callback_url;
  if(bgm) payload.bgm = bgm;

  const res = await (await fetch(api, {
    headers,
    method: 'POST',
    body: JSON.stringify(payload),
  })).json();

  const { task_id } = res;

  if(!task_id) {
    return {
      errorMsg: res,
    };
  }

  const result = await getViduResult(task_id, timeout);

  return {
    ...result,
  };
}

export async function imageToVideo(imageUrl: string, options: IViduCreationOptions): Promise<IViduResult|{ errorMsg: unknown }> {
  return generateVideo('https://api.vidu.cn/ent/v2/img2video', [imageUrl], options);
}

export async function startEndToVideo(startImageUrl: string, endImageUrl: string, options: IViduCreationOptions): Promise<IViduResult|{ errorMsg: unknown }> {
  return generateVideo('https://api.vidu.cn/ent/v2/start-end2video', [startImageUrl, endImageUrl], options);
}

export async function referenceToVideo(referenceImageUrl: string, options: IViduCreationOptions): Promise<IViduResult|{ errorMsg: unknown }> {
  if(!options.prompt) {
    throw new Error('prompt is required');
  }
  return generateVideo('https://api.vidu.cn/ent/v2/reference2video', [referenceImageUrl], options);
}

export async function textToVideo(options: IViduCreationOptions): Promise<IViduResult|{ errorMsg: unknown }> {
  if(!options.prompt) {
    throw new Error('prompt is required');
  }
  return generateVideo('https://api.vidu.cn/ent/v2/text2video', [], options);
}

export async function textToAudio(options: IAudioTextOptions): Promise<IViduResult|{ errorMsg: unknown }> {
  const apiKey = getGlobalConfig('vidu')?.apiKey;
  if(!apiKey) {
    throw new Error('请先配置 vidu apiKey');
  }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${apiKey}`,
  };

  const { model, prompt, duration, seed, callback_url } = options;
  const payload: IAudioTextOptions = {
    model,
    prompt,
  };
  if(duration) payload.duration = duration;
  if(seed!= null) payload.seed = seed;
  if(callback_url) payload.callback_url = callback_url;

  const res = await (await fetch('https://api.vidu.cn/ent/v2/text2audio', {
    headers,
    method: 'POST',
    body: JSON.stringify(payload),
  })).json();

  const { task_id } = res;
  if(!task_id) {
    return {
      errorMsg: res,
    };
  }

  const result = await getViduResult(task_id);

  return {
    ...result,
  };
}

export async function timingToAudio(options: IAudioTimingOptions): Promise<IViduResult|{ errorMsg: unknown }> {
  const apiKey = getGlobalConfig('vidu')?.apiKey;
  if(!apiKey) {
    throw new Error('请先配置 vidu apiKey');
  }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${apiKey}`,
  };

  const { model, timing_prompts, duration, seed, callback_url } = options;
  const payload: IAudioTimingOptions = {
    model,
    timing_prompts,
  };
  if(duration) payload.duration = duration;
  if(seed!= null) payload.seed = seed;
  if(callback_url) payload.callback_url = callback_url;

  const res = await (await fetch('https://api.vidu.cn/ent/v2/timing2audio', {
    headers,
    method: 'POST',
    body: JSON.stringify(payload),
  })).json();

  const { task_id } = res;
  
  if(!task_id) {
    return {
      errorMsg: res,
    };
  }

  const result = await getViduResult(task_id);

  return {
    ...result,
  };
}