"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifierCleanerSeriesIdDataIndex = void 0;
/**
 * Cleans an identifier by extracting only type, seriesId, and dataIndex properties.
 * This is the common cleaner for most series types (bar, line, pie, scatter, radar, etc.).
 */
var identifierCleanerSeriesIdDataIndex = function (identifier) {
    // @ts-expect-error we need to trust the output type here, since T is generic
    return {
        type: identifier.type,
        seriesId: identifier.seriesId,
        dataIndex: identifier.dataIndex,
    };
};
exports.identifierCleanerSeriesIdDataIndex = identifierCleanerSeriesIdDataIndex;
