"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var identifierCleaner = function (identifier) {
    return {
        type: identifier.type,
        seriesId: identifier.seriesId,
        xIndex: identifier.xIndex,
        yIndex: identifier.yIndex,
    };
};
exports.default = identifierCleaner;
