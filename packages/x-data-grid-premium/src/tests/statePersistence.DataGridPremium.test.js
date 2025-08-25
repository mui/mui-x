"use strict";
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
var React = require("react");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
var rows = [
    { id: 0, category: 'Cat A' },
    { id: 1, category: 'Cat A' },
    { id: 2, category: 'Cat A' },
    { id: 3, category: 'Cat B' },
    { id: 4, category: 'Cat B' },
    { id: 5, category: 'Cat B' },
];
var columns = [
    {
        field: 'id',
        type: 'number',
    },
    {
        field: 'category',
    },
];
var FULL_INITIAL_STATE = {
    columns: {
        orderedFields: ['__row_group_by_columns_group__', 'id', 'category'],
    },
    rowGrouping: {
        model: ['category'],
    },
    aggregation: {
        model: {
            id: 'size',
        },
    },
};
describe('<DataGridPremium /> - State persistence', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function TestCase(props) {
        apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_premium_1.DataGridPremium rows={rows} columns={columns} pagination autoHeight={isJSDOM} apiRef={apiRef} disableVirtualization {...props} defaultGroupingExpansionDepth={-1} groupingColDef={{ headerName: 'Group' }}/>
      </div>);
    }
    describe('apiRef: exportState', function () {
        it('should export the initial values of the models', function () { return __awaiter(void 0, void 0, void 0, function () {
            var exportedState;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        render(<TestCase initialState={FULL_INITIAL_STATE}/>);
                        exportedState = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportState();
                        expect(exportedState === null || exportedState === void 0 ? void 0 : exportedState.rowGrouping).to.deep.equal(FULL_INITIAL_STATE.rowGrouping);
                        expect(exportedState === null || exportedState === void 0 ? void 0 : exportedState.aggregation).to.deep.equal(FULL_INITIAL_STATE.aggregation);
                        return [4 /*yield*/, (0, helperFn_1.microtasks)()];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not export the default values of the models when using exportOnlyDirtyModels', function () {
            var _a;
            render(<TestCase />);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportState({ exportOnlyDirtyModels: true })).to.deep.equal({
                columns: {
                    orderedFields: ['id', 'category'],
                },
            });
        });
        it('should export the current version of the exportable state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var exportedState;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        render(<TestCase />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                var _a;
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowGroupingModel(['category']);
                            })];
                    case 1:
                        _b.sent();
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setAggregationModel({
                                id: 'size',
                            });
                        });
                        exportedState = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportState();
                        expect(exportedState === null || exportedState === void 0 ? void 0 : exportedState.rowGrouping).to.deep.equal(FULL_INITIAL_STATE.rowGrouping);
                        expect(exportedState === null || exportedState === void 0 ? void 0 : exportedState.aggregation).to.deep.equal(FULL_INITIAL_STATE.aggregation);
                        return [4 /*yield*/, (0, helperFn_1.microtasks)()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should export the current version of the exportable state when using exportOnlyDirtyModels', function () { return __awaiter(void 0, void 0, void 0, function () {
            var exportedState;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        render(<TestCase />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () {
                                var _a;
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowGroupingModel(['category']);
                            })];
                    case 1:
                        _b.sent();
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setAggregationModel({
                                id: 'size',
                            });
                        });
                        exportedState = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportState({ exportOnlyDirtyModels: true });
                        expect(exportedState === null || exportedState === void 0 ? void 0 : exportedState.rowGrouping).to.deep.equal(FULL_INITIAL_STATE.rowGrouping);
                        expect(exportedState === null || exportedState === void 0 ? void 0 : exportedState.aggregation).to.deep.equal(FULL_INITIAL_STATE.aggregation);
                        return [4 /*yield*/, (0, helperFn_1.microtasks)()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should export the controlled values of the models', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        render(<TestCase rowGroupingModel={(_a = FULL_INITIAL_STATE.rowGrouping) === null || _a === void 0 ? void 0 : _a.model} aggregationModel={(_b = FULL_INITIAL_STATE.aggregation) === null || _b === void 0 ? void 0 : _b.model}/>);
                        expect((_c = apiRef.current) === null || _c === void 0 ? void 0 : _c.exportState().rowGrouping).to.deep.equal(FULL_INITIAL_STATE.rowGrouping);
                        expect((_d = apiRef.current) === null || _d === void 0 ? void 0 : _d.exportState().aggregation).to.deep.equal(FULL_INITIAL_STATE.aggregation);
                        return [4 /*yield*/, (0, helperFn_1.microtasks)()];
                    case 1:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should export the controlled values of the models when using exportOnlyDirtyModels', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        render(<TestCase rowGroupingModel={(_a = FULL_INITIAL_STATE.rowGrouping) === null || _a === void 0 ? void 0 : _a.model} aggregationModel={(_b = FULL_INITIAL_STATE.aggregation) === null || _b === void 0 ? void 0 : _b.model}/>);
                        expect((_c = apiRef.current) === null || _c === void 0 ? void 0 : _c.exportState().rowGrouping).to.deep.equal(FULL_INITIAL_STATE.rowGrouping);
                        expect((_d = apiRef.current) === null || _d === void 0 ? void 0 : _d.exportState().aggregation).to.deep.equal(FULL_INITIAL_STATE.aggregation);
                        return [4 /*yield*/, (0, helperFn_1.microtasks)()];
                    case 1:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('apiRef: restoreState', function () {
        it('should restore the whole exportable state', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestCase />);
                        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.restoreState(FULL_INITIAL_STATE); });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                                    'Cat A (3)',
                                    '',
                                    '',
                                    '',
                                    'Cat B (3)',
                                    '',
                                    '',
                                    '',
                                    '',
                                ]);
                            })];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                            '3' /* Agg */,
                            '0',
                            '1',
                            '2',
                            '3',
                            '3' /* Agg */,
                            '4',
                            '5',
                            '6' /* Agg */,
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
