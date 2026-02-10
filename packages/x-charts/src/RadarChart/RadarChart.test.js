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
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var describeConformance_1 = require("test/utils/describeConformance");
var RadarChart_1 = require("@mui/x-charts/RadarChart");
var vitest_1 = require("vitest");
var skipIf_1 = require("test/utils/skipIf");
var constants_1 = require("../tests/constants");
var radarConfig = {
    height: 100,
    width: 100,
    margin: 0,
    series: [{ data: [10, 15, 20, 25] }],
    radar: { metrics: ['A', 'B', 'C', 'D'] },
};
describe('<RadarChart />', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    (0, describeConformance_1.describeConformance)((0, jsx_runtime_1.jsx)(RadarChart_1.Unstable_RadarChart, __assign({}, radarConfig)), function () { return ({
        classes: {},
        inheritComponent: 'svg',
        render: render,
        muiName: 'MuiRadarChart',
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
        render((0, jsx_runtime_1.jsx)(RadarChart_1.Unstable_RadarChart, { height: 100, width: 100, series: [], radar: { metrics: [] } }));
        var noDataOverlay = createRenderer_1.screen.getByText('No data to display');
        expect(noDataOverlay).toBeVisible();
    });
    // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
    it.skipIf(skipIf_1.isJSDOM)('should call onHighlightChange', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onHighlightChange, user, path;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onHighlightChange = vitest_1.vi.fn();
                    user = render((0, jsx_runtime_1.jsx)(RadarChart_1.Unstable_RadarChart, __assign({}, radarConfig, { onHighlightChange: onHighlightChange }))).user;
                    path = document.querySelector('svg .MuiRadarSeriesPlot-area');
                    return [4 /*yield*/, user.pointer({ target: path })];
                case 1:
                    _a.sent();
                    expect(onHighlightChange.mock.calls.length).to.equal(1);
                    return [2 /*return*/];
            }
        });
    }); });
    it.skipIf(skipIf_1.isJSDOM)('should highlight axis on hover', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, svg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render((0, jsx_runtime_1.jsx)("div", { style: {
                            margin: -8, // Removes the body default margins
                            width: 100,
                            height: 100,
                        }, children: (0, jsx_runtime_1.jsx)(RadarChart_1.Unstable_RadarChart, __assign({}, radarConfig)) })).user;
                    svg = document.querySelector(constants_1.CHART_SELECTOR);
                    return [4 /*yield*/, user.pointer([{ target: svg, coords: { clientX: 45, clientY: 45 } }])];
                case 1:
                    _a.sent();
                    expect(document.querySelector('svg .MuiRadarAxisHighlight-root')).toBeVisible();
                    return [2 /*return*/];
            }
        });
    }); });
});
