"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var StaticDateTimePicker_1 = require("@mui/x-date-pickers/StaticDateTimePicker");
var pickers_1 = require("test/utils/pickers");
var DateTimePicker_1 = require("../../DateTimePicker");
describe('<StaticDateTimePicker />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    it('should allow to select the same day', function () {
        var onChange = (0, sinon_1.spy)();
        render(<StaticDateTimePicker_1.StaticDateTimePicker onChange={onChange} defaultValue={pickers_1.adapterToUse.date('2018-01-01')}/>);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('gridcell', { name: '1' }));
        expect(onChange.callCount).to.equal(1);
    });
    describe('Component slot: Tabs', function () {
        it('should not render tabs when `hidden` is `true`', function () {
            render(<StaticDateTimePicker_1.StaticDateTimePicker slotProps={{
                    tabs: { hidden: true },
                }}/>);
            expect(internal_test_utils_1.screen.queryByTestId('picker-toolbar-title')).not.to.equal(null);
            expect(internal_test_utils_1.screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
        });
        it('should render tabs when `hidden` is `false`', function () {
            render(<StaticDateTimePicker_1.StaticDateTimePicker displayStaticWrapperAs="desktop" slotProps={{
                    tabs: { hidden: false },
                }}/>);
            expect(internal_test_utils_1.screen.queryByTestId('picker-toolbar-title')).to.equal(null);
            expect(internal_test_utils_1.screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
        });
        it('should render custom component', function () {
            function CustomPickerTabs(props) {
                return (<React.Fragment>
            <DateTimePicker_1.DateTimePickerTabs {...props}/>
            <span>test-custom-picker-tabs</span>
          </React.Fragment>);
            }
            render(<StaticDateTimePicker_1.StaticDateTimePicker displayStaticWrapperAs="mobile" slots={{ tabs: CustomPickerTabs }}/>);
            expect(internal_test_utils_1.screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
            expect(internal_test_utils_1.screen.getByText('test-custom-picker-tabs')).not.to.equal(null);
        });
    });
});
