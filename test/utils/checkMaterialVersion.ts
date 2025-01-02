import { expect } from 'chai';
import semver from 'semver';
import childProcess from 'child_process';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';

type PackageJson = {
  name: string;
  version: string;
};

export function checkMaterialVersion({
  packageJson,
  materialPackageJson,
}: {
  packageJson: PackageJson & { devDependencies: { '@mui/material': string } };
  materialPackageJson: PackageJson;
}) {
  testSkipIf(!isJSDOM)(`${packageJson.name} should resolve proper @mui/material version`, () => {
    const expectedVersion = packageJson.devDependencies['@mui/material'];

    const versions = childProcess.execSync(
      `npm dist-tag ls ${'@mui/material'} ${expectedVersion}`,
      {
        encoding: 'utf8',
      },
    );
    const tagMapping = versions
      .split('\n')
      .find((mapping) => {
        return mapping.startsWith(`${expectedVersion}: `);
      })
      ?.split(': ')[1];

    const version = tagMapping ?? expectedVersion;

    expect(semver.satisfies(materialPackageJson.version, version)).to.equal(
      true,
      `Expected @mui/material ${version}, but found ${materialPackageJson.version}`,
    );
  });
}
