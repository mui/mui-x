"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var DateRangePickerDay2_1 = require("@mui/x-date-pickers-pro/DateRangePickerDay2");
var pickers_1 = require("test/utils/pickers");
var describeConformance_1 = require("test/utils/describeConformance");
describe('<DateRangePickerDay2 />', function () {
    var render = (0, pickers_1.createPickerRenderer)().render;
    (0, describeConformance_1.describeConformance)(<DateRangePickerDay2_1.DateRangePickerDay2 day={pickers_1.adapterToUse.date()} outsideCurrentMonth={false} selected onDaySelect={function () { }} isHighlighting isPreviewing isStartOfPreviewing isEndOfPreviewing isStartOfHighlighting isEndOfHighlighting isFirstVisibleCell isLastVisibleCell={false}/>, function () { return ({
        classes: DateRangePickerDay2_1.dateRangePickerDay2Classes,
        inheritComponent: 'button',
        muiName: 'MuiDateRangePickerDay2',
        render: render,
        refInstanceof: window.HTMLButtonElement,
        // cannot test reactTestRenderer because of required context
        skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }); });
});
