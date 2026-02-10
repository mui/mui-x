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
var React = require("react");
var skipIf_1 = require("test/utils/skipIf");
var ChartDataProvider_1 = require("../ChartDataProvider");
var MarkElement_1 = require("./MarkElement");
var CircleMarkElement_1 = require("./CircleMarkElement");
function TestWrapper(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)(ChartDataProvider_1.ChartDataProvider, { series: [{ type: 'line', data: [1, 2, 3], id: 's1' }], width: 100, height: 100, xAxis: [{ scaleType: 'point', data: ['A', 'B', 'C'] }], children: (0, jsx_runtime_1.jsx)("svg", { children: children }) }));
}
describe.for([
    ['MarkElement', MarkElement_1.MarkElement],
    ['CircleMarkElement', CircleMarkElement_1.CircleMarkElement],
])('%s click behavior', function (_a) {
    var _ = _a[0], MarkElementComponent = _a[1];
    var render = (0, internal_test_utils_1.createRenderer)().render;
    it.skipIf(skipIf_1.isJSDOM)('should not be clickable when hidden', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onClick, user, mark;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onClick = vitest_1.vi.fn();
                    user = render((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(MarkElementComponent, { seriesId: "s1", dataIndex: 0, x: 10, y: 10, color: "red", shape: "circle", hidden: true, onClick: onClick, "data-testid": "mark" }) })).user;
                    mark = internal_test_utils_1.screen.getByTestId('mark');
                    expect(mark.getAttribute('pointer-events')).to.equal('none');
                    expect(mark.getAttribute('opacity')).to.equal('0');
                    // It throws because `click` event cannot be fired on an element with `pointer-events: none`
                    return [4 /*yield*/, expect(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, user.click(mark)];
                        }); }); }).rejects.toThrow()];
                case 1:
                    // It throws because `click` event cannot be fired on an element with `pointer-events: none`
                    _a.sent();
                    expect(onClick).not.toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it.skipIf(skipIf_1.isJSDOM)('should be clickable when visible', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onClick, user, mark;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onClick = vitest_1.vi.fn();
                    user = render((0, jsx_runtime_1.jsx)(TestWrapper, { children: (0, jsx_runtime_1.jsx)(CircleMarkElement_1.CircleMarkElement, { seriesId: "s1", dataIndex: 0, x: 10, y: 10, color: "red", onClick: onClick, "data-testid": "mark" }) })).user;
                    mark = internal_test_utils_1.screen.getByTestId('mark');
                    expect(mark.getAttribute('pointer-events')).to.not.equal('none');
                    expect(mark.getAttribute('opacity')).to.equal('1');
                    return [4 /*yield*/, user.click(mark)];
                case 1:
                    _a.sent();
                    expect(onClick).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
