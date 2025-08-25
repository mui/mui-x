"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNoData = useNoData;
exports.ChartsOverlay = ChartsOverlay;
var React = require("react");
var ChartsLoadingOverlay_1 = require("./ChartsLoadingOverlay");
var useSeries_1 = require("../hooks/useSeries");
var ChartsNoDataOverlay_1 = require("./ChartsNoDataOverlay");
function useNoData() {
    var seriesPerType = (0, useSeries_1.useSeries)();
    return Object.values(seriesPerType).every(function (seriesOfGivenType) {
        if (!seriesOfGivenType) {
            return true;
        }
        var series = seriesOfGivenType.series, seriesOrder = seriesOfGivenType.seriesOrder;
        return seriesOrder.every(function (seriesId) { return series[seriesId].data.length === 0; });
    });
}
function ChartsOverlay(props) {
    var _a, _b, _c, _d, _e, _f;
    var noData = useNoData();
    if (props.loading) {
        var LoadingOverlay = (_b = (_a = props.slots) === null || _a === void 0 ? void 0 : _a.loadingOverlay) !== null && _b !== void 0 ? _b : ChartsLoadingOverlay_1.ChartsLoadingOverlay;
        return <LoadingOverlay {...(_c = props.slotProps) === null || _c === void 0 ? void 0 : _c.loadingOverlay}/>;
    }
    if (noData) {
        var NoDataOverlay = (_e = (_d = props.slots) === null || _d === void 0 ? void 0 : _d.noDataOverlay) !== null && _e !== void 0 ? _e : ChartsNoDataOverlay_1.ChartsNoDataOverlay;
        return <NoDataOverlay {...(_f = props.slotProps) === null || _f === void 0 ? void 0 : _f.noDataOverlay}/>;
    }
    return null;
}
