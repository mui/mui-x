"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getColor = function (series) {
    return function (dataIndex) {
        return series.data[dataIndex].color;
    };
};
exports.default = getColor;
