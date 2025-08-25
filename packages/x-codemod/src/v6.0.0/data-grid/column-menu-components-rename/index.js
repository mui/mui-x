"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var renameProps_1 = require("../../../util/renameProps");
var VARIABLES = {
    GridFilterMenuItem: 'GridColumnMenuFilterItem',
    HideGridColMenuItem: 'GridColumnMenuHideItem',
    GridColumnsMenuItem: 'GridColumnMenuColumnsItem',
    SortGridMenuItems: 'GridColumnMenuSortItem',
    GridColumnPinningMenuItems: 'GridColumnMenuPinningItem',
    GridAggregationColumnMenuItem: 'GridColumnMenuAggregationItem',
    GridFilterItemProps: 'GridColumnMenuItemProps',
};
var PACKAGE_REGEXP = /@mui\/x-data-grid(-pro|-premium)?/;
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
    // - import { GridFilterMenuItem } from '@mui/x-data-grid'
    // + import { GridColumnMenuFilterItem } from '@mui/x-data-grid'
    matchingImports
        .find(j.ImportSpecifier)
        .filter(function (path) { return VARIABLES.hasOwnProperty(path.node.imported.name); })
        .replaceWith(function (path) { return j.importSpecifier(j.identifier(VARIABLES[path.node.imported.name])); });
    // Rename the import usage
    // - <GridFilterMenuItem />
    // + <GridColumnMenuFilterItem />
    root
        .find(j.Identifier)
        .filter(function (path) { return VARIABLES.hasOwnProperty(path.node.name); })
        .replaceWith(function (path) { return j.identifier(VARIABLES[path.node.name]); });
    // Rename `column` prop to `colDef`
    // - <GridFilterMenuItem column={col} onClick={onClick} />
    // + <GridFilterMenuItem colDef={col} onClick={onClick} />
    return (0, renameProps_1.default)({
        root: root,
        componentNames: Object.values(VARIABLES),
        props: { column: 'colDef' },
        j: j,
    }).toSource(printOptions);
}
