"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var DateRangePickerDay_1 = require("@mui/x-date-pickers-pro/DateRangePickerDay");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DateRangePickerDay />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<DateRangePickerDay_1.DateRangePickerDay day={pickers_1.adapterToUse.date()} outsideCurrentMonth={false} selected onDaySelect={function () { }} isHighlighting isPreviewing isStartOfPreviewing isEndOfPreviewing isStartOfHighlighting isEndOfHighlighting isFirstVisibleCell isLastVisibleCell={false}/>, function () { return ({
        classes: DateRangePickerDay_1.dateRangePickerDayClasses,
        inheritComponent: 'button',
        muiName: 'MuiDateRangePickerDay',
        render: render,
        refInstanceof: window.HTMLButtonElement,
        // cannot test reactTestRenderer because of required context
        skip: [
            'componentProp',
            'rootClass', // forwards classes to DateRangePickerDayDay, but applies root class on DateRangePickerDayRoot
            'mergeClassName', // forwards other props (i.e. data-test-id) to the DateRangePickerDayDay, but `className` is applied on the root
            'componentsProp',
            // TODO: Fix DateRangePickerDays is not spreading props on root
            'themeDefaultProps',
            'themeVariants',
        ],
    }); });
});
