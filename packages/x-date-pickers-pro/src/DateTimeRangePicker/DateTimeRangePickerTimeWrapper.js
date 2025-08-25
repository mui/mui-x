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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeRangePickerTimeWrapper = DateTimeRangePickerTimeWrapper;
var hooks_1 = require("@mui/x-date-pickers/hooks");
var date_utils_1 = require("../internals/utils/date-utils");
var date_range_manager_1 = require("../internals/utils/date-range-manager");
var hooks_2 = require("../hooks");
/**
 * @ignore - internal component.
 */
function DateTimeRangePickerTimeWrapper(props) {
    var _a, _b;
    var adapter = (0, hooks_1.usePickerAdapter)();
    var viewRenderer = props.viewRenderer, value = props.value, onChange = props.onChange, defaultValue = props.defaultValue, onViewChange = props.onViewChange, views = props.views, className = props.className, referenceDateProp = props.referenceDate, other = __rest(props, ["viewRenderer", "value", "onChange", "defaultValue", "onViewChange", "views", "className", "referenceDate"]);
    var rangePosition = (0, hooks_2.usePickerRangePositionContext)().rangePosition;
    if (!viewRenderer) {
        return null;
    }
    var currentValue = (_a = (rangePosition === 'start' ? value === null || value === void 0 ? void 0 : value[0] : value === null || value === void 0 ? void 0 : value[1])) !== null && _a !== void 0 ? _a : null;
    var currentDefaultValue = (_b = (rangePosition === 'start' ? defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue[0] : defaultValue === null || defaultValue === void 0 ? void 0 : defaultValue[1])) !== null && _b !== void 0 ? _b : null;
    var referenceDate = (0, date_range_manager_1.resolveReferenceDate)(referenceDateProp, rangePosition);
    var handleOnChange = function (newDate, selectionState, selectedView) {
        if (!onChange || !value) {
            return;
        }
        var newRange = (0, date_range_manager_1.calculateRangeChange)({
            newDate: newDate,
            adapter: adapter,
            range: value,
            rangePosition: rangePosition,
        }).newRange;
        var isFullRangeSelected = rangePosition === 'end' && (0, date_utils_1.isRangeValid)(adapter, newRange);
        onChange(newRange, isFullRangeSelected ? 'finish' : 'partial', selectedView);
    };
    return viewRenderer(__assign(__assign({}, other), { referenceDate: referenceDate, views: views, onViewChange: onViewChange, value: currentValue, onChange: handleOnChange, defaultValue: currentDefaultValue }));
}
