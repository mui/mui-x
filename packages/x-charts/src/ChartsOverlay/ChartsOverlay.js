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
exports.useNoData = useNoData;
exports.ChartsOverlay = ChartsOverlay;
var jsx_runtime_1 = require("react/jsx-runtime");
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
        return seriesOrder.every(function (seriesId) {
            var seriesItem = series[seriesId];
            // These prevent a type error when building the package.
            // @ts-ignore, sankey type is not declared in the base package
            if (seriesItem.type === 'sankey') {
                // @ts-ignore, sankey type is not declared in the base package
                return seriesItem.data.links.length === 0;
            }
            return seriesItem.data.length === 0;
        });
    });
}
function ChartsOverlay(props) {
    var _a, _b, _c, _d, _e, _f;
    var noData = useNoData();
    if (props.loading) {
        var LoadingOverlay = (_b = (_a = props.slots) === null || _a === void 0 ? void 0 : _a.loadingOverlay) !== null && _b !== void 0 ? _b : ChartsLoadingOverlay_1.ChartsLoadingOverlay;
        return (0, jsx_runtime_1.jsx)(LoadingOverlay, __assign({}, (_c = props.slotProps) === null || _c === void 0 ? void 0 : _c.loadingOverlay));
    }
    if (noData) {
        var NoDataOverlay = (_e = (_d = props.slots) === null || _d === void 0 ? void 0 : _d.noDataOverlay) !== null && _e !== void 0 ? _e : ChartsNoDataOverlay_1.ChartsNoDataOverlay;
        return (0, jsx_runtime_1.jsx)(NoDataOverlay, __assign({}, (_f = props.slotProps) === null || _f === void 0 ? void 0 : _f.noDataOverlay));
    }
    return null;
}
