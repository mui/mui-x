"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRegisterItemClickHandlers = useRegisterItemClickHandlers;
var React = require("react");
var useChartsLayerContainerRef_1 = require("../hooks/useChartsLayerContainerRef");
var ChartsProvider_1 = require("../context/ChartsProvider");
var getChartPoint_1 = require("../internals/getChartPoint");
var useStore_1 = require("../internals/store/useStore");
var useChartCartesianAxisPosition_selectors_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisPosition.selectors");
/**
 * Hook that registers pointer event handlers for chart item clicking.
 * @param onItemClick Callback for item click events.
 */
function useRegisterItemClickHandlers(onItemClick) {
    var instance = (0, ChartsProvider_1.useChartsContext)().instance;
    var chartsLayerContainerRef = (0, useChartsLayerContainerRef_1.useChartsLayerContainerRef)();
    var store = (0, useStore_1.useStore)();
    React.useEffect(function () {
        var element = chartsLayerContainerRef.current;
        if (!element || !onItemClick) {
            return undefined;
        }
        var lastPointerUp = null;
        var onClick = function onClick(event) {
            var point = event;
            /* The click event doesn't contain decimal values in clientX/Y, but the pointermove does.
             * This caused a problem when rendering many bars that were thinner than a pixel where the tooltip or the highlight
             * would refer to a different bar than the click since those rely on the pointermove event.
             * As a fix, we use the pointerup event to get the decimal values and check if the pointer up event was close enough
             * to the click event (1px difference in each direction); if so, then we can use the pointerup's clientX/Y; if not,
             * we default to the click event's clientX/Y. */
            if (lastPointerUp) {
                if (Math.abs(event.clientX - lastPointerUp.clientX) <= 1 &&
                    Math.abs(event.clientY - lastPointerUp.clientY) <= 1) {
                    point = {
                        clientX: lastPointerUp.clientX,
                        clientY: lastPointerUp.clientY,
                    };
                }
            }
            lastPointerUp = null;
            var svgPoint = (0, getChartPoint_1.getChartPoint)(element, point);
            if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
                return;
            }
            var item = (0, useChartCartesianAxisPosition_selectors_1.selectorBarItemAtPosition)(store.state, svgPoint);
            if (item) {
                onItemClick(event, {
                    type: 'bar',
                    seriesId: item.seriesId,
                    dataIndex: item.dataIndex,
                });
            }
        };
        var onPointerUp = function onPointerUp(event) {
            lastPointerUp = event;
        };
        element.addEventListener('click', onClick);
        element.addEventListener('pointerup', onPointerUp);
        return function () {
            element.removeEventListener('click', onClick);
            element.removeEventListener('pointerup', onPointerUp);
        };
    }, [instance, onItemClick, store, chartsLayerContainerRef]);
}
