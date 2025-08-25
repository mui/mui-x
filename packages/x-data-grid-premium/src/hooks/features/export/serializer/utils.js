"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addColumnGroupingHeaders = exports.getExcelJs = void 0;
exports.addSerializedRowToWorksheet = addSerializedRowToWorksheet;
exports.createValueOptionsSheetIfNeeded = createValueOptionsSheetIfNeeded;
var getExcelJs = function () { return __awaiter(void 0, void 0, void 0, function () {
    var excelJsModule;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require('exceljs'); })];
            case 1:
                excelJsModule = _b.sent();
                return [2 /*return*/, (_a = excelJsModule.default) !== null && _a !== void 0 ? _a : excelJsModule];
        }
    });
}); };
exports.getExcelJs = getExcelJs;
var addColumnGroupingHeaders = function (worksheet, columns, columnGroupPaths, columnGroupDetails) {
    var maxDepth = Math.max.apply(Math, columns.map(function (_a) {
        var _b, _c;
        var key = _a.key;
        return (_c = (_b = columnGroupPaths[key]) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
    }));
    if (maxDepth === 0) {
        return;
    }
    var _loop_1 = function (rowIndex) {
        var row = columns.map(function (_a) {
            var key = _a.key;
            var groupingPath = columnGroupPaths[key];
            if (groupingPath.length <= rowIndex) {
                return { groupId: null, parents: groupingPath };
            }
            return __assign(__assign({}, columnGroupDetails[groupingPath[rowIndex]]), { parents: groupingPath.slice(0, rowIndex) });
        });
        var newRow = worksheet.addRow(row.map(function (group) { var _a; return (group.groupId === null ? null : ((_a = group === null || group === void 0 ? void 0 : group.headerName) !== null && _a !== void 0 ? _a : group.groupId)); }));
        // use `rowCount`, since worksheet can have additional rows added in `exceljsPreProcess`
        var lastRowIndex = newRow.worksheet.rowCount;
        var leftIndex = 0;
        var rightIndex = 1;
        var _loop_2 = function () {
            var _a = row[leftIndex], leftGroupId = _a.groupId, leftParents = _a.parents;
            var _b = row[rightIndex], rightGroupId = _b.groupId, rightParents = _b.parents;
            var areInSameGroup = leftGroupId === rightGroupId &&
                leftParents.length === rightParents.length &&
                leftParents.every(function (leftParent, index) { return rightParents[index] === leftParent; });
            if (areInSameGroup) {
                rightIndex += 1;
            }
            else {
                if (rightIndex - leftIndex > 1) {
                    worksheet.mergeCells(lastRowIndex, leftIndex + 1, lastRowIndex, rightIndex);
                }
                leftIndex = rightIndex;
                rightIndex += 1;
            }
        };
        while (rightIndex < columns.length) {
            _loop_2();
        }
        if (rightIndex - leftIndex > 1) {
            worksheet.mergeCells(lastRowIndex, leftIndex + 1, lastRowIndex, rightIndex);
        }
    };
    for (var rowIndex = 0; rowIndex < maxDepth; rowIndex += 1) {
        _loop_1(rowIndex);
    }
};
exports.addColumnGroupingHeaders = addColumnGroupingHeaders;
function addSerializedRowToWorksheet(serializedRow, worksheet) {
    var row = serializedRow.row, dataValidation = serializedRow.dataValidation, outlineLevel = serializedRow.outlineLevel, mergedCells = serializedRow.mergedCells;
    var newRow = worksheet.addRow(row);
    Object.keys(dataValidation).forEach(function (field) {
        newRow.getCell(field).dataValidation = __assign({}, dataValidation[field]);
    });
    if (outlineLevel) {
        newRow.outlineLevel = outlineLevel;
    }
    // use `rowCount`, since worksheet can have additional rows added in `exceljsPreProcess`
    var lastRowIndex = newRow.worksheet.rowCount;
    mergedCells.forEach(function (mergedCell) {
        worksheet.mergeCells(lastRowIndex, mergedCell.leftIndex, lastRowIndex, mergedCell.rightIndex);
    });
}
function createValueOptionsSheetIfNeeded(valueOptionsData, sheetName, workbook) {
    return __awaiter(this, void 0, void 0, function () {
        var valueOptionsWorksheet;
        return __generator(this, function (_a) {
            if (Object.keys(valueOptionsData).length === 0) {
                return [2 /*return*/];
            }
            valueOptionsWorksheet = workbook.addWorksheet(sheetName);
            valueOptionsWorksheet.columns = Object.keys(valueOptionsData).map(function (key) { return ({ key: key }); });
            Object.entries(valueOptionsData).forEach(function (_a) {
                var field = _a[0], values = _a[1].values;
                valueOptionsWorksheet.getColumn(field).values = values;
            });
            return [2 /*return*/];
        });
    });
}
