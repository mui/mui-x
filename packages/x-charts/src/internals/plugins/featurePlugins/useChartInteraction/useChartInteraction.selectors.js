"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartsInteractionItemIsDefined = exports.selectorChartsInteractionPointerY = exports.selectorChartsInteractionPointerX = exports.selectorChartsInteractionPointer = exports.selectorChartsInteractionItem = exports.selectorChartsInteractionIsInitialized = void 0;
var selectors_1 = require("../../utils/selectors");
var selectInteraction = function (state) {
    return state.interaction;
};
exports.selectorChartsInteractionIsInitialized = (0, selectors_1.createSelector)([selectInteraction], function (interaction) { return interaction !== undefined; });
exports.selectorChartsInteractionItem = (0, selectors_1.createSelector)([selectInteraction], function (interaction) { var _a; return (_a = interaction === null || interaction === void 0 ? void 0 : interaction.item) !== null && _a !== void 0 ? _a : null; });
exports.selectorChartsInteractionPointer = (0, selectors_1.createSelector)([selectInteraction], function (interaction) { var _a; return (_a = interaction === null || interaction === void 0 ? void 0 : interaction.pointer) !== null && _a !== void 0 ? _a : null; });
exports.selectorChartsInteractionPointerX = (0, selectors_1.createSelector)([exports.selectorChartsInteractionPointer], function (pointer) { return pointer && pointer.x; });
exports.selectorChartsInteractionPointerY = (0, selectors_1.createSelector)([exports.selectorChartsInteractionPointer], function (pointer) { return pointer && pointer.y; });
exports.selectorChartsInteractionItemIsDefined = (0, selectors_1.createSelector)([exports.selectorChartsInteractionItem], function (item) { return item !== null; });
