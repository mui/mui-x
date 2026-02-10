"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartsLocalization = void 0;
var React = require("react");
var ChartsLocalizationProvider_1 = require("../ChartsLocalizationProvider/ChartsLocalizationProvider");
var useChartsLocalization = function () {
    var localization = React.useContext(ChartsLocalizationProvider_1.ChartsLocalizationContext);
    if (localization === null) {
        throw new Error([
            'MUI X Charts: Can not find the charts localization context.',
            'It looks like you forgot to wrap your component in ChartsLocalizationProvider.',
            'This can also happen if you are bundling multiple versions of the `@mui/x-charts` package',
        ].join('\n'));
    }
    return localization;
};
exports.useChartsLocalization = useChartsLocalization;
