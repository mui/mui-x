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
var React = require("react");
var LineChart_1 = require("@mui/x-charts/LineChart");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var skipIf_1 = require("test/utils/skipIf");
var web_components_1 = require("./web-components");
describe.skipIf(skipIf_1.isJSDOM)('Web Components', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var root;
    var onAxisClick = vi.fn();
    afterEach(function () {
        onAxisClick.mockClear();
    });
    function BasicLineChart() {
        return ((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, { xAxis: [{ data: [1, 2, 3, 5, 8, 10] }], series: [
                {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
            ], height: 300, onAxisClick: onAxisClick }));
    }
    var mount = function (container, ReactComponent, props) {
        var view = render((0, jsx_runtime_1.jsx)(ReactComponent, __assign({}, props)), { container: container });
        root = view;
        return {
            root: root,
            ReactComponent: ReactComponent,
        };
    };
    var unmount = function (ctx) {
        ctx.root.unmount();
    };
    customElements.define('web-component-shadow', (0, web_components_1.reactToWebComponent)(BasicLineChart, { shadow: 'open' }, { mount: mount, unmount: unmount }));
    customElements.define('web-component-regular', (0, web_components_1.reactToWebComponent)(BasicLineChart, {}, { mount: mount, unmount: unmount }));
    it('should render the web component in regular mode', function () { return __awaiter(void 0, void 0, void 0, function () {
        var regularElement, circle, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    regularElement = document.createElement('web-component-regular');
                    regularElement.setAttribute('data-testid', 'regular');
                    document.body.appendChild(regularElement);
                    onTestFinished(function () {
                        regularElement.remove();
                    });
                    internal_test_utils_1.screen.getByTestId('regular');
                    circle = regularElement === null || regularElement === void 0 ? void 0 : regularElement.querySelector('circle');
                    expect(circle).toBeTruthy();
                    user = root.user;
                    return [4 /*yield*/, user.click(circle)];
                case 1:
                    _a.sent();
                    expect(onAxisClick).toHaveBeenCalledWith(expect.anything(), {
                        axisValue: 1,
                        dataIndex: 0,
                        seriesValues: {
                            'auto-generated-id-0': 2,
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should render the web component in shadow mode', function () { return __awaiter(void 0, void 0, void 0, function () {
        var shadowElement, circle, user;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    shadowElement = document.createElement('web-component-shadow');
                    shadowElement.setAttribute('data-testid', 'shadow');
                    document.body.appendChild(shadowElement);
                    onTestFinished(function () {
                        shadowElement.remove();
                    });
                    internal_test_utils_1.screen.getByTestId('shadow');
                    expect(shadowElement.shadowRoot).toBeTruthy();
                    circle = (_a = shadowElement.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('circle');
                    expect(circle).toBeTruthy();
                    user = root.user;
                    return [4 /*yield*/, user.click(circle)];
                case 1:
                    _b.sent();
                    expect(onAxisClick).toHaveBeenCalledWith(expect.anything(), {
                        axisValue: 1,
                        dataIndex: 0,
                        seriesValues: {
                            'auto-generated-id-0': 2,
                        },
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
