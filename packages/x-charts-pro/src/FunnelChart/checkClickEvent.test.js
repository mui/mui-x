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
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var FunnelChart_1 = require("@mui/x-charts-pro/FunnelChart");
var skipIf_1 = require("test/utils/skipIf");
var config = {
    series: [
        {
            id: 'big',
            data: [
                {
                    value: 200,
                    label: 'A',
                },
                {
                    value: 100,
                    label: 'B',
                },
            ],
        },
        {
            id: 'small',
            data: [
                {
                    value: 100,
                    label: 'C',
                },
                {
                    value: 50,
                    label: 'D',
                },
            ],
        },
    ],
    margin: { top: 0, left: 0, bottom: 0, right: 0 },
    width: 400,
    height: 400,
    hideLegend: true,
};
// Plot as follow to simplify click position
//
// A,C | A C C C A
// B,D |   B D B
describe('FunnelChart - click event', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    describe('onAxisClick', function () {
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        it.skipIf(skipIf_1.isJSDOM)('should provide the right context as second argument', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onAxisClick, user, svg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onAxisClick = (0, sinon_1.spy)();
                        user = render(<div style={{
                                width: 400,
                                height: 400,
                            }}>
          <FunnelChart_1.FunnelChart {...config} onAxisClick={onAxisClick}/>
        </div>).user;
                        svg = document.querySelector('svg');
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 90, clientY: 100 },
                                },
                            ])];
                    case 1:
                        _a.sent();
                        expect(onAxisClick.lastCall.args[1]).to.deep.equal({
                            dataIndex: 0,
                            axisValue: 0,
                            seriesValues: { big: 200, small: 100 },
                        });
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 120, clientY: 300 },
                                },
                            ])];
                    case 2:
                        _a.sent();
                        expect(onAxisClick.lastCall.args[1]).to.deep.equal({
                            dataIndex: 1,
                            axisValue: 1,
                            seriesValues: { big: 100, small: 50 },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        it.skipIf(skipIf_1.isJSDOM)('should provide the right context as second argument with layout="horizontal"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onAxisClick, user, svg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onAxisClick = (0, sinon_1.spy)();
                        user = render(<div style={{
                                width: 400,
                                height: 400,
                            }}>
            <FunnelChart_1.FunnelChart {...config} series={config.series.map(function (v) { return (__assign(__assign({}, v), { layout: 'horizontal' })); })} onAxisClick={onAxisClick}/>
          </div>).user;
                        svg = document.querySelector('svg');
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 50, clientY: 100 },
                                },
                            ])];
                    case 1:
                        _a.sent();
                        expect(onAxisClick.lastCall.args[1]).to.deep.equal({
                            dataIndex: 0,
                            axisValue: 0,
                            seriesValues: { big: 200, small: 100 },
                        });
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 300, clientY: 140 },
                                },
                            ])];
                    case 2:
                        _a.sent();
                        expect(onAxisClick.lastCall.args[1]).to.deep.equal({
                            dataIndex: 1,
                            axisValue: 1,
                            seriesValues: { big: 100, small: 50 },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        it.skipIf(skipIf_1.isJSDOM)('should provide the correct axis values when using category axis', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onAxisClick, user, svg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onAxisClick = (0, sinon_1.spy)();
                        user = render(<div style={{
                                width: 400,
                                height: 400,
                            }}>
            <FunnelChart_1.FunnelChart {...config} onAxisClick={onAxisClick} categoryAxis={{ categories: ['First', 'Second'] }}/>
          </div>).user;
                        svg = document.querySelector('svg');
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 90, clientY: 100 },
                                },
                            ])];
                    case 1:
                        _a.sent();
                        expect(onAxisClick.lastCall.args[1]).to.deep.equal({
                            dataIndex: 0,
                            axisValue: 'First',
                            seriesValues: { big: 200, small: 100 },
                        });
                        return [4 /*yield*/, user.pointer([
                                {
                                    keys: '[MouseLeft]',
                                    target: svg,
                                    coords: { clientX: 120, clientY: 300 },
                                },
                            ])];
                    case 2:
                        _a.sent();
                        expect(onAxisClick.lastCall.args[1]).to.deep.equal({
                            dataIndex: 1,
                            axisValue: 'Second',
                            seriesValues: { big: 100, small: 50 },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('onItemClick', function () {
        it('should add cursor="pointer" to bar elements', function () {
            render(<FunnelChart_1.FunnelChart {...config} onItemClick={function () { }}/>);
            var paths = document.querySelectorAll('path.MuiFunnelSection-root');
            expect(Array.from(paths).map(function (rectangle) { return rectangle.getAttribute('cursor'); })).to.deep.equal([
                'pointer',
                'pointer',
                'pointer',
                'pointer',
            ]);
        });
        // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
        it.skipIf(skipIf_1.isJSDOM)('should provide the right context as second argument', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onItemClick, user, pathsBig, pathsSmall;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onItemClick = (0, sinon_1.spy)();
                        user = render(<div style={{
                                width: 400,
                                height: 400,
                            }}>
          <FunnelChart_1.FunnelChart {...config} onItemClick={onItemClick}/>
        </div>).user;
                        pathsBig = document.querySelectorAll('path.MuiFunnelSection-series-big');
                        pathsSmall = document.querySelectorAll('path.MuiFunnelSection-series-small');
                        return [4 /*yield*/, user.click(pathsBig[0])];
                    case 1:
                        _a.sent();
                        expect(onItemClick.lastCall.args[1]).to.deep.equal({
                            type: 'funnel',
                            seriesId: 'big',
                            dataIndex: 0,
                        });
                        return [4 /*yield*/, user.click(pathsBig[1])];
                    case 2:
                        _a.sent();
                        expect(onItemClick.lastCall.args[1]).to.deep.equal({
                            type: 'funnel',
                            seriesId: 'big',
                            dataIndex: 1,
                        });
                        return [4 /*yield*/, user.click(pathsSmall[0])];
                    case 3:
                        _a.sent();
                        expect(onItemClick.lastCall.args[1]).to.deep.equal({
                            type: 'funnel',
                            seriesId: 'small',
                            dataIndex: 0,
                        });
                        return [4 /*yield*/, user.click(pathsSmall[1])];
                    case 4:
                        _a.sent();
                        expect(onItemClick.lastCall.args[1]).to.deep.equal({
                            type: 'funnel',
                            seriesId: 'small',
                            dataIndex: 1,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
