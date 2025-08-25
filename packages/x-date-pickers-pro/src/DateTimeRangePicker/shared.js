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
exports.useDateTimeRangePickerDefaultizedProps = useDateTimeRangePickerDefaultizedProps;
var styles_1 = require("@mui/material/styles");
var internals_1 = require("@mui/x-date-pickers/internals");
var hooks_1 = require("@mui/x-date-pickers/hooks");
var DateTimeRangePickerToolbar_1 = require("./DateTimeRangePickerToolbar");
var DateTimeRangePickerTabs_1 = require("./DateTimeRangePickerTabs");
function useDateTimeRangePickerDefaultizedProps(props, name) {
    var _a, _b;
    var adapter = (0, hooks_1.usePickerAdapter)();
    var themeProps = (0, styles_1.useThemeProps)({
        props: props,
        name: name,
    });
    var validationProps = (0, internals_1.useApplyDefaultValuesToDateTimeValidationProps)(themeProps);
    var ampm = (_a = themeProps.ampm) !== null && _a !== void 0 ? _a : adapter.is12HourCycleInCurrentLocale();
    var _c = (0, internals_1.applyDefaultViewProps)({
        views: themeProps.views,
        openTo: themeProps.openTo,
        defaultViews: ['day', 'hours', 'minutes'],
        defaultOpenTo: 'day',
    }), openTo = _c.openTo, defaultViews = _c.views;
    var _d = (0, internals_1.resolveTimeViewsResponse)({
        thresholdToRenderTimeInASingleColumn: themeProps.thresholdToRenderTimeInASingleColumn,
        ampm: ampm,
        timeSteps: themeProps.timeSteps,
        views: defaultViews,
    }), shouldRenderTimeInASingleColumn = _d.shouldRenderTimeInASingleColumn, thresholdToRenderTimeInASingleColumn = _d.thresholdToRenderTimeInASingleColumn, views = _d.views, timeSteps = _d.timeSteps;
    return __assign(__assign(__assign({}, themeProps), validationProps), { timeSteps: timeSteps, openTo: openTo, shouldRenderTimeInASingleColumn: shouldRenderTimeInASingleColumn, thresholdToRenderTimeInASingleColumn: thresholdToRenderTimeInASingleColumn, views: views, ampm: ampm, slots: __assign({ tabs: DateTimeRangePickerTabs_1.DateTimeRangePickerTabs, toolbar: DateTimeRangePickerToolbar_1.DateTimeRangePickerToolbar }, themeProps.slots), slotProps: __assign(__assign({}, themeProps.slotProps), { toolbar: __assign(__assign({}, (_b = themeProps.slotProps) === null || _b === void 0 ? void 0 : _b.toolbar), { ampm: ampm }) }) });
}
