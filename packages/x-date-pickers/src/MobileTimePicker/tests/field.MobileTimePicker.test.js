"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var MobileTimePicker_1 = require("@mui/x-date-pickers/MobileTimePicker");
describe('<MobileTimePicker /> - Field', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    var renderWithProps = (0, pickers_1.buildFieldInteractions)({
        render: render,
        Component: MobileTimePicker_1.MobileTimePicker,
    }).renderWithProps;
    it('should pass the ampm prop to the field', function () {
        var view = renderWithProps({ enableAccessibleFieldDOMStructure: true, ampm: true }, { componentFamily: 'picker' });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'hh:mm aa');
        view.setProps({ ampm: false });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'hh:mm');
    });
});
