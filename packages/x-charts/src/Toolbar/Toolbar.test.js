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
var LineChart_1 = require("@mui/x-charts/LineChart");
var Toolbar_1 = require("@mui/x-charts/Toolbar");
function CustomToolbar(_a) {
    var _b = _a.items, items = _b === void 0 ? ['Item 1', 'Item 2', 'Item 3'] : _b;
    return ((0, jsx_runtime_1.jsx)(Toolbar_1.Toolbar, { children: items.map(function (item) { return ((0, jsx_runtime_1.jsx)(Toolbar_1.ToolbarButton, { children: item }, item)); }) }));
}
describe('Charts Toolbar', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        height: 300,
        xAxis: [{ data: [1, 2] }],
        series: [{ data: [2, 4] }],
    };
    describe('Accessibility', function () {
        it('should move focus to the next item when pressing ArrowRight', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, baselineProps, { slots: { toolbar: CustomToolbar }, showToolbar: true }))).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 3:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move focus to the previous item when pressing ArrowLeft', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, baselineProps, { slots: { toolbar: CustomToolbar }, showToolbar: true }))).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 3:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should focus on the first item when pressing Home key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, baselineProps, { slots: { toolbar: CustomToolbar }, showToolbar: true }))).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Home}')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should focus on the last item when pressing End key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, baselineProps, { slots: { toolbar: CustomToolbar }, showToolbar: true }))).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{End}')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should wrap to first item when pressing ArrowRight on last item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, baselineProps, { slots: { toolbar: CustomToolbar }, showToolbar: true }))).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should wrap to last item when pressing ArrowLeft on first item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, baselineProps, { slots: { toolbar: CustomToolbar }, showToolbar: true }))).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should maintain focus position when an item is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProps = render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, baselineProps, { slots: { toolbar: CustomToolbar }, showToolbar: true }))).setProps;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 2' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, setProps({
                                            slotProps: {
                                                toolbar: { items: ['Item 1', 'Item 3'] },
                                            },
                                        })];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should maintain focus on the last item when the last item is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProps = render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, baselineProps, { slots: { toolbar: CustomToolbar }, showToolbar: true }))).setProps;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, setProps({
                                            slotProps: {
                                                toolbar: { items: ['Item 1', 'Item 2'] },
                                            },
                                        })];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should preserve arrow key navigation after item removal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, user, setProps;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render((0, jsx_runtime_1.jsx)(LineChart_1.LineChart, __assign({}, baselineProps, { slots: { toolbar: CustomToolbar }, showToolbar: true }))), user = _a.user, setProps = _a.setProps;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' }).focus()];
                            }); }); })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, setProps({
                                            slotProps: {
                                                toolbar: { items: ['Item 1', 'Item 3'] },
                                            },
                                        })];
                                });
                            }); })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 3:
                        _b.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 4:
                        _b.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
