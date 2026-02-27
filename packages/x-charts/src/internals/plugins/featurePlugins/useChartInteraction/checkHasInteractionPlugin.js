"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHasInteractionPlugin = checkHasInteractionPlugin;
function checkHasInteractionPlugin(instance) {
    return instance.setPointerCoordinate !== undefined;
}
