"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSingleInputDateTimeRangeField = void 0;
var internals_1 = require("@mui/x-date-pickers/internals");
var managers_1 = require("../managers");
var useSingleInputDateTimeRangeField = function (props) {
    var manager = (0, managers_1.useDateTimeRangeManager)(props);
    return (0, internals_1.useField)({ manager: manager, props: props });
};
exports.useSingleInputDateTimeRangeField = useSingleInputDateTimeRangeField;
