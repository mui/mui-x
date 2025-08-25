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
        wrapColumn: 40,
    };
    (0, renameImports_1.renameImports)({
        j: j,
        root: root,
        packageNames: ['@mui/x-charts', '@mui/x-charts-pro'],
        imports: [
            {
                oldEndpoint: 'ResponsiveChartContainer',
                newEndpoint: 'ChartContainer',
                importsMapping: {
                    ResponsiveChartContainer: 'ChartContainer',
                },
            },
            {
                oldEndpoint: 'ResponsiveChartContainerPro',
                newEndpoint: 'ChartContainerPro',
                importsMapping: {
                    ResponsiveChartContainerPro: 'ChartContainerPro',
                },
            },
        ],
    });
    return root.toSource(printOptions);
}
