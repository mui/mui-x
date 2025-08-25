"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
// TODO: Make it generic and move to utils
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    root
        .find(j.ImportDeclaration)
        .filter(function (path) {
        return ['@mui/x-data-grid-pro', '@mui/x-data-grid-premium'].includes(path.node.source.value);
    })
        .forEach(function (path) {
        var specifiers = path.node.specifiers;
        var filteredSpecifiers = specifiers.filter(function (spec) { return !(j.ImportSpecifier.check(spec) && spec.imported.name === 'LicenseInfo'); });
        // If `LicenseInfo` was found and removed
        if (filteredSpecifiers.length !== specifiers.length) {
            var licenseImport = j.importDeclaration([j.importSpecifier(j.identifier('LicenseInfo'))], j.stringLiteral('@mui/x-license'));
            if (filteredSpecifiers.length > 0) {
                // Keep other imports but remove `LicenseInfo`
                path.node.specifiers = filteredSpecifiers;
                // Insert new import right after the modified import
                j(path).insertAfter(licenseImport);
            }
            else {
                // Remove import entirely and insert new one at the same position
                j(path).replaceWith(licenseImport);
            }
        }
    });
    var printOptions = (options === null || options === void 0 ? void 0 : options.printOptions) || {
        quote: 'single',
        trailingComma: true,
    };
    return root.toSource(printOptions);
}
