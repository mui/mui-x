"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultizeZoom = exports.defaultZoomOptions = void 0;
var constants_1 = require("../../../constants");
exports.defaultZoomOptions = {
    minStart: 0,
    maxEnd: 100,
    step: 5,
    minSpan: 10,
    maxSpan: 100,
    panning: true,
    filterMode: 'keep',
    reverse: false,
    slider: {
        enabled: false,
        preview: false,
        size: constants_1.DEFAULT_ZOOM_SLIDER_SIZE,
        showTooltip: constants_1.DEFAULT_ZOOM_SLIDER_SHOW_TOOLTIP,
    },
};
var defaultizeZoom = function (zoom, axisId, axisDirection, reverse) {
    var _a, _b;
    if (!zoom) {
        return undefined;
    }
    if (zoom === true) {
        return __assign(__assign({ axisId: axisId, axisDirection: axisDirection }, exports.defaultZoomOptions), { reverse: reverse !== null && reverse !== void 0 ? reverse : false });
    }
    return __assign(__assign(__assign(__assign({ axisId: axisId, axisDirection: axisDirection }, exports.defaultZoomOptions), { reverse: reverse !== null && reverse !== void 0 ? reverse : false }), zoom), { slider: __assign(__assign(__assign({}, exports.defaultZoomOptions.slider), { size: ((_b = (_a = zoom.slider) === null || _a === void 0 ? void 0 : _a.preview) !== null && _b !== void 0 ? _b : exports.defaultZoomOptions.slider.preview)
                ? constants_1.DEFAULT_ZOOM_SLIDER_PREVIEW_SIZE
                : constants_1.DEFAULT_ZOOM_SLIDER_SIZE }), zoom.slider) });
};
exports.defaultizeZoom = defaultizeZoom;
