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
/* eslint-disable no-promise-executor-return */
var internal_test_utils_1 = require("@mui/internal-test-utils");
var vitest_1 = require("vitest");
var skipIf_1 = require("test/utils/skipIf");
var BarChart_1 = require("@mui/x-charts/BarChart");
var ChartsBrushOverlay_classes_1 = require("./ChartsBrushOverlay.classes");
var ChartsBrushOverlay_1 = require("./ChartsBrushOverlay");
var barChartProps = {
    series: [
        {
            data: [10, 20, 30, 40],
        },
    ],
    xAxis: [
        {
            data: ['A', 'B', 'C', 'D'],
            zoom: true,
            position: 'none',
        },
    ],
    yAxis: [{ position: 'none' }],
    width: 100,
    height: 130,
    margin: 0,
    slotProps: { tooltip: { trigger: 'none' } },
    brushConfig: {
        enabled: true,
    },
};
(0, vitest_1.describe)('<ChartsBrushOverlay />', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    (0, vitest_1.it)('should not render overlay when brush is not active', function () { return __awaiter(void 0, void 0, void 0, function () {
        var container, overlay;
        return __generator(this, function (_a) {
            container = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, __assign({}, barChartProps, { children: (0, jsx_runtime_1.jsx)(ChartsBrushOverlay_1.ChartsBrushOverlay, {}) }))).container;
            overlay = container.querySelector(".".concat(ChartsBrushOverlay_classes_1.brushOverlayClasses.root));
            (0, vitest_1.expect)(overlay).to.equal(null);
            return [2 /*return*/];
        });
    }); });
    vitest_1.it.skipIf(skipIf_1.isJSDOM)('should render brush successfully when interacting with brush enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, container, user, svg, overlay;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, __assign({}, barChartProps, { children: (0, jsx_runtime_1.jsx)(ChartsBrushOverlay_1.ChartsBrushOverlay, {}) }))), container = _a.container, user = _a.user;
                    svg = container.querySelector('svg');
                    return [4 /*yield*/, user.pointer([
                            {
                                keys: "[MouseLeft>]",
                                target: svg,
                                coords: { clientX: 30, clientY: 30 },
                            },
                            {
                                target: svg,
                                coords: { clientX: 50, clientY: 30 },
                            },
                        ])];
                case 1:
                    _b.sent();
                    // Wait the animation frame
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, new Promise(function (r) { return requestAnimationFrame(r); })];
                        }); }); })];
                case 2:
                    // Wait the animation frame
                    _b.sent();
                    overlay = container.querySelector(".".concat(ChartsBrushOverlay_classes_1.brushOverlayClasses.root));
                    (0, vitest_1.expect)(overlay).not.to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
});
