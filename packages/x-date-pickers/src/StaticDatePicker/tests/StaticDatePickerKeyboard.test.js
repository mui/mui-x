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
var StaticDatePicker_1 = require("@mui/x-date-pickers/StaticDatePicker");
var pickers_1 = require("test/utils/pickers");
describe('<StaticDatePicker /> - Keyboard interactions', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    describe('Calendar keyboard navigation', function () {
        it('can autofocus selected day on mount', function () {
            render(<StaticDatePicker_1.StaticDatePicker autoFocus displayStaticWrapperAs="desktop" defaultValue={pickers_1.adapterToUse.date('2022-08-13')}/>);
            expect(internal_test_utils_1.screen.getByRole('gridcell', { name: '13' })).toHaveFocus();
        });
        [
            { key: 'End', expectFocusedDay: '15' },
            { key: 'Home', expectFocusedDay: '9' },
            { key: 'ArrowLeft', expectFocusedDay: '12' },
            { key: 'ArrowUp', expectFocusedDay: '6' },
            { key: 'ArrowRight', expectFocusedDay: '14' },
            { key: 'ArrowDown', expectFocusedDay: '20' },
        ].forEach(function (_a) {
            var key = _a.key, expectFocusedDay = _a.expectFocusedDay;
            it(key, function () {
                render(<StaticDatePicker_1.StaticDatePicker autoFocus displayStaticWrapperAs="desktop" defaultValue={pickers_1.adapterToUse.date('2020-08-13')}/>);
                // Don't care about what's focused.
                // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
                internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: key });
                // Based on column header, screen reader should pronounce <Day Number> <Week Day>
                // But `toHaveAccessibleName` does not do the link between column header and cell value, so we only get <day number> in test
                expect(document.activeElement).toHaveAccessibleName(expectFocusedDay);
            });
        });
        [
            // Switch between months
            { initialDay: '01', key: 'ArrowLeft', expectFocusedDay: '31' },
            { initialDay: '05', key: 'ArrowUp', expectFocusedDay: '29' },
            { initialDay: '31', key: 'ArrowRight', expectFocusedDay: '1' },
            { initialDay: '30', key: 'ArrowDown', expectFocusedDay: '6' },
            // Switch between weeks
            { initialDay: '10', key: 'ArrowLeft', expectFocusedDay: '9' },
            { initialDay: '09', key: 'ArrowRight', expectFocusedDay: '10' },
        ].forEach(function (_a) {
            var initialDay = _a.initialDay, key = _a.key, expectFocusedDay = _a.expectFocusedDay;
            it(key, function () {
                render(<StaticDatePicker_1.StaticDatePicker autoFocus displayStaticWrapperAs="desktop" defaultValue={pickers_1.adapterToUse.date("2020-08-".concat(initialDay))}/>);
                // Don't care about what's focused.
                // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
                internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: key });
                // Based on column header, screen reader should pronounce <Day Number> <Week Day>
                // But `toHaveAccessibleName` does not do the link between column header and cell value, so we only get <day number> in test
                expect(document.activeElement).toHaveAccessibleName(expectFocusedDay);
            });
        });
    });
    it("doesn't allow to select disabled date from keyboard", function () { return __awaiter(void 0, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            render(<StaticDatePicker_1.StaticDatePicker autoFocus displayStaticWrapperAs="desktop" defaultValue={pickers_1.adapterToUse.date('2022-08-13')} minDate={pickers_1.adapterToUse.date('2022-08-13')}/>);
            expect(document.activeElement).toHaveAccessibleName('13');
            for (i = 0; i < 3; i += 1) {
                // Don't care about what's focused.
                // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
                internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft' });
            }
            // leaves focus on the same date
            expect(document.activeElement).toHaveAccessibleName('13');
            return [2 /*return*/];
        });
    }); });
    describe('YearCalendar keyboard navigation', function () {
        [
            { key: 'ArrowLeft', expectFocusedYear: '2019' },
            { key: 'ArrowUp', expectFocusedYear: '2016' },
            { key: 'ArrowRight', expectFocusedYear: '2021' },
            { key: 'ArrowDown', expectFocusedYear: '2024' },
        ].forEach(function (_a) {
            var key = _a.key, expectFocusedYear = _a.expectFocusedYear;
            it(key, function () {
                render(<StaticDatePicker_1.StaticDatePicker openTo="year" reduceAnimations displayStaticWrapperAs="desktop" defaultValue={pickers_1.adapterToUse.date('2022-08-13')}/>);
                var year = internal_test_utils_1.screen.getByText('2020', { selector: 'button' });
                (0, internal_test_utils_1.act)(function () { return year.focus(); });
                internal_test_utils_1.fireEvent.keyDown(year, { key: key });
                expect(document.activeElement).to.have.text(expectFocusedYear);
            });
        });
    });
    describe('MonthCalendar keyboard navigation', function () {
        [
            { key: 'ArrowLeft', expectFocusedMonth: 'Jul' },
            { key: 'ArrowUp', expectFocusedMonth: 'May' },
            { key: 'ArrowRight', expectFocusedMonth: 'Sep' },
            { key: 'ArrowDown', expectFocusedMonth: 'Nov' },
        ].forEach(function (_a) {
            var key = _a.key, expectFocusedMonth = _a.expectFocusedMonth;
            it(key, function () {
                render(<StaticDatePicker_1.StaticDatePicker openTo="month" views={['month']} reduceAnimations displayStaticWrapperAs="desktop" defaultValue={pickers_1.adapterToUse.date('2022-08-13')}/>);
                var aug = internal_test_utils_1.screen.getByText('Aug', { selector: 'button' });
                (0, internal_test_utils_1.act)(function () { return aug.focus(); });
                internal_test_utils_1.fireEvent.keyDown(aug, { key: key });
                expect(document.activeElement).to.have.text(expectFocusedMonth);
            });
        });
    });
    describe('DayCalendar keyboard navigation', function () {
        [
            { key: 'ArrowLeft', expectFocusedDay: '12' },
            { key: 'ArrowUp', expectFocusedDay: '6' },
            { key: 'ArrowRight', expectFocusedDay: '14' },
            { key: 'ArrowDown', expectFocusedDay: '20' },
        ].forEach(function (_a) {
            var key = _a.key, expectFocusedDay = _a.expectFocusedDay;
            it(key, function () {
                render(<StaticDatePicker_1.StaticDatePicker openTo="day" reduceAnimations displayStaticWrapperAs="desktop" defaultValue={pickers_1.adapterToUse.date('2022-08-13')}/>);
                var startDay = internal_test_utils_1.screen.getByText('13', { selector: 'button' });
                (0, internal_test_utils_1.act)(function () { return startDay.focus(); });
                internal_test_utils_1.fireEvent.keyDown(startDay, { key: key });
                expect(document.activeElement).to.have.text(expectFocusedDay);
            });
        });
    });
    var viewsToTest = [
        { view: 'day', textSelector: '13' },
        { view: 'month', textSelector: 'Aug' },
        { view: 'year', textSelector: '2020' },
    ];
    viewsToTest.forEach(function (_a) {
        var view = _a.view, textSelector = _a.textSelector;
        it("should have one element with tabIndex=0 for view ".concat(view), function () {
            render(<StaticDatePicker_1.StaticDatePicker openTo={view} views={[view]} reduceAnimations displayStaticWrapperAs="desktop" defaultValue={pickers_1.adapterToUse.date('2020-08-13')}/>);
            var selectedButton = internal_test_utils_1.screen.getByText(textSelector, { selector: 'button' });
            expect(selectedButton).to.have.attribute('tabindex', '0');
        });
    });
    it("should have one element with tabIndex=0 for day view even if not in current month", function () {
        render(<StaticDatePicker_1.StaticDatePicker openTo="day" reduceAnimations displayStaticWrapperAs="desktop" defaultValue={pickers_1.adapterToUse.date('2022-08-13')}/>);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByTitle('Next month'));
        var day13 = internal_test_utils_1.screen.getByText('13', { selector: 'button' });
        var day1 = internal_test_utils_1.screen.getByText('1', { selector: 'button' });
        expect(day1).to.have.attribute('tabindex', '0');
        expect(day13).to.have.attribute('tabindex', '-1');
    });
});
