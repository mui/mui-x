"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var pickers_1 = require("test/utils/pickers");
var DesktopDateTimePicker_1 = require("@mui/x-date-pickers/DesktopDateTimePicker");
describe('<DesktopDateTimePicker /> - Field', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    var renderWithProps = (0, pickers_1.buildFieldInteractions)({
        render: render,
        Component: DesktopDateTimePicker_1.DesktopDateTimePicker,
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
    it('should adapt the default field format based on the props of the picker', function () {
        var testFormat = function (props, expectedFormat) {
            // Test with accessible DOM structure
            var view = renderWithProps(__assign(__assign({}, props), { enableAccessibleFieldDOMStructure: true }), { componentFamily: 'picker' });
            (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), expectedFormat);
            view.unmount();
            // Test with non-accessible DOM structure
            view = renderWithProps(__assign(__assign({}, props), { enableAccessibleFieldDOMStructure: false }), { componentFamily: 'picker' });
            var input = (0, pickers_1.getTextbox)();
            (0, pickers_1.expectFieldPlaceholderV6)(input, expectedFormat);
            view.unmount();
        };
        testFormat({ views: ['day', 'hours', 'minutes'], ampm: false }, 'DD hh:mm');
        testFormat({ views: ['day', 'hours', 'minutes'], ampm: true }, 'DD hh:mm aa');
        testFormat({ views: ['day', 'hours', 'minutes', 'seconds'], ampm: false }, 'DD hh:mm:ss');
        testFormat({ views: ['day', 'hours', 'minutes', 'seconds'], ampm: true }, 'DD hh:mm:ss aa');
        testFormat({ views: ['year', 'month', 'day', 'hours', 'minutes', 'seconds'], ampm: false }, 'MM/DD/YYYY hh:mm:ss');
        testFormat({ views: ['year', 'month', 'day', 'hours', 'minutes', 'seconds'], ampm: true }, 'MM/DD/YYYY hh:mm:ss aa');
    });
});
