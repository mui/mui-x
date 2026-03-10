"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var Gauge_1 = require("@mui/x-charts/Gauge");
var describeConformance_1 = require("test/utils/charts/describeConformance");
describe('<Gauge />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)((0, jsx_runtime_1.jsx)(Gauge_1.Gauge, { height: 100, width: 100, value: 60 }), function () { return ({
        classes: {},
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiGauge',
        testComponentPropWith: 'div',
        refInstanceof: window.HTMLDivElement,
    }); });
});
