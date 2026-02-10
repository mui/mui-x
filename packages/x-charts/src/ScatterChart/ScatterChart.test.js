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
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var describeConformance_1 = require("test/utils/describeConformance");
var ScatterChart_1 = require("@mui/x-charts/ScatterChart");
var skipIf_1 = require("test/utils/skipIf");
var constants_1 = require("../tests/constants");
var cellSelector = '.MuiChartsTooltip-root td, .MuiChartsTooltip-root th';
describe('<ScatterChart />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)((0, jsx_runtime_1.jsx)(ScatterChart_1.ScatterChart, { height: 100, width: 100, series: [
            {
                data: [
                    { id: 'A', x: 100, y: 10 },
                    { id: 'B', x: 200, y: 20 },
                ],
            },
        ] }), function () { return ({
        classes: {},
        inheritComponent: 'svg',
        render: render,
        muiName: 'MuiScatterChart',
        testComponentPropWith: 'div',
        refInstanceof: window.SVGSVGElement,
        skip: [
            'componentProp',
            'componentsProp',
            'slotPropsProp',
            'slotPropsCallback',
            'slotsProp',
            'themeStyleOverrides',
            'themeVariants',
            'themeCustomPalette',
            'themeDefaultProps',
        ],
    }); });
    var config = {
        dataset: [
            { id: 1, x: 0, y: 10 },
            { id: 2, x: 10, y: 10 },
            { id: 3, x: 10, y: 0 },
            { id: 4, x: 0, y: 0 },
            { id: 5, x: 5, y: 5 },
        ],
        margin: 0,
        xAxis: [{ position: 'none' }],
        yAxis: [{ position: 'none' }],
        width: 100,
        height: 100,
    };
    // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
    it.skipIf(skipIf_1.isJSDOM)('should show the tooltip without errors in default config', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, svg, cells;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render((0, jsx_runtime_1.jsx)("div", { style: {
                            margin: -8, // Removes the body default margins
                            width: 100,
                            height: 100,
                        }, children: (0, jsx_runtime_1.jsx)(ScatterChart_1.ScatterChart, __assign({}, config, { series: [{ id: 's1', label: 'series', data: config.dataset }], hideLegend: true })) })).user;
                    svg = document.querySelector(constants_1.CHART_SELECTOR);
                    return [4 /*yield*/, user.pointer([
                            // Set tooltip position voronoi value
                            { target: svg, coords: { clientX: 10, clientY: 10 } },
                        ])];
                case 1:
                    _a.sent();
                    cells = [];
                    return [4 /*yield*/, createRenderer_1.screen.findByRole('tooltip')];
                case 2:
                    _a.sent();
                    cells = document.querySelectorAll(cellSelector);
                    expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal(['series', '(0, 10)']);
                    return [4 /*yield*/, user.pointer([
                            // Set tooltip position voronoi value
                            { target: svg, coords: { clientX: 40, clientY: 60 } },
                        ])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, createRenderer_1.screen.findByRole('tooltip')];
                case 4:
                    _a.sent();
                    cells = document.querySelectorAll(cellSelector);
                    expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal(['series', '(5, 5)']);
                    return [2 /*return*/];
            }
        });
    }); });
    it.skipIf(skipIf_1.isJSDOM)('should show the tooltip without errors with voronoi disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, marks, cells;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render((0, jsx_runtime_1.jsx)("div", { style: {
                            margin: -8, // Removes the body default margins
                            width: 100,
                            height: 100,
                        }, children: (0, jsx_runtime_1.jsx)(ScatterChart_1.ScatterChart, __assign({}, config, { disableVoronoi: true, series: [{ id: 's1', data: config.dataset }] })) })).user;
                    marks = document.querySelectorAll('circle');
                    return [4 /*yield*/, user.pointer([
                            // Only to set the tooltip position
                            { target: marks[0] },
                        ])];
                case 1:
                    _a.sent();
                    cells = [];
                    return [4 /*yield*/, createRenderer_1.screen.findByRole('tooltip')];
                case 2:
                    _a.sent();
                    cells = document.querySelectorAll(cellSelector);
                    expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal(['', '(0, 10)']);
                    return [4 /*yield*/, user.pointer([
                            // Only to set the tooltip position
                            { target: marks[4] },
                        ])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, createRenderer_1.screen.findByRole('tooltip')];
                case 4:
                    _a.sent();
                    cells = document.querySelectorAll(cellSelector);
                    expect(__spreadArray([], cells, true).map(function (cell) { return cell.textContent; })).to.deep.equal(['', '(5, 5)']);
                    return [2 /*return*/];
            }
        });
    }); });
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
                        },
                        {
                            version: 'data-1',
                            a1: 600,
                            a2: 200,
                        },
                        {
                            version: 'data-2',
                            // Item with missing x-values
                            // a1: 500,
                            a2: 200,
                        },
                        {
                            version: 'data-2',
                            // Item with missing y-values
                            a1: 500,
                            // a2: 200,
                        },
                    ];
                    render((0, jsx_runtime_1.jsx)(ScatterChart_1.ScatterChart, { dataset: dataset, series: [{ datasetKeys: { id: 'version', x: 'a1', y: 'a2' }, label: 'Series A' }], width: 500, height: 300 }));
                    return [4 /*yield*/, createRenderer_1.screen.findByText('100')];
                case 1:
                    labelX = _a.sent();
                    expect(labelX).toBeVisible();
                    return [4 /*yield*/, createRenderer_1.screen.findByText('600')];
                case 2:
                    labelY = _a.sent();
                    expect(labelY).toBeVisible();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should render "No data to display" when axes are empty arrays', function () {
        render((0, jsx_runtime_1.jsx)(ScatterChart_1.ScatterChart, { series: [], width: 100, height: 100, xAxis: [], yAxis: [] }));
        expect(createRenderer_1.screen.getByText('No data to display')).toBeVisible();
    });
});
