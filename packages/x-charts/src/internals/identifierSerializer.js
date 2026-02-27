"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifierSerializerSeriesIdDataIndex = exports.dataIndexSerializer = exports.seriesIdSerializer = exports.typeSerializer = void 0;
var typeSerializer = function (type) { return "Type(".concat(type, ")"); };
exports.typeSerializer = typeSerializer;
var seriesIdSerializer = function (id) { return "Series(".concat(id, ")"); };
exports.seriesIdSerializer = seriesIdSerializer;
var dataIndexSerializer = function (dataIndex) {
    return dataIndex === undefined ? '' : "Index(".concat(dataIndex, ")");
};
exports.dataIndexSerializer = dataIndexSerializer;
var identifierSerializerSeriesIdDataIndex = function (identifier) {
    return "".concat((0, exports.typeSerializer)(identifier.type)).concat((0, exports.seriesIdSerializer)(identifier.seriesId)).concat((0, exports.dataIndexSerializer)(identifier.dataIndex));
};
exports.identifierSerializerSeriesIdDataIndex = identifierSerializerSeriesIdDataIndex;
