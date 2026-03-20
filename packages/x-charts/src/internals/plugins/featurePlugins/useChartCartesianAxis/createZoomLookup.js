"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZoomLookup = void 0;
var defaultizeZoom_1 = require("./defaultizeZoom");
var createZoomLookup = function (axisDirection) {
    return function (axes) {
        if (axes === void 0) { axes = []; }
        return axes.reduce(function (acc, v) {
            // @ts-ignore
            var zoom = v.zoom, axisId = v.id, reverse = v.reverse;
            var defaultizedZoom = (0, defaultizeZoom_1.defaultizeZoom)(zoom, axisId, axisDirection, reverse);
            if (defaultizedZoom) {
                acc[axisId] = defaultizedZoom;
            }
            return acc;
        }, {});
    };
};
exports.createZoomLookup = createZoomLookup;
