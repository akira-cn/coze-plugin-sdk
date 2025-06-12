import path from 'node:path';
import fs from 'node:fs';
import { setTimeout } from 'timers/promises';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import puppeteer from 'puppeteer-core';
import { createTempDir, getGlobalConfig } from '../core';

interface ConvertOptions {
  code: string;
  duration: number; // 秒
  width?: number;
  height?: number;
  deviceScaleFactor?: number;
  sample_ratio?: number;
}

export async function htmlToVideo({
  code,
  duration = 2,
  width,
  height,
  deviceScaleFactor = 1,
  sample_ratio = 10,
}: ConvertOptions): Promise<string> {
  sample_ratio = sample_ratio || 10;

  const apiKey = getGlobalConfig('browser')?.apiKey;
  if(!apiKey) {
    throw new Error('请先配置 browser apiKey');
  }

  // 写入 /tmp 目录
  const tmpDir = createTempDir();
  
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://production-sfo.browserless.io/?token=${apiKey}`,
  });

  const page = await browser.newPage();
  
  // await page.setViewport({ width, height });

  // 包裹 SVG 成 HTML 页面
  const html = code;
  await page.setContent(html);


  // 获取页面实际尺寸
  let dimensions = { width, height };
  if(!dimensions.width) {
    dimensions = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    }));
  }

  await page.setViewport({ ...dimensions as { width: number, height: number }, deviceScaleFactor });

  // 启动 DevTools 会话
  const client = await page.target().createCDPSession();
  // 0.1 = 动画统一放慢 sample_ratio 倍，因为要考虑 browserless 延迟，直接原速度截图生成动画会卡
  await client.send('Animation.setPlaybackRate', { playbackRate: 1 / sample_ratio });
  const frames: Buffer[] = [];

  await client.send('Page.startScreencast', {
    format: 'png',
    everyNthFrame: 1,
  });

  client.on('Page.screencastFrame', async (res) => {
    const buffer = Buffer.from(res.data, 'base64');
    frames.push(buffer);
    console.log('capturing frame', frames.length, '...');
    await client.send('Page.screencastFrameAck', { sessionId: res.sessionId });
  });

  await setTimeout(sample_ratio * duration * 1000);
  await client.send('Page.stopScreencast');
  await browser.close();

  const framePrefix = path.join(tmpDir, 'frame_');
  for (let i = 0; i < frames.length; i++) {
    const filename = `${framePrefix}${String(i).padStart(4, '0')}.png`;
    fs.writeFileSync(filename, frames[i]);
  }

  const outputPath = path.join(tmpDir, 'output.mp4');

  await new Promise<void>((resolve: any, reject) => {
    ffmpeg()
      .setFfmpegPath(ffmpegPath!)
      .input(`${framePrefix}%04d.png`)
      .inputFPS(frames.length / duration)
      .outputOptions([
        '-pix_fmt yuv420p',
        `-t ${duration}`,
      ])
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  return outputPath;
}
