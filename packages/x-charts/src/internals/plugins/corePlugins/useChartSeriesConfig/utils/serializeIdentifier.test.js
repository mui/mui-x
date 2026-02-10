"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serializeIdentifier_1 = require("./serializeIdentifier");
var seriesConfig_1 = require("../../../../../BarChart/seriesConfig");
describe('serializeIdentifier', function () {
    var seriesConfig = {
        bar: seriesConfig_1.barSeriesConfig,
    };
    it('should serialize bar identifier using barSeriesConfig', function () {
        var result = (0, serializeIdentifier_1.serializeIdentifier)(seriesConfig, {
            type: 'bar',
            seriesId: 's1',
            dataIndex: 0,
        });
        expect(result).toBe('Type(bar)Series(s1)Index(0)');
    });
    it('should throw an error if no serializer is found for series type', function () {
        var emptyConfig = {};
        expect(function () { return (0, serializeIdentifier_1.serializeIdentifier)(emptyConfig, { type: 'bar', seriesId: 's1' }); }).toThrowError('MUI X Charts: No identifier serializer found for series type "bar".');
    });
});
