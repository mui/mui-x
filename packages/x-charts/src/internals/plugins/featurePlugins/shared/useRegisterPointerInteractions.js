"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRegisterPointerInteractions = useRegisterPointerInteractions;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var hooks_1 = require("../../../../hooks");
var useStore_1 = require("../../../store/useStore");
var ChartProvider_1 = require("../../../../context/ChartProvider");
var getSVGPoint_1 = require("../../../getSVGPoint");
/**
 * Hook to get pointer interaction props for chart items.
 */
function useRegisterPointerInteractions(getItemAtPosition, onItemEnter, onItemLeave) {
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    var svgRef = (0, hooks_1.useSvgRef)();
    var store = (0, useStore_1.useStore)();
    var interactionActive = React.useRef(false);
    var lastItemRef = React.useRef(undefined);
    var onItemEnterRef = (0, useEventCallback_1.default)(function () { return onItemEnter === null || onItemEnter === void 0 ? void 0 : onItemEnter(); });
    var onItemLeaveRef = (0, useEventCallback_1.default)(function () { return onItemLeave === null || onItemLeave === void 0 ? void 0 : onItemLeave(); });
    React.useEffect(function () {
        var svg = svgRef.current;
        if (!svg) {
            return undefined;
        }
        function onPointerEnter() {
            interactionActive.current = true;
        }
        function reset() {
            var lastItem = lastItemRef.current;
            if (lastItem) {
                lastItemRef.current = undefined;
                instance.removeTooltipItem(lastItem);
                instance.clearHighlight();
                onItemLeaveRef();
            }
        }
        function onPointerLeave() {
            interactionActive.current = false;
            reset();
        }
        var onPointerMove = function onPointerMove(event) {
            var svgPoint = (0, getSVGPoint_1.getSVGPoint)(svg, event);
            if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
                reset();
                return;
            }
            var item = getItemAtPosition(store.state, svgPoint);
            if (item) {
                instance.setLastUpdateSource('pointer');
                instance.setTooltipItem(item);
                instance.setHighlight(item);
                onItemEnterRef();
                lastItemRef.current = item;
            }
            else {
                reset();
            }
        };
        svg.addEventListener('pointerleave', onPointerLeave);
        svg.addEventListener('pointermove', onPointerMove);
        svg.addEventListener('pointerenter', onPointerEnter);
        return function () {
            svg.removeEventListener('pointerenter', onPointerEnter);
            svg.removeEventListener('pointermove', onPointerMove);
            svg.removeEventListener('pointerleave', onPointerLeave);
            /* Clean up state if this item is unmounted while active. */
            if (interactionActive.current) {
                onPointerLeave();
            }
        };
    }, [getItemAtPosition, instance, onItemEnterRef, onItemLeaveRef, store, svgRef]);
}
