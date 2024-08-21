import { expect } from 'chai';
import semver from 'semver';
import childProcess from 'child_process';

type PackageJson = {
  name: string;
  version: string;
};

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

export function checkMaterialVersion({
  packageJson,
  materialPackageJson,
}: {
  packageJson: PackageJson & { devDependencies: { '@mui/material': string } };
  materialPackageJson: PackageJson;
}) {
  if (!isJSDOM) {
    return undefined;
  }

  const expectedVersion = packageJson.devDependencies['@mui/material'];

  const versions = childProcess.execSync(`npm dist-tag ls ${'@mui/material'} ${expectedVersion}`, {
    encoding: 'utf8',
  });
  const tagMapping = versions
    .split('\n')
    .find((mapping) => {
      return mapping.startsWith(`${expectedVersion}: `);
    })
    ?.split(': ')[1];

  const version = tagMapping ?? expectedVersion;

  return it(`${packageJson.name} should resolve proper @mui/material version`, () => {
    expect(semver.satisfies(materialPackageJson.version, version)).to.equal(
      true,
      `Expected @mui/material ${version}, but found ${materialPackageJson.version}`,
    );
  });
}
