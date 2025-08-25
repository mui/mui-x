"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var SimpleTreeView_1 = require("@mui/x-tree-view/SimpleTreeView");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<SimpleTreeView />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)(<SimpleTreeView_1.SimpleTreeView />, function () { return ({
        classes: SimpleTreeView_1.simpleTreeViewClasses,
        inheritComponent: 'ul',
        render: render,
        refInstanceof: window.HTMLUListElement,
        muiName: 'MuiSimpleTreeView',
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
});
