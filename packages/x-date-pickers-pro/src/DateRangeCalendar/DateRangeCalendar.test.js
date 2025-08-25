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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var dragAndDrop_1 = require("test/utils/dragAndDrop");
var DateRangeCalendar_1 = require("@mui/x-date-pickers-pro/DateRangeCalendar");
var DateRangePickerDay_1 = require("@mui/x-date-pickers-pro/DateRangePickerDay");
var describeConformance_1 = require("test/utils/describeConformance");
var getPickerDay = function (name, picker) {
    if (picker === void 0) { picker = 'January 2018'; }
    return (0, internal_test_utils_1.within)(internal_test_utils_1.screen.getByRole('grid', { name: picker })).getByRole('gridcell', { name: name });
};
var dynamicShouldDisableDate = function (date, position) {
    if (position === 'end') {
        return pickers_1.adapterToUse.getDate(date) % 3 === 0;
    }
    return pickers_1.adapterToUse.getDate(date) % 5 === 0;
};
describe('<DateRangeCalendar />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<DateRangeCalendar_1.DateRangeCalendar />, function () { return ({
        classes: DateRangeCalendar_1.dateRangeCalendarClasses,
        inheritComponent: 'div',
        render: render,
        muiName: 'MuiDateRangeCalendar',
        refInstanceof: window.HTMLDivElement,
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
    describe('Selection', function () {
        it('should select the range from the next month', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onChange, user, visibleButton, rangeOn1stCall, rangeOn2ndCall;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onChange = (0, sinon_1.spy)();
                        user = render(<DateRangeCalendar_1.DateRangeCalendar onChange={onChange} defaultValue={[pickers_1.adapterToUse.date('2019-01-01'), null]}/>).user;
                        return [4 /*yield*/, user.click(getPickerDay('1', 'January 2019'))];
                    case 1:
                        _a.sent();
                        visibleButton = internal_test_utils_1.screen.getAllByRole('button', {
                            name: 'Next month',
                        })[0];
                        return [4 /*yield*/, user.click(visibleButton)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                getPickerDay('19', 'March 2019');
                            })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.click(getPickerDay('19', 'March 2019'))];
                    case 4:
                        _a.sent();
                        expect(onChange.callCount).to.equal(2);
                        rangeOn1stCall = onChange.firstCall.firstArg;
                        expect(rangeOn1stCall[0]).to.toEqualDateTime(new Date(2019, 0, 1));
                        expect(rangeOn1stCall[1]).to.equal(null);
                        rangeOn2ndCall = onChange.lastCall.firstArg;
                        expect(rangeOn2ndCall[0]).to.toEqualDateTime(new Date(2019, 0, 1));
                        expect(rangeOn2ndCall[1]).to.toEqualDateTime(new Date(2019, 2, 19));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should continue start selection if selected "end" date is before start', function () {
            var onChange = (0, sinon_1.spy)();
            render(<DateRangeCalendar_1.DateRangeCalendar onChange={onChange} referenceDate={pickers_1.adapterToUse.date('2019-01-01')}/>);
            internal_test_utils_1.fireEvent.click(getPickerDay('30', 'January 2019'));
            internal_test_utils_1.fireEvent.click(getPickerDay('19', 'January 2019'));
            expect(internal_test_utils_1.screen.queryByTestId('DateRangeHighlight')).to.equal(null);
            internal_test_utils_1.fireEvent.click(getPickerDay('30', 'January 2019'));
            expect(onChange.callCount).to.equal(3);
            var range = onChange.lastCall.firstArg;
            expect(range[0]).to.toEqualDateTime(new Date(2019, 0, 19));
            expect(range[1]).to.toEqualDateTime(new Date(2019, 0, 30));
        });
        it('should highlight the selected range of dates', function () {
            render(<DateRangeCalendar_1.DateRangeCalendar defaultValue={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-31')]}/>);
            expect(internal_test_utils_1.screen.getAllByTestId('DateRangeHighlight')).to.have.length(31);
        });
        it('prop: disableDragEditing - should not allow dragging range', function () {
            render(<DateRangeCalendar_1.DateRangeCalendar defaultValue={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-31')]} disableDragEditing/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '1', selected: true })).to.not.have.attribute('draggable');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '31', selected: true })).to.not.have.attribute('draggable');
        });
        describe('dragging behavior', function () {
            var dataTransfer;
            var _a = (0, pickers_1.buildPickerDragInteractions)(function () { return dataTransfer; }), executeDateDragWithoutDrop = _a.executeDateDragWithoutDrop, executeDateDrag = _a.executeDateDrag;
            var fireTouchEvent = function (type, target, touch) {
                (0, internal_test_utils_1.fireTouchChangedEvent)(target, type, { changedTouches: [touch] });
            };
            var executeDateTouchDragWithoutEnd = function (target) {
                var touchTargets = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    touchTargets[_i - 1] = arguments[_i];
                }
                fireTouchEvent('touchstart', target, touchTargets[0]);
                touchTargets.slice(0, touchTargets.length - 1).forEach(function (touch) {
                    fireTouchEvent('touchmove', target, touch);
                });
            };
            var executeDateTouchDrag = function (target) {
                var touchTargets = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    touchTargets[_i - 1] = arguments[_i];
                }
                var endTouchTarget = touchTargets[touchTargets.length - 1];
                executeDateTouchDragWithoutEnd.apply(void 0, __spreadArray([target], touchTargets, false));
                fireTouchEvent('touchend', target, endTouchTarget);
            };
            beforeEach(function () {
                dataTransfer = new dragAndDrop_1.MockedDataTransfer();
            });
            afterEach(function () {
                dataTransfer = null;
            });
            it('should not emit "onChange" when dragging is ended where it was started', function () {
                var onChange = (0, sinon_1.spy)();
                render(<DateRangeCalendar_1.DateRangeCalendar onChange={onChange} defaultValue={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-31')]}/>);
                var startDay = internal_test_utils_1.screen.getByRole('gridcell', { name: '31', selected: true });
                var dragToDay = internal_test_utils_1.screen.getByRole('gridcell', { name: '30' });
                expect(onChange.callCount).to.equal(0);
                executeDateDrag(startDay, dragToDay, startDay);
                expect(onChange.callCount).to.equal(0);
            });
            it.skipIf(!document.elementFromPoint)('should not emit "onChange" when touch dragging is ended where it was started', function () {
                var onChange = (0, sinon_1.spy)();
                render(<DateRangeCalendar_1.DateRangeCalendar onChange={onChange} defaultValue={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-10')]}/>);
                var startDay = internal_test_utils_1.screen.getByRole('gridcell', { name: '1', selected: true });
                expect(onChange.callCount).to.equal(0);
                executeDateTouchDrag(startDay, pickers_1.rangeCalendarDayTouches['2018-01-01'], pickers_1.rangeCalendarDayTouches['2018-01-02'], pickers_1.rangeCalendarDayTouches['2018-01-01']);
                expect(onChange.callCount).to.equal(0);
            });
            it('should emit "onChange" when dragging end date', function () {
                var onChange = (0, sinon_1.spy)();
                var initialValue = [
                    pickers_1.adapterToUse.date('2018-01-10'),
                    pickers_1.adapterToUse.date('2018-01-31'),
                ];
                render(<DateRangeCalendar_1.DateRangeCalendar onChange={onChange} defaultValue={initialValue}/>);
                // test range reduction
                executeDateDrag(internal_test_utils_1.screen.getByRole('gridcell', { name: '31', selected: true }), internal_test_utils_1.screen.getByRole('gridcell', { name: '30' }), internal_test_utils_1.screen.getByRole('gridcell', { name: '29' }));
                expect(onChange.callCount).to.equal(1);
                expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
                expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 29));
                expect(document.activeElement).toHaveAccessibleName('29');
                // test range expansion
                executeDateDrag(internal_test_utils_1.screen.getByRole('gridcell', { name: '29', selected: true }), internal_test_utils_1.screen.getByRole('gridcell', { name: '30' }));
                expect(onChange.callCount).to.equal(2);
                expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
                expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 30));
                expect(document.activeElement).toHaveAccessibleName('30');
                // test range flip
                executeDateDrag(internal_test_utils_1.screen.getByRole('gridcell', { name: '30', selected: true }), getPickerDay('2'));
                expect(onChange.callCount).to.equal(3);
                expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 2));
                expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[0]);
                expect(document.activeElement).toHaveAccessibleName('2');
            });
            it.skipIf(!document.elementFromPoint)('should emit "onChange" when touch dragging end date', function () {
                var onChange = (0, sinon_1.spy)();
                var initialValue = [
                    pickers_1.adapterToUse.date('2018-01-02'),
                    pickers_1.adapterToUse.date('2018-01-11'),
                ];
                render(<DateRangeCalendar_1.DateRangeCalendar onChange={onChange} defaultValue={initialValue}/>);
                // test range reduction
                executeDateTouchDrag(getPickerDay('11'), pickers_1.rangeCalendarDayTouches['2018-01-11'], pickers_1.rangeCalendarDayTouches['2018-01-10']);
                expect(onChange.callCount).to.equal(1);
                expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
                expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 10));
                // test range expansion
                executeDateTouchDrag(getPickerDay('10'), pickers_1.rangeCalendarDayTouches['2018-01-10'], pickers_1.rangeCalendarDayTouches['2018-01-11']);
                expect(onChange.callCount).to.equal(2);
                expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
                expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
                // test range flip
                executeDateTouchDrag(getPickerDay('11'), pickers_1.rangeCalendarDayTouches['2018-01-11'], pickers_1.rangeCalendarDayTouches['2018-01-01']);
                expect(onChange.callCount).to.equal(3);
                expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 1));
                expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[0]);
            });
            it('should emit "onChange" when dragging start date', function () {
                var onChange = (0, sinon_1.spy)();
                var initialValue = [
                    pickers_1.adapterToUse.date('2018-01-01'),
                    pickers_1.adapterToUse.date('2018-01-20'),
                ];
                render(<DateRangeCalendar_1.DateRangeCalendar onChange={onChange} defaultValue={initialValue}/>);
                // test range reduction
                executeDateDrag(getPickerDay('1'), getPickerDay('2'), getPickerDay('3'));
                expect(onChange.callCount).to.equal(1);
                expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 3));
                expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
                expect(document.activeElement).toHaveAccessibleName('3');
                // test range expansion
                executeDateDrag(getPickerDay('3'), getPickerDay('1'));
                expect(onChange.callCount).to.equal(2);
                expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
                expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
                expect(document.activeElement).toHaveAccessibleName('1');
                // test range flip
                executeDateDrag(getPickerDay('1'), getPickerDay('22'));
                expect(onChange.callCount).to.equal(3);
                expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[1]);
                expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 22));
                expect(document.activeElement).toHaveAccessibleName('22');
            });
            it.skipIf(!document.elementFromPoint)('should emit "onChange" when touch dragging start date', function () {
                var onChange = (0, sinon_1.spy)();
                var initialValue = [
                    pickers_1.adapterToUse.date('2018-01-01'),
                    pickers_1.adapterToUse.date('2018-01-10'),
                ];
                render(<DateRangeCalendar_1.DateRangeCalendar onChange={onChange} defaultValue={initialValue}/>);
                // test range reduction
                executeDateTouchDrag(getPickerDay('1'), pickers_1.rangeCalendarDayTouches['2018-01-01'], pickers_1.rangeCalendarDayTouches['2018-01-02']);
                expect(onChange.callCount).to.equal(1);
                expect(onChange.lastCall.args[0][0]).toEqualDateTime(new Date(2018, 0, 2));
                expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
                // test range expansion
                executeDateTouchDrag(getPickerDay('2'), pickers_1.rangeCalendarDayTouches['2018-01-02'], pickers_1.rangeCalendarDayTouches['2018-01-01']);
                expect(onChange.callCount).to.equal(2);
                expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[0]);
                expect(onChange.lastCall.args[0][1]).toEqualDateTime(initialValue[1]);
                // test range flip
                executeDateTouchDrag(getPickerDay('1'), pickers_1.rangeCalendarDayTouches['2018-01-01'], pickers_1.rangeCalendarDayTouches['2018-01-11']);
                expect(onChange.callCount).to.equal(3);
                expect(onChange.lastCall.args[0][0]).toEqualDateTime(initialValue[1]);
                expect(onChange.lastCall.args[0][1]).toEqualDateTime(new Date(2018, 0, 11));
            });
            it('should dynamically update "shouldDisableDate" when flip dragging', function () {
                var initialValue = [
                    pickers_1.adapterToUse.date('2018-01-01'),
                    pickers_1.adapterToUse.date('2018-01-07'),
                ];
                render(<DateRangeCalendar_1.DateRangeCalendar defaultValue={initialValue} shouldDisableDate={dynamicShouldDisableDate} calendars={1}/>);
                expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '5' })).to.have.attribute('disabled');
                expect(internal_test_utils_1.screen.getAllByRole('gridcell').filter(function (c) { return c.disabled; })).to.have.lengthOf(6);
                // flip date range
                executeDateDragWithoutDrop(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' }), internal_test_utils_1.screen.getByRole('gridcell', { name: '4' }), internal_test_utils_1.screen.getByRole('gridcell', { name: '10' }));
                expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '9' })).to.have.attribute('disabled');
                expect(internal_test_utils_1.screen.getAllByRole('gridcell').filter(function (c) { return c.disabled; })).to.have.lengthOf(10);
            });
            it.skipIf(!document.elementFromPoint)('should dynamically update "shouldDisableDate" when flip touch dragging', function () {
                var initialValue = [
                    pickers_1.adapterToUse.date('2018-01-01'),
                    pickers_1.adapterToUse.date('2018-01-07'),
                ];
                render(<DateRangeCalendar_1.DateRangeCalendar defaultValue={initialValue} shouldDisableDate={dynamicShouldDisableDate} calendars={1}/>);
                expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '5' })).to.have.attribute('disabled');
                expect(internal_test_utils_1.screen.getAllByRole('gridcell').filter(function (c) { return c.disabled; })).to.have.lengthOf(6);
                // flip date range
                executeDateTouchDragWithoutEnd(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' }), pickers_1.rangeCalendarDayTouches['2018-01-01'], pickers_1.rangeCalendarDayTouches['2018-01-09'], pickers_1.rangeCalendarDayTouches['2018-01-10']);
                expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '9' })).to.have.attribute('disabled');
                expect(internal_test_utils_1.screen.getAllByRole('gridcell').filter(function (c) { return c.disabled; })).to.have.lengthOf(10);
            });
        });
    });
    describe('Component slot: Day', function () {
        it('should render custom day component', function () {
            render(<DateRangeCalendar_1.DateRangeCalendar slots={{
                    day: function (day) { return <div key={String(day)} data-testid="slot used"/>; },
                }}/>);
            expect(internal_test_utils_1.screen.getAllByTestId('slot used')).not.to.have.length(0);
        });
    });
    describe('prop: disableAutoMonthSwitching', function () {
        it('should go to the month of the end date when changing the start date', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<DateRangeCalendar_1.DateRangeCalendar defaultValue={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-07-01')]}/>).user;
                        return [4 /*yield*/, user.click(getPickerDay('5', 'January 2018'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(getPickerDay('1', 'July 2018')).not.to.equal(null);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not go to the month of the end date when changing the start date and props.disableAutoMonthSwitching = true', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<DateRangeCalendar_1.DateRangeCalendar defaultValue={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-07-01')]} disableAutoMonthSwitching/>);
                        internal_test_utils_1.fireEvent.click(getPickerDay('5', 'January 2018'));
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(getPickerDay('1', 'January 2018')).not.to.equal(null);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should go to the month of the start date when changing both date from the outside', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProps = render(<DateRangeCalendar_1.DateRangeCalendar value={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-07-01')]}/>).setProps;
                        setProps({
                            value: [pickers_1.adapterToUse.date('2018-04-01'), pickers_1.adapterToUse.date('2018-04-01')],
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(getPickerDay('1', 'April 2018')).not.to.equal(null);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        describe('prop: currentMonthCalendarPosition', function () {
            it('should switch to the selected month when changing value from the outside', function () { return __awaiter(void 0, void 0, void 0, function () {
                var setProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setProps = render(<DateRangeCalendar_1.DateRangeCalendar value={[pickers_1.adapterToUse.date('2018-01-10'), pickers_1.adapterToUse.date('2018-01-15')]} currentMonthCalendarPosition={2}/>).setProps;
                            setProps({
                                value: [pickers_1.adapterToUse.date('2018-02-11'), pickers_1.adapterToUse.date('2018-02-22')],
                            });
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(getPickerDay('1', 'February 2018')).not.to.equal(null);
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    ['readOnly', 'disabled'].forEach(function (prop) {
        it("prop: ".concat(prop, "=\"true\" should not allow date editing"), function () {
            var _a;
            var handleChange = (0, sinon_1.spy)();
            render(<DateRangeCalendar_1.DateRangeCalendar value={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-10')]} onChange={handleChange} {..._a = {}, _a[prop] = true, _a}/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '1', selected: true })).to.not.have.attribute('draggable');
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '10', selected: true })).to.not.have.attribute('draggable');
            if (prop === 'disabled') {
                expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '1', selected: true })).to.have.attribute('disabled');
            }
            internal_test_utils_1.fireEvent.click(getPickerDay('2'));
            expect(handleChange.callCount).to.equal(0);
        });
    });
    it('prop: calendars - should render the provided amount of calendars', function () {
        render(<DateRangeCalendar_1.DateRangeCalendar calendars={3}/>);
        expect(internal_test_utils_1.screen.getAllByTestId('pickers-calendar')).to.have.length(3);
    });
    describe('Performance', function () {
        it('should only render the new start day when selecting a start day without a previously selected start day', function () {
            var RenderCount = (0, sinon_1.spy)(function (props) { return <DateRangePickerDay_1.DateRangePickerDay {...props}/>; });
            render(<DateRangeCalendar_1.DateRangeCalendar referenceDate={pickers_1.adapterToUse.date('2018-01-01')} slots={{
                    day: React.memo(RenderCount),
                }}/>);
            var renderCountBeforeChange = RenderCount.callCount;
            internal_test_utils_1.fireEvent.click(getPickerDay('2'));
            expect(RenderCount.callCount - renderCountBeforeChange).to.equal(2); // 2 render * 1 day
        });
        it('should only render the day inside range when selecting the end day', function () {
            var RenderCount = (0, sinon_1.spy)(function (props) { return <DateRangePickerDay_1.DateRangePickerDay {...props}/>; });
            render(<DateRangeCalendar_1.DateRangeCalendar referenceDate={pickers_1.adapterToUse.date('2018-01-01')} slots={{
                    day: React.memo(RenderCount),
                }}/>);
            internal_test_utils_1.fireEvent.click(getPickerDay('2'));
            var renderCountBeforeChange = RenderCount.callCount;
            internal_test_utils_1.fireEvent.click(getPickerDay('4'));
            expect(RenderCount.callCount - renderCountBeforeChange).to.equal(6); // 2 render * 3 day
        });
    });
});
