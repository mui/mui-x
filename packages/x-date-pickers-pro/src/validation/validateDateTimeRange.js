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
exports.validateDateTimeRange = void 0;
var validation_1 = require("@mui/x-date-pickers/validation");
var date_utils_1 = require("../internals/utils/date-utils");
var valueManagers_1 = require("../internals/utils/valueManagers");
var validateDateTimeRange = function (_a) {
    var adapter = _a.adapter, value = _a.value, timezone = _a.timezone, props = _a.props;
    var start = value[0], end = value[1];
    var shouldDisableDate = props.shouldDisableDate, otherProps = __rest(props, ["shouldDisableDate"]);
    var dateTimeValidations = [
        (0, validation_1.validateDateTime)({
            adapter: adapter,
            value: start,
            timezone: timezone,
            props: __assign(__assign({}, otherProps), { shouldDisableDate: function (day) { return !!(shouldDisableDate === null || shouldDisableDate === void 0 ? void 0 : shouldDisableDate(day, 'start')); } }),
        }),
        (0, validation_1.validateDateTime)({
            adapter: adapter,
            value: end,
            timezone: timezone,
            props: __assign(__assign({}, otherProps), { shouldDisableDate: function (day) { return !!(shouldDisableDate === null || shouldDisableDate === void 0 ? void 0 : shouldDisableDate(day, 'end')); } }),
        }),
    ];
    if (dateTimeValidations[0] || dateTimeValidations[1]) {
        return dateTimeValidations;
    }
    // for partial input
    if (start === null || end === null) {
        return [null, null];
    }
    if (!(0, date_utils_1.isRangeValid)(adapter, value)) {
        return ['invalidRange', 'invalidRange'];
    }
    return [null, null];
};
exports.validateDateTimeRange = validateDateTimeRange;
exports.validateDateTimeRange.valueManager = valueManagers_1.rangeValueManager;
