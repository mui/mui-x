"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var vitest_1 = require("vitest");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var ChartsRenderer_1 = require("@mui/x-charts-premium/ChartsRenderer");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var colors_1 = require("./colors");
describe('<ChartsRenderer />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    it('should not render anything if the chart type is not supported', function () {
        render((0, jsx_runtime_1.jsx)("div", { "data-testid": "container", children: (0, jsx_runtime_1.jsx)(ChartsRenderer_1.ChartsRenderer, { dimensions: [], values: [], chartType: "unsupported", configuration: {} }) }));
        expect(internal_test_utils_1.screen.queryByTestId('container').querySelector('svg')).to.equal(null);
    });
    it('should render a bar chart if the chart type is supported', function () {
        render((0, jsx_runtime_1.jsx)("div", { "data-testid": "container", children: (0, jsx_runtime_1.jsx)(ChartsRenderer_1.ChartsRenderer, { dimensions: [], values: [], chartType: "bar", configuration: {} }) }));
        expect(internal_test_utils_1.screen.queryByTestId('container').querySelector('svg')).not.to.equal(null);
    });
    it('should pass the rendering to the onRender callback', function () {
        var _a;
        var onRenderSpy = vitest_1.vi.fn();
        render((0, jsx_runtime_1.jsx)("div", { "data-testid": "container", children: (0, jsx_runtime_1.jsx)(ChartsRenderer_1.ChartsRenderer, { dimensions: [], values: [], chartType: "line", configuration: {}, onRender: onRenderSpy }) }));
        expect((_a = onRenderSpy.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0]).to.equal('line');
    });
    it('should compute props for the chart', function () {
        var _a;
        var onRenderSpy = vitest_1.vi.fn();
        render((0, jsx_runtime_1.jsx)("div", { "data-testid": "container", children: (0, jsx_runtime_1.jsx)(ChartsRenderer_1.ChartsRenderer, { dimensions: [], values: [], chartType: "line", configuration: {}, onRender: onRenderSpy }) }));
        var props = (_a = onRenderSpy.mock.lastCall) === null || _a === void 0 ? void 0 : _a[1];
        expect(props.colors).to.equal(colors_1.colorPaletteLookup.get('rainbowSurgePalette'));
    });
    it('should override the props if the configuration has an updated value', function () {
        var _a;
        var onRenderSpy = vitest_1.vi.fn();
        render((0, jsx_runtime_1.jsx)("div", { "data-testid": "container", children: (0, jsx_runtime_1.jsx)(ChartsRenderer_1.ChartsRenderer, { dimensions: [], values: [], chartType: "line", configuration: {
                    colors: 'mangoFusionPalette',
                }, onRender: onRenderSpy }) }));
        var props = (_a = onRenderSpy.mock.lastCall) === null || _a === void 0 ? void 0 : _a[1];
        expect(props.colors).to.equal(colors_1.colorPaletteLookup.get('mangoFusionPalette'));
    });
    it('should place dimensions and values to the correct place in the props', function () {
        var _a;
        var onRenderSpy = vitest_1.vi.fn();
        render((0, jsx_runtime_1.jsx)("div", { "data-testid": "container", children: (0, jsx_runtime_1.jsx)(ChartsRenderer_1.ChartsRenderer, { dimensions: [{ id: 'dimension', label: 'Dimension', data: ['A'] }], values: [{ id: 'value', label: 'Value', data: [1, 2, 3] }], chartType: "line", configuration: {}, onRender: onRenderSpy }) }));
        var props = (_a = onRenderSpy.mock.lastCall) === null || _a === void 0 ? void 0 : _a[1];
        expect(props.series[0].data).to.deep.equal([1, 2, 3]);
    });
});
