"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var describeConformance_1 = require("test/utils/describeConformance");
var styles_1 = require("@mui/material/styles");
var ChartsLabel_1 = require("@mui/x-charts/ChartsLabel");
describe('<ChartsLabelMark />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)(<ChartsLabel_1.ChartsLabelMark />, function () { return ({
        classes: ChartsLabel_1.labelMarkClasses,
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiChartsLabelMark',
        testComponentPropWith: 'div',
        refInstanceof: window.HTMLDivElement,
        ThemeProvider: styles_1.ThemeProvider,
        createTheme: styles_1.createTheme,
        // SKIP
        skip: ['themeVariants', 'componentProp', 'componentsProp'],
    }); });
});
