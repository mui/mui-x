import semver from 'semver';
import { isJSDOM } from 'test/utils/skipIf';
let catalogCache = null;
async function getCatalog() {
    if (!catalogCache) {
        const { execa } = await import('execa');
        const { stdout } = await execa('pnpm', ['config', 'list', '--json']);
        const pnpmWorkspaceConfig = JSON.parse(stdout);
        catalogCache = pnpmWorkspaceConfig.catalog;
    }
    return catalogCache;
}
export function checkMaterialVersion({ packageJson, materialPackageJson, }) {
    it.skipIf(!isJSDOM)(`${packageJson.name} should resolve proper @mui/material version`, async () => {
        let versionRange = packageJson.devDependencies['@mui/material'];
        if (versionRange === 'catalog:') {
            const catalog = await getCatalog();
            versionRange = catalog['@mui/material'];
        }
        expect(semver.satisfies(materialPackageJson.version, versionRange)).to.equal(true, `Expected @mui/material ${versionRange}, but found ${materialPackageJson.version}`);
    });
}
