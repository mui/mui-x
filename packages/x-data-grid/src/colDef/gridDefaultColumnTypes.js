"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGridDefaultColumnTypes = exports.DEFAULT_GRID_COL_TYPE_KEY = void 0;
var gridStringColDef_1 = require("./gridStringColDef");
var gridNumericColDef_1 = require("./gridNumericColDef");
var gridDateColDef_1 = require("./gridDateColDef");
var gridBooleanColDef_1 = require("./gridBooleanColDef");
var gridSingleSelectColDef_1 = require("./gridSingleSelectColDef");
var gridActionsColDef_1 = require("./gridActionsColDef");
exports.DEFAULT_GRID_COL_TYPE_KEY = 'string';
var getGridDefaultColumnTypes = function () {
    var _a;
    var nativeColumnTypes = (_a = {
            string: gridStringColDef_1.GRID_STRING_COL_DEF,
            number: gridNumericColDef_1.GRID_NUMERIC_COL_DEF,
            date: gridDateColDef_1.GRID_DATE_COL_DEF,
            dateTime: gridDateColDef_1.GRID_DATETIME_COL_DEF,
            boolean: gridBooleanColDef_1.GRID_BOOLEAN_COL_DEF,
            singleSelect: gridSingleSelectColDef_1.GRID_SINGLE_SELECT_COL_DEF
        },
        _a[gridActionsColDef_1.GRID_ACTIONS_COLUMN_TYPE] = gridActionsColDef_1.GRID_ACTIONS_COL_DEF,
        _a.custom = gridStringColDef_1.GRID_STRING_COL_DEF,
        _a);
    return nativeColumnTypes;
};
exports.getGridDefaultColumnTypes = getGridDefaultColumnTypes;
