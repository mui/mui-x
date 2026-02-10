"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeIdentifier = void 0;
/**
 * Serializes a series item identifier into a unique string using the appropriate serializer
 * from the provided series configuration.
 *
 * @param {ChartSeriesConfig<ChartSeriesType>} seriesConfig - The configuration object for chart series.
 * @param {SeriesItemIdentifier<ChartSeriesType>} identifier - The series item identifier to serialize.
 * @returns {string} A unique string representation of the identifier.
 * @throws Will throw an error if no serializer is found for the given series type.
 */
var serializeIdentifier = function (seriesConfig, identifier) {
    var _a;
    var serializer = (_a = seriesConfig[identifier.type]) === null || _a === void 0 ? void 0 : _a.identifierSerializer;
    if (!serializer) {
        throw new Error("MUI X Charts: No identifier serializer found for series type \"".concat(identifier.type, "\"."));
    }
    // @ts-expect-error identifierSerializer expects the full object,
    // but this function accepts a partial one in order be able to serialize all identifiers.
    return serializer(identifier);
};
exports.serializeIdentifier = serializeIdentifier;
