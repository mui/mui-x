"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var internals_1 = require("@mui/x-charts/internals");
var identifierSerializer = function (identifier) {
    return "".concat((0, internals_1.typeSerializer)(identifier.type)).concat((0, internals_1.seriesIdSerializer)(identifier.seriesId), "X(").concat(identifier.xIndex, ")Y(").concat(identifier.yIndex, ")");
};
exports.default = identifierSerializer;
