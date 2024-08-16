// TODO: Unify with core

/* eslint-disable no-console */
import path from 'path';
import fse from 'fs-extra';
import {
  includeFileInBuild,
  createModulePackages,
  typescriptCopy,
  createPackageFile,
} from '@mui/monorepo/scripts/copyFilesUtils.mjs';

const packagePath = process.cwd();
const buildPath = path.join(packagePath, './build');
const srcPath = path.join(packagePath, './src');

async function prepend(file, string) {
  const data = await fse.readFile(file, 'utf8');
  await fse.writeFile(file, string + data, 'utf8');
}

async function addLicense(packageData) {
  const license = `/**
 * ${packageData.name} v${packageData.version}
 *
 * @license ${packageData.license === 'MIT' ? 'MIT' : 'MUI X Commercial'}
 * This source code is licensed under the ${
   packageData.license === 'MIT' ? 'MIT' : 'commercial'
 } license found in the
 * LICENSE file in the root directory of this source tree.
 */
`;
  await Promise.all(
    [
      './index.js',
      './modern/index.js',
      './node/index.js',
      './umd/material-ui.development.js',
      './umd/material-ui.production.min.js',
    ].map(async (file) => {
      try {
        await prepend(path.resolve(buildPath, file), license);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`Skipped license for ${file}`);
        } else {
          throw err;
        }
      }
    }),
  );
}

async function run() {
  try {
    const packageData = await createPackageFile();

    const filesToCopy = ['./README.md', '../../CHANGELOG.md'];

    const hasLicenseFileInPackage = await fse.exists(path.join(packagePath, 'LICENSE'));
    if (hasLicenseFileInPackage) {
      filesToCopy.push('./LICENSE');
    }

    await Promise.all(filesToCopy.map((file) => includeFileInBuild(file)));

    await addLicense(packageData);

    // TypeScript
    await typescriptCopy({ from: srcPath, to: buildPath });

    await createModulePackages({ from: srcPath, to: buildPath });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
