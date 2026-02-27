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
var vitest_1 = require("vitest");
var BarChart_1 = require("@mui/x-charts/BarChart");
var PieChart_1 = require("@mui/x-charts/PieChart");
var ChartsLegend_1 = require("@mui/x-charts/ChartsLegend");
/**
 * Helper to check if a bar element is visible (has non-zero dimensions)
 */
function isBarVisible(bar) {
    var width = Number(bar.getAttribute('width') || 0);
    var height = Number(bar.getAttribute('height') || 0);
    return width > 0 && height > 0;
}
/**
 * Helper to check if a pie arc is visible (start and end angle are different)
 * Hidden pie arcs have startAngle === endAngle (zero-size arc)
 */
function isPieArcVisible(path) {
    var d = path.getAttribute('d') || '';
    // A hidden arc has a path that doesn't create a visible shape
    // A visible arc has a proper arc path
    return d.includes('A') && !d.includes('A0,0');
}
/**
 * Helper to get visible bars from the document
 */
function getVisibleBars() {
    var bars = document.querySelectorAll(".".concat(BarChart_1.barElementClasses.root));
    return Array.from(bars).filter(isBarVisible);
}
/**
 * Helper to get visible pie arcs from the document
 */
function getVisiblePieArcs() {
    var arcs = document.querySelectorAll(".".concat(PieChart_1.pieArcClasses.root));
    return Array.from(arcs).filter(isPieArcVisible);
}
describe('useChartVisibilityManager', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    describe('Legend toggleVisibilityOnClick', function () {
        it('should toggle bar series visibility when clicking on legend item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, series1Button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 300, width: 300, skipAnimation: true, series: [
                                { id: 'series-1', label: 'Series 1', data: [10, 20] },
                                { id: 'series-2', label: 'Series 2', data: [15, 25] },
                            ], xAxis: [{ data: ['A', 'B'] }], slotProps: { legend: { toggleVisibilityOnClick: true } } })).user;
                        // Initially all bars should be visible (with non-zero dimensions)
                        expect(getVisibleBars().length).to.equal(4); // 2 series x 2 data points
                        series1Button = internal_test_utils_1.screen.getByRole('button', { name: /Series 1/ });
                        return [4 /*yield*/, user.click(series1Button)];
                    case 1:
                        _a.sent();
                        // The legend item should now be marked as hidden
                        expect(series1Button.classList.contains(ChartsLegend_1.legendClasses.hidden)).to.equal(true);
                        // Only series-2 bars should be visible now (2 bars with non-zero dimensions)
                        expect(getVisibleBars().length).to.equal(2);
                        // Click again to show the series
                        return [4 /*yield*/, user.click(series1Button)];
                    case 2:
                        // Click again to show the series
                        _a.sent();
                        // Legend item should no longer be hidden
                        expect(series1Button.classList.contains(ChartsLegend_1.legendClasses.hidden)).to.equal(false);
                        // All bars should be visible again
                        expect(getVisibleBars().length).to.equal(4);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should toggle pie series visibility when clicking on legend item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, slice1Button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render((0, jsx_runtime_1.jsx)(PieChart_1.PieChart, { height: 300, width: 300, skipAnimation: true, series: [
                                {
                                    id: 'pie-series',
                                    data: [
                                        { label: 'Slice 1', value: 10 },
                                        { label: 'Slice 2', value: 20 },
                                        { label: 'Slice 3', value: 30 },
                                    ],
                                },
                            ], slotProps: { legend: { toggleVisibilityOnClick: true } } })).user;
                        // Initially all pie slices should be visible
                        expect(getVisiblePieArcs().length).to.equal(3);
                        slice1Button = internal_test_utils_1.screen.getByRole('button', { name: /Slice 1/ });
                        return [4 /*yield*/, user.click(slice1Button)];
                    case 1:
                        _a.sent();
                        // The legend item should now be marked as hidden
                        expect(slice1Button.classList.contains(ChartsLegend_1.legendClasses.hidden)).to.equal(true);
                        // Two slices should still be visible (one hidden)
                        expect(getVisiblePieArcs().length).to.equal(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('onHiddenItemsChange callback', function () {
        it('should call onHiddenItemsChange when hiding and showing a item via legend click', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onHiddenItemsChange, user, series1Button;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        onHiddenItemsChange = vitest_1.vi.fn();
                        user = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 300, width: 300, skipAnimation: true, series: [
                                { id: 'series-1', label: 'Series 1', data: [10, 20] },
                                { id: 'series-2', label: 'Series 2', data: [15, 25] },
                            ], xAxis: [{ data: ['A', 'B'] }], onHiddenItemsChange: onHiddenItemsChange, slotProps: { legend: { toggleVisibilityOnClick: true } } })).user;
                        series1Button = internal_test_utils_1.screen.getByRole('button', { name: /Series 1/ });
                        // Hide the item
                        return [4 /*yield*/, user.click(series1Button)];
                    case 1:
                        // Hide the item
                        _c.sent();
                        expect(onHiddenItemsChange).toHaveBeenCalledTimes(1);
                        expect((_a = onHiddenItemsChange.mock.lastCall) === null || _a === void 0 ? void 0 : _a[0]).to.deep.equal([
                            { type: 'bar', seriesId: 'series-1', dataIndex: undefined },
                        ]);
                        // Show the item again
                        return [4 /*yield*/, user.click(series1Button)];
                    case 2:
                        // Show the item again
                        _c.sent();
                        expect(onHiddenItemsChange).toHaveBeenCalledTimes(2);
                        expect((_b = onHiddenItemsChange.mock.lastCall) === null || _b === void 0 ? void 0 : _b[0]).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('controlled hiddenItems', function () {
        it('should respect controlled hiddenItems for bar chart', function () {
            var setProps = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 300, width: 300, skipAnimation: true, series: [
                    { id: 'series-1', label: 'Series 1', data: [10, 20] },
                    { id: 'series-2', label: 'Series 2', data: [15, 25] },
                ], xAxis: [{ data: ['A', 'B'] }], hiddenItems: [{ type: 'bar', seriesId: 'series-1' }] })).setProps;
            // Only series-2 should be visible (bars with non-zero dimensions)
            expect(getVisibleBars().length).to.equal(2);
            // The legend item for series-1 should be marked as hidden
            var legend = internal_test_utils_1.screen.getByRole('list');
            var series1Item = (0, internal_test_utils_1.within)(legend).getByText('Series 1').closest(".".concat(ChartsLegend_1.legendClasses.series));
            var series2Item = (0, internal_test_utils_1.within)(legend).getByText('Series 2').closest(".".concat(ChartsLegend_1.legendClasses.series));
            expect(series1Item === null || series1Item === void 0 ? void 0 : series1Item.classList.contains(ChartsLegend_1.legendClasses.hidden)).to.equal(true);
            expect(series2Item === null || series2Item === void 0 ? void 0 : series2Item.classList.contains(ChartsLegend_1.legendClasses.hidden)).to.equal(false);
            setProps({
                hiddenItems: [{ type: 'bar', seriesId: 'series-2' }],
            });
            expect(series1Item === null || series1Item === void 0 ? void 0 : series1Item.classList.contains(ChartsLegend_1.legendClasses.hidden)).to.equal(false);
            expect(series2Item === null || series2Item === void 0 ? void 0 : series2Item.classList.contains(ChartsLegend_1.legendClasses.hidden)).to.equal(true);
        });
    });
    describe('initialHiddenItems', function () {
        it('should hide items on initial render with initialHiddenItems', function () { return __awaiter(void 0, void 0, void 0, function () {
            var legend, series1Item, series2Item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 300, width: 300, skipAnimation: true, series: [
                                { id: 'series-1', label: 'Series 1', data: [10, 20] },
                                { id: 'series-2', label: 'Series 2', data: [15, 25] },
                            ], xAxis: [{ data: ['A', 'B'] }], initialHiddenItems: [{ type: 'bar', seriesId: 'series-1' }] }));
                        // Only series-2 should be visible (bars with non-zero dimensions)
                        expect(getVisibleBars().length).to.equal(2);
                        return [4 /*yield*/, internal_test_utils_1.screen.findByRole('list')];
                    case 1:
                        legend = _a.sent();
                        series1Item = (0, internal_test_utils_1.within)(legend).getByText('Series 1').closest(".".concat(ChartsLegend_1.legendClasses.series));
                        series2Item = (0, internal_test_utils_1.within)(legend).getByText('Series 2').closest(".".concat(ChartsLegend_1.legendClasses.series));
                        expect(series1Item === null || series1Item === void 0 ? void 0 : series1Item.classList.contains(ChartsLegend_1.legendClasses.hidden)).to.equal(true);
                        expect(series2Item === null || series2Item === void 0 ? void 0 : series2Item.classList.contains(ChartsLegend_1.legendClasses.hidden)).to.equal(false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow toggling visibility when using initialHiddenItems', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, series1Button;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 300, width: 300, skipAnimation: true, series: [
                                { id: 'series-1', label: 'Series 1', data: [10, 20] },
                                { id: 'series-2', label: 'Series 2', data: [15, 25] },
                            ], xAxis: [{ data: ['A', 'B'] }], initialHiddenItems: [{ type: 'bar', seriesId: 'series-1' }], slotProps: { legend: { toggleVisibilityOnClick: true } } })).user;
                        // Initially only series-2 should be visible
                        expect(getVisibleBars().length).to.equal(2);
                        return [4 /*yield*/, internal_test_utils_1.screen.findByRole('button', { name: /Series 1/ })];
                    case 1:
                        series1Button = _a.sent();
                        return [4 /*yield*/, user.click(series1Button)];
                    case 2:
                        _a.sent();
                        // All bars should now be visible
                        expect(getVisibleBars().length).to.equal(4);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
