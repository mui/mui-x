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
var fastObjectShallowCompare_1 = require("@mui/x-internals/fastObjectShallowCompare");
var useChartInteraction = function (_a) {
    var store = _a.store;
    var cleanInteraction = (0, useEventCallback_1.default)(function cleanInteraction() {
        store.update(function (prev) {
            return __assign(__assign({}, prev), { interaction: { pointer: null, item: null } });
        });
    });
    var removeItemInteraction = (0, useEventCallback_1.default)(function removeItemInteraction(itemToRemove) {
        store.update(function (prev) {
            var prevItem = prev.interaction.item;
            if (!itemToRemove) {
                // Remove without taking care of the current item
                return prevItem === null
                    ? prev
                    : __assign(__assign({}, prev), { interaction: __assign(__assign({}, prev.interaction), { item: null }) });
            }
            if (prevItem === null ||
                Object.keys(itemToRemove).some(function (key) {
                    return itemToRemove[key] !==
                        prevItem[key];
                })) {
                // The current item is already different from the one to remove. No need to clean it.
                return prev;
            }
            return __assign(__assign({}, prev), { interaction: __assign(__assign({}, prev.interaction), { item: null }) });
        });
    });
    var setItemInteraction = (0, useEventCallback_1.default)(function setItemInteraction(newItem) {
        store.update(function (prev) {
            if ((0, fastObjectShallowCompare_1.fastObjectShallowCompare)(prev.interaction.item, newItem)) {
                return prev;
            }
            return __assign(__assign({}, prev), { interaction: __assign(__assign({}, prev.interaction), { item: newItem }) });
        });
    });
    var setPointerCoordinate = (0, useEventCallback_1.default)(function setPointerCoordinate(coordinate) {
        store.update(function (prev) { return (__assign(__assign({}, prev), { interaction: __assign(__assign({}, prev.interaction), { pointer: coordinate }) })); });
    });
    return {
        instance: {
            cleanInteraction: cleanInteraction,
            setItemInteraction: setItemInteraction,
            removeItemInteraction: removeItemInteraction,
            setPointerCoordinate: setPointerCoordinate,
        },
    };
};
exports.useChartInteraction = useChartInteraction;
exports.useChartInteraction.getInitialState = function () { return ({
    interaction: { item: null, pointer: null },
}); };
exports.useChartInteraction.params = {};
