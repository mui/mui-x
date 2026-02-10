"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var skipIf_1 = require("test/utils/skipIf");
var ChartProvider_1 = require("../context/ChartProvider");
// JSDOM doesn't implement SVGElement
describe.skipIf(skipIf_1.isJSDOM)('<ChartsSurface />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    it('should pass ref when it is added directly to component', function () {
        var _a;
        var ref = React.createRef();
        render((0, jsx_runtime_1.jsx)(ChartProvider_1.ChartProvider, { pluginParams: { width: 100, height: 100, series: [] }, children: (0, jsx_runtime_1.jsx)(ChartsSurface_1.ChartsSurface, { ref: ref, children: (0, jsx_runtime_1.jsx)("rect", { width: 100, height: 100 }) }) }));
        expect(ref.current instanceof SVGElement, 'ref is a SVGElement').to.equal(true);
        expect(((_a = ref.current) === null || _a === void 0 ? void 0 : _a.lastElementChild) instanceof SVGRectElement, 'ref last child is a SVGRectElement').to.equal(true);
    });
});
