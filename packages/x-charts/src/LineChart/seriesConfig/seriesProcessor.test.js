"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var seriesProcessor_1 = require("./seriesProcessor");
var seriesOrder = ['id1'];
var seriesDataset = {
    id1: {
        // useless info
        type: 'line',
        id: 'id1',
        color: 'red',
        // useful info
        dataKey: 'k',
    },
};
var dataSet = [{ k: 1 }, { k: 2 }, { k: 3 }];
describe('LineChart - formatter', function () {
    describe('data from dataset', function () {
        it('should get data from the dataset', function () {
            var series = (0, seriesProcessor_1.default)({ seriesOrder: seriesOrder, series: seriesDataset }, dataSet).series;
            expect(series.id1.data).to.deep.equal([1, 2, 3]);
        });
        it('should support missing values', function () {
            var series = (0, seriesProcessor_1.default)({ seriesOrder: seriesOrder, series: seriesDataset }, [
                { k: 1 },
                { k: null },
                { k: 2 },
            ]).series;
            expect(series.id1.data).to.deep.equal([1, null, 2]);
        });
    });
});
