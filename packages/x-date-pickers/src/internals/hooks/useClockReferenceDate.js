"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClockReferenceDate = void 0;
var React = require("react");
var valueManagers_1 = require("../utils/valueManagers");
var date_utils_1 = require("../utils/date-utils");
var getDefaultReferenceDate_1 = require("../utils/getDefaultReferenceDate");
var useClockReferenceDate = function (_a) {
    var value = _a.value, referenceDateProp = _a.referenceDate, adapter = _a.adapter, props = _a.props, timezone = _a.timezone;
    var referenceDate = React.useMemo(function () {
        return valueManagers_1.singleItemValueManager.getInitialReferenceValue({
            value: value,
            adapter: adapter,
            props: props,
            referenceDate: referenceDateProp,
            granularity: getDefaultReferenceDate_1.SECTION_TYPE_GRANULARITY.day,
            timezone: timezone,
            getTodayDate: function () { return (0, date_utils_1.getTodayDate)(adapter, timezone, 'date'); },
        });
    }, // We want the `referenceDate` to update on prop and `timezone` change (https://github.com/mui/mui-x/issues/10804)
    [referenceDateProp, timezone]);
    return value !== null && value !== void 0 ? value : referenceDate;
};
exports.useClockReferenceDate = useClockReferenceDate;
