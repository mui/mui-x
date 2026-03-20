"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifierCleanerSeriesIdDataIndex = void 0;
/**
 * Cleans an identifier by extracting only type, seriesId, and dataIndex properties.
 * This is the common cleaner for most series types (bar, line, pie, scatter, radar, etc.).
 *
 * The generic constraint ensures this can only be used for series types whose
 * identifier actually includes `dataIndex`. Series types with different identifier
 * properties (like heatmap's xIndex/yIndex) must provide their own cleaner.
 */
var identifierCleanerSeriesIdDataIndex = function (identifier) {
    return {
        type: identifier.type,
        seriesId: identifier.seriesId,
        dataIndex: identifier.dataIndex,
    };
};
exports.identifierCleanerSeriesIdDataIndex = identifierCleanerSeriesIdDataIndex;
