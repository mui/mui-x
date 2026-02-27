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
var ScatterChart_1 = require("@mui/x-charts/ScatterChart");
var skipIf_1 = require("test/utils/skipIf");
var constants_1 = require("../tests/constants");
var config = {
    dataset: [
        { id: 1, x: 0, y: 10 },
        { id: 2, x: 10, y: 10 },
        { id: 3, x: 10, y: 0 },
        { id: 4, x: 0, y: 0 },
        { id: 5, x: 5, y: 5 },
    ],
    margin: { top: 0, left: 0, bottom: 0, right: 0 },
    xAxis: [{ position: 'none' }],
    yAxis: [{ position: 'none' }],
    width: 100,
    height: 100,
};
// Plot on series as a dice 5
//
// 1...2
// .....
// ..5..
// .....
// 4...3
describe('ScatterChart - click event', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
    describe.skipIf(skipIf_1.isJSDOM)('onItemClick - using voronoi', function () {
        it('should provide the right context as second argument when clicking svg', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onItemClick, user, svg;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        onItemClick = vitest_1.vi.fn();
                        user = render((0, jsx_runtime_1.jsx)("div", { style: {
                                width: 100,
                                height: 100,
                            }, children: (0, jsx_runtime_1.jsx)(ScatterChart_1.ScatterChart, __assign({}, config, { series: [{ id: 's1', data: config.dataset }], onItemClick: onItemClick })) })).user;
                        svg = document.querySelector(constants_1.CHART_SELECTOR);
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 10, clientY: 10 },
                                },
                            ])];
                    case 1:
                        _c.sent();
                        expect((_a = onItemClick.mock.lastCall) === null || _a === void 0 ? void 0 : _a[1]).to.deep.equal({
                            type: 'scatter',
                            dataIndex: 0,
                            seriesId: 's1',
                        });
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 30, clientY: 30 },
                                },
                            ])];
                    case 2:
                        _c.sent();
                        expect((_b = onItemClick.mock.lastCall) === null || _b === void 0 ? void 0 : _b[1]).to.deep.equal({
                            type: 'scatter',
                            dataIndex: 4,
                            seriesId: 's1',
                        });
                        expect(onItemClick.mock.calls.length).to.equal(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should provide the right context as second argument when clicking mark', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onItemClick, user, marks;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        onItemClick = vitest_1.vi.fn();
                        user = render((0, jsx_runtime_1.jsx)("div", { style: {
                                width: 100,
                                height: 100,
                            }, children: (0, jsx_runtime_1.jsx)(ScatterChart_1.ScatterChart, __assign({}, config, { series: [{ id: 's1', data: config.dataset }], onItemClick: onItemClick })) })).user;
                        marks = document.querySelectorAll('circle');
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: marks[1],
                                    coords: {
                                        clientX: 99,
                                        clientY: 2,
                                    },
                                },
                            ])];
                    case 1:
                        _b.sent();
                        expect((_a = onItemClick.mock.lastCall) === null || _a === void 0 ? void 0 : _a[1]).to.deep.equal({
                            type: 'scatter',
                            dataIndex: 1,
                            seriesId: 's1',
                        });
                        expect(onItemClick.mock.calls.length).to.equal(1); // Make sure voronoi + item click does not duplicate event triggering
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('onItemClick - disabling voronoi', function () {
        it('should not call onItemClick when clicking the SVG', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onItemClick, user, svg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onItemClick = vitest_1.vi.fn();
                        user = render((0, jsx_runtime_1.jsx)("div", { style: {
                                width: 100,
                                height: 100,
                            }, children: (0, jsx_runtime_1.jsx)(ScatterChart_1.ScatterChart, __assign({}, config, { series: [{ id: 's1', data: config.dataset }], onItemClick: onItemClick, disableVoronoi: true })) })).user;
                        svg = document.querySelector(constants_1.CHART_SELECTOR);
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 10, clientY: 10 },
                                },
                            ])];
                    case 1:
                        _a.sent();
                        expect(onItemClick.mock.calls.length).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should provide the right context as second argument when clicking mark', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onItemClick, user, marks;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        onItemClick = vitest_1.vi.fn();
                        user = render((0, jsx_runtime_1.jsx)("div", { style: {
                                width: 100,
                                height: 100,
                            }, children: (0, jsx_runtime_1.jsx)(ScatterChart_1.ScatterChart, __assign({}, config, { series: [{ id: 's1', data: config.dataset }], onItemClick: onItemClick, disableVoronoi: true })) })).user;
                        marks = document.querySelectorAll('circle');
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: marks[1],
                                    coords: {
                                        clientX: 99,
                                        clientY: 2,
                                    },
                                },
                            ])];
                    case 1:
                        _b.sent();
                        expect((_a = onItemClick.mock.lastCall) === null || _a === void 0 ? void 0 : _a[1]).to.deep.equal({
                            type: 'scatter',
                            dataIndex: 1,
                            seriesId: 's1',
                        });
                        expect(onItemClick.mock.calls.length).to.equal(1); // Make sure voronoi + item click does not duplicate event triggering
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
