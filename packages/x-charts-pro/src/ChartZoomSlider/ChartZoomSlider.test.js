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
/* eslint-disable no-promise-executor-return */
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var skipIf_1 = require("test/utils/skipIf");
var sinon = require("sinon");
var LineChartPro_1 = require("../LineChartPro/LineChartPro");
var chartAxisZoomSliderThumbClasses_1 = require("./internals/chartAxisZoomSliderThumbClasses");
var chartAxisZoomSliderTrackClasses_1 = require("./internals/chartAxisZoomSliderTrackClasses");
var getAxisTickValues = function (axis) {
    var axisData = Array.from(document.querySelectorAll(".MuiChartsAxis-direction".concat(axis.toUpperCase(), " .MuiChartsAxis-tickContainer")))
        .map(function (v) { return v.textContent; })
        .filter(Boolean);
    return axisData;
};
describe.skipIf(skipIf_1.isJSDOM)('<ChartZoomSlider />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var lineChartProps = {
        series: [
            {
                data: [10, 20, 30, 40],
            },
        ],
        xAxis: [
            {
                scaleType: 'point',
                data: ['A', 'B', 'C', 'D'],
                zoom: {
                    slider: {
                        enabled: true,
                    },
                },
                height: 30,
                id: 'x',
            },
        ],
        yAxis: [{ position: 'none' }],
        width: 100,
        height: 130,
        margin: 5,
        slotProps: { tooltip: { trigger: 'none' } },
    };
    var options = {
        wrapper: function (_a) {
            var children = _a.children;
            return (<div style={{ width: 100, height: 130 }}>{children}</div>);
        },
    };
    it('should pan when using the slider track', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onZoomChange, user, sliderTrack;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onZoomChange = sinon.spy();
                    user = render(<LineChartPro_1.LineChartPro {...lineChartProps} onZoomChange={onZoomChange} initialZoom={[{ axisId: 'x', start: 50, end: 100 }]}/>, options).user;
                    expect(getAxisTickValues('x')).to.deep.equal(['C', 'D']);
                    sliderTrack = document.querySelector(".".concat(chartAxisZoomSliderTrackClasses_1.chartAxisZoomSliderTrackClasses.active));
                    return [4 /*yield*/, user.pointer([
                            {
                                keys: '[MouseLeft>]',
                                target: sliderTrack,
                                coords: { x: 50, y: 0 },
                            },
                            {
                                target: sliderTrack,
                                coords: { x: 20, y: 0 },
                            },
                            {
                                keys: '[/MouseLeft]',
                                target: sliderTrack,
                                coords: { x: 20, y: 0 },
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Promise(function (r) { return requestAnimationFrame(r); })];
                        }); }); })];
                case 2:
                    _a.sent();
                    expect(onZoomChange.callCount).to.equal(1);
                    // The visible area should have shifted left
                    expect(getAxisTickValues('x')).to.deep.equal(['B']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should zoom pulling the slider thumb', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onZoomChange, user, startThumb, endThumb;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onZoomChange = sinon.spy();
                    user = render(<LineChartPro_1.LineChartPro {...lineChartProps} onZoomChange={onZoomChange}/>, options).user;
                    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);
                    startThumb = document.querySelector(".".concat(chartAxisZoomSliderThumbClasses_1.chartAxisZoomSliderThumbClasses.start));
                    endThumb = document.querySelector(".".concat(chartAxisZoomSliderThumbClasses_1.chartAxisZoomSliderThumbClasses.end));
                    // Move the start thumb to zoom in from the left
                    return [4 /*yield*/, user.pointer([
                            {
                                keys: '[MouseLeft>]',
                                target: startThumb,
                                coords: { x: 0, y: 0 },
                            },
                            {
                                target: startThumb,
                                coords: { x: 40, y: 0 },
                            },
                            {
                                keys: '[/MouseLeft]',
                                target: startThumb,
                                coords: { x: 40, y: 0 },
                            },
                        ])];
                case 1:
                    // Move the start thumb to zoom in from the left
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Promise(function (r) { return requestAnimationFrame(r); })];
                        }); }); })];
                case 2:
                    _a.sent();
                    expect(onZoomChange.callCount).to.be.above(0);
                    expect(getAxisTickValues('x')).to.not.include('A');
                    // Reset zoom change spy
                    onZoomChange.resetHistory();
                    // Move the end thumb to zoom in from the right
                    return [4 /*yield*/, user.pointer([
                            {
                                keys: '[MouseLeft>]',
                                target: endThumb,
                                coords: { x: 0, y: 0 },
                            },
                            {
                                target: endThumb,
                                coords: { x: 60, y: 0 },
                            },
                            {
                                keys: '[/MouseLeft]',
                                target: endThumb,
                                coords: { x: 60, y: 0 },
                            },
                        ])];
                case 3:
                    // Move the end thumb to zoom in from the right
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Promise(function (r) { return requestAnimationFrame(r); })];
                        }); }); })];
                case 4:
                    _a.sent();
                    expect(onZoomChange.callCount).to.be.above(0);
                    expect(getAxisTickValues('x')).to.not.include('D');
                    return [2 /*return*/];
            }
        });
    }); });
});
