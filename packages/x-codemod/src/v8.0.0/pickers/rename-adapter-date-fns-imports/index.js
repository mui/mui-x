"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameImports_1 = require("../../../util/renameImports");
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    (0, renameImports_1.renameImports)({
        j: j,
        root: root,
        packageNames: ['@mui/x-date-pickers', '@mui/x-date-pickers-pro'],
        imports: [
            {
                oldEndpoint: 'AdapterDateFns',
                newEndpoint: 'AdapterDateFnsV2',
                importsMapping: {
                    AdapterDateFns: 'AdapterDateFns',
                },
            },
            {
                oldEndpoint: 'AdapterDateFnsV3',
                newEndpoint: 'AdapterDateFns',
                importsMapping: {
                    AdapterDateFns: 'AdapterDateFns',
                },
            },
            {
                oldEndpoint: 'AdapterDateFnsJalali',
                newEndpoint: 'AdapterDateFnsJalaliV2',
                importsMapping: {
                    AdapterDateFnsJalali: 'AdapterDateFnsJalali',
                },
            },
            {
                oldEndpoint: 'AdapterDateFnsJalaliV3',
                newEndpoint: 'AdapterDateFnsJalali',
                importsMapping: {
                    AdapterDateFnsJalali: 'AdapterDateFnsJalali',
                },
            },
        ],
    });
    return root.toSource(printOptions);
}
