import * as dotenv from 'dotenv';
import { setGlobalConfig, browser, uploadFile } from '../src';

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

setGlobalConfig('browser', {
  apiKey: process.env.BROWSERLESS_TOKEN as string,
});

// const html = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"600\" height=\"400\">\n  <style>text { font: bold 16px sans-serif; fill: #333; }</style>\n  <!-- 背景 -->\n  <rect width=\"100%\" height=\"100%\" fill=\"#f0f8ff\"/>\n  <!-- 文字说明 -->\n  <text x=\"300\" y=\"30\" text-anchor=\"middle\">分糖果学除法：12颗糖分给3个小朋友</text>\n  <!-- 小朋友 -->\n  <circle cx=\"150\" cy=\"350\" r=\"20\" fill=\"#ff9999\"/><!-- 左小朋友 -->\n  <circle cx=\"300\" cy=\"350\" r=\"20\" fill=\"#99ff99\"/><!-- 中小朋友 -->\n  <circle cx=\"450\" cy=\"350\" r=\"20\" fill=\"#9999ff\"/><!-- 右小朋友 -->\n  <!-- 糖果（12颗，初始集中在顶部） -->\n  <g id=\"candies\">\n    <circle cx=\"300\" cy=\"80\" r=\"8\" fill=\"#ff6666\">\n      <animate attributeName=\"cx\" from=\"300\" to=\"150\" dur=\"1s\" begin=\"0s\" fill=\"freeze\"/>\n      <animate attributeName=\"cy\" from=\"80\" to=\"300\" dur=\"1s\" begin=\"0s\" fill=\"freeze\"/>\n    </circle>\n    <circle cx=\"315\" cy=\"80\" r=\"8\" fill=\"#66ff66\">\n      <animate attributeName=\"cx\" from=\"315\" to=\"150\" dur=\"1s\" begin=\"0.5s\" fill=\"freeze\"/>\n      <animate attributeName=\"cy\" from=\"80\" to=\"280\" dur=\"1s\" begin=\"0.5s\" fill=\"freeze\"/>\n    </circle>\n    <circle cx=\"285\" cy=\"80\" r=\"8\" fill=\"#6666ff\">\n      <animate attributeName=\"cx\" from=\"285\" to=\"150\" dur=\"1s\" begin=\"1s\" fill=\"freeze\"/>\n      <animate attributeName=\"cy\" from=\"80\" to=\"260\" dur=\"1s\" begin=\"1s\" fill=\"freeze\"/>\n    </circle>\n    <circle cx=\"300\" cy=\"95\" r=\"8\" fill=\"#ffcc66\">\n      <animate attributeName=\"cx\" from=\"300\" to=\"300\" dur=\"1s\" begin=\"0s\" fill=\"freeze\"/>\n      <animate attributeName=\"cy\" from=\"95\" to=\"300\" dur=\"1s\" begin=\"0s\" fill=\"freeze\"/>\n    </circle>\n    <circle cx=\"315\" cy=\"95\" r=\"8\" fill=\"#ccff66\">\n      <animate attributeName=\"cx\" from=\"315\" to=\"300\" dur=\"1s\" begin=\"0.5s\" fill=\"freeze\"/>\n      <animate attributeName=\"cy\" from=\"95\" to=\"280\" dur=\"1s\" begin=\"0.5s\" fill=\"freeze\"/>\n    </circle>\n    <circle cx=\"285\" cy=\"95\" r=\"8\" fill=\"#66ccff\">\n      <animate attributeName=\"cx\" from=\"285\" to=\"300\" dur=\"1s\" begin=\"1s\" fill=\"freeze\"/>\n      <animate attributeName=\"cy\" from=\"95\" to=\"260\" dur=\"1s\" begin=\"1s\" fill=\"freeze\"/>\n    </circle>\n    <circle cx=\"300\" cy=\"110\" r=\"8\" fill=\"#ff66cc\">\n      <animate attributeName=\"cx\" from=\"300\" to=\"450\" dur=\"1s\" begin=\"0s\" fill=\"freeze\"/>\n      <animate attributeName=\"cy\" from=\"110\" to=\"300\" dur=\"1s\" begin=\"0s\" fill=\"freeze\"/>\n    </circle>\n    <circle cx=\"315\" cy=\"110\" r=\"8\" fill=\"#66ffcc\">\n      <animate attributeName=\"cx\" from=\"315\" to=\"450\" dur=\"1s\" begin=\"0.5s\" fill=\"freeze\"/>\n      <animate attributeName=\"cy\" from=\"110\" to=\"280\" dur=\"1s\" begin=\"0.5s\" fill=\"freeze\"/>\n    </circle>\n    <circle cx=\"285\" cy=\"110\" r=\"8\" fill=\"#cc66ff\">\n      <animate attributeName=\"cx\" from=\"285\" to=\"450\" dur=\"1s\" begin=\"1s\" fill=\"freeze\"/>\n      <animate attributeName=\"cy\" from=\"110\" to=\"260\" dur=\"1s\" begin=\"1s\" fill=\"freeze\"/>\n    </circle>\n  </g>\n  <!-- 结果文字 -->\n  <text x=\"150\" y=\"240\" text-anchor=\"middle\" opacity=\"0\">\n    <animate attributeName=\"opacity\" from=\"0\" to=\"1\" dur=\"0.5s\" begin=\"1.5s\" fill=\"freeze\"/>\n    4颗\n  </text>\n  <text x=\"300\" y=\"240\" text-anchor=\"middle\" opacity=\"0\">\n    <animate attributeName=\"opacity\" from=\"0\" to=\"1\" dur=\"0.5s\" begin=\"1.5s\" fill=\"freeze\"/>\n    4颗\n  </text>\n  <text x=\"450\" y=\"240\" text-anchor=\"middle\" opacity=\"0\">\n    <animate attributeName=\"opacity\" from=\"0\" to=\"1\" dur=\"0.5s\" begin=\"1.5s\" fill=\"freeze\"/>\n    4颗\n  </text>\n  <text x=\"300\" y=\"380\" text-anchor=\"middle\" opacity=\"0\">\n    <animate attributeName=\"opacity\" from=\"0\" to=\"1\" dur=\"0.5s\" begin=\"2s\" fill=\"freeze\"/>\n    12 ÷ 3 = 4，每人分到4颗！\n  </text>\n</svg>`;
// const html = `<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\">\n    <title>写汉字</title>\n    <script src=\"https://fastly.jsdelivr.net/npm/cnchar-all/cnchar.all.min.js\"></script>\n    <style>\n    svg {\n      zoom: 5\n    }\n    </style>\n  </head>\n  <body>\n    <div id='drawNormal'></div>\n    <script>\n      const writer = cnchar.draw('巍',{\n        el: '#drawNormal',\n        type: cnchar.draw.TYPE.ANIMATION,\n        style: {\n          strokeColor: '#555',\n        },\n        animation:{\n          delayBetweenStrokes: 50,\n          loopAnimate: false,\n          autoAnimate: false\n        },\n        line: {\n          lineStraight: false,\n          lineCross: false,\n          lineDash: false,\n          border: false,\n        }\n      })\n      setTimeout(() => {\n        writer.startAnimation();\n      }, 1000);\n    </script>\n  </body>\n</html>`;
const html = `
<div id="app">0</div>
<script>
let i = 0;
const startTime = Date.now();
requestAnimationFrame(function step() {
  app.innerHTML = Math.round((Date.now() - startTime) / 100);
  requestAnimationFrame(step);
});
</script>
`
async function main() {
  // const outputPath = await browser.htmlToVideo({
  //   code: html,
  //   duration: 3,
  //   width: 600,
  //   height: 400,
  // });
  const outputPath = await browser.htmlToVideo({
    code: html,
    duration: 3,
    width: 326,
    height: 326,
    sample_ratio: 5,
  });
  const res = await uploadFile(outputPath);
  console.log(res);
}
main();