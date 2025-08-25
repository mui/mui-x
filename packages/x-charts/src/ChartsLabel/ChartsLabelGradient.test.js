"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var describeConformance_1 = require("test/utils/describeConformance");
var styles_1 = require("@mui/material/styles");
var ChartsLabel_1 = require("@mui/x-charts/ChartsLabel");
var skipIf_1 = require("test/utils/skipIf");
var RtlProvider_1 = require("@mui/system/RtlProvider");
// It's not publicly exported, so, using a relative import
var ChartsLabelGradient_1 = require("./ChartsLabelGradient");
describe('<ChartsLabelGradient />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id"/>, function () { return ({
        classes: ChartsLabel_1.labelGradientClasses,
        inheritComponent: 'div',
        render: function (node) {
            return render(node, {
                wrapper: function (_a) {
                    var children = _a.children;
                    return (<React.Fragment>
            {children}
            <Gradient id="gradient.test-id"/>
          </React.Fragment>);
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
            if (!element) {
                throw new Error('Svg element not found');
            }
            var matrix = new DOMMatrix(getComputedStyle(element).transform);
            return (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;
        };
        describe('horizontal', function () {
            it('should render a gradient in the correct orientation', function () {
                var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id"/>).container;
                var svg = container.querySelector('svg');
                expect(matrixToRotation(svg)).to.equal(0);
            });
            it('should reverse the gradient', function () {
                var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" reverse/>).container;
                var svg = container.querySelector('svg');
                expect(matrixToRotation(svg)).to.equal(180);
            });
            it('should rotate the gradient', function () {
                var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" rotate/>).container;
                var svg = container.querySelector('svg');
                expect(matrixToRotation(svg)).to.equal(90);
            });
            it('should reverse and rotate the gradient', function () {
                var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" reverse rotate/>).container;
                var svg = container.querySelector('svg');
                expect(matrixToRotation(svg)).to.equal(-90);
            });
        });
        describe('vertical', function () {
            it('should render a gradient in the correct orientation', function () {
                var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" direction="vertical"/>).container;
                var svg = container.querySelector('svg');
                expect(matrixToRotation(svg)).to.equal(-90);
            });
            it('should reverse the gradient', function () {
                var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" reverse/>).container;
                var svg = container.querySelector('svg');
                expect(matrixToRotation(svg)).to.equal(90);
            });
            it('should rotate the gradient', function () {
                var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" rotate/>).container;
                var svg = container.querySelector('svg');
                expect(matrixToRotation(svg)).to.equal(0);
            });
            it('should reverse and rotate the gradient', function () {
                var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" reverse rotate/>).container;
                var svg = container.querySelector('svg');
                expect(matrixToRotation(svg)).to.equal(180);
            });
        });
        describe('RTL', function () {
            describe('horizontal', function () {
                it('should render a gradient in the correct orientation', function () {
                    var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id"/>, {
                        wrapper: RtlWrapper,
                    }).container;
                    var svg = container.querySelector('svg');
                    // Technically it is -180, but the browser will normalize it to 180
                    expect(matrixToRotation(svg)).to.equal(180);
                });
                it('should reverse the gradient', function () {
                    var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" reverse/>, { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector('svg');
                    expect(matrixToRotation(svg)).to.equal(0);
                });
                it('should rotate the gradient', function () {
                    var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" rotate/>, { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector('svg');
                    expect(matrixToRotation(svg)).to.equal(-90);
                });
                it('should reverse and rotate the gradient', function () {
                    var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" reverse rotate/>, { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector('svg');
                    expect(matrixToRotation(svg)).to.equal(90);
                });
            });
            describe('vertical', function () {
                it('should render a gradient in the correct orientation', function () {
                    var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" direction="vertical"/>, { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector('svg');
                    expect(matrixToRotation(svg)).to.equal(-90);
                });
                it('should reverse the gradient', function () {
                    var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" reverse/>, { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector('svg');
                    expect(matrixToRotation(svg)).to.equal(90);
                });
                it('should rotate the gradient', function () {
                    var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" rotate/>, { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector('svg');
                    expect(matrixToRotation(svg)).to.equal(0);
                });
                it('should reverse and rotate the gradient', function () {
                    var container = render(<ChartsLabelGradient_1.ChartsLabelGradient gradientId="gradient.test-id" direction="vertical" reverse rotate/>, { wrapper: RtlWrapper }).container;
                    var svg = container.querySelector('svg');
                    expect(matrixToRotation(svg)).to.equal(180);
                });
            });
        });
    });
});
function Gradient(_a) {
    var id = _a.id;
    return (<svg width="0" height="0" viewBox="0 0 0 0" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#CAD4EE"/>
          <stop offset="0.5" stopColor="#4254FB"/>
          <stop offset="1" stopColor="#091159"/>
        </linearGradient>
      </defs>
    </svg>);
}
function RtlWrapper(_a) {
    var children = _a.children;
    return (<RtlProvider_1.default value>
      <div dir="rtl">{children}</div>
    </RtlProvider_1.default>);
}
