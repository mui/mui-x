"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var date_fns_1 = require("date-fns");
var StaticDateRangePicker_1 = require("@mui/x-date-pickers-pro/StaticDateRangePicker");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<StaticDateRangePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<StaticDateRangePicker_1.StaticDateRangePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiStaticDateRangePicker',
        refInstanceof: window.HTMLDivElement,
        skip: [
            'componentProp',
            'componentsProp',
            'themeDefaultProps',
            'themeStyleOverrides',
            'themeVariants',
            'mergeClassName',
            'propsSpread',
        ],
    }); });
    (0, pickers_1.describeRangeValidation)(StaticDateRangePicker_1.StaticDateRangePicker, function () { return ({
        render: render,
        componentFamily: 'static-picker',
        views: ['day'],
        variant: 'mobile',
        fieldType: 'no-input',
    }); });
    it('allows disabling dates', function () {
        render(<StaticDateRangePicker_1.StaticDateRangePicker minDate={pickers_1.adapterToUse.date('2005-01-01')} shouldDisableDate={date_fns_1.isWeekend} defaultValue={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-31')]}/>);
        expect(internal_test_utils_1.screen
            .getAllByTestId('DateRangePickerDay')
            .filter(function (day) { return day.getAttribute('disabled') !== undefined; })).to.have.length(31);
    });
    it('should render the correct a11y tree structure', function () {
        render(<StaticDateRangePicker_1.StaticDateRangePicker defaultValue={[pickers_1.adapterToUse.date('2018-01-01'), pickers_1.adapterToUse.date('2018-01-31')]}/>);
        // It should follow https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
        expect(document.querySelector('[role="grid"] [role="rowgroup"] > [role="row"] [role="gridcell"][data-testid="DateRangePickerDay"]')).to.have.text('1');
    });
});
