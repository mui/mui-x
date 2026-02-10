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
var BarChart_1 = require("@mui/x-charts/BarChart");
var ChartsAxis_1 = require("@mui/x-charts/ChartsAxis");
var skipIf_1 = require("test/utils/skipIf");
describe('useChartCartesianAxis - positions', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    it('should not render axes when position is none', function () { return __awaiter(void 0, void 0, void 0, function () {
        var axesRoot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { yAxis: [{ position: 'none' }], xAxis: [{ id: 'qwerty', data: ['a', 'b'], position: 'none' }], series: [{ data: [1, 2] }], margin: 0, height: 100, width: 100 }));
                    return [4 /*yield*/, document.querySelectorAll(".".concat(ChartsAxis_1.axisClasses.root))];
                case 1:
                    axesRoot = _a.sent();
                    expect(axesRoot).toHaveLength(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it.skipIf(skipIf_1.isJSDOM)('should place axes according to their dimensions', function () { return __awaiter(void 0, void 0, void 0, function () {
        var axesRoot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { xAxis: [{ data: ['a', 'b'], height: 30 }], yAxis: [{ width: 20 }], series: [{ data: [1, 2] }], margin: 0, height: 100, width: 100 }));
                    return [4 /*yield*/, document.querySelectorAll(".".concat(ChartsAxis_1.axisClasses.root))];
                case 1:
                    axesRoot = _a.sent();
                    expect(axesRoot).toHaveLength(2);
                    // transform format: matrix(a, b, c, d, tx, ty)
                    expect(getComputedStyle(axesRoot[0]).transform).toBe('matrix(1, 0, 0, 1, 0, 70)'); // xAxis
                    expect(getComputedStyle(axesRoot[1]).transform).toBe('matrix(1, 0, 0, 1, 20, 0)'); // yAxis
                    return [2 /*return*/];
            }
        });
    }); });
    it.skipIf(skipIf_1.isJSDOM)('should place axes according to their dimensions and position', function () { return __awaiter(void 0, void 0, void 0, function () {
        var axesRoot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { xAxis: [{ data: ['a', 'b'], height: 30, position: 'top' }], yAxis: [{ width: 20, position: 'right' }], series: [{ data: [1, 2] }], margin: 0, height: 100, width: 100 }));
                    return [4 /*yield*/, document.querySelectorAll(".".concat(ChartsAxis_1.axisClasses.root))];
                case 1:
                    axesRoot = _a.sent();
                    expect(axesRoot).toHaveLength(2);
                    // transform format: matrix(a, b, c, d, tx, ty)
                    expect(getComputedStyle(axesRoot[0]).transform).toBe('matrix(1, 0, 0, 1, 0, 30)'); // xAxis
                    expect(getComputedStyle(axesRoot[1]).transform).toBe('matrix(1, 0, 0, 1, 80, 0)'); // yAxis
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not render extra axes if they have no position', function () { return __awaiter(void 0, void 0, void 0, function () {
        var axesRoot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { xAxis: [
                            { data: ['a', 'b'], height: 30 },
                            { data: ['a', 'b'], height: 30 },
                        ], yAxis: [{ width: 20 }, { min: 0, max: 10, width: 20 }], series: [{ data: [1, 2] }], margin: 0, height: 100, width: 100 }));
                    return [4 /*yield*/, document.querySelectorAll(".".concat(ChartsAxis_1.axisClasses.root))];
                case 1:
                    axesRoot = _a.sent();
                    expect(axesRoot).toHaveLength(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it.skipIf(skipIf_1.isJSDOM)('should stack axes when they are at the same position', function () { return __awaiter(void 0, void 0, void 0, function () {
        var axesRoot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { xAxis: [
                            { data: ['a', 'b'], height: 30, position: 'top' },
                            { data: ['a', 'b'], height: 30, position: 'top' },
                        ], yAxis: [
                            { width: 20, position: 'left' },
                            { min: 0, max: 10, width: 20, position: 'left' },
                        ], series: [{ data: [1, 2] }], margin: 0, height: 100, width: 100 }));
                    return [4 /*yield*/, document.querySelectorAll(".".concat(ChartsAxis_1.axisClasses.root))];
                case 1:
                    axesRoot = _a.sent();
                    expect(axesRoot).toHaveLength(4);
                    // transform format: matrix(a, b, c, d, tx, ty)
                    expect(getComputedStyle(axesRoot[0]).transform).toBe('matrix(1, 0, 0, 1, 0, 60)'); // xAxis
                    expect(getComputedStyle(axesRoot[1]).transform).toBe('matrix(1, 0, 0, 1, 0, 30)'); // xAxis
                    expect(getComputedStyle(axesRoot[2]).transform).toBe('matrix(1, 0, 0, 1, 40, 0)'); // yAxis
                    expect(getComputedStyle(axesRoot[3]).transform).toBe('matrix(1, 0, 0, 1, 20, 0)'); // yAxis
                    return [2 /*return*/];
            }
        });
    }); });
    it.skipIf(skipIf_1.isJSDOM)('should apply axesGap on stack axes when they are at the same position', function () { return __awaiter(void 0, void 0, void 0, function () {
        var axesRoot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { axesGap: 5, xAxis: [
                            { data: ['a', 'b'], height: 30, position: 'top' },
                            { data: ['a', 'b'], height: 30, position: 'top' },
                        ], yAxis: [
                            { width: 20, position: 'left' },
                            { min: 0, max: 10, width: 20, position: 'left' },
                        ], series: [{ data: [1, 2] }], margin: 0, height: 100, width: 100 }));
                    return [4 /*yield*/, document.querySelectorAll(".".concat(ChartsAxis_1.axisClasses.root))];
                case 1:
                    axesRoot = _a.sent();
                    expect(axesRoot).toHaveLength(4);
                    // transform format: matrix(a, b, c, d, tx, ty)
                    expect(getComputedStyle(axesRoot[0]).transform).toBe('matrix(1, 0, 0, 1, 0, 65)'); // xAxis with addition 5px gap
                    expect(getComputedStyle(axesRoot[1]).transform).toBe('matrix(1, 0, 0, 1, 0, 30)'); // xAxis
                    expect(getComputedStyle(axesRoot[2]).transform).toBe('matrix(1, 0, 0, 1, 45, 0)'); // yAxis with addition 5px gap
                    expect(getComputedStyle(axesRoot[3]).transform).toBe('matrix(1, 0, 0, 1, 20, 0)'); // yAxis
                    return [2 /*return*/];
            }
        });
    }); });
    it.skipIf(skipIf_1.isJSDOM)('should add extra space for preview', function () { return __awaiter(void 0, void 0, void 0, function () {
        var axesRoot;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { axesGap: 5, xAxis: [
                            { data: ['a', 'b'], height: 30, position: 'top' },
                            {
                                data: ['a', 'b'],
                                height: 30,
                                position: 'top',
                                zoom: { slider: { enabled: true, size: 10 } },
                            },
                        ], yAxis: [
                            { width: 20, position: 'left', zoom: { slider: { enabled: true, size: 10 } } },
                            { min: 0, max: 10, width: 20, position: 'left' },
                        ], series: [{ data: [1, 2] }], margin: 0, height: 100, width: 100 }));
                    return [4 /*yield*/, document.querySelectorAll(".".concat(ChartsAxis_1.axisClasses.root))];
                case 1:
                    axesRoot = _a.sent();
                    expect(axesRoot).toHaveLength(4);
                    // transform format: matrix(a, b, c, d, tx, ty)
                    expect(getComputedStyle(axesRoot[0]).transform).toBe('matrix(1, 0, 0, 1, 0, 75)'); // xAxis (30 + 10 + 5 + 30)
                    expect(getComputedStyle(axesRoot[1]).transform).toBe('matrix(1, 0, 0, 1, 0, 40)'); // xAxis (30 + 10)
                    expect(getComputedStyle(axesRoot[2]).transform).toBe('matrix(1, 0, 0, 1, 55, 0)'); // yAxis (20 + 10 + 5 + 20)
                    expect(getComputedStyle(axesRoot[3]).transform).toBe('matrix(1, 0, 0, 1, 20, 0)'); // yAxis
                    return [2 /*return*/];
            }
        });
    }); });
});
