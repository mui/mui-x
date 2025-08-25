"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNow = exports.useDefaultDates = void 0;
var React = require("react");
var usePickerAdapter_1 = require("../../hooks/usePickerAdapter");
var useDefaultDates = function () { return (0, usePickerAdapter_1.useLocalizationContext)().defaultDates; };
exports.useDefaultDates = useDefaultDates;
var useNow = function (timezone) {
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var now = React.useRef(undefined);
    if (now.current === undefined) {
        now.current = adapter.date(undefined, timezone);
    }
    return now.current;
};
exports.useNow = useNow;
