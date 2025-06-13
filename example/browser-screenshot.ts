import * as dotenv from 'dotenv';
import { browser, setGlobalConfig, getGlobalConfig, uploadFile } from '../src';

dotenv.config({
  path: ['.env.local', '.env'],
});

setGlobalConfig('jwt', {
  appId: process.env.JWT_APP_IE,
  userId: 'coze-plugin-utils',
  keyid: process.env.JWT_KEY,
  privateKey: process.env.JWT_SECRET?.replace(/\\n/g, '\n'),
});

setGlobalConfig('workflows', {
  fileUploader: '7507641509622562835',
});

// 配置 browser API Key
setGlobalConfig({
  browser: {
    apiKey: process.env.BROWSERLESS_TOKEN as string,
  },
});

async function main() {
  try {
    // HTML 代码示例
    const htmlCode = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>测试页面</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
          }
          h1 {
            font-size: 3em;
            margin-bottom: 20px;
          }
          p {
            font-size: 1.2em;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hello World!</h1>
          <p>这是一个测试页面，用于演示截图功能。</p>
          <p>页面包含了CSS样式和渐变背景。</p>
        </div>
      </body>
      </html>
    `;

    // 截取屏幕截图
    const screenshotPath = await browser.htmlToScreenshot({
      code: htmlCode,
      width: 1200,
      height: 800,
      deviceScaleFactor: 2, // 高分辨率
      delay: 1000, // 延迟1秒后截图
    });

    console.log('截图已保存到:', screenshotPath);

    const res = await uploadFile(screenshotPath);
    console.log(res);

    // 使用默认参数的简单示例
    const simpleScreenshot = await browser.htmlToScreenshot({
      code: '<h1>Simple Test</h1>',
    });

    console.log('简单截图已保存到:', simpleScreenshot);

    const res2 = await uploadFile(simpleScreenshot);
    console.log(res2);

  } catch (error) {
    console.error('截图失败:', error);
  }
}

main();