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
exports.GridNoResultsOverlay = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var forwardRef_1 = require("@mui/x-internals/forwardRef");
var useGridApiContext_1 = require("../hooks/utils/useGridApiContext");
var GridOverlay_1 = require("./containers/GridOverlay");
exports.GridNoResultsOverlay = (0, forwardRef_1.forwardRef)(function GridNoResultsOverlay(props, ref) {
    var apiRef = (0, useGridApiContext_1.useGridApiContext)();
    var noResultsOverlayLabel = apiRef.current.getLocaleText('noResultsOverlayLabel');
    return ((0, jsx_runtime_1.jsx)(GridOverlay_1.GridOverlay, __assign({}, props, { ref: ref, children: noResultsOverlayLabel })));
});
