"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var pickers_1 = require("test/utils/pickers");
var DesktopDateTimePicker_1 = require("@mui/x-date-pickers/DesktopDateTimePicker");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DesktopDateTimePicker /> - Describe Conformance', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    it('should respect the `localeText` prop', function () {
        render(<DesktopDateTimePicker_1.DesktopDateTimePicker open localeText={{ cancelButtonLabel: 'Custom cancel' }} slotProps={{ actionBar: { actions: ['cancel'] } }}/>);
        expect(internal_test_utils_1.screen.queryByText('Custom cancel')).not.to.equal(null);
    });
    (0, pickers_1.describePicker)(DesktopDateTimePicker_1.DesktopDateTimePicker, { render: render, fieldType: 'single-input', variant: 'desktop' });
    (0, describeConformance_1.describeConformance)(<DesktopDateTimePicker_1.DesktopDateTimePicker />, function () { return ({
        classes: {},
        render: render,
        muiName: 'MuiDesktopDateTimePicker',
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
});
