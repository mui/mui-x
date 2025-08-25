"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var PickersActionBar_1 = require("@mui/x-date-pickers/PickersActionBar");
var pickers_1 = require("test/utils/pickers");
var usePickerContext_1 = require("../hooks/usePickerContext");
describe('<PickersActionBar />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    var renderWithContext = function (element) {
        var spys = {
            setValue: (0, sinon_1.spy)(),
            setView: (0, sinon_1.spy)(),
            setOpen: (0, sinon_1.spy)(),
            clearValue: (0, sinon_1.spy)(),
            setValueToToday: (0, sinon_1.spy)(),
            acceptValueChanges: (0, sinon_1.spy)(),
            cancelValueChanges: (0, sinon_1.spy)(),
            goToNextStep: (0, sinon_1.spy)(),
            goToPreviousStep: (0, sinon_1.spy)(),
            hasNextStep: false,
        };
        render(<usePickerContext_1.PickerContext.Provider value={spys}>{element}</usePickerContext_1.PickerContext.Provider>);
        return spys;
    };
    it('should not render buttons if actions array is empty', function () {
        renderWithContext(<PickersActionBar_1.PickersActionBar actions={[]}/>);
        expect(internal_test_utils_1.screen.queryByRole('button')).to.equal(null);
    });
    it('should render button for "clear" action calling the associated callback', function () {
        var clearValue = renderWithContext(<PickersActionBar_1.PickersActionBar actions={['clear']}/>).clearValue;
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/clear/i));
        expect(clearValue.callCount).to.equal(1);
    });
    it('should render button for "cancel" action calling the associated callback', function () {
        var cancelValueChanges = renderWithContext(<PickersActionBar_1.PickersActionBar actions={['cancel']}/>).cancelValueChanges;
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/cancel/i));
        expect(cancelValueChanges.callCount).to.equal(1);
    });
    it('should render button for "accept" action calling the associated callback', function () {
        var acceptValueChanges = renderWithContext(<PickersActionBar_1.PickersActionBar actions={['accept']}/>).acceptValueChanges;
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/ok/i));
        expect(acceptValueChanges.callCount).to.equal(1);
    });
    it('should render button for "today" action calling the associated callback', function () {
        var setValueToToday = renderWithContext(<PickersActionBar_1.PickersActionBar actions={['today']}/>).setValueToToday;
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByText(/today/i));
        expect(setValueToToday.callCount).to.equal(1);
    });
    it('should respect actions order', function () {
        renderWithContext(<PickersActionBar_1.PickersActionBar actions={['today', 'accept', 'clear', 'cancel']}/>);
        var buttons = internal_test_utils_1.screen.getAllByRole('button');
        expect(buttons[0]).to.have.text('Today');
        expect(buttons[1]).to.have.text('OK');
        expect(buttons[2]).to.have.text('Clear');
        expect(buttons[3]).to.have.text('Cancel');
    });
});
