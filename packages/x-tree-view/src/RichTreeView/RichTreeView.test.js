"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var RichTreeView_1 = require("@mui/x-tree-view/RichTreeView");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<RichTreeView />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)(<RichTreeView_1.RichTreeView items={[]}/>, function () { return ({
        classes: RichTreeView_1.richTreeViewClasses,
        inheritComponent: 'ul',
        render: render,
        refInstanceof: window.HTMLUListElement,
        muiName: 'MuiRichTreeView',
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
});
