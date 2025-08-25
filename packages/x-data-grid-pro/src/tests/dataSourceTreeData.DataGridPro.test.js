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
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var sinon_1 = require("sinon");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
var dataSetOptions = {
    dataSet: 'Employee',
    rowLength: 100,
    maxColumns: 3,
    treeData: { maxDepth: 2, groupingField: 'name', averageChildren: 5 },
};
var pageSizeOptions = [5, 10, 50];
var serverOptions = { minDelay: 0, maxDelay: 0, verbose: false };
// Needs layout
describe.skipIf(skipIf_1.isJSDOM)('<DataGridPro /> - Data source tree data', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var fetchRowsSpy = (0, sinon_1.spy)();
    var apiRef;
    var mockServer;
    // TODO: Resets strictmode calls, need to find a better fix for this, maybe an AbortController?
    function Reset() {
        React.useLayoutEffect(function () {
            fetchRowsSpy.resetHistory();
        }, []);
        return null;
    }
    function TestDataSource(props) {
        var _this = this;
        var _a;
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        mockServer = (0, x_data_grid_generator_1.useMockServer)(dataSetOptions, serverOptions, (_a = props.shouldRequestsFail) !== null && _a !== void 0 ? _a : false);
        var columns = mockServer.columns;
        var fetchRows = mockServer.fetchRows;
        var dataSource = React.useMemo(function () {
            return {
                getRows: function (params) { return __awaiter(_this, void 0, void 0, function () {
                    var urlParams, url, getRowsResponse;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                urlParams = new URLSearchParams({
                                    paginationModel: JSON.stringify(params.paginationModel),
                                    filterModel: JSON.stringify(params.filterModel),
                                    sortModel: JSON.stringify(params.sortModel),
                                    groupKeys: JSON.stringify(params.groupKeys),
                                });
                                url = "https://mui.com/x/api/data-grid?".concat(urlParams.toString());
                                fetchRowsSpy(url);
                                return [4 /*yield*/, fetchRows(url)];
                            case 1:
                                getRowsResponse = _a.sent();
                                return [2 /*return*/, {
                                        rows: getRowsResponse.rows,
                                        rowCount: getRowsResponse.rowCount,
                                    }];
                        }
                    });
                }); },
                getGroupKey: function (row) { return row[dataSetOptions.treeData.groupingField]; },
                getChildrenCount: function (row) { return row.descendantCount; },
            };
        }, [fetchRows]);
        if (!mockServer.isReady) {
            return null;
        }
        return (<div style={{ width: 300, height: 300 }}>
        <Reset />
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} columns={columns} dataSource={dataSource} initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 } }} pagination treeData pageSizeOptions={pageSizeOptions} disableVirtualization {...props}/>
      </div>);
    }
    it('should fetch the data on initial render', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<TestDataSource />);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.equal(1);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should re-fetch the data on filter change', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setProps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setProps = render(<TestDataSource />).setProps;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.equal(1);
                        })];
                case 1:
                    _a.sent();
                    setProps({ filterModel: { items: [{ field: 'name', value: 'John', operator: 'contains' }] } });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.equal(2);
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should re-fetch the data on sort change', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setProps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setProps = render(<TestDataSource />).setProps;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.equal(1);
                        })];
                case 1:
                    _a.sent();
                    setProps({ sortModel: [{ field: 'name', sort: 'asc' }] });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.equal(2);
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should re-fetch the data on pagination change', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setProps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setProps = render(<TestDataSource />).setProps;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.equal(1);
                        })];
                case 1:
                    _a.sent();
                    setProps({ paginationModel: { page: 1, pageSize: 10 } });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.equal(2);
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should fetch nested data when clicking on a dropdown', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, cell11, cell11ChildrenCount;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    user = render(<TestDataSource />).user;
                    if (!((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state)) {
                        throw new Error('apiRef.current.state is not defined');
                    }
                    expect(fetchRowsSpy.callCount).to.equal(1);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(Object.keys(apiRef.current.state.rows.tree).length).to.equal(10 + 1);
                        })];
                case 1:
                    _b.sent();
                    cell11 = (0, helperFn_1.getCell)(0, 0);
                    return [4 /*yield*/, user.click((0, internal_test_utils_1.within)(cell11).getByRole('button'))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.equal(2);
                        })];
                case 3:
                    _b.sent();
                    cell11ChildrenCount = Number(cell11.innerText.split('(')[1].split(')')[0]);
                    expect(Object.keys(apiRef.current.state.rows.tree).length).to.equal(10 + 1 + cell11ChildrenCount);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should fetch nested data when calling API method `dataSource.fetchRows`', function () { return __awaiter(void 0, void 0, void 0, function () {
        var firstChildId, cell11, cell11ChildrenCount;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    render(<TestDataSource />);
                    if (!((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state)) {
                        throw new Error('apiRef.current.state is not defined');
                    }
                    expect(fetchRowsSpy.callCount).to.equal(1);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(Object.keys(apiRef.current.state.rows.tree).length).to.equal(10 + 1);
                        })];
                case 1:
                    _b.sent();
                    firstChildId = apiRef.current.state.rows.tree[x_data_grid_pro_1.GRID_ROOT_GROUP_ID]
                        .children[0];
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.dataSource.fetchRows(firstChildId);
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.equal(2);
                        })];
                case 3:
                    _b.sent();
                    cell11 = (0, helperFn_1.getCell)(0, 0);
                    cell11ChildrenCount = Number(cell11.innerText.split('(')[1].split(')')[0]);
                    expect(Object.keys(apiRef.current.state.rows.tree).length).to.equal(10 + 1 + cell11ChildrenCount);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should lazily fetch nested data when using `defaultGroupingExpansionDepth`', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    render(<TestDataSource defaultGroupingExpansionDepth={1}/>);
                    if (!((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state)) {
                        throw new Error('apiRef.current.state is not defined');
                    }
                    expect(fetchRowsSpy.callCount).to.equal(1);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            var _a;
                            expect((_a = apiRef.current.state.rows.groupsToFetch) === null || _a === void 0 ? void 0 : _a.length).to.be.greaterThan(0);
                        })];
                case 1:
                    _b.sent();
                    // All the group nodes belonging to the grid root group should be there for fetching
                    apiRef.current.state.rows.tree[x_data_grid_pro_1.GRID_ROOT_GROUP_ID].children.forEach(function (child) {
                        var _a, _b;
                        var node = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rows.tree[child];
                        if ((node === null || node === void 0 ? void 0 : node.type) === 'group') {
                            expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.state.rows.groupsToFetch).to.include(child);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
