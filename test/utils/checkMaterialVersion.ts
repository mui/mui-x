import semver from 'semver';
import { isJSDOM } from 'test/utils/skipIf';
import { it, expect } from 'vitest';

type PackageJson = {
  name: string;
  version: string;
};

interface WorkspaceConfig {
  catalog: Record<string, string>;
  overrides?: Record<string, string>;
}

interface InstalledPackage {
  version: string;
  resolved: string;
}

interface InstalledWorkspace {
  name?: string;
  dependencies?: Record<string, InstalledPackage>;
  devDependencies?: Record<string, InstalledPackage>;
}

let configCache: WorkspaceConfig | null = null;
let installedCache: InstalledWorkspace[] | null = null;

async function getWorkspaceConfig(): Promise<WorkspaceConfig> {
  if (!configCache) {
    const { execa } = await import('execa');
    const { stdout } = await execa('pnpm', ['config', 'list', '--json']);
    configCache = JSON.parse(stdout) as WorkspaceConfig;
  }
  return configCache!;
}

async function getInstalledWorkspaces(): Promise<InstalledWorkspace[]> {
  if (!installedCache) {
    const { execa } = await import('execa');
    const { stdout } = await execa('pnpm', ['list', '@mui/material', '--depth', '0', '--json']);
    installedCache = JSON.parse(stdout) as InstalledWorkspace[];
  }
  return installedCache!;
}

export function checkMaterialVersion({
  packageJson,
  materialPackageJson,
}: {
  packageJson: PackageJson & { devDependencies: { '@mui/material': string } };
  materialPackageJson: PackageJson;
}) {
  it.skipIf(!isJSDOM)(
    `${packageJson.name} should resolve proper @mui/material version`,
    async () => {
      const config = await getWorkspaceConfig();
      const override = config.overrides?.['@mui/material'];
      let versionRange = override ?? packageJson.devDependencies['@mui/material'];

      if (versionRange === 'catalog:') {
        versionRange = config.catalog['@mui/material'];
      }

      // Preview tarballs can report a version outside the published catalog.
      // Verify the installed source against the explicit override instead.
      if (versionRange.startsWith('https://')) {
        const workspaces = await getInstalledWorkspaces();
        const workspace = workspaces.find((entry) => entry.name === packageJson.name);
        const installed =
          workspace?.devDependencies?.['@mui/material'] ??
          workspace?.dependencies?.['@mui/material'];
        expect(installed?.resolved).to.equal(versionRange);
        expect(installed?.version).to.equal(materialPackageJson.version);
        return;
      }

      expect(semver.satisfies(materialPackageJson.version, versionRange)).to.equal(
        true,
        `Expected @mui/material ${versionRange}, but found ${materialPackageJson.version}`,
      );
    },
  );
}
