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
/* eslint-disable no-await-in-loop */
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var skipIf_1 = require("test/utils/skipIf");
var sinon = require("sinon");
var ScatterChartPro_1 = require("./ScatterChartPro");
var getAxisTickValues = function (axis) {
    var axisData = Array.from(document.querySelectorAll(".MuiChartsAxis-direction".concat(axis.toUpperCase(), " .MuiChartsAxis-tickContainer")))
        .map(function (v) { return v.textContent; })
        .filter(Boolean);
    return axisData;
};
describe.skipIf(skipIf_1.isJSDOM)('<ScatterChartPro /> - Zoom', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var scatterChartProps = {
        series: [
            {
                data: [
                    {
                        x: 1,
                        y: 10,
                    },
                    {
                        x: 2,
                        y: 20,
                    },
                    {
                        x: 1,
                        y: 30,
                    },
                    {
                        x: 3,
                        y: 30,
                    },
                    {
                        x: 3,
                        y: 10,
                    },
                ],
            },
        ],
        xAxis: [
            {
                zoom: true,
                height: 30,
                id: 'x',
            },
        ],
        yAxis: [
            {
                zoom: true,
                width: 30,
                id: 'y',
                position: 'right',
            },
        ],
        width: 130,
        height: 130,
        margin: 10,
        slotProps: { tooltip: { trigger: 'none' } },
    };
    var options = {
        wrapper: function (_a) {
            var children = _a.children;
            return (<div style={{ width: 130, height: 130 }}>{children}</div>);
        },
    };
    it('should zoom on wheel', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onZoomChange, user, svg, i, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onZoomChange = sinon.spy();
                    user = render(<ScatterChartPro_1.ScatterChartPro {...scatterChartProps} onZoomChange={onZoomChange}/>, options).user;
                    expect(getAxisTickValues('x')).to.deep.equal(['1', '2', '3']);
                    expect(getAxisTickValues('y')).to.deep.equal(['10', '20', '30']);
                    svg = document.querySelector('svg');
                    return [4 /*yield*/, user.pointer([
                            {
                                target: svg,
                                coords: { x: 50, y: 50 },
                            },
                        ])];
                case 1:
                    _a.sent();
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < 200)) return [3 /*break*/, 5];
                    internal_test_utils_1.fireEvent.wheel(svg, { deltaY: -1, clientX: 50, clientY: 50 });
                    // Wait the animation frame
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Promise(function (r) { return requestAnimationFrame(r); })];
                        }); }); })];
                case 3:
                    // Wait the animation frame
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i += 1;
                    return [3 /*break*/, 2];
                case 5:
                    expect(onZoomChange.callCount).to.equal(200);
                    expect(getAxisTickValues('x')).to.deep.equal(['2']);
                    expect(getAxisTickValues('y')).to.deep.equal(['20']);
                    i = 0;
                    _a.label = 6;
                case 6:
                    if (!(i < 200)) return [3 /*break*/, 9];
                    internal_test_utils_1.fireEvent.wheel(svg, { deltaY: 1, clientX: 50, clientY: 50 });
                    // Wait the animation frame
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Promise(function (r) { return requestAnimationFrame(r); })];
                        }); }); })];
                case 7:
                    // Wait the animation frame
                    _a.sent();
                    _a.label = 8;
                case 8:
                    i += 1;
                    return [3 /*break*/, 6];
                case 9:
                    expect(onZoomChange.callCount).to.equal(400);
                    expect(getAxisTickValues('x')).to.deep.equal(['1', '2', '3']);
                    expect(getAxisTickValues('y')).to.deep.equal(['10', '20', '30']);
                    return [2 /*return*/];
            }
        });
    }); });
    ['MouseLeft', 'TouchA'].forEach(function (pointerName) {
        it("should pan on ".concat(pointerName, " drag"), function () { return __awaiter(void 0, void 0, void 0, function () {
            var onZoomChange, user, svg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onZoomChange = sinon.spy();
                        user = render(<ScatterChartPro_1.ScatterChartPro {...scatterChartProps} initialZoom={[
                                { axisId: 'x', start: 75, end: 100 },
                                { axisId: 'y', start: 75, end: 100 },
                            ]} onZoomChange={onZoomChange}/>, options).user;
                        svg = document.querySelector('svg');
                        expect(getAxisTickValues('x')).to.deep.equal(['2.6', '2.8', '3.0']);
                        expect(getAxisTickValues('y')).to.deep.equal(['26', '28', '30']);
                        // we drag one position
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: "[".concat(pointerName, ">]"),
                                    target: svg,
                                    coords: { x: 15, y: 85 },
                                },
                                {
                                    pointerName: pointerName === 'MouseLeft' ? undefined : pointerName,
                                    target: svg,
                                    coords: { x: 100, y: 5 },
                                },
                                {
                                    keys: "[/".concat(pointerName, "]"),
                                    target: svg,
                                    coords: { x: 100, y: 5 },
                                },
                            ])];
                    case 1:
                        // we drag one position
                        _a.sent();
                        // Wait the animation frame
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (r) { return requestAnimationFrame(r); })];
                            }); }); })];
                    case 2:
                        // Wait the animation frame
                        _a.sent();
                        expect(onZoomChange.callCount).to.equal(1);
                        expect(getAxisTickValues('x')).to.deep.equal(['2.0', '2.2', '2.4']);
                        expect(getAxisTickValues('y')).to.deep.equal(['20', '22', '24']);
                        // we drag all the way to the left so 1 should be visible
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: "[".concat(pointerName, ">]"),
                                    target: svg,
                                    coords: { x: 15, y: 85 },
                                },
                                {
                                    pointerName: pointerName === 'MouseLeft' ? undefined : pointerName,
                                    target: svg,
                                    coords: { x: 300, y: -200 },
                                },
                                {
                                    keys: "[/".concat(pointerName, "]"),
                                    target: svg,
                                    coords: { x: 300, y: -200 },
                                },
                            ])];
                    case 3:
                        // we drag all the way to the left so 1 should be visible
                        _a.sent();
                        // Wait the animation frame
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, new Promise(function (r) { return requestAnimationFrame(r); })];
                            }); }); })];
                    case 4:
                        // Wait the animation frame
                        _a.sent();
                        expect(onZoomChange.callCount).to.equal(2);
                        expect(getAxisTickValues('x')).to.deep.equal(['1.0', '1.2', '1.4']);
                        expect(getAxisTickValues('y')).to.deep.equal(['10', '12', '14']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should zoom on pinch', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onZoomChange, user, svg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onZoomChange = sinon.spy();
                    user = render(<ScatterChartPro_1.ScatterChartPro {...scatterChartProps} onZoomChange={onZoomChange}/>, options).user;
                    expect(getAxisTickValues('x')).to.deep.equal(['1', '2', '3']);
                    expect(getAxisTickValues('y')).to.deep.equal(['10', '20', '30']);
                    svg = document.querySelector('svg');
                    return [4 /*yield*/, user.pointer([
                            {
                                keys: '[TouchA>]',
                                target: svg,
                                coords: { x: 55, y: 45 },
                            },
                            {
                                keys: '[TouchB>]',
                                target: svg,
                                coords: { x: 45, y: 55 },
                            },
                            {
                                pointerName: 'TouchA',
                                target: svg,
                                coords: { x: 65, y: 25 },
                            },
                            {
                                pointerName: 'TouchB',
                                target: svg,
                                coords: { x: 25, y: 65 },
                            },
                            {
                                keys: '[/TouchA]',
                                target: svg,
                                coords: { x: 65, y: 25 },
                            },
                            {
                                keys: '[/TouchB]',
                                target: svg,
                                coords: { x: 25, y: 65 },
                            },
                        ])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Promise(function (r) { return requestAnimationFrame(r); })];
                        }); }); })];
                case 2:
                    _a.sent();
                    expect(onZoomChange.callCount).to.be.above(0);
                    expect(getAxisTickValues('x')).to.deep.equal(['2.0']);
                    expect(getAxisTickValues('y')).to.deep.equal(['20']);
                    return [2 /*return*/];
            }
        });
    }); });
});
