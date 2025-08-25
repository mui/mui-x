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
var MonthCalendar_1 = require("@mui/x-date-pickers/MonthCalendar");
var pickers_1 = require("test/utils/pickers");
var vitest_1 = require("vitest");
describe('<MonthCalendar />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    it('should allow to pick month standalone by click, `Enter` and `Space`', function () {
        var onChange = (0, sinon_1.spy)();
        render(<MonthCalendar_1.MonthCalendar value={pickers_1.adapterToUse.date('2019-02-02')} onChange={onChange}/>);
        var targetMonth = internal_test_utils_1.screen.getByRole('radio', { name: 'February' });
        // A native button implies Enter and Space keydown behavior
        // These keydown events only trigger click behavior if they're trusted (programmatically dispatched events aren't trusted).
        // If this breaks, make sure to add tests for
        // - fireEvent.keyDown(targetDay, { key: 'Enter' })
        // - fireEvent.keyUp(targetDay, { key: 'Space' })
        expect(targetMonth.tagName).to.equal('BUTTON');
        internal_test_utils_1.fireEvent.click(targetMonth);
        expect(onChange.callCount).to.equal(1);
        expect(onChange.args[0][0]).toEqualDateTime(new Date(2019, 1, 2));
    });
    describe('with fake timers', function () {
        beforeEach(function () {
            vitest_1.vi.setSystemTime(new Date(2019, 0, 1));
        });
        afterEach(function () {
            vitest_1.vi.useRealTimers();
        });
        it('should select start of month without time when no initial value is present', function () {
            var onChange = (0, sinon_1.spy)();
            render(<MonthCalendar_1.MonthCalendar onChange={onChange}/>);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('radio', { name: 'February' }));
            expect(onChange.callCount).to.equal(1);
            expect(onChange.args[0][0]).toEqualDateTime(new Date(2019, 1, 1, 0, 0, 0));
        });
    });
    it('does not allow to pick months if readOnly prop is passed', function () {
        var onChangeMock = (0, sinon_1.spy)();
        render(<MonthCalendar_1.MonthCalendar value={pickers_1.adapterToUse.date('2019-02-02')} onChange={onChangeMock} readOnly/>);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Mar', { selector: 'button' }));
        expect(onChangeMock.callCount).to.equal(0);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Apr', { selector: 'button' }));
        expect(onChangeMock.callCount).to.equal(0);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Jul', { selector: 'button' }));
        expect(onChangeMock.callCount).to.equal(0);
    });
    it('clicking on a month button should not trigger the form submit', function () {
        var onSubmitMock = (0, sinon_1.spy)();
        render(<form onSubmit={onSubmitMock}>
        <MonthCalendar_1.MonthCalendar defaultValue={pickers_1.adapterToUse.date('2018-02-02')}/>
      </form>);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('Mar', { selector: 'button' }));
        expect(onSubmitMock.callCount).to.equal(0);
    });
    describe('Disabled', function () {
        it('should disable all months if props.disabled = true', function () {
            var onChange = (0, sinon_1.spy)();
            render(<MonthCalendar_1.MonthCalendar value={pickers_1.adapterToUse.date('2019-02-15')} onChange={onChange} disabled/>);
            internal_test_utils_1.screen.getAllByRole('radio').forEach(function (monthButton) {
                expect(monthButton).to.have.attribute('disabled');
                internal_test_utils_1.fireEvent.click(monthButton);
                expect(onChange.callCount).to.equal(0);
            });
        });
        it('should disable months before props.minDate but not the month in which props.minDate is', function () {
            var onChange = (0, sinon_1.spy)();
            render(<MonthCalendar_1.MonthCalendar value={pickers_1.adapterToUse.date('2019-02-15')} onChange={onChange} minDate={pickers_1.adapterToUse.date('2019-02-12')}/>);
            var january = internal_test_utils_1.screen.getByText('Jan', { selector: 'button' });
            var february = internal_test_utils_1.screen.getByText('Feb', { selector: 'button' });
            expect(january).to.have.attribute('disabled');
            expect(february).not.to.have.attribute('disabled');
            internal_test_utils_1.fireEvent.click(january);
            expect(onChange.callCount).to.equal(0);
            internal_test_utils_1.fireEvent.click(february);
            expect(onChange.callCount).to.equal(1);
        });
        it('should disable months after props.maxDate but not the month in which props.maxDate is', function () {
            var onChange = (0, sinon_1.spy)();
            render(<MonthCalendar_1.MonthCalendar value={pickers_1.adapterToUse.date('2019-02-15')} onChange={onChange} maxDate={pickers_1.adapterToUse.date('2019-04-12')}/>);
            var may = internal_test_utils_1.screen.getByText('May', { selector: 'button' });
            var april = internal_test_utils_1.screen.getByText('Apr', { selector: 'button' });
            expect(may).to.have.attribute('disabled');
            expect(april).not.to.have.attribute('disabled');
            internal_test_utils_1.fireEvent.click(may);
            expect(onChange.callCount).to.equal(0);
            internal_test_utils_1.fireEvent.click(april);
            expect(onChange.callCount).to.equal(1);
        });
        it('should disable months if props.shouldDisableMonth returns true', function () {
            var onChange = (0, sinon_1.spy)();
            render(<MonthCalendar_1.MonthCalendar value={pickers_1.adapterToUse.date('2019-02-02')} onChange={onChange} shouldDisableMonth={function (month) { return pickers_1.adapterToUse.getMonth(month) === 3; }}/>);
            var april = internal_test_utils_1.screen.getByText('Apr', { selector: 'button' });
            var jun = internal_test_utils_1.screen.getByText('Jun', { selector: 'button' });
            expect(april).to.have.attribute('disabled');
            expect(jun).not.to.have.attribute('disabled');
            internal_test_utils_1.fireEvent.click(april);
            expect(onChange.callCount).to.equal(0);
            internal_test_utils_1.fireEvent.click(jun);
            expect(onChange.callCount).to.equal(1);
        });
        describe('with fake timers', function () {
            beforeEach(function () {
                vitest_1.vi.setSystemTime(new Date(2019, 0, 1));
            });
            afterEach(function () {
                vitest_1.vi.useRealTimers();
            });
            it('should disable months after initial render when "disableFuture" prop changes', function () { return __awaiter(void 0, void 0, void 0, function () {
                var setProps, january, february;
                return __generator(this, function (_a) {
                    setProps = render(<MonthCalendar_1.MonthCalendar />).setProps;
                    january = internal_test_utils_1.screen.getByText('Jan', { selector: 'button' });
                    february = internal_test_utils_1.screen.getByText('Feb', { selector: 'button' });
                    expect(january).not.to.have.attribute('disabled');
                    expect(february).not.to.have.attribute('disabled');
                    setProps({ disableFuture: true });
                    expect(january).not.to.have.attribute('disabled');
                    expect(february).to.have.attribute('disabled');
                    return [2 /*return*/];
                });
            }); });
        });
        it('should not mark the `referenceDate` month as selected', function () {
            render(<MonthCalendar_1.MonthCalendar referenceDate={pickers_1.adapterToUse.date('2018-02-02')}/>);
            expect(internal_test_utils_1.screen.getByRole('radio', { name: 'February', checked: false })).not.to.equal(null);
        });
    });
});
