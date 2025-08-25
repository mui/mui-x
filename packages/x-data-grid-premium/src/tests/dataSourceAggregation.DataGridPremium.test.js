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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var sinon_1 = require("sinon");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
describe.skipIf(skipIf_1.isJSDOM)('<DataGridPremium /> - Data source aggregation', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    var fetchRowsSpy = (0, sinon_1.spy)();
    // TODO: Resets strictmode calls, need to find a better fix for this, maybe an AbortController?
    function Reset() {
        React.useLayoutEffect(function () {
            fetchRowsSpy.resetHistory();
        }, []);
        return null;
    }
    function TestDataSourceAggregation(props) {
        var _this = this;
        apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
        var getAggregatedValueProp = props.getAggregatedValue, rest = __rest(props, ["getAggregatedValue"]);
        var _a = (0, x_data_grid_generator_1.useMockServer)({ rowLength: 10, maxColumns: 1 }, { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false }), fetchRows = _a.fetchRows, columns = _a.columns, isReady = _a.isReady;
        var dataSource = React.useMemo(function () {
            return {
                getRows: function (params) { return __awaiter(_this, void 0, void 0, function () {
                    var urlParams, getRowsResponse;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                urlParams = new URLSearchParams({
                                    filterModel: JSON.stringify(params.filterModel),
                                    sortModel: JSON.stringify(params.sortModel),
                                    paginationModel: JSON.stringify(params.paginationModel),
                                    aggregationModel: JSON.stringify(params.aggregationModel),
                                });
                                fetchRowsSpy(params);
                                return [4 /*yield*/, fetchRows("https://mui.com/x/api/data-grid?".concat(urlParams.toString()))];
                            case 1:
                                getRowsResponse = _a.sent();
                                return [2 /*return*/, {
                                        rows: getRowsResponse.rows,
                                        rowCount: getRowsResponse.rowCount,
                                        aggregateRow: getRowsResponse.aggregateRow,
                                    }];
                        }
                    });
                }); },
                getAggregatedValue: getAggregatedValueProp !== null && getAggregatedValueProp !== void 0 ? getAggregatedValueProp : (function (row, field) {
                    return row["".concat(field, "Aggregate")];
                }),
            };
        }, [fetchRows, getAggregatedValueProp]);
        if (!isReady) {
            return null;
        }
        return (<div style={{ width: 300, height: 300 }}>
        <Reset />
        <x_data_grid_premium_1.DataGridPremium apiRef={apiRef} dataSource={dataSource} columns={columns} disableVirtualization aggregationFunctions={{
                sum: { columnTypes: ['number'] },
                avg: { columnTypes: ['number'] },
                min: { columnTypes: ['number', 'date', 'dateTime'] },
                max: { columnTypes: ['number', 'date', 'dateTime'] },
                size: {},
            }} {...rest}/>
      </div>);
    }
    // TODO @MBilalShafi: Flaky test, fix it
    it.skip('should show aggregation option in the column menu', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dataSource, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataSource = {
                        getRows: function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                fetchRowsSpy();
                                return [2 /*return*/, {
                                        rows: [{ id: 123 }],
                                        rowCount: 1,
                                        aggregateRow: {},
                                    }];
                            });
                        }); },
                        getAggregatedValue: function () { return 'Agg value'; },
                    };
                    user = render(<TestDataSourceAggregation dataSource={dataSource} columns={[{ field: 'id' }]}/>).user;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.be.greaterThan(0);
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, user.click((0, internal_test_utils_1.within)((0, helperFn_1.getColumnHeaderCell)(0)).getByLabelText('id column menu'))];
                case 2:
                    _a.sent();
                    // wait for the column menu to be open first
                    return [4 /*yield*/, internal_test_utils_1.screen.findByRole('menu', { name: 'id column menu' })];
                case 3:
                    // wait for the column menu to be open first
                    _a.sent();
                    return [4 /*yield*/, internal_test_utils_1.screen.findByLabelText('Aggregation')];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not show aggregation option in the column menu when no aggregation function is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestDataSourceAggregation aggregationFunctions={{}}/>).user;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.be.greaterThan(0);
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, user.click((0, internal_test_utils_1.within)((0, helperFn_1.getColumnHeaderCell)(0)).getByLabelText('id column menu'))];
                case 2:
                    _a.sent();
                    expect(internal_test_utils_1.screen.queryByLabelText('Aggregation')).to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should provide the `aggregationModel` in the `getRows` params', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<TestDataSourceAggregation initialState={{
                            aggregation: { model: { id: 'size' } },
                        }}/>);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.be.greaterThan(0);
                        })];
                case 1:
                    _a.sent();
                    expect(fetchRowsSpy.lastCall.args[0].aggregationModel).to.deep.equal({ id: 'size' });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should show the aggregation footer row when aggregation is enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    render(<TestDataSourceAggregation initialState={{
                            aggregation: { model: { id: 'size' } },
                        }}/>);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(Object.keys(apiRef.current.state.aggregation.lookup).length).to.be.greaterThan(0);
                        })];
                case 1:
                    _b.sent();
                    expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rows.tree[x_data_grid_premium_1.GRID_AGGREGATION_ROOT_FOOTER_ROW_ID]).not.to.equal(null);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            var _a;
                            var footerRow = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.aggregation.lookup[x_data_grid_premium_1.GRID_ROOT_GROUP_ID];
                            expect(footerRow === null || footerRow === void 0 ? void 0 : footerRow.id).to.deep.equal({ position: 'footer', value: 10 });
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should derive the aggregation values using `dataSource.getAggregatedValue`', function () { return __awaiter(void 0, void 0, void 0, function () {
        var getAggregatedValue;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    getAggregatedValue = function () { return 'Agg value'; };
                    render(<TestDataSourceAggregation initialState={{
                            aggregation: { model: { id: 'size' } },
                        }} getAggregatedValue={getAggregatedValue}/>);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(Object.keys(apiRef.current.state.aggregation.lookup).length).to.be.greaterThan(0);
                        })];
                case 1:
                    _b.sent();
                    expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.aggregation.lookup[x_data_grid_premium_1.GRID_ROOT_GROUP_ID].id.value).to.equal('Agg value');
                    return [2 /*return*/];
            }
        });
    }); });
});
