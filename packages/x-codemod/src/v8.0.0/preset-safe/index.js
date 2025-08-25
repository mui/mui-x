"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var preset_safe_1 = require("../tree-view/preset-safe");
var preset_safe_2 = require("../pickers/preset-safe");
var preset_safe_3 = require("../charts/preset-safe");
var preset_safe_4 = require("../data-grid/preset-safe");
function transformer(file, api, options) {
    file.source = (0, preset_safe_1.default)(file, api, options);
    file.source = (0, preset_safe_2.default)(file, api, options);
    file.source = (0, preset_safe_3.default)(file, api, options);
    file.source = (0, preset_safe_4.default)(file, api, options);
    return file.source;
}
