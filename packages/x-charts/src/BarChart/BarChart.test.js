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
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var describeConformance_1 = require("test/utils/describeConformance");
var BarChart_1 = require("@mui/x-charts/BarChart");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var skipIf_1 = require("test/utils/skipIf");
describe('<BarChart />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 100, width: 100, series: [{ data: [100, 200] }] }), function () { return ({
        classes: {},
        inheritComponent: 'svg',
        render: render,
        muiName: 'MuiBarChart',
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
    it('should render "No data to display" when axes are empty arrays', function () {
        render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { series: [], width: 100, height: 100, xAxis: [], yAxis: [] }));
        expect(internal_test_utils_1.screen.getByText('No data to display')).toBeVisible();
    });
    it('should render "No data to display" when series are empty and axes are not empty arrays', function () {
        render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { series: [], width: 100, height: 100, xAxis: [{ data: ['A'] }], yAxis: [] }));
        expect(internal_test_utils_1.screen.getByText('No data to display')).toBeVisible();
    });
    it('prioritizes `barLabel` from series over `barLabel` prop', function () {
        render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { barLabel: function () { return 'Bar label from prop'; }, series: [{ data: [1], barLabel: function () { return 'Bar label from series'; } }], width: 100, height: 100, xAxis: [{ data: ['A'] }], yAxis: [] }));
        expect(internal_test_utils_1.screen.getByText('Bar label from series')).toBeVisible();
    });
    it("defaults to `barLabel` prop when `barLabel` from series isn't defined", function () {
        render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { barLabel: function () { return 'Bar label from prop'; }, series: [{ data: [1] }, { data: [1], barLabel: function () { return 'Bar label from 2nd series'; } }], width: 100, height: 100, xAxis: [{ data: ['A'] }], yAxis: [] }));
        expect(internal_test_utils_1.screen.getByText('Bar label from prop')).toBeVisible();
        expect(internal_test_utils_1.screen.getByText('Bar label from 2nd series')).toBeVisible();
    });
    var wrapper = function (_a) {
        var children = _a.children;
        return ((0, jsx_runtime_1.jsx)("div", { style: { width: 400, height: 400 }, children: children }));
    };
    // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
    it.skipIf(skipIf_1.isJSDOM)('should hide tooltip if the item the tooltip was showing is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, setProps, user, bar, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 400, width: 400, series: [{ data: [10] }], xAxis: [{ data: ['A'] }], hideLegend: true, skipAnimation: true }), { wrapper: wrapper }), setProps = _a.setProps, user = _a.user;
                    bar = document.querySelector(".".concat(BarChart_1.barElementClasses.root));
                    return [4 /*yield*/, user.pointer({ target: bar, coords: { x: 200, y: 200 } })];
                case 1:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, internal_test_utils_1.screen.findByRole('tooltip')];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBeVisible();
                    setProps({
                        series: [{ data: [] }],
                        xAxis: [{ data: [] }],
                    });
                    expect(internal_test_utils_1.screen.queryByRole('tooltip')).to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
    it.skipIf(skipIf_1.isJSDOM)('should hide tooltip if the series of the item the tooltip was showing is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, setProps, user, bar, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 400, width: 400, series: [{ data: [10] }], xAxis: [{ data: ['A'] }], hideLegend: true, skipAnimation: true }), { wrapper: wrapper }), setProps = _a.setProps, user = _a.user;
                    bar = document.querySelector(".".concat(BarChart_1.barElementClasses.root));
                    return [4 /*yield*/, user.pointer({ target: bar, coords: { x: 200, y: 200 } })];
                case 1:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, internal_test_utils_1.screen.findByRole('tooltip')];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBeVisible();
                    setProps({
                        series: [],
                        xAxis: [],
                    });
                    expect(internal_test_utils_1.screen.queryByRole('tooltip')).to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
    it.skipIf(skipIf_1.isJSDOM)('should highlight element on pointer enter and remove highlight on pointer leave', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, bars;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 400, width: 400, series: [
                            { data: [5, 10], highlightScope: { highlight: 'item', fade: 'global' } },
                            { data: [1, 2] },
                        ], xAxis: [{ data: ['A', 'B'] }], hideLegend: true, skipAnimation: true }), { wrapper: wrapper }).user;
                    bars = document.querySelectorAll(".".concat(BarChart_1.barElementClasses.root));
                    return [4 /*yield*/, user.pointer({ target: bars[0] })];
                case 1:
                    _a.sent();
                    expect(__spreadArray([], bars, true).map(function (b) { return b.getAttribute('data-highlighted'); })).to.deep.equal([
                        'true',
                        null,
                        null,
                        null,
                    ]);
                    expect(__spreadArray([], bars, true).map(function (b) { return b.getAttribute('data-faded'); })).to.deep.equal([
                        null,
                        'true',
                        'true',
                        'true',
                    ]);
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
                            a2: 200,
                            unusedProp: { test: 'value' },
                        },
                        {
                            version: 'data-3',
                            a1: null,
                        },
                        {
                            version: 'data-4',
                            a1: undefined,
                        },
                    ];
                    render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { dataset: dataset, xAxis: [{ dataKey: 'version' }], series: [{ dataKey: 'a1', label: 'Series A' }], width: 500, height: 300 }));
                    return [4 /*yield*/, internal_test_utils_1.screen.findByText('data-3')];
                case 1:
                    labelX = _a.sent();
                    expect(labelX).toBeVisible();
                    return [4 /*yield*/, internal_test_utils_1.screen.findByText('600')];
                case 2:
                    labelY = _a.sent();
                    expect(labelY).toBeVisible();
                    return [2 /*return*/];
            }
        });
    }); });
});
