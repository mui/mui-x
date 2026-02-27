"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInteractionItemProps = void 0;
exports.getInteractionItemProps = getInteractionItemProps;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var ChartProvider_1 = require("../context/ChartProvider");
function onPointerDown(event) {
    if ('hasPointerCapture' in event.currentTarget &&
        event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
    }
}
var useInteractionItemProps = function (data, skip) {
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    var interactionActive = React.useRef(false);
    var onPointerEnter = (0, useEventCallback_1.default)(function () {
        interactionActive.current = true;
        instance.setLastUpdateSource('pointer');
        instance.setTooltipItem(data);
        // TODO: uniformize sankey and other types to get a single plugin
        instance.setHighlight(
        // @ts-ignore
        data.type === 'sankey' ? data : { seriesId: data.seriesId, dataIndex: data.dataIndex });
    });
    var onPointerLeave = (0, useEventCallback_1.default)(function () {
        interactionActive.current = false;
        instance.removeTooltipItem(data);
        instance.clearHighlight();
    });
    React.useEffect(function () {
        return function () {
            /* Clean up state if this item is unmounted while active. */
            if (interactionActive.current) {
                onPointerLeave();
            }
        };
    }, [onPointerLeave]);
    return React.useMemo(function () {
        return skip
            ? {}
            : {
                onPointerEnter: onPointerEnter,
                onPointerLeave: onPointerLeave,
                onPointerDown: onPointerDown,
            };
    }, [skip, onPointerEnter, onPointerLeave]);
};
exports.useInteractionItemProps = useInteractionItemProps;
function getInteractionItemProps(instance, item) {
    function onPointerEnter() {
        if (!item) {
            return;
        }
        instance.setLastUpdateSource('pointer');
        instance.setTooltipItem(item);
        instance.setHighlight(
        // @ts-ignore
        item.type === 'sankey' ? item : { seriesId: item.seriesId, dataIndex: item.dataIndex });
    }
    function onPointerLeave() {
        if (!item) {
            return;
        }
        instance.removeTooltipItem(item);
        instance.clearHighlight();
    }
    return {
        onPointerEnter: onPointerEnter,
        onPointerLeave: onPointerLeave,
        onPointerDown: onPointerDown,
    };
}
