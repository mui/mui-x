const fs = require('fs');
const path = require('path');

const packageDir = process.cwd();

const packageJsonPath = path.join(packageDir, 'package.json');
const packageJsonFileContent = fs.readFileSync(packageJsonPath, 'utf8');
const packageJson = JSON.parse(packageJsonFileContent);

if (packageJson.packageScripts) {
  const buildPackageJsonPath = path.join(packageDir, 'build/package.json');
  const buildPackageJsonFileContent = fs.readFileSync(buildPackageJsonPath, 'utf8');
  const buildPackageJson = JSON.parse(buildPackageJsonFileContent);

  buildPackageJson.scripts = packageJson.packageScripts;
  delete buildPackageJson.packageScripts;

  fs.writeFileSync(buildPackageJsonPath, JSON.stringify(buildPackageJson, null, 2));
}
