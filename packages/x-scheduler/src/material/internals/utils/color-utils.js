"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorClassName = getColorClassName;
// TODO: Add support for event.color and props.color
function getColorClassName(parameters) {
    var _a;
    var resource = parameters.resource;
    var color = (_a = resource === null || resource === void 0 ? void 0 : resource.color) !== null && _a !== void 0 ? _a : 'primary';
    return "palette-".concat(color);
}
