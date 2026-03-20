"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInteractionAllItemProps = void 0;
var React = require("react");
var useChartsContext_1 = require("../../context/ChartsProvider/useChartsContext");
var useInteractionItemProps_1 = require("../../hooks/useInteractionItemProps");
var useInteractionAllItemProps = function (data, skip) {
    var instance = (0, useChartsContext_1.useChartsContext)().instance;
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
