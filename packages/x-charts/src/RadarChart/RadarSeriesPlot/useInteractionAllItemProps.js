"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInteractionAllItemProps = void 0;
var React = require("react");
var useChartContext_1 = require("../../context/ChartProvider/useChartContext");
var useInteractionItemProps_1 = require("../../hooks/useInteractionItemProps");
var useInteractionAllItemProps = function (data, skip) {
    var instance = (0, useChartContext_1.useChartContext)().instance;
    var results = React.useMemo(function () {
        return data.map(function (item) {
            return skip
                ? {}
                : (0, useInteractionItemProps_1.getInteractionItemProps)(instance, {
                    type: 'radar',
                    seriesId: item.seriesId,
                    dataIndex: item.dataIndex,
                });
        });
    }, [data, instance, skip]);
    return results;
};
exports.useInteractionAllItemProps = useInteractionAllItemProps;
