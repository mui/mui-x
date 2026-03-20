"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInteractionItemProps = void 0;
exports.getInteractionItemProps = getInteractionItemProps;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var ChartsProvider_1 = require("../context/ChartsProvider");
function onPointerDown(event) {
    if ('hasPointerCapture' in event.currentTarget &&
        event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
    }
}
var useInteractionItemProps = function (data, skip) {
    var instance = (0, ChartsProvider_1.useChartsContext)().instance;
    var interactionActive = React.useRef(false);
    var onPointerEnter = (0, useEventCallback_1.default)(function () {
        interactionActive.current = true;
        instance.setLastUpdateSource('pointer');
        instance.setTooltipItem(data);
        instance.setHighlight(data);
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
        instance.setHighlight(item);
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
