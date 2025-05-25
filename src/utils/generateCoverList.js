// src/utils/generateCoverList.js
// 注意：这个文件仍然是 JavaScript，因为它是在 Node.js 环境中运行的脚本，不属于前端代码。
const fs = require('fs');
const path = require('path');

// 从脚本的当前位置 (src/utils) 向上两级到达项目根目录
const projectRoot = path.join(__dirname, '..', '..');
const publicDir = path.join(projectRoot, 'public');
const coverDir = path.join(publicDir, 'cover');
// 输出文件路径：在 src/constants 下生成 coverImages.ts
const outputFile = path.join(projectRoot, 'src', 'constants', 'default_cover.ts');

// 确保输出目录存在
const outputDirPath = path.dirname(outputFile);
if (!fs.existsSync(outputDirPath)) {
  fs.mkdirSync(outputDirPath, { recursive: true });
}

console.log(`\n正在扫描目录: ${coverDir}`);

fs.readdir(coverDir, (err, files) => {
  if (err) {
    console.error('错误: 无法读取目录。请确保 public/cover 目录存在且可访问。', err);
    process.exit(1); // 退出脚本并指示错误
  }

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const imageNames = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });

  // 注意这里导出的文件是 .ts 格式，所以需要添加类型声明
  const fileContent = `
// 这个文件由 src/utils/generateCoverList.js 脚本自动生成
// 请勿手动修改！
// 运行 'npm run generate-covers' 来更新此文件。

export const DEFAULT_COVER_IMAGE_NAMES: string[] = ${JSON.stringify(imageNames, null, 2)};
`;

  fs.writeFile(outputFile, fileContent, (err) => {
    if (err) {
      console.error('错误: 写入文件失败。', err);
      process.exit(1); // 退出脚本并指示错误
    }
    console.log(`成功生成图片列表到: ${outputFile}\n`);
  });
});