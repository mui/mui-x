"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTimeRange = void 0;
var validation_1 = require("@mui/x-date-pickers/validation");
var date_utils_1 = require("../internals/utils/date-utils");
var valueManagers_1 = require("../internals/utils/valueManagers");
var validateTimeRange = function (_a) {
    var adapter = _a.adapter, value = _a.value, timezone = _a.timezone, props = _a.props;
    var start = value[0], end = value[1];
    var dateTimeValidations = [
        (0, validation_1.validateTime)({
            adapter: adapter,
            value: start,
            timezone: timezone,
            props: props,
        }),
        (0, validation_1.validateTime)({
            adapter: adapter,
            value: end,
            timezone: timezone,
            props: props,
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
exports.validateTimeRange = validateTimeRange;
exports.validateTimeRange.valueManager = valueManagers_1.rangeValueManager;
