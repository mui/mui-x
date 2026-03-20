"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldRegisterPointerInteractionsGlobally = shouldRegisterPointerInteractionsGlobally;
var HeatmapCell_1 = require("./HeatmapCell");
/* Global pointer interactions should be registered when we're using the default HeatmapCell.
 * We only want to return false when a custom slot is being used to avoid breaking changes.
 *
 * This can be removed in v9. */
function shouldRegisterPointerInteractionsGlobally(slots, slotProps) {
    var _a;
    // If 'onPointerEnter' is defined in the slotProps, we don't want to register globally.
    if ('onPointerEnter' in ((_a = slotProps === null || slotProps === void 0 ? void 0 : slotProps.cell) !== null && _a !== void 0 ? _a : {})) {
        return false;
    }
    return slots === undefined || slots.cell === HeatmapCell_1.HeatmapCell;
}
