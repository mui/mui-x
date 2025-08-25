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
var PickersDay_1 = require("@mui/x-date-pickers/PickersDay");
var DayCalendarSkeleton_1 = require("@mui/x-date-pickers/DayCalendarSkeleton");
var MobileDatePicker_1 = require("@mui/x-date-pickers/MobileDatePicker");
var pickers_1 = require("test/utils/pickers");
describe('<MobileDatePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    var renderWithProps = (0, pickers_1.buildFieldInteractions)({
        render: render,
        Component: MobileDatePicker_1.MobileDatePicker,
    }).renderWithProps;
    it('allows to change only year', function () {
        var onChangeMock = (0, sinon_1.spy)();
        render(<MobileDatePicker_1.MobileDatePicker open value={pickers_1.adapterToUse.date('2019-01-01')} onChange={onChangeMock}/>);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByLabelText(/switch to year view/i));
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('2010', { selector: 'button' }));
        expect(internal_test_utils_1.screen.getAllByTestId('calendar-month-and-year-text')[0]).to.have.text('January 2010');
        expect(onChangeMock.callCount).to.equal(1);
    });
    it('allows to select edge years from list', function () {
        render(<MobileDatePicker_1.MobileDatePicker open reduceAnimations openTo="year" minDate={pickers_1.adapterToUse.date('2000-01-01')} maxDate={pickers_1.adapterToUse.date('2010-01-01')}/>);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('2010', { selector: 'button' }));
        expect(internal_test_utils_1.screen.getByTestId('datepicker-toolbar-date')).to.have.text('Fri, Jan 1');
    });
    it('prop `onMonthChange` – dispatches callback when months switching', function () {
        var onMonthChangeMock = (0, sinon_1.spy)();
        render(<MobileDatePicker_1.MobileDatePicker open onMonthChange={onMonthChangeMock}/>);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByLabelText('Next month'));
        expect(onMonthChangeMock.callCount).to.equal(1);
    });
    it('prop `loading` – displays default loading indicator', function () {
        render(<MobileDatePicker_1.MobileDatePicker open loading/>);
        expect(internal_test_utils_1.screen.queryAllByTestId('day')).to.have.length(0);
        expect(internal_test_utils_1.screen.getByTestId('loading-progress')).toBeVisible();
    });
    it('prop `renderLoading` – displays custom loading indicator', function () {
        render(<MobileDatePicker_1.MobileDatePicker loading renderLoading={function () { return <DayCalendarSkeleton_1.DayCalendarSkeleton data-testid="custom-loading"/>; }} open/>);
        expect(internal_test_utils_1.screen.queryByTestId('loading-progress')).to.equal(null);
        expect(internal_test_utils_1.screen.getByTestId('custom-loading')).toBeVisible();
    });
    describe('Component slot: Toolbar', function () {
        it('should render custom toolbar component', function () {
            render(<MobileDatePicker_1.MobileDatePicker open slots={{
                    toolbar: function () { return <div data-testid="custom-toolbar"/>; },
                }}/>);
            expect(internal_test_utils_1.screen.getByTestId('custom-toolbar')).toBeVisible();
        });
        it('should format toolbar according to `toolbarFormat` prop', function () {
            render(<MobileDatePicker_1.MobileDatePicker open defaultValue={pickers_1.adapterToUse.date('2018-01-01')} slotProps={{
                    toolbar: {
                        toolbarFormat: 'MMMM',
                    },
                }}/>);
            expect(internal_test_utils_1.screen.getByTestId('datepicker-toolbar-date').textContent).to.equal('January');
        });
        it('should render the toolbar when `hidden` is `false`', function () {
            render(<MobileDatePicker_1.MobileDatePicker open slotProps={{ toolbar: { hidden: false } }}/>);
            expect(internal_test_utils_1.screen.getByTestId('picker-toolbar')).toBeVisible();
        });
    });
    describe('Component slot: Day', function () {
        it('should render custom day', function () {
            render(<MobileDatePicker_1.MobileDatePicker open defaultValue={pickers_1.adapterToUse.date('2018-01-01')} slots={{
                    day: function (props) { return <PickersDay_1.PickersDay {...props} data-testid="test-day"/>; },
                }}/>);
            expect(internal_test_utils_1.screen.getAllByTestId('test-day')).to.have.length(31);
        });
    });
    describe('picker state', function () {
        it('should call `onAccept` even if controlled', function () {
            var onAccept = (0, sinon_1.spy)();
            function ControlledMobileDatePicker(props) {
                var _a = React.useState(null), value = _a[0], setValue = _a[1];
                return <MobileDatePicker_1.MobileDatePicker {...props} value={value} onChange={setValue}/>;
            }
            render(<ControlledMobileDatePicker onAccept={onAccept}/>);
            (0, pickers_1.openPicker)({ type: 'date' });
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('15', { selector: 'button' }));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText('OK', { selector: 'button' }));
            expect(onAccept.callCount).to.equal(1);
        });
        it('should update internal state when controlled value is updated', function () { return __awaiter(void 0, void 0, void 0, function () {
            var view;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        view = renderWithProps({
                            enableAccessibleFieldDOMStructure: true,
                            value: pickers_1.adapterToUse.date('2019-01-01'),
                        });
                        // Set a date
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), '01/01/2019');
                        // Clean value using external control
                        view.setProps({ value: null });
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY');
                        // Open and Dismiss the picker
                        (0, pickers_1.openPicker)({ type: 'date' });
                        return [4 /*yield*/, view.user.keyboard('[Escape]')];
                    case 1:
                        _a.sent();
                        // Verify it's still a clean value
                        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
