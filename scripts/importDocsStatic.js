const glob = require('glob-gitignore');
const fse = require('fs-extra');

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
    const newFiles = glob.sync(`docs/node_modules/@material-ui/monorepo/${pattern}`);
    return acc.concat(newFiles);
  }, []);
  files.forEach((file) => {
    fse.copySync(file, file.replace('docs/node_modules/@material-ui/monorepo/docs/', 'docs/'));
    // eslint-disable-next-line no-console
    console.log(`copy ${file}`);
  });
}

run();
