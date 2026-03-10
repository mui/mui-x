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
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var describeConformance_1 = require("test/utils/charts/describeConformance");
var LineChart_1 = require("@mui/x-charts/LineChart");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var skipIf_1 = require("test/utils/skipIf");
var config = {
    dataset: [
        { x: 10, v1: 0, v2: 10 },
        { x: 20, v1: 5, v2: 8 },
        { x: 30, v1: 8, v2: 5 },
        { x: 40, v1: 10, v2: 0 },
    ],
    margin: { top: 0, left: 0, bottom: 0, right: 0 },
    xAxis: [{ position: 'none' }],
    yAxis: [{ position: 'none' }],
    width: 400,
    height: 400,
};
describe('<LineChart />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, { height: 100, width: 100, series: [{ data: [100, 200] }] }), function () { return ({
        classes: {},
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiLineChart',
        testComponentPropWith: 'div',
        refInstanceof: window.HTMLDivElement,
    }); });
    it('should render "No data to display" when axes are empty arrays', function () {
        render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, { series: [], width: 100, height: 100, xAxis: [], yAxis: [] }));
        expect(internal_test_utils_1.screen.getByText('No data to display')).toBeVisible();
    });
    it('should support dataset with missing values', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dataset, labelX, labelY;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataset = [
                        {
                            version: 'data-0',
                            a1: 500,
                            a2: 100,
                            unusedProp: 'test',
                        },
                        {
                            version: 'data-1',
                            a1: 600,
                            a2: 200,
                            unusedProp: ['test'],
                        },
                        {
                            version: 'data-2',
                            // Item with missing x-values
                            // a1: 500,
                            a2: 250,
                            unusedProp: { test: 'value' },
                        },
                        {
                            version: 'data-3',
                            a1: null,
                            // Missing y-value,
                        },
                        {
                            version: 'data-4',
                            a1: undefined,
                            a2: null,
                        },
                    ];
                    render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, { dataset: dataset, xAxis: [{ dataKey: 'a1' }], series: [{ dataKey: 'a2', label: 'Series A' }], width: 500, height: 300 }));
                    return [4 /*yield*/, internal_test_utils_1.screen.findByText('500')];
                case 1:
                    labelX = _a.sent();
                    expect(labelX).toBeVisible();
                    return [4 /*yield*/, internal_test_utils_1.screen.findByText('250')];
                case 2:
                    labelY = _a.sent();
                    expect(labelY).toBeVisible();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('data-series-id', function () {
        it('should add data-series-id to area elements', function () {
            render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, config, { series: [
                    { dataKey: 'v1', id: 's1', area: true },
                    { dataKey: 'v2', id: 's2', area: true },
                ], xAxis: [{ scaleType: 'band', dataKey: 'x' }] })));
            var areas = document.querySelectorAll(".".concat(LineChart_1.lineClasses.area));
            expect(areas[0].getAttribute('data-series-id')).to.equal('s1');
            expect(areas[1].getAttribute('data-series-id')).to.equal('s2');
        });
        it('should add data-series-id to line elements', function () {
            render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, config, { series: [
                    { dataKey: 'v1', id: 's1' },
                    { dataKey: 'v2', id: 's2' },
                ], xAxis: [{ scaleType: 'band', dataKey: 'x' }] })));
            var lines = document.querySelectorAll(".".concat(LineChart_1.lineClasses.line));
            expect(lines[0].getAttribute('data-series-id')).to.equal('s1');
            expect(lines[1].getAttribute('data-series-id')).to.equal('s2');
        });
        it('should add data-series-id to mark elements', function () {
            render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, config, { series: [
                    { dataKey: 'v1', id: 's1', showMark: true },
                    { dataKey: 'v2', id: 's2', showMark: true },
                ], xAxis: [{ scaleType: 'band', dataKey: 'x' }] })));
            var marks = document.querySelectorAll(".".concat(LineChart_1.lineClasses.mark));
            // First 4 marks belong to s1, next 4 to s2
            for (var i = 0; i < 4; i += 1) {
                expect(marks[i].getAttribute('data-series-id')).to.equal('s1');
            }
            for (var i = 4; i < 8; i += 1) {
                expect(marks[i].getAttribute('data-series-id')).to.equal('s2');
            }
        });
    });
    describe('data-index', function () {
        it('should add data-index to mark elements', function () {
            render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, config, { series: [{ dataKey: 'v1', id: 's1', showMark: true }], xAxis: [{ scaleType: 'band', dataKey: 'x' }] })));
            var marks = document.querySelectorAll(".".concat(LineChart_1.lineClasses.mark));
            expect(marks[0].getAttribute('data-index')).to.equal('0');
            expect(marks[1].getAttribute('data-index')).to.equal('1');
            expect(marks[2].getAttribute('data-index')).to.equal('2');
            expect(marks[3].getAttribute('data-index')).to.equal('3');
        });
    });
    describe('classes', function () {
        it('should apply MuiLineChart classes to area elements', function () {
            render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, config, { series: [{ dataKey: 'v1', id: 's1', area: true }], xAxis: [{ scaleType: 'band', dataKey: 'x' }] })));
            var areas = document.querySelectorAll(".".concat(LineChart_1.lineClasses.area));
            expect(areas.length).to.equal(1);
        });
        it('should apply MuiLineChart classes to line elements', function () {
            render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, config, { series: [{ dataKey: 'v1', id: 's1' }], xAxis: [{ scaleType: 'band', dataKey: 'x' }] })));
            var lines = document.querySelectorAll(".".concat(LineChart_1.lineClasses.line));
            expect(lines.length).to.equal(1);
        });
        it('should apply MuiLineChart classes to mark elements', function () {
            render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, config, { series: [{ dataKey: 'v1', id: 's1', showMark: true }], xAxis: [{ scaleType: 'band', dataKey: 'x' }] })));
            var marks = document.querySelectorAll(".".concat(LineChart_1.lineClasses.mark));
            expect(marks.length).to.equal(4);
        });
    });
    describe('Plot root elements', function () {
        it('should apply MuiLineChart-root class to AreaPlot root', function () {
            render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, config, { series: [{ dataKey: 'v1', id: 's1', area: true }], xAxis: [{ scaleType: 'band', dataKey: 'x' }] })));
            var areaPlotRoots = document.querySelectorAll(".".concat(LineChart_1.lineClasses.root));
            expect(areaPlotRoots.length).toBeGreaterThan(0);
        });
    });
    describe('theme style overrides', function () {
        it.skipIf(skipIf_1.isJSDOM)('should apply MuiAreaPlot style overrides from the theme', function () {
            var theme = (0, styles_1.createTheme)({
                components: {
                    MuiAreaPlot: {
                        styleOverrides: {
                            root: {
                                strokeDashoffset: 10,
                            },
                        },
                    },
                },
            });
            render((0, jsx_runtime_1.jsx)(styles_1.ThemeProvider, { theme: theme, children: (0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, config, { series: [{ dataKey: 'v1', id: 's1', area: true }], xAxis: [{ scaleType: 'band', dataKey: 'x' }] })) }));
            var area = document.querySelector(".".concat(LineChart_1.lineClasses.area));
            expect(area).not.to.equal(null);
            var areaPlotRoot = area.parentElement;
            expect(areaPlotRoot).toHaveComputedStyle({ strokeDashoffset: '10px' });
        });
        it.skipIf(skipIf_1.isJSDOM)('should apply MuiLinePlot style overrides from the theme', function () {
            var theme = (0, styles_1.createTheme)({
                components: {
                    MuiLinePlot: {
                        styleOverrides: {
                            root: {
                                strokeDashoffset: 10,
                            },
                        },
                    },
                },
            });
            render((0, jsx_runtime_1.jsx)(styles_1.ThemeProvider, { theme: theme, children: (0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, config, { series: [{ dataKey: 'v1', id: 's1' }], xAxis: [{ scaleType: 'band', dataKey: 'x' }] })) }));
            var line = document.querySelector(".".concat(LineChart_1.lineClasses.line));
            expect(line).not.to.equal(null);
            var linePlotRoot = line.parentElement;
            expect(linePlotRoot).toHaveComputedStyle({ strokeDashoffset: '10px' });
        });
        it.skipIf(skipIf_1.isJSDOM)('should apply MuiMarkPlot style overrides from the theme', function () {
            var _a;
            var theme = (0, styles_1.createTheme)({
                components: {
                    MuiMarkPlot: {
                        styleOverrides: {
                            root: {
                                strokeDashoffset: 10,
                            },
                        },
                    },
                },
            });
            render((0, jsx_runtime_1.jsx)(styles_1.ThemeProvider, { theme: theme, children: (0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, config, { series: [{ dataKey: 'v1', id: 's1', showMark: true }], xAxis: [{ scaleType: 'band', dataKey: 'x' }] })) }));
            var mark = document.querySelector(".".concat(LineChart_1.lineClasses.mark));
            expect(mark).not.to.equal(null);
            // mark -> series group <g> -> MarkPlotRoot
            var markPlotRoot = (_a = mark.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
            expect(markPlotRoot).toHaveComputedStyle({ strokeDashoffset: '10px' });
        });
    });
});
