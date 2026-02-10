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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var vitest_1 = require("vitest");
var RadarChart_1 = require("@mui/x-charts/RadarChart");
var skipIf_1 = require("test/utils/skipIf");
var constants_1 = require("../tests/constants");
var config = {
    series: [
        { id: 's1', data: [2, 3, 4, 5] },
        { id: 's2', data: [6, 5, 2, 1] },
    ],
    radar: {
        metrics: ['A', 'B', 'C', 'D'],
    },
    margin: { top: 0, left: 0, bottom: 0, right: 0 },
    width: 100,
    height: 100,
};
describe('RadarChart - click event', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    describe('onAxisClick', function () {
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        it.skipIf(skipIf_1.isJSDOM)('should provide the right context as second argument', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onAxisClick, user, svg;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        onAxisClick = vitest_1.vi.fn();
                        user = render((0, jsx_runtime_1.jsx)("div", { style: {
                                width: 100,
                                height: 100,
                            }, children: (0, jsx_runtime_1.jsx)(RadarChart_1.RadarChart, __assign({}, config, { onAxisClick: onAxisClick })) })).user;
                        svg = document.querySelector(constants_1.CHART_SELECTOR);
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 45, clientY: 15 },
                                },
                            ])];
                    case 1:
                        _c.sent();
                        expect((_a = onAxisClick.mock.lastCall) === null || _a === void 0 ? void 0 : _a[1]).to.deep.equal({
                            dataIndex: 0,
                            axisValue: 'A',
                            seriesValues: { s1: 2, s2: 6 },
                        });
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 80, clientY: 45 },
                                },
                            ])];
                    case 2:
                        _c.sent();
                        expect((_b = onAxisClick.mock.lastCall) === null || _b === void 0 ? void 0 : _b[1]).to.deep.equal({
                            dataIndex: 1,
                            axisValue: 'B',
                            seriesValues: { s1: 3, s2: 5 },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        it.skipIf(skipIf_1.isJSDOM)('should provide the right context as second argument with startAngle=90', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onAxisClick, user, svg;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        onAxisClick = vitest_1.vi.fn();
                        user = render((0, jsx_runtime_1.jsx)("div", { style: {
                                width: 100,
                                height: 100,
                            }, children: (0, jsx_runtime_1.jsx)(RadarChart_1.RadarChart, __assign({}, config, { radar: __assign(__assign({}, config.radar), { startAngle: 90 }), onAxisClick: onAxisClick })) })).user;
                        svg = document.querySelector(constants_1.CHART_SELECTOR);
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 45, clientY: 15 },
                                },
                            ])];
                    case 1:
                        _c.sent();
                        expect((_a = onAxisClick.mock.lastCall) === null || _a === void 0 ? void 0 : _a[1]).to.deep.equal({
                            dataIndex: 3,
                            axisValue: 'D',
                            seriesValues: { s1: 5, s2: 1 },
                        });
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 80, clientY: 45 },
                                },
                            ])];
                    case 2:
                        _c.sent();
                        expect((_b = onAxisClick.mock.lastCall) === null || _b === void 0 ? void 0 : _b[1]).to.deep.equal({
                            dataIndex: 0,
                            axisValue: 'A',
                            seriesValues: { s1: 2, s2: 6 },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('onMarkClick', function () {
        it('should add cursor="pointer" to mark elements', function () {
            render((0, jsx_runtime_1.jsx)(RadarChart_1.RadarChart, __assign({}, config, { onMarkClick: function () { } })));
            var marks = document.querySelectorAll('circle.MuiRadarSeriesPlot-mark');
            expect(Array.from(marks).map(function (rectangle) { return rectangle.getAttribute('cursor'); })).to.deep.equal([
                'pointer',
                'pointer',
                'pointer',
                'pointer',
                'pointer',
                'pointer',
                'pointer',
                'pointer',
            ]);
        });
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        it.skipIf(skipIf_1.isJSDOM)('should provide the right context as second argument', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onItemClick, user, marks;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        onItemClick = vitest_1.vi.fn();
                        user = render((0, jsx_runtime_1.jsx)("div", { style: {
                                width: 100,
                                height: 100,
                            }, children: (0, jsx_runtime_1.jsx)(RadarChart_1.RadarChart, __assign({}, config, { onMarkClick: onItemClick })) })).user;
                        marks = document.querySelectorAll('circle.MuiRadarSeriesPlot-mark');
                        return [4 /*yield*/, user.click(marks[0])];
                    case 1:
                        _d.sent();
                        expect((_a = onItemClick.mock.lastCall) === null || _a === void 0 ? void 0 : _a[1]).to.deep.equal({
                            type: 'radar',
                            seriesId: 's1',
                            dataIndex: 0,
                        });
                        return [4 /*yield*/, user.click(marks[1])];
                    case 2:
                        _d.sent();
                        expect((_b = onItemClick.mock.lastCall) === null || _b === void 0 ? void 0 : _b[1]).to.deep.equal({
                            type: 'radar',
                            seriesId: 's1',
                            dataIndex: 1,
                        });
                        return [4 /*yield*/, user.click(marks[4])];
                    case 3:
                        _d.sent();
                        expect((_c = onItemClick.mock.lastCall) === null || _c === void 0 ? void 0 : _c[1]).to.deep.equal({
                            type: 'radar',
                            seriesId: 's2',
                            dataIndex: 0,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('onAreaClick', function () {
        it('should add cursor="pointer" to mark elements', function () {
            render((0, jsx_runtime_1.jsx)(RadarChart_1.RadarChart, __assign({}, config, { onAreaClick: function () { } })));
            var marks = document.querySelectorAll('path.MuiRadarSeriesPlot-area');
            expect(Array.from(marks).map(function (rectangle) { return rectangle.getAttribute('cursor'); })).to.deep.equal([
                'pointer',
                'pointer',
            ]);
        });
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        it.skipIf(skipIf_1.isJSDOM)('should provide the right context as second argument', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onItemClick, user, marks;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        onItemClick = vitest_1.vi.fn();
                        user = render((0, jsx_runtime_1.jsx)("div", { style: {
                                width: 100,
                                height: 100,
                            }, children: (0, jsx_runtime_1.jsx)(RadarChart_1.RadarChart, __assign({}, config, { onAreaClick: onItemClick })) })).user;
                        marks = document.querySelectorAll('path.MuiRadarSeriesPlot-area');
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: marks[0],
                                    coords: { clientX: 50, clientY: 45 },
                                },
                            ])];
                    case 1:
                        _c.sent();
                        expect((_a = onItemClick.mock.lastCall) === null || _a === void 0 ? void 0 : _a[1]).to.deep.equal({
                            type: 'radar',
                            seriesId: 's1',
                            dataIndex: 0,
                        });
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: marks[1],
                                    coords: { clientX: 50, clientY: 55 },
                                },
                            ])];
                    case 2:
                        _c.sent();
                        expect((_b = onItemClick.mock.lastCall) === null || _b === void 0 ? void 0 : _b[1]).to.deep.equal({
                            type: 'radar',
                            seriesId: 's2',
                            dataIndex: 2,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
