"use strict";
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
exports.useChartInteraction = void 0;
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useChartInteraction = function (_a) {
    var store = _a.store;
    var cleanInteraction = (0, useEventCallback_1.default)(function cleanInteraction() {
        store.update({
            interaction: __assign(__assign({}, store.state.interaction), { pointer: null }),
        });
    });
    var setLastUpdateSource = (0, useEventCallback_1.default)(function setLastUpdateSource(interaction) {
        if (store.state.interaction.lastUpdate !== interaction) {
            store.set('interaction', __assign(__assign({}, store.state.interaction), { lastUpdate: interaction }));
        }
    });
    var setPointerCoordinate = (0, useEventCallback_1.default)(function setPointerCoordinate(coordinate) {
        store.set('interaction', __assign(__assign({}, store.state.interaction), { pointer: coordinate, lastUpdate: coordinate !== null ? 'pointer' : store.state.interaction.lastUpdate }));
    });
    var handlePointerEnter = (0, useEventCallback_1.default)(function handlePointerEnter(event) {
        store.set('interaction', __assign(__assign({}, store.state.interaction), { pointerType: event.pointerType }));
    });
    var handlePointerLeave = (0, useEventCallback_1.default)(function handlePointerLeave() {
        store.set('interaction', __assign(__assign({}, store.state.interaction), { pointerType: null }));
    });
    return {
        instance: {
            cleanInteraction: cleanInteraction,
            setLastUpdateSource: setLastUpdateSource,
            setPointerCoordinate: setPointerCoordinate,
            handlePointerEnter: handlePointerEnter,
            handlePointerLeave: handlePointerLeave,
        },
    };
};
exports.useChartInteraction = useChartInteraction;
exports.useChartInteraction.getInitialState = function () { return ({
    interaction: { item: null, pointer: null, lastUpdate: 'pointer', pointerType: null },
}); };
exports.useChartInteraction.params = {};
