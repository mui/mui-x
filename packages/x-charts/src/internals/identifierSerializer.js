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
/**
 * Serializes an identifier using type, seriesId, and dataIndex properties.
 *
 * The generic constraint ensures this can only be used for series types whose
 * identifier actually includes `dataIndex`. Series types with different identifier
 * properties (like heatmap's xIndex/yIndex) must provide their own serializer.
 */
var identifierSerializerSeriesIdDataIndex = function (identifier) {
    return "".concat((0, exports.typeSerializer)(identifier.type)).concat((0, exports.seriesIdSerializer)(identifier.seriesId)).concat((0, exports.dataIndexSerializer)(identifier.dataIndex));
};
exports.identifierSerializerSeriesIdDataIndex = identifierSerializerSeriesIdDataIndex;
