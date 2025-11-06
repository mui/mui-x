"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeGridClasses = composeGridClasses;
var composeClasses_1 = require("@mui/utils/composeClasses");
var gridClasses_1 = require("../constants/gridClasses");
function composeGridClasses(classes, slots) {
    return (0, composeClasses_1.default)(slots, gridClasses_1.getDataGridUtilityClass, classes);
}
