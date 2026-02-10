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
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var skipIf_1 = require("test/utils/skipIf");
var useSvgRef_1 = require("./useSvgRef");
var ChartProvider_1 = require("../context/ChartProvider");
function UseSvgRef() {
    var _a;
    var ref = (0, useSvgRef_1.useSvgRef)();
    return ((0, jsx_runtime_1.jsx)("svg", { ref: ref, id: "test-id", children: (_a = ref.current) === null || _a === void 0 ? void 0 : _a.id }));
}
describe('useSvgRef', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    // can't catch render errors in the browser for unknown reason
    // tried try-catch + error boundary + window onError preventDefault
    it.skipIf(!skipIf_1.isJSDOM)('should throw an error when parent context not present', function () {
        var errorRef = React.createRef();
        var expectedError = ['The above error occurred in the <UseSvgRef> component'];
        expect(function () {
            return render((0, jsx_runtime_1.jsx)(internal_test_utils_1.ErrorBoundary, { ref: errorRef, children: (0, jsx_runtime_1.jsx)(UseSvgRef, {}) }));
        }).toErrorDev(expectedError);
        expect(errorRef.current.errors).to.have.length(1);
        expect(errorRef.current.errors[0].toString()).to.include('MUI X Charts: Could not find the Chart context.');
    });
    it('should not throw an error when parent context is present', function () { return __awaiter(void 0, void 0, void 0, function () {
        function RenderDrawingProvider() {
            return ((0, jsx_runtime_1.jsx)(ChartProvider_1.ChartProvider, { pluginParams: { width: 200, height: 200 }, children: (0, jsx_runtime_1.jsx)(UseSvgRef, {}) }));
        }
        var forceUpdate, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    forceUpdate = render((0, jsx_runtime_1.jsx)(RenderDrawingProvider, {})).forceUpdate;
                    // Ref is not available on first render.
                    forceUpdate();
                    _a = expect;
                    return [4 /*yield*/, internal_test_utils_1.screen.findByText('test-id')];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBeVisible();
                    return [2 /*return*/];
            }
        });
    }); });
});
