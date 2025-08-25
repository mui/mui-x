"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDateField = void 0;
var useField_1 = require("../internals/hooks/useField");
var managers_1 = require("../managers");
var useDateField = function (props) {
    var manager = (0, managers_1.useDateManager)(props);
    return (0, useField_1.useField)({ manager: manager, props: props });
};
exports.useDateField = useDateField;
