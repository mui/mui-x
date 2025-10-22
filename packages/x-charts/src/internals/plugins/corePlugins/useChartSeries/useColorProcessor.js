"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useColorProcessor = useColorProcessor;
var React = require("react");
var useSelector_1 = require("../../../store/useSelector");
var useStore_1 = require("../../../store/useStore");
var useChartSeries_selectors_1 = require("./useChartSeries.selectors");
function useColorProcessor(seriesType) {
    var store = (0, useStore_1.useStore)();
    var seriesConfig = (0, useSelector_1.useSelector)(store, useChartSeries_selectors_1.selectorChartSeriesConfig);
    var colorProcessors = React.useMemo(function () {
        var rep = {};
        Object.keys(seriesConfig).forEach(function (seriesT) {
            // @ts-expect-error https://github.com/microsoft/TypeScript/issues/61555
            rep[seriesT] = seriesConfig[seriesT].colorProcessor;
        });
        return rep;
    }, [seriesConfig]);
    if (!seriesType) {
        return colorProcessors;
    }
    return colorProcessors[seriesType];
}
