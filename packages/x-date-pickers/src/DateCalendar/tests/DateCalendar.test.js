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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var DateCalendar_1 = require("@mui/x-date-pickers/DateCalendar");
var PickersDay_1 = require("@mui/x-date-pickers/PickersDay");
var pickers_1 = require("test/utils/pickers");
var skipIf_1 = require("test/utils/skipIf");
var sinon_1 = require("sinon");
var vitest_1 = require("vitest");
describe('<DateCalendar />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    it('switches between views uncontrolled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var handleViewChange, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleViewChange = (0, sinon_1.spy)();
                    user = render(<DateCalendar_1.DateCalendar defaultValue={pickers_1.adapterToUse.date('2019-01-01')} onViewChange={handleViewChange}/>).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText(/switch to year view/i))];
                case 1:
                    _a.sent();
                    expect(handleViewChange.callCount).to.equal(1);
                    expect(internal_test_utils_1.screen.queryByLabelText(/switch to year view/i)).to.equal(null);
                    expect(internal_test_utils_1.screen.getByLabelText('year view is open, switch to calendar view')).toBeVisible();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow month and view changing, but not selection when readOnly prop is passed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onChangeMock, onMonthChangeMock, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onChangeMock = (0, sinon_1.spy)();
                    onMonthChangeMock = (0, sinon_1.spy)();
                    user = render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2019-01-01')} onChange={onChangeMock} onMonthChange={onMonthChangeMock} readOnly/>).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByTitle('Previous month'))];
                case 1:
                    _a.sent();
                    expect(onMonthChangeMock.callCount).to.equal(1);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByTitle('Next month'))];
                case 2:
                    _a.sent();
                    expect(onMonthChangeMock.callCount).to.equal(2);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(internal_test_utils_1.screen.getAllByRole('rowgroup').length).to.equal(1); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '5' }))];
                case 4:
                    _a.sent();
                    expect(onChangeMock.callCount).to.equal(0);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText('January 2019'))];
                case 5:
                    _a.sent();
                    expect(internal_test_utils_1.screen.queryByLabelText('year view is open, switch to calendar view')).toBeVisible();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not allow interaction when disabled prop is passed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onChangeMock, onMonthChangeMock, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onChangeMock = (0, sinon_1.spy)();
                    onMonthChangeMock = (0, sinon_1.spy)();
                    user = render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2019-01-01')} onChange={onChangeMock} onMonthChange={onMonthChangeMock} disabled/>).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText('January 2019'))];
                case 1:
                    _a.sent();
                    expect(internal_test_utils_1.screen.queryByText('January 2019')).toBeVisible();
                    expect(internal_test_utils_1.screen.queryByLabelText('year view is open, switch to calendar view')).to.equal(null);
                    return [4 /*yield*/, user.setup({ pointerEventsCheck: 0 }).click(internal_test_utils_1.screen.getByTitle('Previous month'))];
                case 2:
                    _a.sent();
                    expect(onMonthChangeMock.callCount).to.equal(0);
                    return [4 /*yield*/, user.setup({ pointerEventsCheck: 0 }).click(internal_test_utils_1.screen.getByTitle('Next month'))];
                case 3:
                    _a.sent();
                    expect(onMonthChangeMock.callCount).to.equal(0);
                    return [4 /*yield*/, user.setup({ pointerEventsCheck: 0 }).click(internal_test_utils_1.screen.getByRole('gridcell', { name: '5' }))];
                case 4:
                    _a.sent();
                    expect(onChangeMock.callCount).to.equal(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should display disabled days when disabled prop is passed', function () {
        var onChangeMock = (0, sinon_1.spy)();
        var onMonthChangeMock = (0, sinon_1.spy)();
        render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2019-01-01')} onChange={onChangeMock} onMonthChange={onMonthChangeMock} disabled/>);
        // days are disabled
        var cells = internal_test_utils_1.screen.getAllByRole('gridcell');
        var disabledDays = cells.filter(function (cell) {
            return cell.getAttribute('disabled') !== null && cell.getAttribute('data-testid') === 'day';
        });
        expect(cells.length).to.equal(35);
        expect(disabledDays.length).to.equal(31);
    });
    it('should render column header according to dayOfWeekFormatter', function () {
        render(<DateCalendar_1.DateCalendar defaultValue={pickers_1.adapterToUse.date('2019-01-01')} dayOfWeekFormatter={function (day) { return "".concat(pickers_1.adapterToUse.format(day, 'weekdayShort'), "."); }}/>);
        ['Su.', 'Mo.', 'Tu.', 'We.', 'Th.', 'Fr.', 'Sa.'].forEach(function (formattedDay) {
            expect(internal_test_utils_1.screen.getByText(formattedDay)).toBeVisible();
        });
    });
    it('should render week number when `displayWeekNumber=true`', function () {
        render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2019-01-01')} onChange={function () { }} displayWeekNumber/>);
        expect(internal_test_utils_1.screen.getAllByRole('rowheader').length).to.equal(5);
    });
    describe('with fake timers', function () {
        beforeEach(function () {
            vitest_1.vi.setSystemTime(new Date(2019, 0, 2));
        });
        afterEach(function () {
            vitest_1.vi.useRealTimers();
        });
        // test: https://github.com/mui/mui-x/issues/12373
        it('should not reset day to `startOfDay` if value already exists when finding the closest enabled date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, defaultDate, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        defaultDate = pickers_1.adapterToUse.date('2019-01-02T11:12:13.550Z');
                        user = render(<DateCalendar_1.DateCalendar onChange={onChange} disablePast defaultValue={defaultDate}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'calendar view is open, switch to year view' }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('radio', { name: '2020' }))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, internal_test_utils_1.screen.findByRole('gridcell', { name: '1' })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' }))];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'calendar view is open, switch to year view' }))];
                    case 5:
                        _a.sent();
                        // select the current year with a date in the past to trigger "findClosestEnabledDate"
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('radio', { name: '2019' }))];
                    case 6:
                        // select the current year with a date in the past to trigger "findClosestEnabledDate"
                        _a.sent();
                        expect(onChange.lastCall.firstArg).toEqualDateTime(defaultDate);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Slot: calendarHeader', function () {
        it('should allow to override the format', function () {
            render(<DateCalendar_1.DateCalendar defaultValue={pickers_1.adapterToUse.date('2019-01-01')} slotProps={{ calendarHeader: { format: 'yyyy/MM' } }}/>);
            expect(internal_test_utils_1.screen.getByText('2019/01')).toBeVisible();
        });
    });
    describe('view: day', function () {
        it('renders day calendar standalone', function () {
            render(<DateCalendar_1.DateCalendar defaultValue={pickers_1.adapterToUse.date('2019-01-01')}/>);
            expect(internal_test_utils_1.screen.getByText('January 2019')).toBeVisible();
            expect(internal_test_utils_1.screen.getAllByTestId('day')).to.have.length(31);
            // It should follow https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
            expect(document.querySelector('[role="grid"] [role="rowgroup"] > [role="row"] [role="gridcell"][data-testid="day"]')).to.have.text('1');
        });
        it('should use `referenceDate` when no value defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar onChange={onChange} referenceDate={pickers_1.adapterToUse.date('2022-04-17T12:30:00')} view="day"/>).user;
                        // should make the reference day firstly focusable
                        expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '17' })).to.have.attribute('tabindex', '0');
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }))];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 3, 2, 12, 30));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not use `referenceDate` when a value is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar onChange={onChange} value={pickers_1.adapterToUse.date('2019-01-01T12:20:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-01T15:30:00')} view="day"/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }))];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 2, 12, 20));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not use `referenceDate` when a defaultValue is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar onChange={onChange} defaultValue={pickers_1.adapterToUse.date('2019-01-01T12:20:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-01T15:30:00')} view="day"/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }))];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 0, 2, 12, 20));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should keep the time of the currently provided date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2018-01-03T11:11:11.111')} onChange={onChange} view="day"/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }))];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(pickers_1.adapterToUse.date('2018-01-02T11:11:11.111'));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should complete weeks when showDaysOutsideCurrentMonth=true', function () {
            render(<DateCalendar_1.DateCalendar defaultValue={pickers_1.adapterToUse.date('2018-01-03T11:11:11.111')} view="day" showDaysOutsideCurrentMonth/>);
            expect(internal_test_utils_1.screen.getAllByRole('gridcell', { name: '31' }).length).to.equal(2);
        });
        it('should complete weeks up to match `fixedWeekNumber`', function () {
            render(<DateCalendar_1.DateCalendar defaultValue={pickers_1.adapterToUse.date('2018-01-03T11:11:11.111')} view="day" showDaysOutsideCurrentMonth fixedWeekNumber={6}/>);
            expect(internal_test_utils_1.screen.getAllByRole('row').length).to.equal(7); // 6 weeks + header
        });
        it('should open after `minDate` if now is outside', function () {
            render(<DateCalendar_1.DateCalendar view="day" minDate={pickers_1.adapterToUse.date('2031-03-03')}/>);
            expect(internal_test_utils_1.screen.getByText('March 2031')).not.to.equal(null);
        });
        it('should open before `maxDate` if now is outside', function () {
            render(<DateCalendar_1.DateCalendar view="day" maxDate={pickers_1.adapterToUse.date('1534-03-03')}/>);
            expect(internal_test_utils_1.screen.getByText('March 1534')).not.to.equal(null);
        });
    });
    describe('view: month', function () {
        it('should select the closest enabled date in the month if the current date is disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, april;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2019-01-01')} onChange={onChange} shouldDisableDate={function (date) {
                                return pickers_1.adapterToUse.getMonth(date) === 3 && pickers_1.adapterToUse.getDate(date) < 6;
                            }} views={['month', 'day']} openTo="month"/>).user;
                        april = internal_test_utils_1.screen.getByText('Apr', { selector: 'button' });
                        return [4 /*yield*/, user.click(april)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 3, 6));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should respect minDate when selecting closest enabled date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, april;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2019-06-01')} minDate={pickers_1.adapterToUse.date('2019-04-07')} onChange={onChange} views={['month', 'day']} openTo="month"/>).user;
                        april = internal_test_utils_1.screen.getByText('Apr', { selector: 'button' });
                        return [4 /*yield*/, user.click(april)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 3, 7));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should respect maxDate when selecting closest enabled date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, april;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2019-01-29')} maxDate={pickers_1.adapterToUse.date('2019-04-22')} onChange={onChange} views={['month', 'day']} openTo="month"/>).user;
                        april = internal_test_utils_1.screen.getByText('Apr', { selector: 'button' });
                        return [4 /*yield*/, user.click(april)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 3, 22));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go to next view without changing the date when no date of the new month is enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, april;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2019-01-29')} onChange={onChange} shouldDisableDate={function (date) { return pickers_1.adapterToUse.getMonth(date) === 3; }} views={['month', 'day']} openTo="month"/>).user;
                        april = internal_test_utils_1.screen.getByText('Apr', { selector: 'button' });
                        return [4 /*yield*/, user.click(april)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(0);
                        expect(internal_test_utils_1.screen.getByTestId('calendar-month-and-year-text')).to.have.text('April 2019');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use `referenceDate` when no value defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, april;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar onChange={onChange} referenceDate={pickers_1.adapterToUse.date('2018-01-01T12:30:00')} views={['month', 'day']} openTo="month"/>).user;
                        april = internal_test_utils_1.screen.getByText('Apr', { selector: 'button' });
                        return [4 /*yield*/, user.click(april)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2018, 3, 1, 12, 30));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not use `referenceDate` when a value is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, april;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar onChange={onChange} value={pickers_1.adapterToUse.date('2019-01-01T12:20:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-01T15:30:00')} views={['month', 'day']} openTo="month"/>).user;
                        april = internal_test_utils_1.screen.getByText('Apr', { selector: 'button' });
                        return [4 /*yield*/, user.click(april)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 3, 1, 12, 20));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not use `referenceDate` when a defaultValue is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, april;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar onChange={onChange} defaultValue={pickers_1.adapterToUse.date('2019-01-01T12:20:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-01T15:30:00')} views={['month', 'day']} openTo="month"/>).user;
                        april = internal_test_utils_1.screen.getByText('Apr', { selector: 'button' });
                        return [4 /*yield*/, user.click(april)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2019, 3, 1, 12, 20));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('view: year', function () {
        it('renders year selection standalone', function () {
            render(<DateCalendar_1.DateCalendar defaultValue={pickers_1.adapterToUse.date('2019-01-01')} openTo="year"/>);
            expect(internal_test_utils_1.screen.getAllByRole('radio')).to.have.length(200);
        });
        it('should select the closest enabled date in the month if the current date is disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, year2022;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2019-04-29')} onChange={onChange} shouldDisableDate={function (date) {
                                return pickers_1.adapterToUse.getYear(date) === 2022 && pickers_1.adapterToUse.getMonth(date) === 3;
                            }} views={['year', 'day']} openTo="year"/>).user;
                        year2022 = internal_test_utils_1.screen.getByText('2022', { selector: 'button' });
                        return [4 /*yield*/, user.click(year2022)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 4, 1));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should respect minDate when selecting closest enabled date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, year2017;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2019-04-29')} minDate={pickers_1.adapterToUse.date('2017-05-12')} onChange={onChange} views={['year', 'day']} openTo="year"/>).user;
                        year2017 = internal_test_utils_1.screen.getByText('2017', { selector: 'button' });
                        return [4 /*yield*/, user.click(year2017)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2017, 4, 12));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should respect maxDate when selecting closest enabled date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, year2022;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2019-04-29')} maxDate={pickers_1.adapterToUse.date('2022-03-31')} onChange={onChange} views={['year', 'day']} openTo="year"/>).user;
                        year2022 = internal_test_utils_1.screen.getByText('2022', { selector: 'button' });
                        return [4 /*yield*/, user.click(year2022)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 2, 31));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go to next view without changing the date when no date of the new year is enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, year2022;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar value={pickers_1.adapterToUse.date('2019-04-29')} onChange={onChange} shouldDisableDate={function (date) { return pickers_1.adapterToUse.getYear(date) === 2022; }} views={['year', 'day']} openTo="year"/>).user;
                        year2022 = internal_test_utils_1.screen.getByText('2022', { selector: 'button' });
                        return [4 /*yield*/, user.click(year2022)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(0);
                        expect(internal_test_utils_1.screen.getByTestId('calendar-month-and-year-text')).to.have.text('January 2022');
                        return [2 /*return*/];
                }
            });
        }); });
        // Needs layout
        it.skipIf(skipIf_1.isJSDOM)('should scroll to show the selected year', function () {
            render(<DateCalendar_1.DateCalendar defaultValue={pickers_1.adapterToUse.date('2019-04-29')} views={['year']} openTo="year"/>);
            var rootElement = document.querySelector('.MuiDateCalendar-root');
            var selectedButton = document.querySelector('.Mui-selected');
            expect(rootElement).not.to.equal(null);
            expect(selectedButton).not.to.equal(null);
            var parentBoundingBox = rootElement.getBoundingClientRect();
            var buttonBoundingBox = selectedButton.getBoundingClientRect();
            expect(parentBoundingBox.top).not.to.greaterThan(buttonBoundingBox.top);
            expect(parentBoundingBox.bottom).not.to.lessThan(buttonBoundingBox.bottom);
        });
        it('should use `referenceDate` when no value defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, year2022;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar onChange={onChange} referenceDate={pickers_1.adapterToUse.date('2018-01-01T12:30:00')} views={['year']} openTo="year"/>).user;
                        year2022 = internal_test_utils_1.screen.getByText('2022', { selector: 'button' });
                        return [4 /*yield*/, user.click(year2022)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 0, 1, 12, 30));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not use `referenceDate` when a value is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, year2022;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar onChange={onChange} value={pickers_1.adapterToUse.date('2019-01-01T12:20:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-01T15:30:00')} views={['year']} openTo="year"/>).user;
                        year2022 = internal_test_utils_1.screen.getByText('2022', { selector: 'button' });
                        return [4 /*yield*/, user.click(year2022)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 0, 1, 12, 20));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not use `referenceDate` when a defaultValue is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, year2022;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateCalendar_1.DateCalendar onChange={onChange} defaultValue={pickers_1.adapterToUse.date('2019-01-01T12:20:00')} referenceDate={pickers_1.adapterToUse.date('2018-01-01T15:30:00')} views={['year']} openTo="year"/>).user;
                        year2022 = internal_test_utils_1.screen.getByText('2022', { selector: 'button' });
                        return [4 /*yield*/, user.click(year2022)];
                    case 1:
                        _a.sent();
                        expect(onChange.callCount).to.equal(1);
                        expect(onChange.lastCall.firstArg).toEqualDateTime(new Date(2022, 0, 1, 12, 20));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Performance', function () {
        it('should only render newly selected day when selecting a day without a previously selected day', function () {
            var RenderCount = (0, sinon_1.spy)(function (props) { return <PickersDay_1.PickersDay {...props}/>; });
            render(<DateCalendar_1.DateCalendar referenceDate={pickers_1.adapterToUse.date('2019-01-02')} slots={{
                    day: React.memo(RenderCount),
                }}/>);
            var renderCountBeforeChange = RenderCount.callCount;
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }));
            expect(RenderCount.callCount - renderCountBeforeChange).to.equal(2); // 2 render * 1 day
        });
        it('should only re-render previously selected day and newly selected day when selecting a day', function () {
            var RenderCount = (0, sinon_1.spy)(function (props) { return <PickersDay_1.PickersDay {...props}/>; });
            render(<DateCalendar_1.DateCalendar defaultValue={pickers_1.adapterToUse.date('2019-04-29')} slots={{
                    day: React.memo(RenderCount),
                }}/>);
            var renderCountBeforeChange = RenderCount.callCount;
            // TODO: Use userEvent.click instead.
            internal_test_utils_1.fireEvent.focus(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '2' }));
            // 2 render (one to update tabIndex + autoFocus, one to update selection) * 2 days * 2 (because dev mode)
            expect(RenderCount.callCount - renderCountBeforeChange).to.equal(8);
        });
    });
});
