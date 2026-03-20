"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsFineMainPointer = void 0;
exports.utcFormatter = utcFormatter;
var useMediaQuery_1 = require("@mui/material/useMediaQuery");
function utcFormatter(v) {
    if (v instanceof Date) {
        return v.toUTCString();
    }
    return v.toLocaleString();
}
// Taken from @mui/x-date-time-pickers
var mainPointerFineMediaQuery = '@media (pointer: fine)';
/**
 * Returns true if the main pointer is fine (e.g. mouse).
 * This is useful for determining how to position tooltips or other UI elements based on the type of input device.
 * @returns true if the main pointer is fine, false otherwise.
 */
var useIsFineMainPointer = function () {
    return (0, useMediaQuery_1.default)(mainPointerFineMediaQuery, { defaultMatches: true });
};
exports.useIsFineMainPointer = useIsFineMainPointer;
