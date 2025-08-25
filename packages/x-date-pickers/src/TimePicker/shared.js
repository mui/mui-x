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
exports.useTimePickerDefaultizedProps = useTimePickerDefaultizedProps;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var TimePickerToolbar_1 = require("./TimePickerToolbar");
var views_1 = require("../internals/utils/views");
var useTimeManager_1 = require("../managers/useTimeManager");
var usePickerAdapter_1 = require("../hooks/usePickerAdapter");
function useTimePickerDefaultizedProps(props, name) {
    var _a, _b;
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var themeProps = (0, styles_1.useThemeProps)({
        props: props,
        name: name,
    });
    var validationProps = (0, useTimeManager_1.useApplyDefaultValuesToTimeValidationProps)(themeProps);
    var ampm = (_a = themeProps.ampm) !== null && _a !== void 0 ? _a : adapter.is12HourCycleInCurrentLocale();
    var localeText = React.useMemo(function () {
        var _a;
        if (((_a = themeProps.localeText) === null || _a === void 0 ? void 0 : _a.toolbarTitle) == null) {
            return themeProps.localeText;
        }
        return __assign(__assign({}, themeProps.localeText), { timePickerToolbarTitle: themeProps.localeText.toolbarTitle });
    }, [themeProps.localeText]);
    return __assign(__assign(__assign(__assign(__assign({}, themeProps), validationProps), { ampm: ampm, localeText: localeText }), (0, views_1.applyDefaultViewProps)({
        views: themeProps.views,
        openTo: themeProps.openTo,
        defaultViews: ['hours', 'minutes'],
        defaultOpenTo: 'hours',
    })), { slots: __assign({ toolbar: TimePickerToolbar_1.TimePickerToolbar }, themeProps.slots), slotProps: __assign(__assign({}, themeProps.slotProps), { toolbar: __assign({ ampm: ampm, ampmInClock: themeProps.ampmInClock }, (_b = themeProps.slotProps) === null || _b === void 0 ? void 0 : _b.toolbar) }) });
}
