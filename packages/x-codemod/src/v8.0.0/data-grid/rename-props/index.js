"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameProps_1 = require("../../../util/renameProps");
var componentNames = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
var props = {
    unstable_rowSpanning: 'rowSpanning',
    unstable_dataSource: 'dataSource',
    unstable_dataSourceCache: 'dataSourceCache',
    unstable_lazyLoading: 'lazyLoading',
    unstable_lazyLoadingRequestThrottleMs: 'lazyLoadingRequestThrottleMs',
    unstable_onDataSourceError: 'onDataSourceError',
    unstable_listView: 'listView',
    unstable_listColumn: 'listViewColumn',
};
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    return (0, renameProps_1.default)({ root: root, j: j, props: props, componentNames: componentNames }).toSource(printOptions);
}
