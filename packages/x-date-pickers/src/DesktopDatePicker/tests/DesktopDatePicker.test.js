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
var InputBase_1 = require("@mui/material/InputBase");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var DesktopDatePicker_1 = require("@mui/x-date-pickers/DesktopDatePicker");
var pickers_1 = require("test/utils/pickers");
var skipIf_1 = require("test/utils/skipIf");
var PickersActionBar_1 = require("@mui/x-date-pickers/PickersActionBar");
describe('<DesktopDatePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    describe('Views', function () {
        it('should switch between views uncontrolled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleViewChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handleViewChange = (0, sinon_1.spy)();
                        user = render(<DesktopDatePicker_1.DesktopDatePicker open slotProps={{ toolbar: { hidden: false } }} defaultValue={pickers_1.adapterToUse.date('2018-01-01')} onViewChange={handleViewChange}/>).user;
                        // Parent element is used to avoid the ripple effect triggering act warnings.
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText(/switch to year view/i).parentElement)];
                    case 1:
                        // Parent element is used to avoid the ripple effect triggering act warnings.
                        _a.sent();
                        expect(handleViewChange.callCount).to.equal(1);
                        expect(internal_test_utils_1.screen.queryByLabelText(/switch to year view/i)).to.equal(null);
                        expect(internal_test_utils_1.screen.getByLabelText('year view is open, switch to calendar view')).toBeVisible();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go to the first view when re-opening the picker', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleViewChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handleViewChange = (0, sinon_1.spy)();
                        user = render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-01-01')} onViewChange={handleViewChange} slotProps={{ toolbar: { hidden: false } }}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText(/switch to year view/i))];
                    case 2:
                        _a.sent();
                        expect(handleViewChange.callCount).to.equal(1);
                        // Dismiss the picker
                        return [4 /*yield*/, user.keyboard('[Escape]')];
                    case 3:
                        // Dismiss the picker
                        _a.sent();
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 4:
                        _a.sent();
                        expect(handleViewChange.callCount).to.equal(2);
                        expect(handleViewChange.lastCall.firstArg).to.equal('day');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go to the `openTo` view when re-opening the picker', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleViewChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handleViewChange = (0, sinon_1.spy)();
                        user = render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-01-01')} onViewChange={handleViewChange} openTo="month" views={['year', 'month', 'day']} slotProps={{ toolbar: { hidden: false } }}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText(/switch to year view/i))];
                    case 2:
                        _a.sent();
                        expect(handleViewChange.callCount).to.equal(1);
                        // Dismiss the picker
                        return [4 /*yield*/, user.keyboard('[Escape]')];
                    case 3:
                        // Dismiss the picker
                        _a.sent();
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 4:
                        _a.sent();
                        expect(handleViewChange.callCount).to.equal(2);
                        expect(handleViewChange.lastCall.firstArg).to.equal('month');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go to the relevant `view` when `views` prop changes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, setProps, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-01-01')} views={['year']}/>), setProps = _a.setProps, user = _a.user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 1:
                        _b.sent();
                        expect(internal_test_utils_1.screen.getByRole('radio', { checked: true, name: '2018' })).not.to.equal(null);
                        // Dismiss the picker
                        return [4 /*yield*/, user.keyboard('[Escape]')];
                    case 2:
                        // Dismiss the picker
                        _b.sent();
                        setProps({ views: ['month', 'year'] });
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 3:
                        _b.sent();
                        // should have changed the open view
                        expect(internal_test_utils_1.screen.getByRole('radio', { checked: true, name: 'January' })).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it.skipIf(skipIf_1.isJSDOM)('should move the focus to the newly opened views', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={new Date(2019, 5, 5)} openTo="year"/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 1:
                        _a.sent();
                        expect(document.activeElement).to.have.text('2019');
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText('2020'))];
                    case 2:
                        _a.sent();
                        expect(document.activeElement).to.have.text('5');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go to the relevant `view` when `view` prop changes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, setProps, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-01-01')} views={['year', 'month', 'day']} view="month"/>), setProps = _a.setProps, user = _a.user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 1:
                        _b.sent();
                        expect(internal_test_utils_1.screen.getByRole('radio', { checked: true, name: 'January' })).not.to.equal(null);
                        // Dismiss the picker
                        return [4 /*yield*/, user.keyboard('[Escape]')];
                    case 2:
                        // Dismiss the picker
                        _b.sent();
                        setProps({ view: 'year' });
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 3:
                        _b.sent();
                        // should have changed the open view
                        expect(internal_test_utils_1.screen.getByRole('radio', { checked: true, name: '2018' })).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // JSDOM has neither layout nor window.scrollTo
    describe.skipIf(skipIf_1.isJSDOM)('scroll', function () {
        var NoTransition = React.forwardRef(function NoTransition(props, ref) {
            var children = props.children, inProp = props.in;
            if (!inProp) {
                return null;
            }
            return (<div ref={ref} tabIndex={-1}>
          {children}
        </div>);
        });
        var originalScrollX;
        var originalScrollY;
        beforeEach(function () {
            originalScrollX = window.screenX;
            originalScrollY = window.scrollY;
        });
        afterEach(function () {
            var _a;
            if (!skipIf_1.isJSDOM) {
                (_a = window.scrollTo) === null || _a === void 0 ? void 0 : _a.call(window, originalScrollX, originalScrollY);
            }
        });
        it('does not scroll when opened', function () {
            var handleClose = (0, sinon_1.spy)();
            var handleOpen = (0, sinon_1.spy)();
            function BottomAnchoredDesktopTimePicker() {
                var _a = React.useState(null), anchorEl = _a[0], anchorElRef = _a[1];
                React.useEffect(function () {
                    if (anchorEl !== null) {
                        window.scrollTo(0, anchorEl.getBoundingClientRect().top);
                    }
                }, [anchorEl]);
                return (<React.Fragment>
            <div style={{ height: '200vh' }}>Spacer</div>
            <DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-01-01')} onClose={handleClose} onOpen={handleOpen} slots={{
                        desktopTransition: NoTransition,
                    }} slotProps={{
                        openPickerButton: {
                            ref: anchorElRef,
                        },
                    }}/>
          </React.Fragment>);
            }
            render(<BottomAnchoredDesktopTimePicker />);
            var scrollYBeforeOpen = window.scrollY;
            // Can't use `userEvent.click` as it scrolls the window before it clicks on browsers.
            (0, internal_test_utils_1.act)(function () {
                internal_test_utils_1.screen.getByLabelText(/choose date/i).click();
            });
            expect(handleClose.callCount).to.equal(0);
            expect(handleOpen.callCount).to.equal(1);
            expect(window.scrollY, 'focus caused scroll').to.equal(scrollYBeforeOpen);
        });
    });
    describe('picker state', function () {
        it('should open when clicking "Choose date"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onOpen, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onOpen = (0, sinon_1.spy)();
                        user = render(<DesktopDatePicker_1.DesktopDatePicker onOpen={onOpen}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText(/Choose date/))];
                    case 1:
                        _a.sent();
                        expect(onOpen.callCount).to.equal(1);
                        expect(internal_test_utils_1.screen.queryByRole('dialog')).toBeVisible();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onAccept when selecting the same date after changing the year', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, onAccept, onClose, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<DesktopDatePicker_1.DesktopDatePicker onChange={onChange} onAccept={onAccept} onClose={onClose} defaultValue={pickers_1.adapterToUse.date('2018-01-01')} openTo="year"/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 1:
                        _a.sent();
                        // Select year
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('radio', { name: '2025' }))];
                    case 2:
                        // Select year
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2025, 0, 1));
                        expect(onAccept.callCount).to.equal(0);
                        expect(onClose.callCount).to.equal(0);
                        // Change the date (same value)
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' }))];
                    case 3:
                        // Change the date (same value)
                        _a.sent();
                        expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
                        expect(onAccept.callCount).to.equal(1);
                        expect(onAccept.lastCall.args[0]).toEqualDateTime(new Date(2025, 0, 1));
                        expect(onClose.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        // Ensures the case in https://github.com/mui/mui-x/issues/18491 works correctly
        it('should call allow re-selecting the previous date when value binding is done in "onAccept"', function () { return __awaiter(void 0, void 0, void 0, function () {
            function TestCase(props) {
                var _a = React.useState(pickers_1.adapterToUse.date('2018-01-01')), value = _a[0], setValue = _a[1];
                return (<DesktopDatePicker_1.DesktopDatePicker {...props} value={value} onAccept={function (newValue, context) {
                        var _a;
                        setValue(newValue);
                        (_a = props.onAccept) === null || _a === void 0 ? void 0 : _a.call(props, newValue, context);
                    }}/>);
            }
            var onChange, onAccept, onClose, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        onAccept = (0, sinon_1.spy)();
                        onClose = (0, sinon_1.spy)();
                        user = render(<TestCase onChange={onChange} onAccept={onAccept} onClose={onClose}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 1:
                        _a.sent();
                        // Change the day
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }))];
                    case 2:
                        // Change the day
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onAccept.callCount).to.equal(1);
                        expect(onAccept.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 2));
                        expect(onClose.callCount).to.equal(1);
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 3:
                        _a.sent();
                        // Change to the initial day
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' }))];
                    case 4:
                        // Change to the initial day
                        _a.sent();
                        expect(onChange.callCount).to.equal(2);
                        expect(onAccept.callCount).to.equal(2);
                        expect(onAccept.lastCall.args[0]).toEqualDateTime(new Date(2018, 0, 1));
                        expect(onClose.callCount).to.equal(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Month navigation', function () {
        it('should not allow to navigate to previous month if props.minDate is after the last day of the previous month', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-02-10')} minDate={pickers_1.adapterToUse.date('2018-02-05')}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByLabelText('Previous month')).to.have.attribute('disabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to navigate to previous month if props.minDate is the last day of the previous month', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-02-10')} minDate={pickers_1.adapterToUse.date('2018-01-31')}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByLabelText('Previous month')).not.to.have.attribute('disabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not allow to navigate to next month if props.maxDate is before the first day of the next month', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-02-10')} maxDate={pickers_1.adapterToUse.date('2018-02-20')}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByLabelText('Next month')).to.have.attribute('disabled');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to navigate to next month if props.maxDate is the first day of the next month', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-02-10')} maxDate={pickers_1.adapterToUse.date('2018-03-01')}/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByLabelText('Next month')).not.to.have.attribute('disabled');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Validation', function () {
        it('should enable the input error state when the current date has an invalid day', function () {
            render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-06-01')} shouldDisableDate={function () { return true; }}/>);
            expect(document.querySelector(".".concat(InputBase_1.inputBaseClasses.error))).not.to.equal(null);
        });
        it('should enable the input error state when the current date has an invalid month', function () {
            render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-06-01')} shouldDisableMonth={function () { return true; }}/>);
            expect(document.querySelector(".".concat(InputBase_1.inputBaseClasses.error))).not.to.equal(null);
        });
        it('should enable the input error state when the current date has an invalid year', function () {
            render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-02-01')} shouldDisableYear={function () { return true; }}/>);
            expect(document.querySelector(".".concat(InputBase_1.inputBaseClasses.error))).not.to.equal(null);
        });
    });
    it('should throw console warning when invalid `openTo` prop is provided', function () {
        expect(function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={null} openTo="month"/>).user;
                        return [4 /*yield*/, (0, pickers_1.openPickerAsync)(user, { type: 'date' })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }).toWarnDev('MUI X: `openTo="month"` is not a valid prop.');
    });
    describe('performance', function () {
        it('should not re-render the `PickersActionBar` on date change', function () { return __awaiter(void 0, void 0, void 0, function () {
            var RenderCount, user, renderCountBeforeChange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        RenderCount = (0, sinon_1.spy)(function (props) { return <PickersActionBar_1.PickersActionBar {...props}/>; });
                        user = render(<DesktopDatePicker_1.DesktopDatePicker slots={{ actionBar: React.memo(RenderCount) }} closeOnSelect={false} open/>).user;
                        renderCountBeforeChange = RenderCount.callCount;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' }))];
                    case 2:
                        _a.sent();
                        expect(RenderCount.callCount - renderCountBeforeChange).to.equal(0); // no re-renders after selecting new values
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not re-render the `PickersActionBar` on date change with custom callback actions with root component updates', function () { return __awaiter(void 0, void 0, void 0, function () {
            var RenderCount, actions, _a, setProps, user, renderCountBeforeChange;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        RenderCount = (0, sinon_1.spy)(function (props) { return <PickersActionBar_1.PickersActionBar {...props}/>; });
                        actions = ['clear', 'today'];
                        _a = render(<DesktopDatePicker_1.DesktopDatePicker defaultValue={pickers_1.adapterToUse.date('2018-01-01')} slots={{ actionBar: React.memo(RenderCount) }} slotProps={{ actionBar: function () { return ({ actions: actions }); } }} closeOnSelect={false} open/>), setProps = _a.setProps, user = _a.user;
                        renderCountBeforeChange = RenderCount.callCount;
                        setProps({ defaultValue: pickers_1.adapterToUse.date('2018-01-04') });
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '3' }))];
                    case 2:
                        _b.sent();
                        expect(RenderCount.callCount - renderCountBeforeChange).to.equal(0); // no re-renders after selecting new values and causing a root component re-render
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
