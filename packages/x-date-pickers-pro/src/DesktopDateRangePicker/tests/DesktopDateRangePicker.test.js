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
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var styles_1 = require("@mui/material/styles");
var LocalizationProvider_1 = require("@mui/x-date-pickers/LocalizationProvider");
var DesktopDateRangePicker_1 = require("@mui/x-date-pickers-pro/DesktopDateRangePicker");
var MultiInputDateRangeField_1 = require("@mui/x-date-pickers-pro/MultiInputDateRangeField");
var pickers_1 = require("test/utils/pickers");
var skipIf_1 = require("test/utils/skipIf");
var vitest_1 = require("vitest");
var getPickerDay = function (name, picker) {
    if (picker === void 0) { picker = 'January 2018'; }
    return (0, internal_test_utils_1.within)(internal_test_utils_1.screen.getByRole('grid', { name: picker })).getByRole('gridcell', { name: name });
};
describe('<DesktopDateRangePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    it('should scroll current month to the active selection when focusing appropriate field (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker reduceAnimations defaultValue={[pickers_1.adapterToUse.date('2019-05-19'), pickers_1.adapterToUse.date('2019-10-30')]} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                    return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                            type: 'date-range',
                            initialFocus: 'start',
                            fieldType: 'multi-input',
                        })];
                case 1:
                    _a.sent();
                    expect(internal_test_utils_1.screen.getByText('May 2019')).toBeVisible();
                    return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                            type: 'date-range',
                            initialFocus: 'end',
                            fieldType: 'multi-input',
                        })];
                case 2:
                    _a.sent();
                    expect(internal_test_utils_1.screen.getByText('October 2019')).toBeVisible();
                    // scroll back
                    return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                            type: 'date-range',
                            initialFocus: 'start',
                            fieldType: 'multi-input',
                        })];
                case 3:
                    // scroll back
                    _a.sent();
                    expect(internal_test_utils_1.screen.getByText('May 2019')).toBeVisible();
                    return [2 /*return*/];
            }
        });
    }); });
    it("should not crash when opening picker with invalid date value", function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker defaultValue={[new Date(NaN), pickers_1.adapterToUse.date('2019-01-31')]}/>).user;
                    return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                            type: 'date-range',
                            initialFocus: 'start',
                            fieldType: 'single-input',
                        })];
                case 1:
                    _a.sent();
                    expect(internal_test_utils_1.screen.getByRole('dialog')).toBeVisible();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should respect localeText from the theme', function () {
        var theme = (0, styles_1.createTheme)({
            components: {
                MuiLocalizationProvider: {
                    defaultProps: {
                        localeText: { start: 'Início', end: 'Fim' },
                    },
                },
            },
        });
        render(<styles_1.ThemeProvider theme={theme}>
        <LocalizationProvider_1.LocalizationProvider dateAdapter={pickers_1.AdapterClassToUse}>
          <DesktopDateRangePicker_1.DesktopDateRangePicker 
        // We set the variant to standard to avoid having the label rendered in two places.
        slotProps={{
                textField: {
                    variant: 'standard',
                },
            }} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>
        </LocalizationProvider_1.LocalizationProvider>
      </styles_1.ThemeProvider>);
        expect(internal_test_utils_1.screen.queryByText('Início')).not.to.equal(null);
        expect(internal_test_utils_1.screen.queryByText('Fim')).not.to.equal(null);
    });
    it('should add focused class to the field when it is focused', function () { return __awaiter(void 0, void 0, void 0, function () {
        var unmount, sectionsContainer, input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    unmount = render(<DesktopDateRangePicker_1.DesktopDateRangePicker />).unmount;
                    sectionsContainer = (0, pickers_1.getFieldSectionsContainer)();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, sectionsContainer.focus()];
                        }); }); })];
                case 1:
                    _a.sent();
                    expect(sectionsContainer.parentElement).to.have.class('Mui-focused');
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, unmount()];
                        }); }); })];
                case 2:
                    _a.sent();
                    // Test with non-accessible DOM structure
                    render(<DesktopDateRangePicker_1.DesktopDateRangePicker enableAccessibleFieldDOMStructure={false}/>);
                    input = (0, pickers_1.getTextbox)();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, input.focus()];
                        }); }); })];
                case 3:
                    _a.sent();
                    expect(input.parentElement).to.have.class('Mui-focused');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should render the input with a given `name`', function () {
        // Test with accessible DOM structure
        var unmount = render(<DesktopDateRangePicker_1.DesktopDateRangePicker name="test"/>).unmount;
        expect(internal_test_utils_1.screen.getByRole('textbox', { hidden: true }).name).to.equal('test');
        unmount();
        // Test with non-accessible DOM structure
        render(<DesktopDateRangePicker_1.DesktopDateRangePicker enableAccessibleFieldDOMStructure={false} name="test"/>);
        expect(internal_test_utils_1.screen.getByRole('textbox').name).to.equal('test');
    });
    describe('Component slot: Popper', function () {
        it('should forward onClick and onTouchStart', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleClick, handleTouchStart, popper;
            return __generator(this, function (_a) {
                handleClick = (0, sinon_1.spy)();
                handleTouchStart = (0, sinon_1.spy)();
                render(<DesktopDateRangePicker_1.DesktopDateRangePicker open slotProps={{
                        popper: {
                            onClick: handleClick,
                            onTouchStart: handleTouchStart,
                            // @ts-expect-error `data-*` attributes are not recognized in props objects
                            'data-testid': 'popper',
                        },
                    }}/>);
                popper = internal_test_utils_1.screen.getByTestId('popper');
                internal_test_utils_1.fireEvent.click(popper);
                internal_test_utils_1.fireEvent.touchStart(popper);
                expect(handleClick.callCount).to.equal(1);
                expect(handleTouchStart.callCount).to.equal(1);
                return [2 /*return*/];
            });
        }); });
    });
    describe('picker state', function () {
        it('should open when clicking the start input (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onOpen, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onOpen = (0, sinon_1.spy)();
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onOpen={onOpen} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        _a.sent();
                        expect(onOpen.callCount).to.equal(1);
                        expect(internal_test_utils_1.screen.getByRole('tooltip')).toBeVisible();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should open when clicking the end input (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onOpen, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onOpen = (0, sinon_1.spy)();
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onOpen={onOpen} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'end',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        _a.sent();
                        expect(onOpen.callCount).to.equal(1);
                        expect(internal_test_utils_1.screen.getByRole('tooltip')).toBeVisible();
                        return [2 /*return*/];
                }
            });
        }); });
        ['Enter', 'Space'].forEach(function (key) {
            return it("should open when pressing \"".concat(key, "\" in the start input (multi input field)"), function () { return __awaiter(void 0, void 0, void 0, function () {
                var onOpen, user, startInput;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onOpen = (0, sinon_1.spy)();
                            user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onOpen={onOpen} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                            startInput = (0, pickers_1.getFieldSectionsContainer)();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, startInput.focus()];
                                }); }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.keyboard("[".concat(key, "]"))];
                        case 2:
                            _a.sent();
                            expect(onOpen.callCount).to.equal(1);
                            expect(internal_test_utils_1.screen.getByRole('tooltip')).toBeVisible();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        ['Enter', 'Space'].forEach(function (key) {
            return it("should open when pressing \"".concat(key, "\" in the end input (multi input field)"), function () { return __awaiter(void 0, void 0, void 0, function () {
                var onOpen, user, endInput;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onOpen = (0, sinon_1.spy)();
                            user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onOpen={onOpen} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                            endInput = (0, pickers_1.getFieldSectionsContainer)(1);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, endInput.focus()];
                                }); }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.keyboard("[".concat(key, "]"))];
                        case 2:
                            _a.sent();
                            expect(onOpen.callCount).to.equal(1);
                            expect(internal_test_utils_1.screen.getByRole('tooltip')).toBeVisible();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('should call onChange with updated start date then call onChange with updated end date, onClose and onAccept with update date range when opening from start input', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, defaultValue, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        defaultValue = [
                            pickers_1.adapterToUse.date('2018-01-01'),
                            pickers_1.adapterToUse.date('2018-01-06'),
                        ];
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={defaultValue} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                        // Open the picker
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        // Open the picker
                        _a.sent();
                        expect(onChange.callCount).to.equal(0);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        // Change the start date
                        return [4 /*yield*/, user.click(getPickerDay('3'))];
                    case 2:
                        // Change the start date
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
                        expect(onChange.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
                        // Change the end date
                        return [4 /*yield*/, user.click(getPickerDay('5'))];
                    case 3:
                        // Change the end date
                        _a.sent();
                        expect(onChange.callCount).to.equal(2);
                        expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
                        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 5));
                        expect(onAccept.callCount).to.equal(1);
                        expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
                        expect(onAccept.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 5));
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onChange with updated end date, onClose and onAccept with update date range when opening from end input (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, defaultValue, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        defaultValue = [
                            pickers_1.adapterToUse.date('2018-01-01'),
                            pickers_1.adapterToUse.date('2018-01-06'),
                        ];
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={defaultValue} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                        // Open the picker
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'end',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        // Open the picker
                        _a.sent();
                        expect(onChange.callCount).to.equal(0);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        // Change the end date
                        internal_test_utils_1.fireEvent.click(getPickerDay('3'));
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
                        expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
                        expect(onAccept.callCount).to.equal(1);
                        expect(onAccept.lastCall.args[0][0]).toEqualDateTime(defaultValue[0]);
                        expect(onAccept.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 3));
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not call onClose and onAccept when selecting the end date if props.closeOnSelect = false (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onAccept, onClose, defaultValue, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        defaultValue = [
                            pickers_1.adapterToUse.date('2018-01-01'),
                            pickers_1.adapterToUse.date('2018-01-06'),
                        ];
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onAccept={onAccept} onClose={onClose} defaultValue={defaultValue} closeOnSelect={false} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'end',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        _a.sent();
                        // Change the end date
                        return [4 /*yield*/, user.click(getPickerDay('3'))];
                    case 2:
                        // Change the end date
                        _a.sent();
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onClose and onAccept with the live value when pressing Escape', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, defaultValue, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        defaultValue = [
                            pickers_1.adapterToUse.date('2018-01-01'),
                            pickers_1.adapterToUse.date('2018-01-06'),
                        ];
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={defaultValue}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
                    case 1:
                        _a.sent();
                        // Change the start date (already tested)
                        return [4 /*yield*/, user.click(getPickerDay('3'))];
                    case 2:
                        // Change the start date (already tested)
                        _a.sent();
                        // Dismiss the picker
                        return [4 /*yield*/, user.keyboard('[Escape]')];
                    case 3:
                        // Dismiss the picker
                        _a.sent();
                        expect(onChange.callCount).to.equal(1); // Start date change
                        expect(onAccept.callCount).to.equal(1);
                        expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
                        expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onClose when clicking outside of the picker without prior change (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, user, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<div>
          <input id="test-id"/>
          <DesktopDateRangePicker_1.DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>
        </div>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        _a.sent();
                        input = document.getElementById('test-id');
                        return [4 /*yield*/, user.pointer({ keys: '[MouseLeft>]', target: input })];
                    case 2:
                        _a.sent();
                        expect(onChange.callCount).to.equal(0);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onClose and onAccept with the live value when clicking outside of the picker (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, defaultValue, user, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        defaultValue = [
                            pickers_1.adapterToUse.date('2018-01-01'),
                            pickers_1.adapterToUse.date('2018-01-06'),
                        ];
                        user = render(<div>
          <DesktopDateRangePicker_1.DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={defaultValue} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>
          <input id="test-id"/>
        </div>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        _a.sent();
                        // Change the start date (already tested)
                        return [4 /*yield*/, user.click(getPickerDay('3'))];
                    case 2:
                        // Change the start date (already tested)
                        _a.sent();
                        input = document.getElementById('test-id');
                        return [4 /*yield*/, user.click(input)];
                    case 3:
                        _a.sent();
                        // Start date change
                        expect(onChange.callCount).to.equal(1);
                        expect(onAccept.callCount).to.equal(1);
                        expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
                        expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not call onClose or onAccept when clicking outside of the picker if not opened (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                        // Dismiss the picker
                        return [4 /*yield*/, user.click(document.body)];
                    case 1:
                        // Dismiss the picker
                        _a.sent();
                        expect(onChange.callCount).to.equal(0);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        // test:unit does not call `blur` when focusing another element.
        it.skipIf(skipIf_1.isJSDOM)('should call onClose when blur the current field without prior change (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<React.Fragment>
            <DesktopDateRangePicker_1.DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>
            <button type="button" id="test">
              focus me
            </button>
          </React.Fragment>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('tooltip')).toBeVisible();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, document.querySelector('#test').focus()];
                            }); }); })];
                    case 2:
                        _a.sent();
                        expect(onChange.callCount).to.equal(0);
                        expect(onAccept.callCount).to.equal(0);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(onClose.callCount).to.equal(1);
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onClose and onAccept when blur the current field (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, defaultValue, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        defaultValue = [
                            pickers_1.adapterToUse.date('2018-01-01'),
                            pickers_1.adapterToUse.date('2018-01-06'),
                        ];
                        user = render(<div>
          <DesktopDateRangePicker_1.DesktopDateRangePicker defaultValue={defaultValue} onChange={onChange} onAccept={onAccept} onClose={onClose} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>
          <button id="test"/>
        </div>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('tooltip')).toBeVisible();
                        // Change the start date (already tested)
                        return [4 /*yield*/, user.click(getPickerDay('3'))];
                    case 2:
                        // Change the start date (already tested)
                        _a.sent();
                        expect(onAccept.callCount).to.equal(0);
                        return [4 /*yield*/, user.click(document.querySelector('#test'))];
                    case 3:
                        _a.sent();
                        // Start date change
                        expect(onChange.callCount).to.equal(1);
                        expect(onAccept.callCount).to.equal(1);
                        expect(onAccept.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
                        expect(onAccept.lastCall.args[0][1]).toEqualDateTime(defaultValue[1]);
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onClose, onChange with empty value and onAccept with empty value when pressing the "Clear" button', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, defaultValue, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        defaultValue = [
                            pickers_1.adapterToUse.date('2018-01-01'),
                            pickers_1.adapterToUse.date('2018-01-06'),
                        ];
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={defaultValue} slotProps={{ actionBar: { actions: ['clear'] } }}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
                    case 1:
                        _a.sent();
                        // Clear the date
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText(/clear/i))];
                    case 2:
                        // Clear the date
                        _a.sent();
                        expect(onChange.callCount).to.equal(1); // Start date change
                        expect(onChange.lastCall.args[0]).to.deep.equal([null, null]);
                        expect(onAccept.callCount).to.equal(1);
                        expect(onAccept.lastCall.args[0]).to.deep.equal([null, null]);
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not call onChange or onAccept when pressing "Clear" button with an already null value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} slotProps={{ actionBar: { actions: ['clear'] } }} value={[null, null]}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
                    case 1:
                        _a.sent();
                        // Clear the date
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText(/clear/i))];
                    case 2:
                        // Clear the date
                        _a.sent();
                        expect(onChange.callCount).to.equal(0);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        // TODO: Write test
        // it('should call onClose and onAccept with the live value when clicking outside of the picker', () => {
        // })
        it('should not close picker when switching focus from start to end input (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-06')]} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                        // Open the picker (already tested)
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        // Open the picker (already tested)
                        _a.sent();
                        // Switch to end date
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'end',
                                fieldType: 'multi-input',
                            })];
                    case 2:
                        // Switch to end date
                        _a.sent();
                        expect(onChange.callCount).to.equal(0);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not close picker when switching focus from end to start input (multi input field)', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-06')]} slots={{ field: MultiInputDateRangeField_1.MultiInputDateRangeField }}/>).user;
                        // Open the picker (already tested)
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'end',
                                fieldType: 'multi-input',
                            })];
                    case 1:
                        // Open the picker (already tested)
                        _a.sent();
                        // Switch to start date
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'multi-input',
                            })];
                    case 2:
                        // Switch to start date
                        _a.sent();
                        expect(onChange.callCount).to.equal(0);
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should work with separate start and end "reference" dates', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker referenceDate={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-06')]} defaultRangePosition="end"/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
                    case 1:
                        _a.sent();
                        expect(document.activeElement).to.equal(getPickerDay('6'));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('disabled dates', function () {
        beforeEach(function () {
            vitest_1.vi.setSystemTime(new Date(2018, 0, 10));
        });
        afterEach(function () {
            vitest_1.vi.useRealTimers();
        });
        it('should respect the disablePast prop', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker disablePast/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
                    case 1:
                        _a.sent();
                        expect(getPickerDay('8')).to.have.attribute('disabled');
                        expect(getPickerDay('9')).to.have.attribute('disabled');
                        expect(getPickerDay('10')).not.to.have.attribute('disabled');
                        expect(getPickerDay('11')).not.to.have.attribute('disabled');
                        expect(getPickerDay('12')).not.to.have.attribute('disabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should respect the disableFuture prop', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker disableFuture/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
                    case 1:
                        _a.sent();
                        expect(getPickerDay('8')).not.to.have.attribute('disabled');
                        expect(getPickerDay('9')).not.to.have.attribute('disabled');
                        expect(getPickerDay('10')).not.to.have.attribute('disabled');
                        expect(getPickerDay('11')).to.have.attribute('disabled');
                        expect(getPickerDay('12')).to.have.attribute('disabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should respect the minDate prop', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker minDate={pickers_1.adapterToUse.date('2018-01-15')}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
                    case 1:
                        _a.sent();
                        expect(getPickerDay('13')).to.have.attribute('disabled');
                        expect(getPickerDay('14')).to.have.attribute('disabled');
                        expect(getPickerDay('15')).not.to.have.attribute('disabled');
                        expect(getPickerDay('16')).not.to.have.attribute('disabled');
                        expect(getPickerDay('17')).not.to.have.attribute('disabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should respect the maxDate prop', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDateRangePicker_1.DesktopDateRangePicker maxDate={pickers_1.adapterToUse.date('2018-01-15')}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, {
                                type: 'date-range',
                                initialFocus: 'start',
                                fieldType: 'single-input',
                            })];
                    case 1:
                        _a.sent();
                        expect(getPickerDay('13')).not.to.have.attribute('disabled');
                        expect(getPickerDay('14')).not.to.have.attribute('disabled');
                        expect(getPickerDay('15')).not.to.have.attribute('disabled');
                        expect(getPickerDay('16')).to.have.attribute('disabled');
                        expect(getPickerDay('17')).to.have.attribute('disabled');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
