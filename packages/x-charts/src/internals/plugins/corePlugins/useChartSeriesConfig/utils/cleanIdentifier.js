"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanIdentifier = void 0;
/**
 * Cleans a series item identifier by extracting only the relevant properties
 * using the appropriate cleaner from the provided series configuration.
 *
 * @param {ChartSeriesConfig<ChartSeriesType>} seriesConfig - The configuration object for chart series.
 * @param {object} identifier - The series item identifier to clean.
 * @returns {object} A cleaned identifier object with only the properties relevant to the series type.
 * @throws Will throw an error if no cleaner is found for the given series type.
 */
var cleanIdentifier = function (seriesConfig, identifier) {
    var _a;
    var cleaner = (_a = seriesConfig[identifier.type]) === null || _a === void 0 ? void 0 : _a.identifierCleaner;
    if (!cleaner) {
        throw new Error("MUI X Charts: No identifier cleaner found for series type \"".concat(identifier.type, "\"."));
    }
    // @ts-expect-error identifierCleaner expects the full object,
    // but this function accepts a partial one in order to be able to clean all identifiers.
    return cleaner(identifier);
};
exports.cleanIdentifier = cleanIdentifier;
