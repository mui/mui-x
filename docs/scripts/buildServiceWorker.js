/* eslint-disable no-console */
const path = require('path');
const fs = require('fs/promises');

async function run() {
  const swDestDir = path.join(__dirname, '../export/x');
  const swDest = path.join(swDestDir, 'sw.js');
  const swSrc = path.join(__dirname, '../src/sw.js');

  await fs.mkdir(swDestDir, { recursive: true });
  await fs.copyFile(swSrc, swDest);

  console.log('Successfully built service worker');
}

run();
