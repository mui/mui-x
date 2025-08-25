"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var RichTreeViewPro_1 = require("@mui/x-tree-view-pro/RichTreeViewPro");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<RichTreeViewPro />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)(<RichTreeViewPro_1.RichTreeViewPro items={[]}/>, function () { return ({
        classes: RichTreeViewPro_1.richTreeViewProClasses,
        inheritComponent: 'ul',
        render: render,
        refInstanceof: window.HTMLUListElement,
        muiName: 'MuiRichTreeViewPro',
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
});
