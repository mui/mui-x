"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var adapters = {
    'date-fns': 'AdapterDateFns',
    'date-fns-jalali': 'AdapterDateFnsJalali',
    dayjs: 'AdapterDayjs',
    luxon: 'AdapterLuxon',
    moment: 'AdapterMoment',
    hijri: 'AdapterMomentHijri',
    jalaali: 'AdapterMomentJalaali',
};
var getDateIoSubPackage = function (path) { var _a, _b, _c; return (_c = ((_b = (_a = path.node.source.value) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '').match(/@date-io\/(.*)/)) === null || _c === void 0 ? void 0 : _c[1]; };
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    var matchingImports = root.find(j.ImportDeclaration).filter(function (path) {
        var subPackage = getDateIoSubPackage(path);
        return !!subPackage && !!adapters[subPackage];
    });
    var adapterVariableNames = {};
    // Replace the default import specifier by an import specifiers
    // - import WhateverDateFns from '@mui/x-date-pickers/MonthPicker'
    // + import { AdapterDateFns } from '@mui/x-date-pickers/MonthPicker'
    matchingImports.find(j.ImportDefaultSpecifier).replaceWith(function (path) {
        var _a, _b;
        var subPackage = getDateIoSubPackage(path.parentPath.parentPath);
        var adapterVariableName = (_b = (_a = path.value.local) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : '';
        adapterVariableNames[adapterVariableName] = adapters[subPackage];
        return j.importSpecifier(j.identifier(adapters[subPackage]));
    });
    // Rename the import declarations
    // - import {} from '@date-io/date-fns'
    // + import {} from '@mui/x-date-pickers/AdapterDateFns'
    matchingImports.replaceWith(function (path) {
        var subPackage = getDateIoSubPackage(path);
        return j.importDeclaration(path.node.specifiers, // copy over the existing import specifiers
        j.stringLiteral("@mui/x-date-pickers/".concat(adapters[subPackage])));
    });
    // Rename the import usage
    // - <LocalizationProvider dateAdapter={WhateverDateFns} />
    // + <LocalizationProvider dateAdapter={AdapterDateFns} />
    root
        .find(j.Identifier)
        .filter(function (path) { return adapterVariableNames.hasOwnProperty(path.node.name); })
        .replaceWith(function (path) { return j.identifier(adapterVariableNames[path.node.name]); });
    return root.toSource(printOptions);
}
