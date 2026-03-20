"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var identifierCleaner = function (identifier) {
    if (identifier.subType === 'node') {
        return {
            type: identifier.type,
            seriesId: identifier.seriesId,
            subType: 'node',
            nodeId: identifier.nodeId,
        };
    }
    return {
        type: identifier.type,
        seriesId: identifier.seriesId,
        subType: 'link',
        sourceId: identifier.sourceId,
        targetId: identifier.targetId,
    };
};
exports.default = identifierCleaner;
