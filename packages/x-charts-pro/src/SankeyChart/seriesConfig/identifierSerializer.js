"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internals_1 = require("@mui/x-charts/internals");
var identifierSerializer = function (identifier) {
    if (identifier.subType === 'node') {
        return "".concat((0, internals_1.typeSerializer)(identifier.type), "Node(").concat(identifier.nodeId, ")");
    }
    return "".concat((0, internals_1.typeSerializer)(identifier.type), "Source(").concat(identifier.sourceId, ")Target(").concat(identifier.targetId, ")");
};
exports.default = identifierSerializer;
