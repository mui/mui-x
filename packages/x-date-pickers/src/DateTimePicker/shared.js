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
exports.useDateTimePickerDefaultizedProps = useDateTimePickerDefaultizedProps;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var usePickerAdapter_1 = require("../hooks/usePickerAdapter");
var DateTimePickerTabs_1 = require("./DateTimePickerTabs");
var DateTimePickerToolbar_1 = require("./DateTimePickerToolbar");
var views_1 = require("../internals/utils/views");
var date_time_utils_1 = require("../internals/utils/date-time-utils");
var useDateTimeManager_1 = require("../managers/useDateTimeManager");
function useDateTimePickerDefaultizedProps(props, name) {
    var _a, _b, _c;
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var themeProps = (0, styles_1.useThemeProps)({
        props: props,
        name: name,
    });
    var validationProps = (0, useDateTimeManager_1.useApplyDefaultValuesToDateTimeValidationProps)(themeProps);
    var ampm = (_a = themeProps.ampm) !== null && _a !== void 0 ? _a : adapter.is12HourCycleInCurrentLocale();
    var localeText = React.useMemo(function () {
        var _a;
        if (((_a = themeProps.localeText) === null || _a === void 0 ? void 0 : _a.toolbarTitle) == null) {
            return themeProps.localeText;
        }
        return __assign(__assign({}, themeProps.localeText), { dateTimePickerToolbarTitle: themeProps.localeText.toolbarTitle });
    }, [themeProps.localeText]);
    var _d = (0, views_1.applyDefaultViewProps)({
        views: themeProps.views,
        openTo: themeProps.openTo,
        defaultViews: ['year', 'day', 'hours', 'minutes'],
        defaultOpenTo: 'day',
    }), openTo = _d.openTo, defaultViews = _d.views;
    var _e = (0, date_time_utils_1.resolveTimeViewsResponse)({
        thresholdToRenderTimeInASingleColumn: themeProps.thresholdToRenderTimeInASingleColumn,
        ampm: ampm,
        timeSteps: themeProps.timeSteps,
        views: defaultViews,
    }), shouldRenderTimeInASingleColumn = _e.shouldRenderTimeInASingleColumn, thresholdToRenderTimeInASingleColumn = _e.thresholdToRenderTimeInASingleColumn, views = _e.views, timeSteps = _e.timeSteps;
    return __assign(__assign(__assign({}, themeProps), validationProps), { timeSteps: timeSteps, openTo: openTo, shouldRenderTimeInASingleColumn: shouldRenderTimeInASingleColumn, thresholdToRenderTimeInASingleColumn: thresholdToRenderTimeInASingleColumn, views: views, ampm: ampm, localeText: localeText, orientation: (_b = themeProps.orientation) !== null && _b !== void 0 ? _b : 'portrait', slots: __assign({ toolbar: DateTimePickerToolbar_1.DateTimePickerToolbar, tabs: DateTimePickerTabs_1.DateTimePickerTabs }, themeProps.slots), slotProps: __assign(__assign({}, themeProps.slotProps), { toolbar: __assign({ ampm: ampm }, (_c = themeProps.slotProps) === null || _c === void 0 ? void 0 : _c.toolbar) }) });
}
