"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var StaticDatePicker_1 = require("@mui/x-date-pickers/StaticDatePicker");
var pickers_1 = require("test/utils/pickers");
var skipIf_1 = require("test/utils/skipIf");
describe('<StaticDatePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    it('render proper month', function () {
        render(<StaticDatePicker_1.StaticDatePicker defaultValue={pickers_1.adapterToUse.date('2019-01-01')}/>);
        expect(internal_test_utils_1.screen.getByText('January 2019')).toBeVisible();
        expect(internal_test_utils_1.screen.getAllByTestId('day')).to.have.length(31);
    });
    it('switches between months', function () {
        render(<StaticDatePicker_1.StaticDatePicker reduceAnimations defaultValue={pickers_1.adapterToUse.date('2019-01-01')}/>);
        expect(internal_test_utils_1.screen.getByTestId('calendar-month-and-year-text')).to.have.text('January 2019');
        var nextMonth = internal_test_utils_1.screen.getByLabelText('Next month');
        var previousMonth = internal_test_utils_1.screen.getByLabelText('Previous month');
        internal_test_utils_1.fireEvent.click(nextMonth);
        internal_test_utils_1.fireEvent.click(nextMonth);
        internal_test_utils_1.fireEvent.click(previousMonth);
        internal_test_utils_1.fireEvent.click(previousMonth);
        internal_test_utils_1.fireEvent.click(previousMonth);
        expect(internal_test_utils_1.screen.getByTestId('calendar-month-and-year-text')).to.have.text('December 2018');
    });
    describe('props - autoFocus', function () {
        function Test(props) {
            return (<div id="pickerWrapper">
          <StaticDatePicker_1.StaticDatePicker {...props}/>
        </div>);
        }
        it.skipIf(skipIf_1.isJSDOM)('should take focus when `autoFocus=true`', function () {
            var _a;
            render(<Test autoFocus/>);
            var isInside = (_a = document.getElementById('pickerWrapper')) === null || _a === void 0 ? void 0 : _a.contains(document.activeElement);
            expect(isInside).to.equal(true);
        });
        it.skipIf(skipIf_1.isJSDOM)('should not take focus when `autoFocus=false`', function () {
            var _a;
            render(<Test />);
            var isInside = (_a = document.getElementById('pickerWrapper')) === null || _a === void 0 ? void 0 : _a.contains(document.activeElement);
            expect(isInside).to.equal(false);
        });
    });
});
