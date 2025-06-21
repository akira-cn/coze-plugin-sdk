import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs, { existsSync, promises as fsPromises } from 'node:fs';
import path from 'node:path';
import { downloadFile, downloadFiles, getTempPath } from '../core';
import { detectMimeType } from './utils';
import { KenBurnsOptions } from '../types/config';

if(ffmpegStatic && existsSync(ffmpegStatic)) {
  ffmpeg.setFfmpegPath(ffmpegStatic as string);
}


/**
 * 将音频文件从一种格式转换为另一种格式
 * 
 * @param url - 输入音频文件网址
 * @param desType - 目标音频格式 (例如: 'mp3', 'wav', 'ogg', 'flac')
 * @param srcType - 源音频格式 (可选，如果未提供将通过检测文件头来确定)
 * @returns Promise<string> - 转换后的文件路径
 * 
 * @example
 * // 将 input.wav 转换为 MP3 格式
 * const outputPath = await convertAudio('https://site/to/path/sound.wav', 'mp3');
 *
 */
export async function convertAudio(
  url: string,
  desType: string,
  srcType?: string,
): Promise<string> {
  const inputFile = await downloadFile(url, 'input.wav');
  try {
    // 如果未提供源类型，则尝试检测
    if (!srcType) {
      const buffer = await fsPromises.readFile(inputFile.file);
      const mimeType = detectMimeType(buffer);
      
      if (!mimeType || !mimeType.startsWith('audio/')) {
        throw new Error(`无法检测到音频类型或文件不是音频文件: ${inputFile}`);
      }
      
      // 从 MIME 类型中提取格式 (例如 'audio/mpeg' -> 'mp3')
      srcType = mimeType.split('/')[1];
      // 特殊情况处理
      if (srcType === 'mpeg') srcType = 'mp3';
    }

    // 规范化目标类型
    desType = desType.toLowerCase().replace(/^\./,'');
    
    // 创建输出文件路径
    const outputFile = inputFile.createOutput(`output.${desType}`);

    // 执行转换
    await new Promise<string>((resolve, reject) => {
      ffmpeg(inputFile.file)
        .audioCodec(getAudioCodec(desType))
        .format(desType)
        .on('error', (err) => {
          reject(new Error(`音频转换失败: ${err.message}`));
        })
        .on('end', () => {
          resolve(outputFile);
        })
        .save(outputFile);
    });
    return outputFile;
  } catch (error) {
    throw new Error(`音频转换失败: ${error}`);
  }
}

/**
 * 根据目标格式获取适当的音频编解码器
 * 
 * @param format - 目标音频格式
 * @returns 适合该格式的编解码器
 */
function getAudioCodec(format: string): string {
  switch (format.toLowerCase()) {
    case 'mp3':
      return 'libmp3lame';
    case 'aac':
      return 'aac';
    case 'ogg':
    case 'oga':
      return 'libvorbis';
    case 'opus':
      return 'libopus';
    case 'flac':
      return 'flac';
    case 'wav':
      return 'pcm_s16le';
    default:
      return 'copy'; // 默认尝试复制编解码器
  }
}

export async function mergeVideoAndAudio(
  videoUrl: string,
  audioUrl: string,
  audioType?: 'wav' | 'mp3' | 'ogg' | 'm4a' | 'aac',
): Promise<string> {
  const audioExt = `.${audioType}` || path.extname(audioUrl) || '.wav';

  // 下载视频和音频
  const [videoFile, audioFile] = await downloadFiles([
    { url: videoUrl, filename: 'video.mp4' },
    { url: audioUrl, filename: `audio${audioExt}` },
  ]);

  // console.log('downloaded');

  let mp3File = audioFile.file;

  // 如果不是 .mp3，则转为 mp3
  if (audioExt !== '.mp3') {
    mp3File = audioFile.createOutput('coverted.mp3');
    await new Promise((resolve, reject) => {
      ffmpeg(audioFile.file)
        .audioCodec('libmp3lame')
        .format('mp3')
        .save(mp3File)
        .on('end', resolve)
        .on('error', reject);
    });
  }

  // console.log(mp3File);

  const outputFile = videoFile.createOutput('output.mp4');
  // 合成视频+音频
  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoFile.file)
      .input(mp3File)
      .outputOptions(['-c:v copy', '-c:a aac', '-shortest'])
      .save(outputFile)
      .on('end', resolve)
      .on('error', reject);
  });

  return outputFile;
}

interface IAssEvents {
  text: string;
  effect?: string;
  layer?: number;
  start?: string;
  end?: string;
  style?: string;
  name?: string;
  marginL?: number;
  marginR?: number;
  marginV?: number;
}

/**
 * 生成带样式的 .ass 字幕文件
 */
function generateASS(contents: IAssEvents[]): string {

  const assContent = `
[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
Title: Auto Subtitle
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Source Han Sans CN,60,&H00FFFFFF,&H000000FF,&H64000000,&H64000000,-1,0,0,0,100,100,0,0,1,2,0,5,30,30,30,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${contents.map((c) => `Dialogue: ${c.layer || 0},${c.start || '0:00:00.00'},${c.end || '0:00:10.00'},${c.style || 'Default'},${c.name || ''},${c.marginL || 0},${c.marginR || 0},${c.marginV || 0},,${c.effect||''}${c.text}`).join('\n')}
`;

  return assContent;
}

/**
 * 合成字幕到视频（ASS方式 + 样式）
 */
export async function burnASSSubtitleToVideo(
  videoUrl: string,
  contents: IAssEvents[],
): Promise<string> {
  const videoFile = await downloadFile(videoUrl, 'input.mp4');
  const assFile = videoFile.createOutput('temp_subtitle.ass');
  const assText = generateASS(contents);
  await fsPromises.writeFile(assFile, assText, 'utf-8');
  const outputFile = videoFile.createOutput('output.mp4');

  const fontsdir = path.resolve(__dirname, '..', '..', 'fonts');
    
  await new Promise((resolve, reject) => {
    ffmpeg(videoFile.file)
      .videoFilters([{
        filter: 'ass',
        options: {
          filename: assFile,
          fontsdir,
        },
      }])
      .on('start', (commandLine) => {
        console.log('[FFmpeg] 开始执行命令:', commandLine);
      })
      .on('error', (err) => {
        console.error('[FFmpeg] 出错了:', err);
        reject(err);
      })
      .on('end', () => {
        console.log('[FFmpeg] ✅ 字幕合成完成');
        resolve(true);
      })
      .save(outputFile);
  });
  return outputFile;
}

/**
 * 将多个视频文件按顺序合并成一个视频
 * 
 * @param urls - 视频文件URL数组，按照需要合并的顺序排列
 * @param outputFormat - 输出视频格式，默认为'mp4'
 * @returns Promise<string> - 合并后的视频文件路径
 * 
 * @example
 * // 合并三个视频文件
 * const outputPath = await joinVideos([
 *   'https://example.com/video1.mp4',
 *   'https://example.com/video2.mp4',
 *   'https://example.com/video3.mp4'
 * ]);
 */
export async function joinVideos(
  urls: string[],
  outputFormat: string = 'mp4',
): Promise<string> {
  if (!urls || urls.length === 0) {
    throw new Error('视频URL列表不能为空');
  }
  
  if (urls.length === 1) {
    // 如果只有一个视频，直接下载并返回
    const videoFile = await downloadFile(urls[0], 'single_video.mp4');
    return videoFile.file;
  }
  
  // 规范化输出格式
  outputFormat = outputFormat.toLowerCase().replace(/^\./, '');
  
  // 下载所有视频文件
  const videoFiles = await downloadFiles(
    urls.map((url, index) => ({
      url,
      filename: `video_part_${index + 1}.mp4`,
    })),
  );
  
  // 创建一个临时文件，用于存储视频文件列表
  const listFile = videoFiles[0].createOutput('video_list.txt');
  
  // 创建文件列表内容
  const fileListContent = videoFiles
    .map((file) => `file '${file.file}'`)
    .join('\n');
  
  // 写入文件列表
  await fsPromises.writeFile(listFile, fileListContent, 'utf-8');
  
  // 创建输出文件路径
  const outputFile = videoFiles[0].createOutput(`joined_video.${outputFormat}`);
  
  // 使用 FFmpeg 的 concat 分离器合并视频
  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(listFile)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .outputOptions(['-c', 'copy']) // 使用复制模式，不重新编码以保持质量和速度
      .on('start', (commandLine) => {
        console.log('[FFmpeg] 开始执行视频合并命令:', commandLine);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`[FFmpeg] 合并进度: ${Math.floor(progress.percent)}%`);
        }
      })
      .on('error', (err) => {
        console.error('[FFmpeg] 视频合并出错:', err);
        reject(new Error(`视频合并失败: ${err.message}`));
      })
      .on('end', () => {
        console.log('[FFmpeg] ✅ 视频合并完成');
        resolve();
      })
      .save(outputFile);
  });
  
  return outputFile;
}

async function getDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata.format.duration;
      resolve(duration || 0);
    });
  });
}

function replaceChineseWithFontTag(text: string): string {
  // 匹配：中文、全角标点，中文间可以有空格也可以没有
  const pattern = /([\u4e00-\u9fff\u3000-\u303F\uff00-\uffef](?:\s*[\u4e00-\u9fff\u3000-\u303F\uff00-\uffef])*)/g;

  return text.replace(pattern, (match) => {
    return `{\\fnSource Han Sans CN}${match}{\\fnOpen Sans}`;
  });
}

export async function mergeWithDelayAndStretch(
  videoUrl: string,
  audioUrl: string,
  videoDuration?: number,
  audioDuration?: number,
  subtitle?: string,
): Promise<string> {
  // 下载视频和音频
  const [videoPath, audioPath] = await downloadFiles([
    { url: videoUrl, filename: 'video.mp4' },
    { url: audioUrl, filename: `audio.mp3` },
  ]);

  videoDuration = videoDuration || await getDuration(videoPath.file);
  audioDuration = audioDuration || await getDuration(audioPath.file);

  const rate = (0.5 + audioDuration) / videoDuration;
  const delayMs = 500;

  const videoFilter = rate > 1
    ? `[0:v]setpts=${rate}*PTS[v]`
    : `[0:v]copy[v]`;

  // 检查是否需要补齐音频尾帧
  const needPadding = videoDuration > (audioDuration + 0.5);
  const audioFilter = needPadding 
    ? `[1:a]adelay=${delayMs}|${delayMs},apad=whole_dur=${videoDuration}[aud]`
    : `[1:a]adelay=${delayMs}|${delayMs}[aud]`;

  let filterComplex = `${videoFilter};${audioFilter}`;

  const outputPath = videoPath.createOutput('output.mp4');

  if(subtitle) {
    const assFile = videoPath.createOutput('temp_subtitle.ass');
    const assText = generateASS([
      {
        text: replaceChineseWithFontTag(subtitle),
        effect: '{\\an2\\fnOpen Sans}',
        start: '0:00:00.50',
        end: '0:00:20.00',
        marginV: 100,
        marginL: 60,
        marginR: 60,
      },
    ]);
    await fsPromises.writeFile(assFile, assText, 'utf-8');
    const fontsdir = path.resolve(__dirname, '..', '..', 'fonts');
    filterComplex = `${filterComplex};[v]ass=${assFile}:fontsdir=${fontsdir}[vout]`;
  }

  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(videoPath.file)
      .input(audioPath.file)
      .complexFilter(filterComplex)
      .outputOptions(subtitle ? ['-map [vout]', '-map [aud]', '-c:v libx264', '-c:a aac'] : ['-map [v]', '-map [aud]', '-c:v libx264', '-c:a aac'])
      .on('start', (commandLine) => {
        console.log('[FFmpeg] 开始执行命令:', commandLine);
      })
      .on('end', () => {
        console.log('✅ 合成完成');
        resolve();
      })
      .on('error', (err) => {
        console.error('❌ 出错了:', err.message);
        reject(new Error(`视频合并失败: ${err.message}`));
      })
      .save(outputPath);
  });

  return outputPath;
}

/**
 * 生成简单的 Ken Burns 运动参数
 * @param index 图片索引，用于交替缩放方向
 * @returns 运动参数对象
 */
function generateKenBurnsMotion(index: number) {
  // 简单的交替模式：奇数图片放大，偶数图片缩小
  // 统一使用中心位置，避免复杂的平移
  const isZoomIn = index % 2 === 0;
  
  return {
    startZoom: isZoomIn ? 1.0 : 1.5,
    endZoom: isZoomIn ? 1.5 : 1.0,
    startX: 0.5, // 始终居中
    startY: 0.5,
    endX: 0.5,
    endY: 0.5,
  };
}

/**
 * 将秒数转换为ASS时间格式 (H:MM:SS.CC)
 */
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const centiseconds = Math.floor((seconds % 1) * 100);
  
  return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
}

export async function createKenBurnsVideoFromImages({
  scenes,
  resolution,
  fadeDuration = 0.2,
  fps = 25,
}: KenBurnsOptions): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const inputs = ffmpeg();
    const filters: string[] = [];

    // 下载所有图片
    const imageFiles = await downloadFiles(
      scenes.map(({ url }, index) => ({
        url,
        filename: `video_scene_${index + 1}.png`,
      })),
    );

    if(!imageFiles.length) {
      throw new Error('图片下载失败');
    }

    // 获取第一张图片的分辨率
    if(!resolution) {
      const firstImagePath = imageFiles[0].file;
      resolution = await new Promise<string>((resolve, reject) => {
        ffmpeg.ffprobe(firstImagePath, (err, metadata) => {
          if (err) {
            reject(err);
            return;
          }
          const videoStream = metadata.streams.find((stream) => stream.codec_type === 'video');
          if (videoStream && videoStream.width && videoStream.height) {
            resolve(`${videoStream.width % 2 === 0 ? videoStream.width : videoStream.width - 1}x${videoStream.height % 2 === 0 ? videoStream.height : videoStream.height - 1}`);
          } else {
            reject(new Error('无法获取图片分辨率'));
          }
        });
      });
    }

    console.log('🎬 检测到图片分辨率:', resolution);

    const outputPath = imageFiles[0].createOutput('output.mp4');

    // 收集所有字幕信息，用于生成ASS文件
    const assEvents: IAssEvents[] = [];
    // 收集所有音频信息
    let audioFiles: Array<{ file: string; start: number; delay: number }> = [];
    let currentTime = 0;

    const audios = scenes.map((scene, index) => ({ url: scene.audio || '', filename: `audio_${index}` }));
    if(audios[0].url) {
      const downloadedFiles = await downloadFiles(audios);
      audioFiles = downloadedFiles.map((item, index) => {
        const ret = {
          file: item.file,
          start: currentTime,
          delay: scenes[index].audioDelay || 0.5,
        };
        currentTime += scenes[index].duration;
        return ret;
      });
    }

    // 重置时间计数器
    currentTime = 0;

    imageFiles.forEach((item: any, index: number) => {
      const scene = scenes[index];
      const { duration, subtitle, subtitlePosition = 'bottom', subtitleDelay = 0, subtitleFontSize = 60 } = scene;
      const totalFrames = Math.floor(duration * fps);
      const fadeOutStartTime = Math.max(0, duration - fadeDuration);

      inputs.input(item.file);

      // 使用 zoompan 滤镜创建 Ken Burns 效果
      const motion = generateKenBurnsMotion(index);
        
      // 构建 zoompan 滤镜参数，使用更大的缩放幅度和平滑的线性插值
      const zoomPanFilter = [
        `zoompan=z='${motion.startZoom}+(${motion.endZoom}-${motion.startZoom})*(on-1)/(${totalFrames}-1)'`,
        `x='(iw-iw/zoom)/2'`, // 始终居中
        `y='(ih-ih/zoom)/2'`, // 始终居中
        `d=${totalFrames}`,
        `s=${resolution || '1280x720'}`,
        `fps=${fps}`,
      ].join(':');

      const filterChain = `[${index}:v]${zoomPanFilter},fade=t=in:st=0:d=${fadeDuration},fade=t=out:st=${fadeOutStartTime}:d=${fadeDuration}`;
      
      // 收集字幕信息
      if (subtitle) {
        const subtitleStart = currentTime + subtitleDelay;
        const subtitleEnd = currentTime + duration - fadeDuration;
        
        // 根据位置设置对齐方式和边距
        let alignment = 2; // 底部居中
        let marginV = 100;
        
        if (subtitlePosition === 'top') {
          alignment = 8; // 顶部居中
          marginV = 50;
        } else if (subtitlePosition === 'middle') {
          alignment = 5; // 中间居中
          marginV = 0;
        }
        
        assEvents.push({
          text: replaceChineseWithFontTag(subtitle),
          start: formatTime(subtitleStart),
          end: formatTime(subtitleEnd),
          effect: `{\\an${alignment}\\fs${subtitleFontSize}}`,
          marginV,
          marginL: 60,
          marginR: 60,
        });
      }
      
      const label = `[v${index}]`;
      filters.push(filterChain + label);
      
      currentTime += duration;
    });

    const concatInputs = scenes.map((_, i) => `[v${i}]`).join('');
    let filterComplex = [
      ...filters,
      `${concatInputs}concat=n=${scenes.length}:v=1:a=0[outv]`,
    ];

    // 添加音频输入和处理
    const audioInputCount = imageFiles.length;
    const audioFilters: string[] = [];
    
    if (audioFiles.length > 0) {
      // 为每个音频文件添加输入
      audioFiles.forEach((audioInfo, index) => {
        inputs.input(audioInfo.file);
        const audioIndex = audioInputCount + index;
        const startTime = audioInfo.start + audioInfo.delay;
        
        // 为每个音频添加延迟滤镜
        audioFilters.push(`[${audioIndex}:a]adelay=${Math.round(startTime * 1000)}|${Math.round(startTime * 1000)}[a${index}]`);
      });
      
      // 如果有多个音频，需要混音
      if (audioFiles.length > 1) {
        const audioInputs = audioFiles.map((_, i) => `[a${i}]`).join('');
        audioFilters.push(`${audioInputs}amix=inputs=${audioFiles.length}:duration=longest[outa]`);
      } else {
        audioFilters.push(`[a0]anull[outa]`);
      }
    }

    // 如果有字幕，生成ASS文件并添加字幕滤镜
    if (assEvents.length > 0) {
      const assFile = imageFiles[0].createOutput('temp_subtitle.ass');
      const assText = generateASS(assEvents);
      await fsPromises.writeFile(assFile, assText, 'utf-8');
      const fontsdir = path.resolve(__dirname, '..', '..', 'fonts');
      
      // 修改滤镜链，添加ASS字幕
      filterComplex = [
        ...filters,
        `${concatInputs}concat=n=${scenes.length}:v=1:a=0[v_concat]`,
        `[v_concat]ass=${assFile}:fontsdir=${fontsdir}[outv]`,
      ];
    }

    // 添加音频滤镜到复合滤镜中
    if (audioFilters.length > 0) {
      filterComplex = [...filterComplex, ...audioFilters];
    }

    // 构建输出选项
    const outputOptions = ['-pix_fmt yuv420p'];
    
    if (audioFiles.length > 0) {
      outputOptions.push('-c:a aac', '-b:a 128k');
      inputs
        .complexFilter(filterComplex, ['outv', 'outa'])
        .outputOptions(outputOptions)
        .output(outputPath)
        .on('start', (command) => {
          console.log('[ffmpeg start]', command);
        })
        .on('error', (err) => {
          console.error('[ffmpeg error]', err.message);
          const tmpDir = getTempPath(audioFiles[0].file);
          fs.rmSync(tmpDir, { recursive: true, force: true });
          reject(err);
        })
        .on('end', () => {
          console.log('✅ 视频生成完成:', outputPath);
          const tmpDir = getTempPath(audioFiles[0].file);
          fs.rmSync(tmpDir, { recursive: true, force: true });
          resolve(outputPath);
        })
        .run();
    } else {
      inputs
        .complexFilter(filterComplex, 'outv')
        .outputOptions(outputOptions)
        .output(outputPath)
        .on('start', (command) => {
          console.log('[ffmpeg start]', command);
        })
        .on('error', (err) => {
          console.error('[ffmpeg error]', err.message);
          reject(err);
        })
        .on('end', () => {
          console.log('✅ 视频生成完成:', outputPath);
          resolve(outputPath);
        })
        .run();
    }
  });
}