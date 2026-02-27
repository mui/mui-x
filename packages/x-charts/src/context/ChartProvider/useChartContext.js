"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartContext = void 0;
var React = require("react");
var ChartContext_1 = require("./ChartContext");
var useChartContext = function () {
    var context = React.useContext(ChartContext_1.ChartContext);
    if (context == null) {
        throw new Error([
            'MUI X Charts: Could not find the Chart context.',
            'It looks like you rendered your component outside of a ChartDataProvider.',
            'This can also happen if you are bundling multiple versions of the library.',
        ].join('\n'));
    }
    return context;
};
exports.useChartContext = useChartContext;
