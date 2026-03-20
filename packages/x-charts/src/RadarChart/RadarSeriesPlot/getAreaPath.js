"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAreaPath = getAreaPath;
function getAreaPath(points) {
    return "M ".concat(points.map(function (p) { return "".concat(p.x, " ").concat(p.y); }).join('L'), " Z");
}
