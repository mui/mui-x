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
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var fireUserEvent_1 = require("test/utils/fireUserEvent");
var sinon_1 = require("sinon");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var skipIf_1 = require("test/utils/skipIf");
var baselineProps = {
    autoHeight: skipIf_1.isJSDOM,
    disableVirtualization: true,
    rows: [
        { id: 0, category1: 'Cat A', category2: 'Cat 1' },
        { id: 1, category1: 'Cat A', category2: 'Cat 2' },
        { id: 2, category1: 'Cat A', category2: 'Cat 2' },
        { id: 3, category1: 'Cat A', category2: 'Cat 2' },
        { id: 4, category1: 'Cat A', category2: 'Cat 1' },
        { id: 5, category1: 'Cat B', category2: 'Cat 1' },
    ],
    columns: [
        {
            field: 'id',
            type: 'number',
        },
        {
            field: 'category1',
        },
        {
            field: 'category2',
        },
    ],
};
describe('<DataGridPremium /> - Aggregation', function () {
    var originalRender = (0, internal_test_utils_1.createRenderer)().render;
    var render = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () {
            var utils;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        utils = originalRender.apply(void 0, args);
                        return [4 /*yield*/, (0, helperFn_1.microtasks)()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, utils];
                }
            });
        });
    };
    var apiRef;
    function Test(props) {
        apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_premium_1.DataGridPremium {...baselineProps} apiRef={apiRef} {...props}/>
      </div>);
    }
    describe('Setting aggregation model', function () {
        describe('initialState: aggregation.model', function () {
            it('should allow to initialize aggregation', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'max' } } }}/>)];
                        case 1:
                            _a.sent();
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not react to initial state updates', function () { return __awaiter(void 0, void 0, void 0, function () {
                var setProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'max' } } }}/>)];
                        case 1:
                            setProps = (_a.sent()).setProps;
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
                            setProps({ initialState: { aggregation: { model: { id: 'min' } } } });
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('prop: aggregationModel', function () {
            it('should not call onAggregationModelChange on initialisation or on aggregationModel prop change', function () { return __awaiter(void 0, void 0, void 0, function () {
                var onAggregationModelChange, setProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onAggregationModelChange = (0, sinon_1.spy)();
                            return [4 /*yield*/, render(<Test aggregationModel={{ id: 'max' }} onAggregationModelChange={onAggregationModelChange}/>)];
                        case 1:
                            setProps = (_a.sent()).setProps;
                            expect(onAggregationModelChange.callCount).to.equal(0);
                            setProps({ id: 'min' });
                            expect(onAggregationModelChange.callCount).to.equal(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should allow to update the aggregation model from the outside', function () { return __awaiter(void 0, void 0, void 0, function () {
                var setProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, render(<Test aggregationModel={{ id: 'max' }}/>)];
                        case 1:
                            setProps = (_a.sent()).setProps;
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
                            setProps({ aggregationModel: { id: 'min' } });
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '0' /* Agg */]);
                                })];
                        case 2:
                            _a.sent();
                            setProps({ aggregationModel: {} });
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should ignore aggregation rule that do not match any column', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, render(<Test initialState={{
                                    aggregation: { model: { id: 'max', idBis: 'max' } },
                                }}/>)];
                        case 1:
                            _a.sent();
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should respect aggregation rule with colDef.aggregable = false', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, render(<Test columns={[
                                    {
                                        field: 'id',
                                        type: 'number',
                                    },
                                    {
                                        field: 'idBis',
                                        type: 'number',
                                        valueGetter: function (valuem, row) { return row.id; },
                                        aggregable: false,
                                    },
                                ]} initialState={{
                                    aggregation: { model: { id: 'max', idBis: 'max' } },
                                }}/>)];
                        case 1:
                            _a.sent();
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
                            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should ignore aggregation rules with invalid aggregation functions', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'mux' } } }}/>)];
                        case 1:
                            _a.sent();
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should correctly restore the column when changing from aggregated to non-aggregated', function () { return __awaiter(void 0, void 0, void 0, function () {
                var setProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, render(<Test aggregationModel={{ id: 'max' }}/>)];
                        case 1:
                            setProps = (_a.sent()).setProps;
                            expect((0, helperFn_1.getColumnHeaderCell)(0, 0).textContent).to.equal('idmax');
                            setProps({ aggregationModel: {} });
                            expect((0, helperFn_1.getColumnHeaderCell)(0, 0).textContent).to.equal('id');
                            return [2 /*return*/];
                    }
                });
            }); });
            // See https://github.com/mui/mui-x/issues/10864
            it('should correctly handle changing aggregated column from non-editable to editable', function () { return __awaiter(void 0, void 0, void 0, function () {
                var column, setProps, cell;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            column = { field: 'value', type: 'number', editable: false };
                            return [4 /*yield*/, render(<Test columns={[column]} rows={[
                                        { id: 1, value: 1 },
                                        { id: 2, value: 10 },
                                    ]} aggregationModel={{ value: 'sum' }}/>)];
                        case 1:
                            setProps = (_a.sent()).setProps;
                            cell = (0, helperFn_1.getCell)(0, 0);
                            internal_test_utils_1.fireEvent.doubleClick(cell);
                            expect(cell.querySelector('input')).to.equal(null);
                            setProps({ columns: [__assign(__assign({}, column), { editable: true })] });
                            internal_test_utils_1.fireEvent.doubleClick(cell);
                            expect(cell.querySelector('input')).not.to.equal(null);
                            fireUserEvent_1.fireUserEvent.mousePress((0, helperFn_1.getCell)(1, 0));
                            setProps({ columns: [column] });
                            return [4 /*yield*/, (0, helperFn_1.microtasks)()];
                        case 2:
                            _a.sent();
                            internal_test_utils_1.fireEvent.doubleClick(cell);
                            expect(cell.querySelector('input')).to.equal(null);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('Row Grouping', function () {
        it('should aggregate on the grouping row and on the global footer', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{
                                rowGrouping: { model: ['category1'] },
                                aggregation: { model: { id: 'max' } },
                            }} defaultGroupingExpansionDepth={-1}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                            '4' /* Agg "Cat A" */,
                            '0',
                            '1',
                            '2',
                            '3',
                            '4',
                            '5' /* Agg "Cat B" */,
                            '5',
                            '5' /* Agg root */,
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update aggregation values after filtering', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{
                                rowGrouping: { model: ['category2'] },
                                aggregation: { model: { id: 'sum' } },
                            }}/>)];
                    case 1:
                        setProps = (_a.sent()).setProps;
                        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                            '9', // Agg "Cat 1"
                            '6', // Agg "Cat 2"
                            '15', // Agg root
                        ]);
                        setProps({
                            filterModel: {
                                items: [{ field: 'category1', operator: 'contains', value: 'Cat B' }],
                            },
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                                    '5', // Agg "Cat 1"
                                    '5', // Agg root
                                ]);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should apply sorting on the aggregated values', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, header;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{
                                rowGrouping: { model: ['category1'] },
                                aggregation: { model: { id: 'sum' } },
                            }}/>)];
                    case 1:
                        user = (_a.sent()).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                                    '10' /* Agg "Cat A" */,
                                    '5' /* Agg "Cat B" */,
                                    '15' /* Agg root */,
                                ]);
                            })];
                    case 2:
                        _a.sent();
                        header = (0, helperFn_1.getColumnHeaderCell)(1);
                        return [4 /*yield*/, user.click(header)];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['5' /* Agg "Cat B" */, '10' /* Agg "Cat A" */, '15' /* Agg root */], 'sorted asc');
                        return [4 /*yield*/, user.click(header)];
                    case 4:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['10' /* Agg "Cat A" */, '5' /* Agg "Cat B" */, '15' /* Agg root */], 'sorted desc');
                        return [2 /*return*/];
                }
            });
        }); });
        describe('prop: getAggregationPosition', function () {
            it('should not aggregate groups if props.getAggregationPosition returns null', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, render(<Test initialState={{
                                    rowGrouping: { model: ['category1'] },
                                    aggregation: { model: { id: 'max' } },
                                }} defaultGroupingExpansionDepth={-1} getAggregationPosition={function (group) { return ((group === null || group === void 0 ? void 0 : group.groupingKey) === 'Cat A' ? 'inline' : null); }}/>)];
                        case 1:
                            _a.sent();
                            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                                '4' /* Agg "Cat A" */,
                                '0',
                                '1',
                                '2',
                                '3',
                                '4',
                                '',
                                '5',
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should react to props.getAggregationPosition update', function () { return __awaiter(void 0, void 0, void 0, function () {
                var setProps;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, render(<Test initialState={{
                                    rowGrouping: { model: ['category1'] },
                                    aggregation: { model: { id: 'max' } },
                                }} defaultGroupingExpansionDepth={-1} 
                            // Only group "Cat A" aggregated inline
                            getAggregationPosition={function (group) { return ((group === null || group === void 0 ? void 0 : group.groupingKey) === 'Cat A' ? 'inline' : null); }}/>)];
                        case 1:
                            setProps = (_a.sent()).setProps;
                            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                                '4' /* Agg "Cat A" */,
                                '0',
                                '1',
                                '2',
                                '3',
                                '4',
                                '',
                                '5',
                            ]);
                            // All groups aggregated inline except the root
                            setProps({
                                getAggregationPosition: function (group) { return (group.depth === -1 ? null : 'inline'); },
                            });
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                                        '4' /* Agg "Cat A" */,
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4',
                                        '5' /* Agg "Cat B" */,
                                        '5',
                                    ]);
                                })];
                        case 2:
                            _a.sent();
                            // All groups aggregated in footer except the root
                            setProps({
                                getAggregationPosition: function (group) { return (group.depth === -1 ? null : 'footer'); },
                            });
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                                        '',
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4',
                                        '4' /* Agg "Cat A" */,
                                        '',
                                        '5',
                                        '5' /* Agg "Cat B" */,
                                    ]);
                                })];
                        case 3:
                            _a.sent();
                            // All groups aggregated on footer
                            setProps({ getAggregationPosition: function () { return 'footer'; } });
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                                        '',
                                        '0',
                                        '1',
                                        '2',
                                        '3',
                                        '4',
                                        '4' /* Agg "Cat A" */,
                                        '',
                                        '5',
                                        '5' /* Agg "Cat B" */,
                                        '5' /* Agg root */,
                                    ]);
                                })];
                        case 4:
                            _a.sent();
                            // 0 group aggregated
                            setProps({ getAggregationPosition: function () { return null; } });
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '0', '1', '2', '3', '4', '', '5']);
                                })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('Tree data', function () {
        function TreeDataTest(props) {
            return (<Test treeData defaultGroupingExpansionDepth={-1} columns={[
                    {
                        field: 'value',
                        headerName: 'Value',
                        type: 'number',
                    },
                ]} getTreeDataPath={function (row) { return row.hierarchy; }} getRowId={function (row) { return row.hierarchy.join('/'); }} groupingColDef={{ headerName: 'Files', width: 350 }} getAggregationPosition={function (rowNode) { return (rowNode != null ? 'inline' : null); }} initialState={{
                    aggregation: {
                        model: {
                            value: 'sum',
                        },
                    },
                }} {...props}/>);
        }
        it('should use aggregated values instead of provided values on data groups', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<TreeDataTest rows={[
                                {
                                    hierarchy: ['A'],
                                    value: 10,
                                },
                                {
                                    hierarchy: ['A', 'A'],
                                    value: 1,
                                },
                                {
                                    hierarchy: ['A', 'B'],
                                    value: 2,
                                },
                            ]}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['3' /* Agg "A" */, '1', '2']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should only aggregate based on leaves', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<TreeDataTest rows={[
                                {
                                    hierarchy: ['A'],
                                    value: 2,
                                },
                                {
                                    hierarchy: ['A', 'A'],
                                    value: 2,
                                },
                                {
                                    hierarchy: ['A', 'A', 'A'],
                                    value: 1,
                                },
                                {
                                    hierarchy: ['A', 'A', 'B'],
                                    value: 1,
                                },
                            ]}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['2' /* Agg "A" */, '2' /* Agg "A.A" */, '1', '1']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Column menu', function () {
        it('should render select on aggregable column', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test />)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('id')];
                            }); }); })];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByLabelText('Aggregation')).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update the aggregation when changing "Aggregation" select value', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test />)];
                    case 1:
                        user = (_a.sent()).user;
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('id')];
                            }); }); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText('Aggregation'))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, internal_test_utils_1.within)(internal_test_utils_1.screen.getByRole('listbox', {
                                name: 'Aggregation',
                            })).getByText('max'))];
                    case 4:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: aggregatedRows', function () {
        it('should aggregate based on the filtered rows if props.aggregatedRows is not defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{
                                filter: {
                                    filterModel: { items: [{ field: 'id', operator: '<', value: 4 }] },
                                },
                                aggregation: { model: { id: 'max' } },
                            }}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '3' /* Agg */]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should aggregate based on the filtered rows if props.aggregatedRows = "filtered"', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{
                                filter: {
                                    filterModel: { items: [{ field: 'id', operator: '<', value: 4 }] },
                                },
                                aggregation: { model: { id: 'max' } },
                            }} aggregationRowsScope="filtered"/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '3' /* Agg */]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should aggregate based on all the rows if props.aggregatedRows = "all"', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{
                                filter: {
                                    filterModel: { items: [{ field: 'id', operator: '<', value: 4 }] },
                                },
                                aggregation: { model: { id: 'max' } },
                            }} aggregationRowsScope="all"/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '5' /* Agg */]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: aggregationFunctions', function () {
        it('should ignore aggregation rules not present in props.aggregationFunctions', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'max' } } }} aggregationFunctions={{
                                min: x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.min,
                            }}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should react to props.aggregationFunctions update', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps, customMax;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'max' } } }} aggregationFunctions={{
                                min: x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.min,
                            }}/>)];
                    case 1:
                        setProps = (_a.sent()).setProps;
                        // 'max' is not in props.aggregationFunctions
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
                        setProps({
                            aggregationFunctions: {
                                min: x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.min,
                                max: x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.max,
                            },
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                // 'max' is in props.aggregationFunctions
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
                            })];
                    case 2:
                        _a.sent();
                        customMax = __assign(__assign({}, x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.max), { apply: function (params) {
                                return "Agg: ".concat(x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.max.apply(params, apiRef.current));
                            } });
                        setProps({ aggregationFunctions: { min: x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.min, max: customMax } });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                // 'max' is in props.aggregationFunctions but has changed
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                                    '0',
                                    '1',
                                    '2',
                                    '3',
                                    '4',
                                    '5',
                                    'Agg: 5' /* Agg */,
                                ]);
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('colDef: aggregable', function () {
        it('should respect `initialState.aggregation.model` prop even if colDef.aggregable = false', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'max' } } }} columns={[
                                {
                                    field: 'id',
                                    type: 'number',
                                    aggregable: false,
                                },
                            ]}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should respect `aggregationModel` prop even if colDef.aggregable = false', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test aggregationModel={{ id: 'max' }} columns={[
                                {
                                    field: 'id',
                                    type: 'number',
                                    aggregable: false,
                                },
                            ]}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not render column menu select if colDef.aggregable = false', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'max' } } }} columns={[
                                {
                                    field: 'id',
                                    type: 'number',
                                    aggregable: false,
                                },
                            ]}/>)];
                    case 1:
                        _a.sent();
                        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('id'); });
                        expect(internal_test_utils_1.screen.queryAllByLabelText('Aggregation')).to.have.length(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('colDef: availableAggregationFunctions', function () {
        it('should ignore aggregation rules not present in props.aggregationFunctions', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'max' } } }} columns={[
                                {
                                    field: 'id',
                                    type: 'number',
                                    availableAggregationFunctions: ['min'],
                                },
                            ]}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should react to colDef.availableAggregationFunctions update', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'max' } } }} columns={[
                                {
                                    field: 'id',
                                    type: 'number',
                                    availableAggregationFunctions: ['min'],
                                },
                            ]}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateColumns([
                                { field: 'id', availableAggregationFunctions: ['min', 'max'] },
                            ]);
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '5' /* Agg */]);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('colDef: valueFormatter', function () {
        it('should use the column valueFormatter for aggregation function without custom valueFormatter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customAggregationFunction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customAggregationFunction = {
                            apply: function () { return 'Agg value'; },
                        };
                        return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'custom' } } }} aggregationFunctions={{ custom: customAggregationFunction }} columns={[
                                    {
                                        field: 'id',
                                        type: 'number',
                                        valueFormatter: function (value) { return "- ".concat(value); },
                                    },
                                ]}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                            '- 0',
                            '- 1',
                            '- 2',
                            '- 3',
                            '- 4',
                            '- 5',
                            '- Agg value' /* Agg */,
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use the aggregation function valueFormatter if defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customAggregationFunction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customAggregationFunction = {
                            apply: function () { return 'Agg value'; },
                            valueFormatter: function (value) { return "+ ".concat(value); },
                        };
                        return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'custom' } } }} aggregationFunctions={{ custom: customAggregationFunction }} columns={[
                                    {
                                        field: 'id',
                                        type: 'number',
                                        valueFormatter: function (value) { return "- ".concat(value); },
                                    },
                                ]}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                            '- 0',
                            '- 1',
                            '- 2',
                            '- 3',
                            '- 4',
                            '- 5',
                            '+ Agg value' /* Agg */,
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('colDef: renderCell', function () {
        it('should use the column renderCell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customAggregationFunction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customAggregationFunction = {
                            apply: function () { return 'Agg value'; },
                        };
                        return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'custom' } } }} aggregationFunctions={{ custom: customAggregationFunction }} columns={[
                                    {
                                        field: 'id',
                                        type: 'number',
                                        renderCell: function (params) { return "- ".concat(params.value); },
                                    },
                                ]}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                            '- 0',
                            '- 1',
                            '- 2',
                            '- 3',
                            '- 4',
                            '- 5',
                            '- Agg value' /* Agg */,
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should pass aggregation meta with `hasCellUnit: true` if the aggregation function have no hasCellUnit property ', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renderCell, customAggregationFunction, callForAggCell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderCell = (0, sinon_1.spy)(function (params) { return "- ".concat(params.value); });
                        customAggregationFunction = {
                            apply: function () { return 'Agg value'; },
                        };
                        return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'custom' } } }} aggregationFunctions={{ custom: customAggregationFunction }} columns={[
                                    {
                                        field: 'id',
                                        type: 'number',
                                        renderCell: renderCell,
                                    },
                                ]}/>)];
                    case 1:
                        _a.sent();
                        callForAggCell = renderCell
                            .getCalls()
                            .find(function (call) { return call.firstArg.rowNode.type === 'pinnedRow' && call.firstArg.aggregation; });
                        expect(callForAggCell.firstArg.aggregation.hasCellUnit).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should pass aggregation meta with `hasCellUnit: false` if the aggregation function have `hasCellUnit: false` ', function () { return __awaiter(void 0, void 0, void 0, function () {
            var renderCell, customAggregationFunction, callForAggCell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        renderCell = (0, sinon_1.spy)(function (params) { return "- ".concat(params.value); });
                        customAggregationFunction = {
                            apply: function () { return 'Agg value'; },
                            hasCellUnit: false,
                        };
                        return [4 /*yield*/, render(<Test initialState={{ aggregation: { model: { id: 'custom' } } }} aggregationFunctions={{ custom: customAggregationFunction }} columns={[
                                    {
                                        field: 'id',
                                        type: 'number',
                                        renderCell: renderCell,
                                    },
                                ]}/>)];
                    case 1:
                        _a.sent();
                        callForAggCell = renderCell
                            .getCalls()
                            .find(function (call) { return call.firstArg.rowNode.type === 'pinnedRow' && call.firstArg.aggregation; });
                        expect(callForAggCell.firstArg.aggregation.hasCellUnit).to.equal(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('filter', function () {
        it('should not filter-out the aggregated cells', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{
                                aggregation: { model: { id: 'sum' } },
                                filter: {
                                    filterModel: {
                                        items: [{ field: 'id', operator: '!=', value: 15 }],
                                    },
                                },
                            }}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5', '15' /* Agg */]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('sorting', function () {
        it('should always render top level footer below the other rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{
                                aggregation: { model: { id: 'sum' } },
                                sorting: {
                                    sortModel: [{ field: 'id', sort: 'desc' }],
                                },
                            }}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['5', '4', '3', '2', '1', '0', '15' /* Agg */]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should always render group footers below the other rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test initialState={{
                                rowGrouping: { model: ['category1'] },
                                aggregation: { model: { id: 'max' } },
                                sorting: {
                                    sortModel: [{ field: 'id', sort: 'desc' }],
                                },
                            }} defaultGroupingExpansionDepth={-1} getAggregationPosition={function (group) { return (group.depth === -1 ? null : 'footer'); }}/>)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                            '',
                            '4',
                            '3',
                            '2',
                            '1',
                            '0',
                            '4' /* Agg "Cat A" */,
                            '',
                            '5',
                            '5' /* Agg "Cat B" */,
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('built-in aggregation functions', function () {
        describe('`sum`', function () {
            it('should work with numbers', function () {
                expect(x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.sum.apply({
                    values: [0, 10, 12, 23],
                    field: 'value',
                    groupId: 0,
                }, apiRef.current)).to.equal(45);
            });
            it('should ignore non-numbers', function () {
                expect(x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.sum.apply({
                    values: [0, 10, 12, 23, 'a', '', undefined, null, NaN, {}, true],
                    field: 'value',
                    groupId: 0,
                }, apiRef.current)).to.equal(45);
            });
        });
        describe('`avg`', function () {
            it('should work with numbers', function () {
                expect(x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.avg.apply({
                    values: [0, 10, 12, 23],
                    field: 'value',
                    groupId: 0,
                }, apiRef.current)).to.equal(11.25);
            });
            it('should ignore non-numbers', function () {
                expect(x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.avg.apply({
                    values: [0, 10, 12, 23, 'a', '', undefined, null, NaN, {}, true],
                    field: 'value',
                    groupId: 0,
                }, apiRef.current)).to.equal(11.25);
            });
        });
        describe('`size`', function () {
            it('should work with any value types', function () {
                expect(x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.size.apply({
                    values: [23, '', 'a', NaN, {}, false, true],
                    field: 'value',
                    groupId: 0,
                }, apiRef.current)).to.equal(7);
            });
            it('should ignore undefined values', function () {
                expect(x_data_grid_premium_1.GRID_AGGREGATION_FUNCTIONS.size.apply({
                    values: [23, '', 'a', NaN, {}, false, true, undefined],
                    field: 'value',
                    groupId: 0,
                }, apiRef.current)).to.equal(7);
            });
        });
    });
    describe('"no rows" overlay', function () {
        it('should display "no rows" overlay and not show aggregation footer when there are no rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, render(<Test rows={[]} initialState={{
                                aggregation: { model: { id: 'sum' } },
                            }}/>)];
                    case 1:
                        _a.sent();
                        // Check for "no rows" overlay
                        expect(internal_test_utils_1.screen.queryByText('No rows')).not.to.equal(null);
                        // Ensure aggregation footer is not present
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
