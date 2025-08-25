"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var PACKAGE_REGEXP = /@mui\/x-date-pickers(-pro|)(\/(.*)|)/;
var matchImport = function (path) { var _a, _b; return ((_b = (_a = path.node.source.value) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '').match(PACKAGE_REGEXP); };
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    var matchingImports = root.find(j.ImportDeclaration).filter(function (path) { return !!matchImport(path); });
    // Rename the import specifiers
    // - import { dayPickerClasses } from '@mui/x-date-pickers'
    // + import { dayCalendarClasses } from '@mui/x-date-pickers'
    matchingImports
        .find(j.ImportSpecifier)
        .filter(function (path) { return path.node.imported.name === 'dayPickerClasses'; })
        .replaceWith(function (path) { return j.importSpecifier(j.identifier('dayCalendarClasses'), path.value.local); });
    // Rename the import usage
    // - dayPickerClasses.root
    // + dayCalendarClasses.root
    root
        .find(j.Identifier)
        .filter(function (path) { return path.node.name === 'dayPickerClasses'; })
        .replaceWith(function () { return j.identifier('dayCalendarClasses'); });
    return root.toSource(printOptions);
}
