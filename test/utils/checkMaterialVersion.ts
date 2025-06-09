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
  packageDirectory,
}: {
  packageJson: PackageJson & { devDependencies: { '@mui/material': string } };
  materialPackageJson: PackageJson;
  packageDirectory: string;
}) {
  testSkipIf(!isJSDOM)(`${packageJson.name} should resolve proper @mui/material version`, () => {
    let expectedVersion = packageJson.devDependencies['@mui/material'];

    if (expectedVersion === 'catalog:') {
      const listedMuiMaterial = childProcess.execSync('pnpm list "@mui/material" --json', {
        cwd: packageDirectory,
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
