"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkMaterialVersion = checkMaterialVersion;
var semver_1 = require("semver");
var child_process_1 = require("child_process");
var skipIf_1 = require("test/utils/skipIf");
function checkMaterialVersion(_a) {
    var packageJson = _a.packageJson, materialPackageJson = _a.materialPackageJson, testFilePath = _a.testFilePath;
    it.skipIf(!skipIf_1.isJSDOM)("".concat(packageJson.name, " should resolve proper @mui/material version"), function () {
        var _a;
        var expectedVersion = packageJson.devDependencies['@mui/material'];
        if (expectedVersion === 'catalog:') {
            // take only relevant part of the file path
            // e.g. file:///Users/dev/mui/mui-x/packages/x-charts-pro/src/tests/materialVersion.test.tsx
            // becomes packages/x-charts-pro
            var workingDirectory = testFilePath.substring(testFilePath.indexOf('packages/'), testFilePath.indexOf('/src/'));
            var listedMuiMaterial = child_process_1.default.execSync('pnpm list "@mui/material" --json', {
                cwd: workingDirectory,
            });
            if (listedMuiMaterial) {
                var jsonListedDependencies = JSON.parse(listedMuiMaterial.toString());
                expectedVersion = jsonListedDependencies[0].devDependencies['@mui/material'].version;
            }
        }
        var versions = child_process_1.default.execSync("npm dist-tag ls ".concat('@mui/material', " ").concat(expectedVersion), {
            encoding: 'utf8',
        });
        var tagMapping = (_a = versions
            .split('\n')
            .find(function (mapping) {
            return mapping.startsWith("".concat(expectedVersion, ": "));
        })) === null || _a === void 0 ? void 0 : _a.split(': ')[1];
        var version = tagMapping !== null && tagMapping !== void 0 ? tagMapping : expectedVersion;
        expect(semver_1.default.satisfies(materialPackageJson.version, version)).to.equal(true, "Expected @mui/material ".concat(version, ", but found ").concat(materialPackageJson.version));
    });
}
