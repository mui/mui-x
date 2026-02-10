"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seriesContextBuilder = void 0;
var seriesContextBuilder = function (context) {
    return ({
        type: 'series',
        color: context.color,
        label: context.label,
        seriesId: context.seriesId,
        itemId: context.itemId,
        dataIndex: context.dataIndex,
    });
};
exports.seriesContextBuilder = seriesContextBuilder;
