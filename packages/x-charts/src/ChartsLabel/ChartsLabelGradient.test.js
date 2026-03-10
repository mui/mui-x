"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var describeConformance_1 = require("test/utils/describeConformance");
var styles_1 = require("@mui/material/styles");
var ChartsLabel_1 = require("@mui/x-charts/ChartsLabel");
var skipIf_1 = require("test/utils/skipIf");
var RtlProvider_1 = require("@mui/system/RtlProvider");
// It's not publicly exported, so, using a relative import
var ChartsLabelGradient_1 = require("./ChartsLabelGradient");
var constants_1 = require("../tests/constants");
describe('<ChartsLabelGradient />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id" }), function () { return ({
        classes: ChartsLabel_1.labelGradientClasses,
        inheritComponent: 'div',
        render: function (node) {
            return render(node, {
                wrapper: function (_a) {
                    var children = _a.children;
                    return ((0, jsx_runtime_1.jsxs)(React.Fragment, { children: [children, (0, jsx_runtime_1.jsx)(Gradient, { id: "gradient.test-id" })] }));
                },
            });
        },
        muiName: 'MuiChartsLabelGradient',
        testComponentPropWith: 'div',
        refInstanceof: window.HTMLDivElement,
        ThemeProvider: styles_1.ThemeProvider,
        createTheme: styles_1.createTheme,
        // SKIP
        skip: ['themeVariants', 'componentProp', 'componentsProp'],
    }); });
    // JSDOM does not support SVGMatrix
    describe.skipIf(skipIf_1.isJSDOM)('rotation', function () {
        var matrixToRotation = function (element) {
            if (!element || !(element instanceof SVGElement)) {
                throw new Error('Svg element not found');
            }
            var matrix = new DOMMatrix(getComputedStyle(element).transform);
            return (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
        };
        describe('horizontal', function () {
            it('should render a gradient in the correct orientation', function () {
                var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id" })).container;
                var svg = container.querySelector(constants_1.CHART_SELECTOR);
                expect(matrixToRotation(svg)).to.equal(0);
            });
            it('should reverse the gradient', function () {
                var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", reverse: true })).container;
                var svg = container.querySelector(constants_1.CHART_SELECTOR);
                expect(matrixToRotation(svg)).to.equal(180);
            });
            it('should rotate the gradient', function () {
                var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", rotate: true })).container;
                var svg = container.querySelector(constants_1.CHART_SELECTOR);
                expect(matrixToRotation(svg)).to.equal(90);
            });
            it('should reverse and rotate the gradient', function () {
                var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", reverse: true, rotate: true })).container;
                var svg = container.querySelector(constants_1.CHART_SELECTOR);
                expect(matrixToRotation(svg)).to.equal(-90);
            });
        });
        describe('vertical', function () {
            it('should render a gradient in the correct orientation', function () {
                var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", direction: "vertical" })).container;
                var svg = container.querySelector(constants_1.CHART_SELECTOR);
                expect(matrixToRotation(svg)).to.equal(-90);
            });
            it('should reverse the gradient', function () {
                var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", direction: "vertical", reverse: true })).container;
                var svg = container.querySelector(constants_1.CHART_SELECTOR);
                expect(matrixToRotation(svg)).to.equal(90);
            });
            it('should rotate the gradient', function () {
                var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", direction: "vertical", rotate: true })).container;
                var svg = container.querySelector(constants_1.CHART_SELECTOR);
                expect(matrixToRotation(svg)).to.equal(0);
            });
            it('should reverse and rotate the gradient', function () {
                var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", direction: "vertical", reverse: true, rotate: true })).container;
                var svg = container.querySelector(constants_1.CHART_SELECTOR);
                expect(matrixToRotation(svg)).to.equal(180);
            });
        });
        describe('RTL', function () {
            describe('horizontal', function () {
                it('should render a gradient in the correct orientation', function () {
                    var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id" }), {
                        wrapper: RtlWrapper,
                    }).container;
                    var svg = container.querySelector(constants_1.CHART_SELECTOR);
                    // Technically it is -180, but the browser will normalize it to 180
                    expect(matrixToRotation(svg)).to.equal(180);
                });
                it('should reverse the gradient', function () {
                    var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", reverse: true }), { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector(constants_1.CHART_SELECTOR);
                    expect(matrixToRotation(svg)).to.equal(0);
                });
                it('should rotate the gradient', function () {
                    var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", rotate: true }), { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector(constants_1.CHART_SELECTOR);
                    expect(matrixToRotation(svg)).to.equal(-90);
                });
                it('should reverse and rotate the gradient', function () {
                    var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", reverse: true, rotate: true }), { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector(constants_1.CHART_SELECTOR);
                    expect(matrixToRotation(svg)).to.equal(90);
                });
            });
            describe('vertical', function () {
                it('should render a gradient in the correct orientation', function () {
                    var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", direction: "vertical" }), { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector(constants_1.CHART_SELECTOR);
                    expect(matrixToRotation(svg)).to.equal(-90);
                });
                it('should reverse the gradient', function () {
                    var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", direction: "vertical", reverse: true }), { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector(constants_1.CHART_SELECTOR);
                    expect(matrixToRotation(svg)).to.equal(90);
                });
                it('should rotate the gradient', function () {
                    var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", direction: "vertical", rotate: true }), { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector(constants_1.CHART_SELECTOR);
                    expect(matrixToRotation(svg)).to.equal(0);
                });
                it('should reverse and rotate the gradient', function () {
                    var container = render((0, jsx_runtime_1.jsx)(ChartsLabelGradient_1.ChartsLabelGradient, { gradientId: "gradient.test-id", direction: "vertical", reverse: true, rotate: true }), { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector(constants_1.CHART_SELECTOR);
                    expect(matrixToRotation(svg)).to.equal(180);
                });
            });
        });
    });
});
function Gradient(_a) {
    var id = _a.id;
    return ((0, jsx_runtime_1.jsx)("svg", { width: "0", height: "0", viewBox: "0 0 0 0", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("linearGradient", { id: id, x1: "0", y1: "0", x2: "1", y2: "0", gradientUnits: "objectBoundingBox", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "0", stopColor: "#CAD4EE" }), (0, jsx_runtime_1.jsx)("stop", { offset: "0.5", stopColor: "#4254FB" }), (0, jsx_runtime_1.jsx)("stop", { offset: "1", stopColor: "#091159" })] }) }) }));
}
function RtlWrapper(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)(RtlProvider_1.default, { value: true, children: (0, jsx_runtime_1.jsx)("div", { dir: "rtl", children: children }) }));
}
