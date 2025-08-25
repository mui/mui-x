"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameIdentifiers_1 = require("../../../util/renameIdentifiers");
var renamedIdentifiers = {
    columnField: 'field',
    operatorValue: 'operator',
};
var PACKAGE_REGEXP = /@mui\/x-data-grid(-pro|-premium)?/;
var GridComponents = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
var preRequisiteUsages = {
    columnField: {
        possiblePaths: ['initialState', 'filterModel', 'onFilterModelChange'],
        components: GridComponents,
        packageRegex: PACKAGE_REGEXP,
    },
    operatorValue: {
        possiblePaths: ['initialState', 'filterModel', 'onFilterModelChange'],
        components: GridComponents,
        packageRegex: PACKAGE_REGEXP,
    },
};
function transformer(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    // <DataGrid(Pro|Premium)
    //   filterModel={{
    //     items: [{
    // -     columnField: 'name',
    // +     field: 'name',
    // -     operatorValue: 'contains',
    // +     operator: 'contains',
    //       value: 'a'
    //     }]
    //   }}
    // />
    (0, renameIdentifiers_1.default)({ root: root, j: j, preRequisiteUsages: preRequisiteUsages, identifiers: renamedIdentifiers });
    return root.toSource(printOptions);
}
