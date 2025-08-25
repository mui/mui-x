"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDateTime = void 0;
var validateDate_1 = require("./validateDate");
var validateTime_1 = require("./validateTime");
var valueManagers_1 = require("../internals/utils/valueManagers");
var validateDateTime = function (_a) {
    var adapter = _a.adapter, value = _a.value, timezone = _a.timezone, props = _a.props;
    var dateValidationResult = (0, validateDate_1.validateDate)({
        adapter: adapter,
        value: value,
        timezone: timezone,
        props: props,
    });
    if (dateValidationResult !== null) {
        return dateValidationResult;
    }
    return (0, validateTime_1.validateTime)({
        adapter: adapter,
        value: value,
        timezone: timezone,
        props: props,
    });
};
exports.validateDateTime = validateDateTime;
exports.validateDateTime.valueManager = valueManagers_1.singleItemValueManager;
