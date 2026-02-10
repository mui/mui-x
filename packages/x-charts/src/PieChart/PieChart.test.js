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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var describeConformance_1 = require("test/utils/describeConformance");
var PieChart_1 = require("@mui/x-charts/PieChart");
describe('<PieChart />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)((0, jsx_runtime_1.jsx)(PieChart_1.PieChart, { height: 100, width: 100, series: [
            {
                data: [
                    { id: 'A', value: 100 },
                    { id: 'B', value: 200 },
                ],
            },
        ] }), function () { return ({
        classes: {},
        inheritComponent: 'svg',
        render: render,
        muiName: 'MuiPieChart',
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
    it('should render "No Data" overlay when series prop is an empty array', function () {
        render((0, jsx_runtime_1.jsx)(PieChart_1.PieChart, { height: 100, width: 100, series: [] }));
        var noDataOverlay = internal_test_utils_1.screen.getByText('No data to display');
        expect(noDataOverlay).toBeVisible();
    });
    it('should hide tooltip if the item the tooltip was showing is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rerender, user, pieArc, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = render((0, jsx_runtime_1.jsx)(PieChart_1.PieChart, { height: 100, width: 100, series: [{ data: [{ id: 0, value: 10 }] }], hideLegend: true })), rerender = _a.rerender, user = _a.user;
                    pieArc = document.querySelector(".".concat(PieChart_1.pieArcClasses.root));
                    return [4 /*yield*/, user.hover(pieArc)];
                case 1:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, internal_test_utils_1.screen.findByRole('tooltip')];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBeVisible();
                    rerender((0, jsx_runtime_1.jsx)(PieChart_1.PieChart, { height: 100, width: 100, series: [{ data: [] }], hideLegend: true }));
                    expect(internal_test_utils_1.screen.queryByRole('tooltip')).to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should hide tooltip if the series of the item the tooltip was showing is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, rerender, user, pieArc, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = render((0, jsx_runtime_1.jsx)(PieChart_1.PieChart, { height: 100, width: 100, series: [{ data: [{ id: 0, value: 10 }] }], hideLegend: true })), rerender = _a.rerender, user = _a.user;
                    pieArc = document.querySelector(".".concat(PieChart_1.pieArcClasses.root));
                    return [4 /*yield*/, user.hover(pieArc)];
                case 1:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, internal_test_utils_1.screen.findByRole('tooltip')];
                case 2:
                    _b.apply(void 0, [_c.sent()]).toBeVisible();
                    rerender((0, jsx_runtime_1.jsx)(PieChart_1.PieChart, { height: 100, width: 100, series: [], hideLegend: true }));
                    expect(internal_test_utils_1.screen.queryByRole('tooltip')).to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should show focus indicator when navigating with keyboard', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, container, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = render((0, jsx_runtime_1.jsx)(PieChart_1.PieChart, { enableKeyboardNavigation: true, "data-testid": "chart-keyboard-navigation", height: 100, width: 100, series: [
                            {
                                data: [
                                    { id: 0, value: 10 },
                                    { id: 1, value: 20 },
                                ],
                            },
                        ], hideLegend: true })), container = _a.container, user = _a.user;
                    // by default does not show focus indicator
                    expect(container.querySelector(".".concat(PieChart_1.pieArcClasses.focusIndicator))).not.toBeTruthy();
                    // focus the chart
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, internal_test_utils_1.screen.getByTestId('chart-keyboard-navigation').focus()];
                        }); }); })];
                case 1:
                    // focus the chart
                    _b.sent();
                    // Focus the first arc
                    return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                case 2:
                    // Focus the first arc
                    _b.sent();
                    expect(container.querySelector(".".concat(PieChart_1.pieArcClasses.focusIndicator, ".MuiPieArc-data-index-0"))).toBeTruthy();
                    // Focus the second arc
                    return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                case 3:
                    // Focus the second arc
                    _b.sent();
                    expect(container.querySelector(".".concat(PieChart_1.pieArcClasses.focusIndicator, ".MuiPieArc-data-index-1"))).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should only show focus indicator for the focused series', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, container, user, focusIndicators, focusIndicators2, focusIndicators3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = render((0, jsx_runtime_1.jsx)(PieChart_1.PieChart, { enableKeyboardNavigation: true, "data-testid": "chart-focus-series", height: 400, width: 400, series: [
                            {
                                id: 'series-1',
                                data: [
                                    { id: 0, value: 10 },
                                    { id: 1, value: 20 },
                                ],
                                innerRadius: 0,
                                outerRadius: 80,
                            },
                            {
                                id: 'series-2',
                                data: [
                                    { id: 0, value: 30 },
                                    { id: 1, value: 40 },
                                ],
                                innerRadius: 100,
                                outerRadius: 180,
                            },
                        ], hideLegend: true })), container = _a.container, user = _a.user;
                    // focus the chart
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, internal_test_utils_1.screen.getByTestId('chart-focus-series').focus()];
                        }); }); })];
                case 1:
                    // focus the chart
                    _b.sent();
                    // Focus the first arc of series-1
                    return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                case 2:
                    // Focus the first arc of series-1
                    _b.sent();
                    focusIndicators = container.querySelectorAll(".".concat(PieChart_1.pieArcClasses.focusIndicator));
                    expect(focusIndicators.length).to.equal(1);
                    // Focus the second arc of series-1
                    return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                case 3:
                    // Focus the second arc of series-1
                    _b.sent();
                    focusIndicators2 = container.querySelectorAll(".".concat(PieChart_1.pieArcClasses.focusIndicator));
                    expect(focusIndicators2.length).to.equal(1);
                    // Move to series-2
                    return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                case 4:
                    // Move to series-2
                    _b.sent();
                    focusIndicators3 = container.querySelectorAll(".".concat(PieChart_1.pieArcClasses.focusIndicator));
                    expect(focusIndicators3.length).to.equal(1);
                    return [2 /*return*/];
            }
        });
    }); });
});
