"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MobileDateTimePicker_1 = require("@mui/x-date-pickers/MobileDateTimePicker");
var pickers_1 = require("test/utils/pickers");
describe('<MobileDateTimePicker /> - Field', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    var renderWithProps = (0, pickers_1.buildFieldInteractions)({
        render: render,
        Component: MobileDateTimePicker_1.MobileDateTimePicker,
    }).renderWithProps;
    it('should pass the ampm prop to the field', function () {
        var view = renderWithProps({
            enableAccessibleFieldDOMStructure: true,
            ampm: true,
        });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY hh:mm aa');
        view.setProps({ ampm: false });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'MM/DD/YYYY hh:mm');
    });
});
