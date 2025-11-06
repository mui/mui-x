"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBasicGridData = exports.currencyPairs = void 0;
exports.currencyPairs = [
    'USDGBP',
    'USDEUR',
    'GBPEUR',
    'JPYUSD',
    'MXNUSD',
    'BTCUSD',
    'USDCAD',
    'EURJPY',
    'EURUSD',
    'EURCHF',
    'USDCHF',
    'EURGBP',
    'GBPUSD',
    'AUDCAD',
    'NZDUSD',
    'GBPCHF',
    'AUDUSD',
    'GBPJPY',
    'USDJPY',
    'CHFJPY',
    'EURCAD',
    'AUDJPY',
    'EURAUD',
    'AUDNZD',
    'CADEUR',
    'CHFMXN',
    'ETHUSD',
    'BCHUSD',
    'ETHBTC',
    'XRPUSD',
    'XRPBTC',
    'USDLTC',
    'USDXRP',
    'USDDSH',
    'USDBCH',
    'JPYEUR',
    'JPYUSD',
    'JPYGBP',
    'JPYCAD',
    'JPYCHF',
    'JPYAUD',
    'JPYNZD',
    'JPYSGD',
    'JPYNOK',
    'JPYRUB',
    'JPYSEK',
    'JPYTRY',
    'JPYZAR',
    'JPYHKD',
    'JPYCNH',
    'JPYDKK',
    'JPYMXN',
    'JPYPLN',
    'JPYXAG',
    'JPYXAU',
    'JPYBTC',
    'JPYETH',
    'JPYLTC',
    'JPYXRP',
    'JPYDSH',
    'JPYBCH',
    'GBPEUR',
    'GBPRUB',
    'GBPTRY',
];
var getBasicGridData = function (rowLength, colLength) {
    var data = [];
    var pricesColLength = colLength - 2;
    for (var i = 0; i < rowLength; i += 1) {
        var idx = i >= exports.currencyPairs.length ? i % exports.currencyPairs.length : i;
        var model = {
            id: i,
            currencyPair: exports.currencyPairs[idx],
        };
        for (var j = 1; j <= pricesColLength; j += 1) {
            model["price".concat(j, "M")] = Number("".concat(i.toString()).concat(j)); // randomPrice(0.7, 2);
        }
        data.push(model);
    }
    var columns = [
        { field: 'id', headerName: 'id', type: 'number' },
        { field: 'currencyPair', headerName: 'Currency Pair' },
    ];
    for (var j = 1; j <= pricesColLength; j += 1) {
        // const y = Math.floor(j / 12);
        columns.push({ field: "price".concat(j, "M"), headerName: "".concat(j, "M"), type: 'number' }); // (y > 0 ? `${y}Y` : '') + `${j - y * 12}M`
    }
    columns.length = colLength; // we cut the array in case < 2;
    return { columns: columns, rows: data };
};
exports.getBasicGridData = getBasicGridData;
