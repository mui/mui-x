"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var describeConformance_1 = require("test/utils/describeConformance");
var ChartsLabel_1 = require("@mui/x-charts/ChartsLabel");
var styles_1 = require("@mui/material/styles");
describe('<ChartsLabel />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)((0, jsx_runtime_1.jsx)(ChartsLabel_1.ChartsLabel, {}), function () { return ({
        classes: ChartsLabel_1.labelClasses,
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiChartsLabel',
        testComponentPropWith: 'div',
        refInstanceof: window.HTMLSpanElement,
        ThemeProvider: styles_1.ThemeProvider,
        createTheme: styles_1.createTheme,
        // SKIP
        skip: [
            'themeVariants',
            'themeStyleOverrides',
            'themeCustomPalette',
            'themeDefaultProps',
            'componentProp',
            'componentsProp',
        ],
    }); });
});
