"use strict";
'use client';
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
exports.ChartsAxisHighlightPath = void 0;
var styles_1 = require("@mui/material/styles");
exports.ChartsAxisHighlightPath = (0, styles_1.styled)('path', {
    name: 'MuiChartsAxisHighlight',
    slot: 'Root',
})(function (_a) {
    var theme = _a.theme;
    return ({
        pointerEvents: 'none',
        variants: [
            {
                props: {
                    axisHighlight: 'band',
                },
                style: __assign({ fill: 'white', fillOpacity: 0.1 }, theme.applyStyles('light', {
                    fill: 'gray',
                })),
            },
            {
                props: {
                    axisHighlight: 'line',
                },
                style: __assign({ strokeDasharray: '5 2', stroke: '#ffffff' }, theme.applyStyles('light', {
                    stroke: '#000000',
                })),
            },
        ],
    });
});
