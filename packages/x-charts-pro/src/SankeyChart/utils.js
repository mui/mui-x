"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeAlignFunction = void 0;
var d3Sankey_1 = require("./d3Sankey");
var getNodeAlignFunction = function (align) {
    switch (align) {
        case 'left':
            return d3Sankey_1.sankeyLeft;
        case 'right':
            return d3Sankey_1.sankeyRight;
        case 'center':
            return d3Sankey_1.sankeyCenter;
        case 'justify':
        default:
            return d3Sankey_1.sankeyJustify;
    }
};
exports.getNodeAlignFunction = getNodeAlignFunction;
