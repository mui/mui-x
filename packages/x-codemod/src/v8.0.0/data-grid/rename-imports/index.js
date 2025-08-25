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
        packageNames: ['@mui/x-data-grid', '@mui/x-data-grid-pro', '@mui/x-data-grid-premium'],
        imports: [
            {
                oldEndpoint: 'DataGrid',
                importsMapping: {
                    selectedGridRowsSelector: 'gridRowSelectionIdsSelector',
                    selectedGridRowsCountSelector: 'gridRowSelectionCountSelector',
                },
            },
        ],
    });
    return root.toSource(printOptions);
}
