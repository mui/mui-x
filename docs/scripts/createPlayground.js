const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, 'playground.template.tsx');
const targetFile = path.join(process.cwd(), 'pages/playground/index.tsx');
const targetDir = path.dirname(targetFile);

if (fs.existsSync(targetFile)) {
  // eslint-disable-next-line no-console
  console.log('File already exists, skipping copy\n');
  process.exit(0);
}

try {
  fs.mkdirSync(targetDir, { recursive: true });
  fs.copyFileSync(sourceFile, targetFile);

  // eslint-disable-next-line no-console
  console.log('✅ File copied successfully\n');
} catch (error) {
  console.error('❌ Error copying file:', error.message);
  process.exit(1);
}
