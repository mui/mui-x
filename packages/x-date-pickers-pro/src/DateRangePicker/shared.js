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
exports.useDateRangePickerDefaultizedProps = useDateRangePickerDefaultizedProps;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var internals_1 = require("@mui/x-date-pickers/internals");
var DateRangePickerToolbar_1 = require("./DateRangePickerToolbar");
function useDateRangePickerDefaultizedProps(props, name) {
    var themeProps = (0, styles_1.useThemeProps)({
        props: props,
        name: name,
    });
    var validationProps = (0, internals_1.useApplyDefaultValuesToDateValidationProps)(themeProps);
    var localeText = React.useMemo(function () {
        var _a;
        if (((_a = themeProps.localeText) === null || _a === void 0 ? void 0 : _a.toolbarTitle) == null) {
            return themeProps.localeText;
        }
        return __assign(__assign({}, themeProps.localeText), { dateRangePickerToolbarTitle: themeProps.localeText.toolbarTitle });
    }, [themeProps.localeText]);
    return __assign(__assign(__assign({}, themeProps), validationProps), { localeText: localeText, slots: __assign({ toolbar: DateRangePickerToolbar_1.DateRangePickerToolbar }, themeProps.slots) });
}
