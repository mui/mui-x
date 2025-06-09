import { expect } from 'chai';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
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
  testFilePath,
}: {
  packageJson: PackageJson & { devDependencies: { '@mui/material': string } };
  materialPackageJson: PackageJson;
  testFilePath: string;
}) {
  testSkipIf(!isJSDOM)(`${packageJson.name} should resolve proper @mui/material version`, () => {
    let expectedVersion = packageJson.devDependencies['@mui/material'];

    if (expectedVersion === 'catalog:') {
      let workingDirectory = testFilePath;
      const providedTestsDirectory = dirname(fileURLToPath(testFilePath));
      const testsFolderDepth = providedTestsDirectory.match('packages/(.*)')?.[1].split('/').length;
      if (testsFolderDepth !== undefined) {
        workingDirectory = resolve(
          providedTestsDirectory,
          Array.from({ length: testsFolderDepth - 1 })
            .fill('..')
            .join('/'),
        );
      }
      const listedMuiMaterial = childProcess.execSync('pnpm list "@mui/material" --json', {
        cwd: workingDirectory,
      });
      if (listedMuiMaterial) {
        const jsonListedDependencies = JSON.parse(listedMuiMaterial.toString());
        expectedVersion = jsonListedDependencies[0].devDependencies['@mui/material'].version;
      }
    }

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
