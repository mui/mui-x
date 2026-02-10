"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cleanIdentifier_1 = require("./cleanIdentifier");
var seriesConfig_1 = require("../../../../../LineChart/seriesConfig");
describe('cleanIdentifier', function () {
    var seriesConfig = {
        line: seriesConfig_1.lineSeriesConfig,
    };
    it('should clean line identifier using lineSeriesConfig', function () {
        var result = (0, cleanIdentifier_1.cleanIdentifier)(seriesConfig, {
            type: 'line',
            seriesId: 's2',
            dataIndex: 5,
            extraProp: 'remove this',
        });
        expect(result).to.deep.equal({ type: 'line', seriesId: 's2', dataIndex: 5 });
    });
    it('should throw an error if no cleaner is found for series type', function () {
        var emptyConfig = {};
        expect(function () { return (0, cleanIdentifier_1.cleanIdentifier)(emptyConfig, { type: 'bar', seriesId: 's1' }); }).toThrowError('MUI X Charts: No identifier cleaner found for series type "bar".');
    });
});
