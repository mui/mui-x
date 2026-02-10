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
var sinon_1 = require("sinon");
var skipIf_1 = require("test/utils/skipIf");
var createRenderer_1 = require("@mui/internal-test-utils/createRenderer");
var BarChart_1 = require("@mui/x-charts/BarChart");
var constants_1 = require("../../../../tests/constants");
describe('highlight', function () {
    var render = (0, createRenderer_1.createRenderer)().render;
    it('should have no highlight by default', function () {
        render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 100, width: 100, skipAnimation: true, series: [{ id: 'A', data: [50, 100] }] }));
        expect(document.querySelector(".".concat(BarChart_1.barElementClasses.highlighted))).to.equal(null);
    });
    it('should set highlight when keyboard move focus', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, svg, firstBar, secondBar;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 100, width: 100, skipAnimation: true, margin: 0, series: [{ id: 'A', data: [50, 100], highlightScope: { highlight: 'item' } }], enableKeyboardNavigation: true })).user;
                    svg = document.querySelector(constants_1.CHART_SELECTOR);
                    firstBar = document.querySelector("[data-series=\"A\"] .".concat(BarChart_1.barElementClasses.root, ":nth-child(1)"));
                    secondBar = document.querySelector("[data-series=\"A\"] .".concat(BarChart_1.barElementClasses.root, ":nth-child(2)"));
                    expect(firstBar.getAttribute('data-highlighted')).to.equal(null);
                    svg.focus();
                    return [4 /*yield*/, user.keyboard('[ArrowRight]')];
                case 1:
                    _a.sent();
                    expect(firstBar.getAttribute('data-highlighted')).to.equal('true');
                    expect(secondBar.getAttribute('data-highlighted')).to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should keep highlight on the controlled focused even if arrow navigation is used', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, svg, firstBar, secondBar;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 100, width: 100, skipAnimation: true, margin: 0, series: [{ id: 'A', data: [50, 100], highlightScope: { highlight: 'item' } }], enableKeyboardNavigation: true, highlightedItem: { seriesId: 'A', dataIndex: 1 } })).user;
                    svg = document.querySelector(constants_1.CHART_SELECTOR);
                    firstBar = document.querySelector("[data-series=\"A\"] .".concat(BarChart_1.barElementClasses.root, ":nth-child(1)"));
                    secondBar = document.querySelector("[data-series=\"A\"] .".concat(BarChart_1.barElementClasses.root, ":nth-child(2)"));
                    expect(firstBar.getAttribute('data-highlighted')).to.equal(null);
                    expect(secondBar.getAttribute('data-highlighted')).to.equal('true');
                    svg.focus();
                    return [4 /*yield*/, user.keyboard('[ArrowRight]')];
                case 1:
                    _a.sent();
                    expect(firstBar.getAttribute('data-highlighted')).to.equal(null);
                    expect(secondBar.getAttribute('data-highlighted')).to.equal('true');
                    return [2 /*return*/];
            }
        });
    }); });
    // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
    it.skipIf(skipIf_1.isJSDOM)('should call onHighlightChange when leaving the highlightedItem', function () { return __awaiter(void 0, void 0, void 0, function () {
        var handleHighlight, user, bars;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleHighlight = (0, sinon_1.spy)();
                    user = render((0, jsx_runtime_1.jsx)(BarChart_1.BarChart, { height: 400, width: 400, series: [
                            { id: 'id-a', data: [5, 10], highlightScope: { highlight: 'item', fade: 'global' } },
                            { id: 'id-b', data: [1, 2] },
                        ], xAxis: [{ data: ['A', 'B'] }], hideLegend: true, skipAnimation: true, highlightedItem: { seriesId: 'id-a', dataIndex: 0 }, onHighlightChange: handleHighlight })).user;
                    bars = document.querySelectorAll(".".concat(BarChart_1.barElementClasses.root));
                    return [4 /*yield*/, user.pointer({ target: bars[0] })];
                case 1:
                    _a.sent();
                    expect(handleHighlight.callCount).to.equal(0);
                    // Moving pointer on another rect triggers the exit (null) and the entrance (new identifier)
                    return [4 /*yield*/, user.pointer({ target: bars[3] })];
                case 2:
                    // Moving pointer on another rect triggers the exit (null) and the entrance (new identifier)
                    _a.sent();
                    expect(handleHighlight.callCount).to.equal(2);
                    expect(handleHighlight.firstCall.args[0]).to.deep.equal(null);
                    expect(handleHighlight.lastCall.args[0]).to.deep.equal({ seriesId: 'id-b', dataIndex: 1 });
                    // Moving pointer back only triggers the exist since the controlled value was not modified
                    return [4 /*yield*/, user.pointer({ target: bars[0] })];
                case 3:
                    // Moving pointer back only triggers the exist since the controlled value was not modified
                    _a.sent();
                    expect(handleHighlight.lastCall.args[0]).to.deep.equal(null);
                    expect(handleHighlight.callCount).to.equal(3);
                    return [2 /*return*/];
            }
        });
    }); });
});
