"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartsContext = void 0;
var React = require("react");
var ChartsContext_1 = require("./ChartsContext");
var useChartsContext = function () {
    var context = React.useContext(ChartsContext_1.ChartsContext);
    if (context == null) {
        throw new Error('MUI X Charts: Could not find the Charts context. ' +
            'This happens when the component is rendered outside of a ChartsDataProvider or ChartsContainer parent component, ' +
            'which means the required context is not available. ' +
            'Wrap your component in a ChartsDataProvider or ChartsContainer. ' +
            'This can also happen if you are bundling multiple versions of the library.');
    }
    return context;
};
exports.useChartsContext = useChartsContext;
