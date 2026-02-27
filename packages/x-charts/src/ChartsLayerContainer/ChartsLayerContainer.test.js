"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var ChartsLayerContainer_1 = require("@mui/x-charts/ChartsLayerContainer");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var skipIf_1 = require("test/utils/skipIf");
var ChartProvider_1 = require("../context/ChartProvider");
describe('<ChartsLayerContainer />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    it.skipIf(!skipIf_1.isJSDOM)('should warn when ChartsSurface is used inside ChartsLayerContainer', function () {
        expect(function () {
            return render((0, jsx_runtime_1.jsx)(ChartProvider_1.ChartProvider, { pluginParams: { width: 100, height: 100, series: [] }, children: (0, jsx_runtime_1.jsx)(ChartsLayerContainer_1.ChartsLayerContainer, { children: (0, jsx_runtime_1.jsx)(ChartsSurface_1.ChartsSurface, {}) }) }));
        }).toErrorDev('MUI X Charts: ChartsSurface should not be used inside ChartsLayerContainer. Render a ChartsSvgLayer instead.');
    });
});
