import { globbySync } from 'globby';
import fs from 'node:fs/promises';

async function run() {
  const importFiles = [
    'docs/public/static/favicon.ico',
    'docs/public/static/icons/*',
    'docs/public/static/logo.png',
    'docs/public/static/logo.svg',
    'docs/public/static/manifest.json',
    'docs/public/static/styles',
  ];

  const files = importFiles.reduce((acc, pattern) => {
    const newFiles = globbySync(`node_modules/@mui/monorepo/${pattern}`);
    return acc.concat(newFiles);
  }, []);

  const copyPromises = files.map(async (file) => {
    await fs.copyFile(file, file.replace('node_modules/@mui/monorepo/docs/', 'docs/'));
    // eslint-disable-next-line no-console
    console.log(`copy ${file}`);
  });

  await Promise.all(copyPromises);
}

run();
