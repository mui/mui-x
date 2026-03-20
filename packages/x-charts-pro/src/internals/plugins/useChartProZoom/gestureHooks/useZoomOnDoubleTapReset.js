"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZoomOnDoubleTapReset = void 0;
var React = require("react");
var internals_1 = require("@mui/x-charts/internals");
var ZoomInteractionConfig_selectors_1 = require("../ZoomInteractionConfig.selectors");
var useZoomOnDoubleTapReset = function (_a, setZoomDataCallback) {
    var store = _a.store, instance = _a.instance;
    var chartsLayerContainerRef = instance.chartsLayerContainerRef;
    var optionsLookup = store.use(internals_1.selectorChartZoomOptionsLookup);
    var config = store.use(ZoomInteractionConfig_selectors_1.selectorZoomInteractionConfig, 'doubleTapReset');
    var isZoomOnDoubleTapResetEnabled = Object.keys(optionsLookup).length > 0 && Boolean(config);
    React.useEffect(function () {
        if (!isZoomOnDoubleTapResetEnabled) {
            return;
        }
        instance.updateZoomInteractionListeners('zoomDoubleTapReset', {
            requiredKeys: config.requiredKeys,
            pointerMode: config.pointerMode,
            pointerOptions: {
                mouse: config.mouse,
                touch: config.touch,
            },
        });
    }, [config, isZoomOnDoubleTapResetEnabled, instance]);
    // Reset zoom on double tap
    React.useEffect(function () {
        var element = chartsLayerContainerRef.current;
        if (element === null || !isZoomOnDoubleTapResetEnabled) {
            return function () { };
        }
        var handleDoubleTapReset = function () {
            // Reset all axes to their default zoom state
            setZoomDataCallback(function (prev) {
                return prev.map(function (zoom) {
                    var option = optionsLookup[zoom.axisId];
                    if (!option) {
                        return zoom;
                    }
                    // Reset to the full range (minStart to maxEnd)
                    return {
                        axisId: zoom.axisId,
                        start: option.minStart,
                        end: option.maxEnd,
                    };
                });
            });
        };
        var doubleTapResetHandler = instance.addInteractionListener('zoomDoubleTapReset', handleDoubleTapReset);
        return function () {
            doubleTapResetHandler.cleanup();
        };
    }, [
        chartsLayerContainerRef,
        isZoomOnDoubleTapResetEnabled,
        optionsLookup,
        instance,
        setZoomDataCallback,
        store,
    ]);
};
exports.useZoomOnDoubleTapReset = useZoomOnDoubleTapReset;
