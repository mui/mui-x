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
var DesktopTimePicker_1 = require("@mui/x-date-pickers/DesktopTimePicker");
describe('<DesktopTimePicker /> - Field', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    var renderWithProps = (0, pickers_1.buildFieldInteractions)({
        render: render,
        Component: DesktopTimePicker_1.DesktopTimePicker,
    }).renderWithProps;
    it('should pass the ampm prop to the field', function () {
        var view = renderWithProps({ enableAccessibleFieldDOMStructure: true, ampm: true }, { componentFamily: 'picker' });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'hh:mm aa');
        view.setProps({ ampm: false });
        (0, pickers_1.expectFieldValueV7)(view.getSectionsContainer(), 'hh:mm');
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
        testFormat({ views: ['hours'], ampm: false }, 'hh');
        testFormat({ views: ['hours'], ampm: true }, 'hh aa');
        testFormat({ views: ['minutes'] }, 'mm');
        testFormat({ views: ['seconds'] }, 'ss');
        testFormat({ views: ['hours', 'minutes'], ampm: false }, 'hh:mm');
        testFormat({ views: ['hours', 'minutes'], ampm: true }, 'hh:mm aa');
        testFormat({ views: ['minutes', 'seconds'] }, 'mm:ss');
        testFormat({ views: ['hours', 'minutes', 'seconds'], ampm: false }, 'hh:mm:ss');
        testFormat({ views: ['hours', 'minutes', 'seconds'], ampm: true }, 'hh:mm:ss aa');
    });
});
