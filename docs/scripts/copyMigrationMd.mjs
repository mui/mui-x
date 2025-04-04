import glob from 'fast-glob';
import fs from 'node:fs';
import path from 'node:path';

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
const __dirname = import.meta.dirname;

function main() {
  const files = glob.sync(path.join(__dirname, '../data/migration/**/*-v7.md'));

  files.forEach((filePath) => {
    const fileName = path.basename(filePath);
    fs.cpSync(filePath, path.join(__dirname, '../export/static/md/', fileName), {
      recursive: true,
    });
  });
}

main();
