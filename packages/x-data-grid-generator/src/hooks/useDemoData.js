"use strict";
'use client';
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
exports.useDemoData = exports.getInitialState = exports.getColumnsFromOptions = exports.deepFreeze = void 0;
exports.extrapolateSeed = extrapolateSeed;
var React = require("react");
var lru_cache_1 = require("lru-cache");
var real_data_service_1 = require("../services/real-data-service");
var commodities_columns_1 = require("../columns/commodities.columns");
var employees_columns_1 = require("../columns/employees.columns");
var asyncWorker_1 = require("../services/asyncWorker");
var tree_data_generator_1 = require("../services/tree-data-generator");
var dataCache = new lru_cache_1.LRUCache({
    max: 10,
    ttl: 60 * 5 * 1e3, // 5 minutes
});
// Generate fake data from a seed.
// It's about x20 faster than getRealData.
function extrapolateSeed(rowLength, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    var seed = data.rows;
                    var rows = data.rows.slice();
                    var tasks = { current: rowLength - seed.length };
                    function work() {
                        var row = {};
                        for (var j = 0; j < data.columns.length; j += 1) {
                            var column = data.columns[j];
                            var index = Math.round(Math.random() * (seed.length - 1));
                            if (column.field === 'id') {
                                row.id = "id-".concat(tasks.current + seed.length);
                            }
                            else {
                                row[column.field] = seed[index][column.field];
                            }
                        }
                        rows.push(row);
                        tasks.current -= 1;
                    }
                    (0, asyncWorker_1.default)({
                        work: work,
                        done: function () { return resolve(__assign(__assign({}, data), { rows: rows })); },
                        tasks: tasks,
                    });
                })];
        });
    });
}
var deepFreeze = function (object) {
    // Retrieve the property names defined on object
    var propNames = Object.getOwnPropertyNames(object);
    // Freeze properties before freezing self
    for (var _i = 0, propNames_1 = propNames; _i < propNames_1.length; _i++) {
        var name_1 = propNames_1[_i];
        var value = object[name_1];
        if (value && typeof value === 'object') {
            (0, exports.deepFreeze)(value);
        }
    }
    return Object.freeze(object);
};
exports.deepFreeze = deepFreeze;
var getColumnsFromOptions = function (options) {
    var columns = options.dataSet === 'Commodity' ? (0, commodities_columns_1.getCommodityColumns)(options.editable) : (0, employees_columns_1.getEmployeeColumns)();
    if (options.visibleFields) {
        columns = columns.map(function (col) { var _a; return (__assign(__assign({}, col), { hide: !((_a = options.visibleFields) === null || _a === void 0 ? void 0 : _a.includes(col.field)) })); });
    }
    if (options.maxColumns) {
        columns = columns.slice(0, options.maxColumns);
    }
    return columns;
};
exports.getColumnsFromOptions = getColumnsFromOptions;
var getInitialState = function (options, columns) {
    var _a;
    var columnVisibilityModel = {};
    columns.forEach(function (col) {
        if (col.hide) {
            columnVisibilityModel[col.field] = false;
        }
    });
    var groupingField = (_a = options.treeData) === null || _a === void 0 ? void 0 : _a.groupingField;
    if (groupingField) {
        columnVisibilityModel[groupingField] = false;
    }
    return { columns: { columnVisibilityModel: columnVisibilityModel } };
};
exports.getInitialState = getInitialState;
var useDemoData = function (options) {
    var _a, _b, _c;
    var _d = React.useState(options.rowLength), rowLength = _d[0], setRowLength = _d[1];
    var _e = React.useState(0), index = _e[0], setIndex = _e[1];
    var _f = React.useState(true), loading = _f[0], setLoading = _f[1];
    var columns = React.useMemo(function () {
        return (0, exports.getColumnsFromOptions)({
            dataSet: options.dataSet,
            editable: options.editable,
            maxColumns: options.maxColumns,
            visibleFields: options.visibleFields,
        });
    }, [options.dataSet, options.editable, options.maxColumns, options.visibleFields]);
    var _g = React.useState(function () {
        return (0, tree_data_generator_1.addTreeDataOptionsToDemoData)({
            columns: columns,
            rows: [],
            initialState: (0, exports.getInitialState)(options, columns),
        }, options.treeData);
    }), data = _g[0], setData = _g[1];
    React.useEffect(function () {
        var cacheKey = "".concat(options.dataSet, "-").concat(rowLength, "-").concat(index, "-").concat(options.maxColumns);
        // Cache to allow fast switch between the JavaScript and TypeScript version
        // of the demos.
        if (dataCache.has(cacheKey)) {
            var newData = dataCache.get(cacheKey);
            setData(newData);
            setLoading(false);
            return undefined;
        }
        var active = true;
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var newData;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        setLoading(true);
                        if (!(rowLength > 1000)) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, real_data_service_1.getRealGridData)(1000, columns)];
                    case 1:
                        newData = _d.sent();
                        return [4 /*yield*/, extrapolateSeed(rowLength, newData)];
                    case 2:
                        newData = _d.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, (0, real_data_service_1.getRealGridData)(rowLength, columns)];
                    case 4:
                        newData = _d.sent();
                        _d.label = 5;
                    case 5:
                        if (!active) {
                            return [2 /*return*/];
                        }
                        newData = (0, tree_data_generator_1.addTreeDataOptionsToDemoData)(newData, {
                            maxDepth: (_a = options.treeData) === null || _a === void 0 ? void 0 : _a.maxDepth,
                            groupingField: (_b = options.treeData) === null || _b === void 0 ? void 0 : _b.groupingField,
                            averageChildren: (_c = options.treeData) === null || _c === void 0 ? void 0 : _c.averageChildren,
                        });
                        // It's quite slow. No need for it in production.
                        if (process.env.NODE_ENV !== 'production') {
                            (0, exports.deepFreeze)(newData);
                        }
                        dataCache.set(cacheKey, newData);
                        setData(newData);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); })();
        return function () {
            active = false;
        };
    }, [
        rowLength,
        options.dataSet,
        options.maxColumns,
        (_a = options.treeData) === null || _a === void 0 ? void 0 : _a.maxDepth,
        (_b = options.treeData) === null || _b === void 0 ? void 0 : _b.groupingField,
        (_c = options.treeData) === null || _c === void 0 ? void 0 : _c.averageChildren,
        index,
        columns,
    ]);
    return {
        data: data,
        loading: loading,
        setRowLength: setRowLength,
        loadNewData: function () {
            setIndex(function (oldIndex) { return oldIndex + 1; });
        },
    };
};
exports.useDemoData = useDemoData;
