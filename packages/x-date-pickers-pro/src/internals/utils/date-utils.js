"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRange = exports.isEndOfRange = exports.isStartOfRange = exports.isWithinRange = exports.isRangeValid = void 0;
var isRangeValid = function (adapter, range) {
    return (adapter.isValid(range[0]) && adapter.isValid(range[1]) && !adapter.isBefore(range[1], range[0]));
};
exports.isRangeValid = isRangeValid;
var isWithinRange = function (adapter, day, range) {
    return (0, exports.isRangeValid)(adapter, range) && adapter.isWithinRange(day, range);
};
exports.isWithinRange = isWithinRange;
var isStartOfRange = function (adapter, day, range) {
    return (0, exports.isRangeValid)(adapter, range) && adapter.isSameDay(day, range[0]);
};
exports.isStartOfRange = isStartOfRange;
var isEndOfRange = function (adapter, day, range) {
    return (0, exports.isRangeValid)(adapter, range) && adapter.isSameDay(day, range[1]);
};
exports.isEndOfRange = isEndOfRange;
var formatRange = function (adapter, range, formatKey) {
    if (!(0, exports.isRangeValid)(adapter, range)) {
        return null;
    }
    return "".concat(adapter.format(range[0], formatKey), " - ").concat(adapter.format(range[1], formatKey));
};
exports.formatRange = formatRange;
