"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var BarChart_1 = require("@mui/x-charts/BarChart");
var skipIf_1 = require("test/utils/skipIf");
var useItemTooltip_1 = require("./useItemTooltip");
var hooks_1 = require("../hooks");
var ChartsTooltipContainer_1 = require("./ChartsTooltipContainer");
var config = {
    dataset: [
        { x: 'A', v1: 4, v2: 2 },
        { x: 'B', v1: 1, v2: 1 },
    ],
    margin: 0,
    xAxis: [{ position: 'none' }],
    yAxis: [{ position: 'none' }],
    hideLegend: true,
    width: 400,
    height: 400,
};
// Plot as follow to simplify click position
//
// | X
// | X
// | X X
// | X X X X
// ---A---B-
//
// Horizontal layout
// A| X X X X
// A| X X
// B| X
// B| X
//   --------
var cellSelector = '.MuiChartsTooltip-root td, .MuiChartsTooltip-root th, .MuiChartsTooltip-root caption';
// can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
describe.skipIf(skipIf_1.isJSDOM)('ChartsTooltip', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var wrapper = function (_a) {
        var children = _a.children;
        return ((0, jsx_runtime_1.jsx)("div", { style: { width: 400, height: 400 }, children: children }));
    };
    describe('axis trigger', function () {
        it('should show right values with vertical layout on axis', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, user, container, svg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, __assign({}, config, { series: [
                                { dataKey: 'v1', id: 's1', label: 'S1' },
                                { dataKey: 'v2', id: 's2', label: 'S2' },
                            ], xAxis: [{ dataKey: 'x', position: 'none' }], slotProps: { tooltip: { trigger: 'axis' } } })), { wrapper: wrapper }), user = _a.user, container = _a.container;
                        svg = container.querySelector('svg');
                        // Trigger the tooltip
                        return [4 /*yield*/, user.pointer({
                                target: svg,
                                coords: {
                                    x: 198,
                                    y: 60,
                                },
                            })];
                    case 1:
                        // Trigger the tooltip
                        _b.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                var cells = document.querySelectorAll(cellSelector);
                                var firstRow = ['S1', '4'];
                                var secondRow = ['S2', '2'];
                                expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal(__spreadArray(__spreadArray([
                                    // Header
                                    'A'
                                ], firstRow, true), secondRow, true));
                            })];
                    case 2:
                        _b.sent();
                        // Trigger the tooltip
                        return [4 /*yield*/, user.pointer({
                                target: svg,
                                coords: {
                                    x: 201,
                                    y: 60,
                                },
                            })];
                    case 3:
                        // Trigger the tooltip
                        _b.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                var cells = document.querySelectorAll(cellSelector);
                                var firstRow = ['S1', '1'];
                                var secondRow = ['S2', '1'];
                                expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal(__spreadArray(__spreadArray([
                                    // Header
                                    'B'
                                ], firstRow, true), secondRow, true));
                            })];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should show right values with horizontal layout on axis', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, user, container, svg;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, __assign({}, config, { layout: "horizontal", series: [
                                { dataKey: 'v1', id: 's1', label: 'S1' },
                                { dataKey: 'v2', id: 's2', label: 'S2' },
                            ], yAxis: [{ scaleType: 'band', dataKey: 'x', position: 'none' }], slotProps: { tooltip: { trigger: 'axis' } } })), { wrapper: wrapper }), user = _a.user, container = _a.container;
                        svg = container.querySelector('svg');
                        // Trigger the tooltip
                        return [4 /*yield*/, user.pointer({
                                target: svg,
                                coords: {
                                    x: 150,
                                    y: 60,
                                },
                            })];
                    case 1:
                        // Trigger the tooltip
                        _b.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                var cells = document.querySelectorAll(cellSelector);
                                var firstRow = ['S1', '4'];
                                var secondRow = ['S2', '2'];
                                expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal(__spreadArray(__spreadArray([
                                    // Header
                                    'A'
                                ], firstRow, true), secondRow, true));
                            })];
                    case 2:
                        _b.sent();
                        // Trigger the tooltip
                        return [4 /*yield*/, user.pointer({
                                target: svg,
                                coords: {
                                    x: 150,
                                    y: 220,
                                },
                            })];
                    case 3:
                        // Trigger the tooltip
                        _b.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                var cells = document.querySelectorAll(cellSelector);
                                var firstRow = ['S1', '1'];
                                var secondRow = ['S2', '1'];
                                expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal(__spreadArray(__spreadArray([
                                    // Header
                                    'B'
                                ], firstRow, true), secondRow, true));
                            })];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('item trigger', function () {
        it('should show right values with vertical layout on item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, rectangles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, __assign({}, config, { series: [
                                { dataKey: 'v1', id: 's1', label: 'S1' },
                                { dataKey: 'v2', id: 's2', label: 'S2' },
                            ], xAxis: [{ dataKey: 'x', position: 'none' }], slotProps: { tooltip: { trigger: 'item' } } })), { wrapper: wrapper }).user;
                        rectangles = document.querySelectorAll('rect');
                        // Trigger the tooltip
                        return [4 /*yield*/, user.pointer({
                                target: rectangles[0],
                            })];
                    case 1:
                        // Trigger the tooltip
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                var cells = document.querySelectorAll(cellSelector);
                                expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal(['S1', '4']);
                            })];
                    case 2:
                        _a.sent();
                        // Trigger the tooltip
                        return [4 /*yield*/, user.pointer({
                                target: rectangles[3],
                            })];
                    case 3:
                        // Trigger the tooltip
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                var cells = document.querySelectorAll(cellSelector);
                                expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal(['S2', '1']);
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should show right values with horizontal layout on item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, rectangles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, __assign({}, config, { series: [
                                { dataKey: 'v1', id: 's1', label: 'S1' },
                                { dataKey: 'v2', id: 's2', label: 'S2' },
                            ], layout: "horizontal", yAxis: [{ scaleType: 'band', dataKey: 'x', position: 'none' }], slotProps: { tooltip: { trigger: 'item' } } })), { wrapper: wrapper }).user;
                        rectangles = document.querySelectorAll('rect');
                        return [4 /*yield*/, user.pointer({
                                target: rectangles[0],
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                var cells = document.querySelectorAll(cellSelector);
                                expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal(['S1', '4']);
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.pointer({
                                target: rectangles[3],
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                var cells = document.querySelectorAll(cellSelector);
                                expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal(['S2', '1']);
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('custom tooltip', function () {
        it('should show custom tooltip', function () { return __awaiter(void 0, void 0, void 0, function () {
            function CustomTooltip() {
                var _a;
                var tooltipData = (0, useItemTooltip_1.useItemTooltip)();
                var barSeries = (0, hooks_1.useBarSeries)((_a = tooltipData === null || tooltipData === void 0 ? void 0 : tooltipData.identifier.seriesId) !== null && _a !== void 0 ? _a : '');
                if (!tooltipData || !barSeries) {
                    return null;
                }
                var sum = barSeries.data
                    .slice(0, tooltipData.identifier.dataIndex + 1)
                    .reduce(function (acc, v) { return acc + (v !== null && v !== void 0 ? v : 0); }, 0);
                return ((0, jsx_runtime_1.jsx)(ChartsTooltipContainer_1.ChartsTooltipContainer, { trigger: "item", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: "sum" }), (0, jsx_runtime_1.jsx)("p", { children: sum })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { children: "current" }), (0, jsx_runtime_1.jsx)("p", { children: tooltipData === null || tooltipData === void 0 ? void 0 : tooltipData.formattedValue })] })] }) }));
            }
            var user, rectangles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, __assign({}, config, { dataset: undefined, series: [{ id: 's1', label: 'S1', data: [100, 200, 300, 400] }], xAxis: [{ data: ['A', 'B', 'C', 'D'], position: 'none' }], slotProps: { tooltip: { trigger: 'item' } }, slots: { tooltip: CustomTooltip } })), { wrapper: wrapper }).user;
                        rectangles = document.querySelectorAll('rect');
                        // Trigger the tooltip
                        return [4 /*yield*/, user.pointer({
                                target: rectangles[1],
                                coords: {
                                    x: 50,
                                    y: 350,
                                },
                            })];
                    case 1:
                        // Trigger the tooltip
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                var cells = document.querySelectorAll('.MuiChartsTooltip-root p');
                                expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal([
                                    'sum',
                                    '300',
                                    'current',
                                    '200',
                                ]);
                            })];
                    case 2:
                        _a.sent();
                        // Trigger the tooltip
                        return [4 /*yield*/, user.pointer({
                                target: rectangles[3],
                                coords: {
                                    x: 350,
                                    y: 350,
                                },
                            })];
                    case 3:
                        // Trigger the tooltip
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                var cells = document.querySelectorAll('.MuiChartsTooltip-root p');
                                expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal([
                                    'sum',
                                    '1000',
                                    'current',
                                    '400',
                                ]);
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
