"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transform;
var renameCSSClasses_1 = require("../../../util/renameCSSClasses");
var renameIdentifiers_1 = require("../../../util/renameIdentifiers");
var renamedIdentifiers = {
    GridLinkOperator: 'GridLogicOperator',
    linkOperatorInputProps: 'logicOperatorInputProps',
    linkOperator: 'logicOperator',
    linkOperators: 'logicOperators',
    setFilterLinkOperator: 'setFilterLogicOperator',
    getRowIndex: 'getRowIndexRelativeToVisibleRows',
};
var PACKAGE_REGEXP = /@mui\/x-data-grid(-pro|-premium)?/;
var GridComponents = ['DataGrid', 'DataGridPro', 'DataGridPremium'];
var preRequisiteUsages = {
    GridLinkOperator: {
        possiblePaths: ['initialState.filter', 'filterModel', 'componentsProps.filter'],
        components: GridComponents,
        packageRegex: PACKAGE_REGEXP,
    },
    linkOperatorInputProps: {
        possiblePaths: ['componentsProps.filter'],
        components: GridComponents,
        packageRegex: PACKAGE_REGEXP,
    },
    linkOperator: {
        possiblePaths: ['initialState.filter', 'filterModel', 'componentsProps.filter'],
        components: GridComponents,
        packageRegex: PACKAGE_REGEXP,
    },
    linkOperators: {
        possiblePaths: ['componentsProps.filter'],
        components: GridComponents,
        packageRegex: PACKAGE_REGEXP,
    },
    setFilterLinkOperator: {
        components: GridComponents,
        packageRegex: PACKAGE_REGEXP,
    },
    getRowIndex: {
        components: GridComponents,
        packageRegex: PACKAGE_REGEXP,
    },
};
var renamedLiterals = {
    filterPanelLinkOperator: 'filterPanelLogicOperator',
};
var renamedClasses = {
    'MuiDataGrid-filterFormLinkOperatorInput': 'MuiDataGrid-filterFormLogicOperatorInput',
    'MuiDataGrid-withBorder': 'MuiDataGrid-withBorderColor',
};
function transform(file, api, options) {
    var j = api.jscodeshift;
    var root = j(file.source);
    var printOptions = options.printOptions || {
        quote: 'single',
        trailingComma: true,
    };
    var matchingImports = root
        .find(j.ImportDeclaration)
        .filter(function (path) { return !!(0, renameIdentifiers_1.matchImport)(path, PACKAGE_REGEXP); });
    if (matchingImports.length > 0) {
        // Rename the identifiers
        // <DataGrid
        //  componentsProps={{
        //    filter: {
        // -   linkOperators: [GridLinkOperator.And],
        // +   logicOperators: [GridLogicOperator.And],
        //      filterFormProps: {
        // -      linkOperatorInputProps: {
        // +      logicOperatorInputProps: {
        //          variant: 'outlined',
        //          size: 'small',
        //        },
        //      },
        //    },
        //  }}
        // />
        (0, renameIdentifiers_1.default)({ j: j, root: root, identifiers: renamedIdentifiers, preRequisiteUsages: preRequisiteUsages });
        // Rename the literals
        // - apiRef.current.getLocaleText('filterPanelLinkOperator')
        // + apiRef.current.getLocaleText('filterPanelLogicOperator')
        root
            .find(j.Literal)
            .filter(function (path) { return renamedLiterals.hasOwnProperty(path.node.value); })
            .replaceWith(function (path) { return j.literal(renamedLiterals[path.node.value]); });
        // Rename the classes
        // - 'MuiDataGrid-filterFormLinkOperatorInput'
        // + 'MuiDataGrid-filterFormLogicOperatorInput'
        (0, renameCSSClasses_1.default)({ j: j, root: root, renamedClasses: renamedClasses });
    }
    return root.toSource(printOptions);
}
