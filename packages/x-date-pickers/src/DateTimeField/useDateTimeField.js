"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDateTimeField = void 0;
var useField_1 = require("../internals/hooks/useField");
var managers_1 = require("../managers");
var useDateTimeField = function (props) {
    var manager = (0, managers_1.useDateTimeManager)(props);
    return (0, useField_1.useField)({ manager: manager, props: props });
};
exports.useDateTimeField = useDateTimeField;
