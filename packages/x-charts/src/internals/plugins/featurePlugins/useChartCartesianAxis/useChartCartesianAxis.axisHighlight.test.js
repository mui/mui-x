"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var vitest_1 = require("vitest");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var skipIf_1 = require("test/utils/skipIf");
var ChartDataProvider_1 = require("@mui/x-charts/ChartDataProvider");
var ChartsSurface_1 = require("@mui/x-charts/ChartsSurface");
var ChartsAxisHighlight_1 = require("@mui/x-charts/ChartsAxisHighlight");
var useChartCartesianAxis_1 = require("./useChartCartesianAxis");
var useChartInteraction_1 = require("../useChartInteraction");
// can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
describe.skipIf(skipIf_1.isJSDOM)('useChartCartesianAxis - axis highlight', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    it('should call onHighlightedAxisChange when crossing any value', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onHighlightedAxisChange, _a, user, container, svg;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    onHighlightedAxisChange = vitest_1.vi.fn();
                    _a = render((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, { plugins: [useChartInteraction_1.useChartInteraction, useChartCartesianAxis_1.useChartCartesianAxis], xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }], yAxis: [{ id: 'y-axis', min: 0, max: 1, data: [0, 0.5], position: 'none' }], width: 100, height: 100, margin: 0, onHighlightedAxisChange: onHighlightedAxisChange, children: (0, jsx_runtime_1.jsx)(ChartsSurface_1.ChartsSurface, {}) })), user = _a.user, container = _a.container;
                    svg = container.querySelector('svg');
                    return [4 /*yield*/, user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 75, clientY: 60 } }])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(onHighlightedAxisChange.mock.calls.length).to.equal(1); })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, user.pointer([
                            {
                                pointerName: 'TouchA',
                                target: svg,
                                coords: { clientX: 25, clientY: 70 }, // x-axis : B -> A
                            },
                            {
                                pointerName: 'TouchA',
                                target: svg,
                                coords: { clientX: 25, clientY: 90 }, // y-axis : 0.5 -> 0
                            },
                            {
                                keys: '[/TouchA]',
                            },
                        ])];
                case 3:
                    _b.sent();
                    expect(onHighlightedAxisChange.mock.calls.length).to.equal(4);
                    expect(onHighlightedAxisChange.mock.calls[0][0]).to.deep.equal([
                        { axisId: 'x-axis', dataIndex: 1 },
                        { axisId: 'y-axis', dataIndex: 1 },
                    ]);
                    expect(onHighlightedAxisChange.mock.calls[1][0]).to.deep.equal([
                        { axisId: 'x-axis', dataIndex: 0 },
                        { axisId: 'y-axis', dataIndex: 1 },
                    ]);
                    expect(onHighlightedAxisChange.mock.calls[2][0]).to.deep.equal([
                        { axisId: 'x-axis', dataIndex: 0 },
                        { axisId: 'y-axis', dataIndex: 0 },
                    ]);
                    expect(onHighlightedAxisChange.mock.calls[3][0]).to.deep.equal([]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call onHighlightedAxisChange when axis got modified', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onHighlightedAxisChange, _a, user, setProps, container, svg;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    onHighlightedAxisChange = vitest_1.vi.fn();
                    _a = render((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, { plugins: [useChartInteraction_1.useChartInteraction, useChartCartesianAxis_1.useChartCartesianAxis], xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }], yAxis: [{ position: 'none' }], width: 100, height: 100, margin: 0, onHighlightedAxisChange: onHighlightedAxisChange, children: (0, jsx_runtime_1.jsx)(ChartsSurface_1.ChartsSurface, {}) })), user = _a.user, setProps = _a.setProps, container = _a.container;
                    svg = container.querySelector('svg');
                    return [4 /*yield*/, user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 45, clientY: 60 } }])];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(onHighlightedAxisChange.mock.calls.length).to.equal(1); })];
                case 2:
                    _d.sent();
                    expect((_b = onHighlightedAxisChange.mock.lastCall) === null || _b === void 0 ? void 0 : _b[0]).to.deep.equal([
                        { axisId: 'x-axis', dataIndex: 0 },
                    ]);
                    setProps({
                        xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B', 'C'], position: 'none' }],
                    });
                    expect(onHighlightedAxisChange.mock.calls.length).to.equal(2);
                    expect((_c = onHighlightedAxisChange.mock.lastCall) === null || _c === void 0 ? void 0 : _c[0]).to.deep.equal([
                        { axisId: 'x-axis', dataIndex: 1 },
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not call onHighlightedAxisChange when axis got modified but highlighted item stay the same', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onHighlightedAxisChange, _a, user, setProps, container, svg;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    onHighlightedAxisChange = vitest_1.vi.fn();
                    _a = render((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, { plugins: [useChartInteraction_1.useChartInteraction, useChartCartesianAxis_1.useChartCartesianAxis], xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }], yAxis: [{ position: 'none' }], width: 100, height: 100, margin: 0, onHighlightedAxisChange: onHighlightedAxisChange, children: (0, jsx_runtime_1.jsx)(ChartsSurface_1.ChartsSurface, {}) })), user = _a.user, setProps = _a.setProps, container = _a.container;
                    svg = container.querySelector('svg');
                    return [4 /*yield*/, user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 10, clientY: 60 } }])];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(onHighlightedAxisChange.mock.calls.length).to.equal(1); })];
                case 2:
                    _c.sent();
                    expect((_b = onHighlightedAxisChange.mock.lastCall) === null || _b === void 0 ? void 0 : _b[0]).to.deep.equal([
                        { axisId: 'x-axis', dataIndex: 0 },
                    ]);
                    setProps({
                        xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B', 'C'], position: 'none' }],
                    });
                    expect(onHighlightedAxisChange.mock.calls.length).to.equal(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call onHighlightedAxisChange when highlighted axis got removed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onHighlightedAxisChange, _a, user, setProps, container, svg;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    onHighlightedAxisChange = vitest_1.vi.fn();
                    _a = render((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, { plugins: [useChartInteraction_1.useChartInteraction, useChartCartesianAxis_1.useChartCartesianAxis], xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }], yAxis: [{ position: 'none' }], width: 100, height: 100, margin: 0, onHighlightedAxisChange: onHighlightedAxisChange, children: (0, jsx_runtime_1.jsx)(ChartsSurface_1.ChartsSurface, {}) })), user = _a.user, setProps = _a.setProps, container = _a.container;
                    svg = container.querySelector('svg');
                    return [4 /*yield*/, user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 10, clientY: 60 } }])];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(onHighlightedAxisChange.mock.calls.length).to.equal(1); })];
                case 2:
                    _d.sent();
                    expect((_b = onHighlightedAxisChange.mock.lastCall) === null || _b === void 0 ? void 0 : _b[0]).to.deep.equal([
                        { axisId: 'x-axis', dataIndex: 0 },
                    ]);
                    setProps({
                        xAxis: [{ id: 'new-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }],
                    });
                    expect(onHighlightedAxisChange.mock.calls.length).to.equal(2);
                    expect((_c = onHighlightedAxisChange.mock.lastCall) === null || _c === void 0 ? void 0 : _c[0]).to.deep.equal([
                        { axisId: 'new-axis', dataIndex: 0 },
                    ]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow to highlight axes without data', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, user, container, svg;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = render((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, { plugins: [useChartInteraction_1.useChartInteraction, useChartCartesianAxis_1.useChartCartesianAxis], xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }], yAxis: [{ position: 'none', min: 0, max: 100 }], width: 100, height: 100, margin: 0, children: (0, jsx_runtime_1.jsx)(ChartsSurface_1.ChartsSurface, { children: (0, jsx_runtime_1.jsx)(ChartsAxisHighlight_1.ChartsAxisHighlight, { y: "line" }) }) })), user = _a.user, container = _a.container;
                    svg = container.querySelector('svg');
                    return [4 /*yield*/, user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 10, clientY: 60 } }])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            var highlight = svg.getElementsByClassName(ChartsAxisHighlight_1.chartsAxisHighlightClasses.root);
                            expect(highlight.length).to.equal(1);
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow to highlight axes with data', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, user, container, svg;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = render((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, { plugins: [useChartInteraction_1.useChartInteraction, useChartCartesianAxis_1.useChartCartesianAxis], xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }], yAxis: [{ position: 'none', min: 0, max: 100 }], width: 100, height: 100, margin: 0, children: (0, jsx_runtime_1.jsx)(ChartsSurface_1.ChartsSurface, { children: (0, jsx_runtime_1.jsx)(ChartsAxisHighlight_1.ChartsAxisHighlight, { x: "line" }) }) })), user = _a.user, container = _a.container;
                    svg = container.querySelector('svg');
                    return [4 /*yield*/, user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 10, clientY: 60 } }])];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            var highlight = svg.getElementsByClassName(ChartsAxisHighlight_1.chartsAxisHighlightClasses.root);
                            expect(highlight.length).to.equal(1);
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
