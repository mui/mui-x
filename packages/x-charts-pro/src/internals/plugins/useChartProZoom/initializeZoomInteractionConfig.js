"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeZoomInteractionConfig = void 0;
var initializeZoomInteractionConfig = function (zoomInteractionConfig, optionsLookup) {
    var defaultizedConfig = { zoom: {}, pan: {} };
    // Config for zoom
    if (!(zoomInteractionConfig === null || zoomInteractionConfig === void 0 ? void 0 : zoomInteractionConfig.zoom)) {
        defaultizedConfig.zoom = {
            wheel: { type: 'wheel', requiredKeys: [], mouse: {}, touch: {} },
            pinch: { type: 'pinch', requiredKeys: [], mouse: {}, touch: {} },
        };
    }
    else {
        defaultizedConfig.zoom = initializeFor('zoom', zoomInteractionConfig.zoom);
    }
    // Config for pan
    if (!(zoomInteractionConfig === null || zoomInteractionConfig === void 0 ? void 0 : zoomInteractionConfig.pan)) {
        defaultizedConfig.pan = {
            drag: { type: 'drag', requiredKeys: [], mouse: {}, touch: {} },
        };
        var hasXZoom_1 = false;
        var hasYZoom_1 = false;
        if (optionsLookup) {
            Object.values(optionsLookup).forEach(function (options) {
                if (options.axisDirection === 'x') {
                    hasXZoom_1 = true;
                }
                if (options.axisDirection === 'y') {
                    hasYZoom_1 = true;
                }
            });
        }
        // Only add pan on wheel if the x-axis can pan (has zoom enabled) but the y-axis cannot
        // This provides a consistent horizontal panning experience that aligns with typical scrolling behavior
        // When both axes can pan, we avoid wheel interactions to prevent conflicts with vertical scrolling
        if (hasXZoom_1 && !hasYZoom_1) {
            defaultizedConfig.pan.wheel = {
                type: 'wheel',
                requiredKeys: [],
                allowedDirection: 'x',
                mouse: {},
                touch: {},
            };
        }
    }
    else {
        defaultizedConfig.pan = initializeFor('pan', zoomInteractionConfig.pan);
    }
    return defaultizedConfig;
};
exports.initializeZoomInteractionConfig = initializeZoomInteractionConfig;
function initializeFor(interactionType, zoomInteractionConfig) {
    var _a, _b, _c, _d;
    // We aggregate interactions by type
    var aggregation = zoomInteractionConfig.reduce(function (acc, interaction) {
        if (typeof interaction === 'string') {
            if (!acc[interaction]) {
                acc[interaction] = [];
            }
            acc[interaction].push({ type: interaction, requiredKeys: [] });
            return acc;
        }
        var type = interaction.type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push({
            type: type,
            pointerMode: interaction.pointerMode,
            requiredKeys: interaction.requiredKeys,
            allowedDirection: interaction.allowedDirection,
        });
        return acc;
    }, {});
    // We then need to generate a usable config by type
    // When a gesture type is provided without options, it means we enable it for all pointer modes
    // Any interaction with a specific pointer mode should be restricted to that mode
    var acc = {};
    for (var _i = 0, _e = Object.entries(aggregation); _i < _e.length; _i++) {
        var _f = _e[_i], type = _f[0], config = _f[1];
        var lastEmpty = config.findLast(function (item) { return !item.pointerMode; });
        var lastMouse = config.findLast(function (item) { return item.pointerMode === 'mouse'; });
        var lastTouch = config.findLast(function (item) { return item.pointerMode === 'touch'; });
        acc[type] = {
            type: type,
            pointerMode: lastEmpty
                ? []
                : Array.from(new Set(config.filter(function (c) { return c.pointerMode; }).map(function (c) { return c.pointerMode; }))),
            requiredKeys: (_a = lastEmpty === null || lastEmpty === void 0 ? void 0 : lastEmpty.requiredKeys) !== null && _a !== void 0 ? _a : [],
            mouse: lastMouse
                ? {
                    requiredKeys: (_b = lastMouse === null || lastMouse === void 0 ? void 0 : lastMouse.requiredKeys) !== null && _b !== void 0 ? _b : [],
                }
                : {},
            touch: lastTouch
                ? {
                    requiredKeys: (_c = lastTouch === null || lastTouch === void 0 ? void 0 : lastTouch.requiredKeys) !== null && _c !== void 0 ? _c : [],
                }
                : {},
        };
        if (type === 'wheel' && interactionType === 'pan') {
            acc[type].allowedDirection = (_d = lastEmpty === null || lastEmpty === void 0 ? void 0 : lastEmpty.allowedDirection) !== null && _d !== void 0 ? _d : 'x';
        }
    }
    return acc;
}
