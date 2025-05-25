import { sleep } from './utils';

enum ViduResultState {
  created = 'created',
  queueing = 'queueing',
  processing = 'processing',
  success = 'success',
  failed = 'failed',
  timeout = 'timeout',
}

interface ViduResult {
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

export async function getViduResult(apiKey: string, taskId: string, timeout = 180000): Promise<ViduResult> {
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
    if(timeCost > timeout) {
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