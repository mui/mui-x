"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultCellValue = void 0;
var getDefaultCellValue = function (colDef) {
    switch (colDef.type) {
        case 'boolean':
            return false;
        case 'date':
        case 'dateTime':
        case 'number':
            return undefined;
        case 'singleSelect':
            return null;
        case 'string':
        default:
            return '';
    }
};
exports.getDefaultCellValue = getDefaultCellValue;
