"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var ButtonBase_1 = require("@mui/material/ButtonBase");
var PickersDay_1 = require("@mui/x-date-pickers/PickersDay");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<PickersDay />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<PickersDay_1.PickersDay day={pickers_1.adapterToUse.date()} outsideCurrentMonth={false} isFirstVisibleCell={false} isLastVisibleCell={false} selected onDaySelect={function () { }}/>, function () { return ({
        classes: PickersDay_1.pickersDayClasses,
        inheritComponent: ButtonBase_1.default,
        render: render,
        muiName: 'MuiPickersDay',
        refInstanceof: window.HTMLButtonElement,
        testVariantProps: { variant: 'disableMargin' },
        skip: ['componentProp', 'componentsProp'],
    }); });
    it('selects the date on click, Enter and Space', function () {
        var handleDaySelect = (0, sinon_1.spy)();
        var day = pickers_1.adapterToUse.date();
        render(<PickersDay_1.PickersDay day={day} outsideCurrentMonth={false} isFirstVisibleCell={false} isLastVisibleCell={false} onDaySelect={handleDaySelect}/>);
        var targetDay = internal_test_utils_1.screen.getByRole('button', { name: pickers_1.adapterToUse.format(day, 'dayOfMonth') });
        // A native button implies Enter and Space keydown behavior
        // These keydown events only trigger click behavior if they're trusted (programmatically dispatched events aren't trusted).
        // If this breaks, make sure to add tests for
        // - fireEvent.keyDown(targetDay, { key: 'Enter' })
        // - fireEvent.keyUp(targetDay, { key: 'Space' })
        expect(targetDay.tagName).to.equal('BUTTON');
        internal_test_utils_1.fireEvent.click(targetDay);
        expect(handleDaySelect.callCount).to.equal(1);
        expect(handleDaySelect.args[0][0]).toEqualDateTime(day);
    });
    it('renders the day of the month by default', function () {
        render(<PickersDay_1.PickersDay day={pickers_1.adapterToUse.date('2020-02-02T02:02:02.000')} onDaySelect={function () { }} outsideCurrentMonth={false} isFirstVisibleCell={false} isLastVisibleCell={false}/>);
        var day = internal_test_utils_1.screen.getByRole('button');
        expect(day).to.have.text('2');
        expect(day).toHaveAccessibleName('2');
    });
    it('should render children instead of the day of the month when children prop is present', function () {
        render(<PickersDay_1.PickersDay day={pickers_1.adapterToUse.date('2020-02-02T02:02:02.000')} outsideCurrentMonth={false} isFirstVisibleCell={false} isLastVisibleCell={false} onDaySelect={function () { }}>
        2 (free)
      </PickersDay_1.PickersDay>);
        var day = internal_test_utils_1.screen.getByRole('button');
        expect(day).to.have.text('2 (free)');
        expect(day).toHaveAccessibleName('2 (free)');
    });
});
