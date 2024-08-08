import glob from 'fast-glob';
import fse from 'fs-extra';

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
    const newFiles = glob.sync(`node_modules/@mui/monorepo/${pattern}`);
    return acc.concat(newFiles);
  }, []);
  files.forEach((file) => {
    fse.copySync(file, file.replace('node_modules/@mui/monorepo/docs/', 'docs/'));
    // eslint-disable-next-line no-console
    console.log(`copy ${file}`);
  });
}

run();
