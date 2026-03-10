"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartsLocalization = void 0;
var React = require("react");
var ChartsLocalizationProvider_1 = require("../ChartsLocalizationProvider/ChartsLocalizationProvider");
var useChartsLocalization = function () {
    var localization = React.useContext(ChartsLocalizationProvider_1.ChartsLocalizationContext);
    if (localization === null) {
        throw new Error('MUI X Charts: Could not find the charts localization context. ' +
            'This happens when the component is rendered without a ChartsLocalizationProvider. ' +
            'Wrap your component in a ChartsLocalizationProvider. ' +
            'This can also happen if you are bundling multiple versions of the `@mui/x-charts` package.');
    }
    return localization;
};
exports.useChartsLocalization = useChartsLocalization;
