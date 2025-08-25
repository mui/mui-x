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
var DesktopDatePicker_1 = require("@mui/x-date-pickers/DesktopDatePicker");
var pickers_1 = require("test/utils/pickers");
describe('<DesktopDatePicker /> - Field', function () {
    describe('Basic behaviors', function () {
        var render = (0, pickers_1.createPickerRenderer)({
            clockConfig: new Date('2018-01-01T10:05:05.000'),
        }).render;
        var renderWithProps = (0, pickers_1.buildFieldInteractions)({
            render: render,
            Component: DesktopDatePicker_1.DesktopDatePicker,
        }).renderWithProps;
        it('should be able to reset a single section', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            format: "".concat(pickers_1.adapterToUse.formats.month, " ").concat(pickers_1.adapterToUse.formats.dayOfMonth),
                        }, { componentFamily: 'picker' });
                        view.selectSection('month');
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM DD');
                        return [4 /*yield*/, view.user.keyboard('N')];
                    case 1:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'November DD');
                        return [4 /*yield*/, view.user.keyboard('4')];
                    case 2:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'November 04');
                        return [4 /*yield*/, view.user.keyboard('[Backspace]')];
                    case 3:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'November DD');
                        view.unmount();
                        // Test with non-accessible DOM structure
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: false,
                            format: "".concat(pickers_1.adapterToUse.formats.month, " ").concat(pickers_1.adapterToUse.formats.dayOfMonth),
                        }, { componentFamily: 'picker' });
                        input = (0, pickers_1.getTextbox)();
                        view.selectSection('month');
                        (0, pickers_1.expectFieldPlaceholderV6)(input, 'MMMM DD');
                        return [4 /*yield*/, view.user.keyboard('N')];
                    case 4:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'November DD');
                        return [4 /*yield*/, view.user.keyboard('4')];
                    case 5:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'November 04');
                        return [4 /*yield*/, view.user.keyboard('[Backspace]')];
                    case 6:
                        _a.sent();
                        (0, pickers_1.expectFieldValueV6)(input, 'November DD');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should adapt the default field format based on the props of the picker', function () {
            var testFormat = function (props, expectedFormat) {
                // Test with accessible DOM structure
                var view = renderWithProps(__assign(__assign({}, props), { enableAccessibleFieldDOMStructure: true }), { componentFamily: 'picker' });
                (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), expectedFormat);
                view.unmount();
                // Test with non-accessible DOM structure
                view = renderWithProps(__assign(__assign({}, props), { enableAccessibleFieldDOMStructure: false }), { componentFamily: 'picker' });
                var input = (0, pickers_1.getTextbox)();
                (0, pickers_1.expectFieldPlaceholderV6)(input, expectedFormat);
                view.unmount();
            };
            testFormat({ views: ['year'] }, 'YYYY');
            testFormat({ views: ['month'] }, 'MMMM');
            testFormat({ views: ['day'] }, 'DD');
            testFormat({ views: ['month', 'day'] }, 'MMMM DD');
            testFormat({ views: ['year', 'month'] }, 'MMMM YYYY');
            testFormat({ views: ['year', 'month', 'day'] }, 'MM/DD/YYYY');
            testFormat({ views: ['year', 'day'] }, 'MM/DD/YYYY');
        });
    });
    describe('slots: field', function () {
        var render = (0, pickers_1.createPickerRenderer)({
            clockConfig: new Date('2018-01-01T10:05:05.000'),
        }).render;
        var renderWithProps = (0, pickers_1.buildFieldInteractions)({
            render: render,
            Component: DesktopDatePicker_1.DesktopDatePicker,
        }).renderWithProps;
        it('should allow to override the placeholder (v6 only)', function () {
            renderWithProps({
                enableAccessibleFieldDOMStructure: false,
                slotProps: {
                    field: {
                        // @ts-ignore
                        placeholder: 'Custom placeholder',
                    },
                },
            });
            var input = (0, pickers_1.getTextbox)();
            (0, pickers_1.expectFieldPlaceholderV6)(input, 'Custom placeholder');
        });
    });
    describe('slots: textField', function () {
        var render = (0, pickers_1.createPickerRenderer)({
            clockConfig: new Date('2018-01-01T10:05:05.000'),
        }).render;
        var renderWithProps = (0, pickers_1.buildFieldInteractions)({
            render: render,
            Component: DesktopDatePicker_1.DesktopDatePicker,
        }).renderWithProps;
        describe('placeholder override (v6 only)', function () {
            it('should allow to override the placeholder', function () {
                renderWithProps({
                    enableAccessibleFieldDOMStructure: false,
                    slotProps: {
                        textField: {
                            placeholder: 'Custom placeholder',
                        },
                    },
                });
                var input = (0, pickers_1.getTextbox)();
                (0, pickers_1.expectFieldPlaceholderV6)(input, 'Custom placeholder');
            });
            it('should render blank placeholder when prop is an empty string', function () {
                renderWithProps({
                    enableAccessibleFieldDOMStructure: false,
                    slotProps: {
                        textField: {
                            placeholder: '',
                        },
                    },
                });
                var input = (0, pickers_1.getTextbox)();
                (0, pickers_1.expectFieldPlaceholderV6)(input, '');
            });
        });
    });
    (0, pickers_1.describeAdapters)('Timezone', DesktopDatePicker_1.DesktopDatePicker, function (_a) {
        var adapter = _a.adapter, renderWithProps = _a.renderWithProps;
        it('should clear the selected section when all sections are completed when using timezones', function () {
            var view = renderWithProps({
                enableAccessibleFieldDOMStructure: true,
                defaultValue: adapter.date(),
                format: "".concat(adapter.formats.month, " ").concat(adapter.formats.year),
                timezone: 'America/Chicago',
            }, { componentFamily: 'picker' });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'June 2022');
            view.selectSection('month');
            view.pressKey(0, '');
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MMMM 2022');
        });
    });
});
