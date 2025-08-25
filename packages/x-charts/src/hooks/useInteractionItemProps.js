"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInteractionAllItemProps = exports.useInteractionItemProps = void 0;
exports.getInteractionItemProps = getInteractionItemProps;
var React = require("react");
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
    var onPointerEnter = React.useCallback(function () {
        interactionActive.current = true;
        instance.setItemInteraction(data);
        instance.setHighlight(data);
    }, [instance, data]);
    var onPointerLeave = React.useCallback(function () {
        interactionActive.current = false;
        instance.removeItemInteraction(data);
        instance.clearHighlight();
    }, [instance, data]);
    React.useEffect(function () {
        return function () {
            /* Clean up state if this item is unmounted while active. */
            if (interactionActive.current) {
                onPointerLeave();
            }
        };
    }, [onPointerLeave]);
    if (skip) {
        return {};
    }
    return {
        onPointerEnter: onPointerEnter,
        onPointerLeave: onPointerLeave,
        onPointerDown: onPointerDown,
    };
};
exports.useInteractionItemProps = useInteractionItemProps;
var useInteractionAllItemProps = function (data, skip) {
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    var results = React.useMemo(function () {
        return data.map(function (item) {
            return skip ? {} : getInteractionItemProps(instance, item);
        });
    }, [data, instance, skip]);
    return results;
};
exports.useInteractionAllItemProps = useInteractionAllItemProps;
function getInteractionItemProps(instance, item) {
    function onPointerEnter() {
        if (!item) {
            return;
        }
        instance.setItemInteraction(item);
        instance.setHighlight(item);
    }
    function onPointerLeave() {
        if (!item) {
            return;
        }
        instance.removeItemInteraction(item);
        instance.clearHighlight();
    }
    return {
        onPointerEnter: onPointerEnter,
        onPointerLeave: onPointerLeave,
        onPointerDown: onPointerDown,
    };
}
