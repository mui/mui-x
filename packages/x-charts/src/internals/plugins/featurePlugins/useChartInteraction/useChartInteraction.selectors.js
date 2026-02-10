"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartsPointerType = exports.selectorChartsLastInteraction = exports.selectorChartsInteractionPointerY = exports.selectorChartsInteractionPointerX = exports.selectorChartsInteractionPointer = exports.selectorChartsInteractionIsInitialized = void 0;
var store_1 = require("@mui/x-internals/store");
var selectInteraction = function (state) {
    return state.interaction;
};
exports.selectorChartsInteractionIsInitialized = (0, store_1.createSelector)(selectInteraction, function (interaction) { return interaction !== undefined; });
exports.selectorChartsInteractionPointer = (0, store_1.createSelector)(selectInteraction, function (interaction) { var _a; return (_a = interaction === null || interaction === void 0 ? void 0 : interaction.pointer) !== null && _a !== void 0 ? _a : null; });
exports.selectorChartsInteractionPointerX = (0, store_1.createSelector)(exports.selectorChartsInteractionPointer, function (pointer) { return pointer && pointer.x; });
exports.selectorChartsInteractionPointerY = (0, store_1.createSelector)(exports.selectorChartsInteractionPointer, function (pointer) { return pointer && pointer.y; });
exports.selectorChartsLastInteraction = (0, store_1.createSelector)(selectInteraction, function (interaction) { return interaction === null || interaction === void 0 ? void 0 : interaction.lastUpdate; });
exports.selectorChartsPointerType = (0, store_1.createSelector)(selectInteraction, function (interaction) { var _a; return (_a = interaction === null || interaction === void 0 ? void 0 : interaction.pointerType) !== null && _a !== void 0 ? _a : null; });
