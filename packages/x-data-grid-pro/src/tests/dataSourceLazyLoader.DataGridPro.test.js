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
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var sinon_1 = require("sinon");
var skipIf_1 = require("test/utils/skipIf");
var internals_1 = require("@mui/x-data-grid/internals");
// Needs layout
describe.skipIf(skipIf_1.isJSDOM)('<DataGridPro /> - Data source lazy loader', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var defaultTransformGetRowsResponse = function (response) { return response; };
    var fetchRowsSpy = (0, sinon_1.spy)();
    var transformGetRowsResponse;
    var apiRef;
    var mockServer;
    var scrollEndThreshold = 60;
    var rowHeight = 50;
    var columnHeaderHeight = 50;
    var gridHeight = 4 * rowHeight +
        columnHeaderHeight +
        // border
        2;
    // TODO: Resets strictmode calls, need to find a better fix for this, maybe an AbortController?
    function Reset() {
        React.useLayoutEffect(function () {
            fetchRowsSpy.resetHistory();
        }, []);
        return null;
    }
    function TestDataSourceLazyLoader(props) {
        var _this = this;
        var mockServerRowCount = props.mockServerRowCount, rest = __rest(props, ["mockServerRowCount"]);
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        mockServer = (0, x_data_grid_generator_1.useMockServer)({ rowLength: mockServerRowCount !== null && mockServerRowCount !== void 0 ? mockServerRowCount : 100, maxColumns: 1 }, { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false });
        var fetchRows = mockServer.fetchRows;
        var dataSource = React.useMemo(function () {
            return {
                getRows: function (params) { return __awaiter(_this, void 0, void 0, function () {
                    var urlParams, url, getRowsResponse, response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                urlParams = new URLSearchParams({
                                    filterModel: JSON.stringify(params.filterModel),
                                    sortModel: JSON.stringify(params.sortModel),
                                    start: "".concat(params.start),
                                    end: "".concat(params.end),
                                });
                                url = "https://mui.com/x/api/data-grid?".concat(urlParams.toString());
                                fetchRowsSpy(url);
                                return [4 /*yield*/, fetchRows(url)];
                            case 1:
                                getRowsResponse = _a.sent();
                                response = transformGetRowsResponse(getRowsResponse);
                                return [2 /*return*/, {
                                        rows: response.rows,
                                        rowCount: response.rowCount,
                                    }];
                        }
                    });
                }); },
            };
        }, [fetchRows]);
        if (!mockServer.isReady) {
            return null;
        }
        return (<div style={{ width: 300, height: gridHeight }}>
        <Reset />
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} columns={mockServer.columns} dataSource={dataSource} lazyLoading initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 } }} disableVirtualization scrollEndThreshold={scrollEndThreshold} rowHeight={rowHeight} columnHeaderHeight={columnHeaderHeight} {...rest}/>
      </div>);
    }
    beforeEach(function () {
        transformGetRowsResponse = defaultTransformGetRowsResponse;
    });
    it('should load the first page initially', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<TestDataSourceLazyLoader />);
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.equal(1);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should re-fetch the data once if multiple models have changed', function () { return __awaiter(void 0, void 0, void 0, function () {
        var setProps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setProps = render(<TestDataSourceLazyLoader />).setProps;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.equal(1);
                        })];
                case 1:
                    _a.sent();
                    setProps({
                        sortModel: [{ field: 'id', sort: 'asc' }],
                        filterModel: { items: [{ field: 'id', value: 'abc', operator: 'doesNotContain' }] },
                    });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(fetchRowsSpy.callCount).to.equal(2);
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should keep the selection state on scroll', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestCase() {
            var handleSelectionChange = function (newModel) {
                rowSelectionModel = newModel;
            };
            return (<TestDataSourceLazyLoader onRowSelectionModelChange={handleSelectionChange} disableVirtualization={false}/>);
        }
        var rowSelectionModel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rowSelectionModel = {
                        type: 'include',
                        ids: new Set(),
                    };
                    render(<TestCase />);
                    // wait until the rows are rendered
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                case 1:
                    // wait until the rows are rendered
                    _a.sent();
                    expect(Array.from(rowSelectionModel.ids).length).to.equal(0);
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRow((0, helperFn_1.getCell)(1, 0).textContent)];
                        }); }); })];
                case 2:
                    _a.sent();
                    expect(Array.from(rowSelectionModel.ids).length).to.equal(1);
                    // arbitrary number to make sure that the bottom of the grid window is reached.
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                            return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scroll({ top: 12345 })];
                        }); }); })];
                case 3:
                    // arbitrary number to make sure that the bottom of the grid window is reached.
                    _a.sent();
                    // wait until the row is not in the render context anymore
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(function () { return (0, helperFn_1.getRow)(1); }).to.throw(); })];
                case 4:
                    // wait until the row is not in the render context anymore
                    _a.sent();
                    // selection is kept
                    expect(Array.from(rowSelectionModel.ids).length).to.equal(1);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Viewport loading', function () {
        it('should render skeleton rows if rowCount is bigger than the number of rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataSourceLazyLoader />);
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                    case 1:
                        // wait until the rows are rendered
                        _a.sent();
                        // The 11th row should be a skeleton
                        expect((0, helperFn_1.getRow)(10).dataset.id).to.equal('auto-generated-skeleton-row-root-10');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should make a new data source request once the skeleton rows are in the render context', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataSourceLazyLoader />);
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                    case 1:
                        // wait until the rows are rendered
                        _a.sent();
                        // reset the spy call count
                        fetchRowsSpy.resetHistory();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 10 })];
                            }); }); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(1);
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reset the scroll position when sorting is applied', function () { return __awaiter(void 0, void 0, void 0, function () {
            var initialSearchParams, beforeSortSearchParams, afterSortSearchParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataSourceLazyLoader />);
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                    case 1:
                        // wait until the rows are rendered
                        _a.sent();
                        initialSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
                        expect(initialSearchParams.get('end')).to.equal('9');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 10 })];
                            }); }); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(2);
                            })];
                    case 3:
                        _a.sent();
                        beforeSortSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
                        expect(beforeSortSearchParams.get('end')).to.not.equal('9');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.sortColumn(mockServer.columns[0].field, 'asc')];
                            }); }); })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(3);
                            })];
                    case 5:
                        _a.sent();
                        afterSortSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
                        expect(afterSortSearchParams.get('end')).to.equal('9');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reset the scroll position when filter is applied', function () { return __awaiter(void 0, void 0, void 0, function () {
            var beforeFilteringSearchParams, afterFilteringSearchParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataSourceLazyLoader />);
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                    case 1:
                        // wait until the rows are rendered
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 10 })];
                            }); }); })];
                    case 2:
                        _a.sent();
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(fetchRowsSpy.callCount).to.equal(2); })];
                    case 3:
                        // wait until the rows are rendered
                        _a.sent();
                        beforeFilteringSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
                        // first row is not the first page anymore
                        expect(beforeFilteringSearchParams.get('start')).to.equal('10');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setFilterModel({
                                        items: [
                                            {
                                                field: mockServer.columns[0].field,
                                                value: '0',
                                                operator: 'contains',
                                            },
                                        ],
                                    });
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(3);
                            })];
                    case 5:
                        _a.sent();
                        afterFilteringSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
                        // first row is the start of the first page
                        expect(afterFilteringSearchParams.get('start')).to.equal('0');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Infinite loading', function () {
        beforeEach(function () {
            // override rowCount
            transformGetRowsResponse = function (response) { return (__assign(__assign({}, response), { rowCount: -1 })); };
        });
        it('should not render skeleton rows if rowCount is unknown', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataSourceLazyLoader />);
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                    case 1:
                        // wait until the rows are rendered
                        _a.sent();
                        // The 11th row should not exist
                        expect(function () { return (0, helperFn_1.getRow)(10); }).to.throw();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should make a new data source request in infinite loading mode once the bottom row is reached', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataSourceLazyLoader />);
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                    case 1:
                        // wait until the rows are rendered
                        _a.sent();
                        // reset the spy call count
                        fetchRowsSpy.resetHistory();
                        // make one small and one big scroll that makes sure that the bottom of the grid window is reached
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 1 });
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        // make one small and one big scroll that makes sure that the bottom of the grid window is reached
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 9 });
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 3:
                        _a.sent();
                        // Only one additional fetch should have been made
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(1);
                            })];
                    case 4:
                        // Only one additional fetch should have been made
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should make a new data source request when there is not enough rows to cover the viewport height', function () { return __awaiter(void 0, void 0, void 0, function () {
            var lastSearchParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataSourceLazyLoader initialState={{
                                pagination: { paginationModel: { page: 0, pageSize: 2 } },
                            }}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(3); // grid is 4 rows high and the threshold is 60px, so 3 pages are loaded
                            })];
                    case 1:
                        _a.sent();
                        lastSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
                        expect(lastSearchParams.get('end')).to.equal('5'); // 6th row
                        return [2 /*return*/];
                }
            });
        }); });
        it('should stop making data source requests if the new rows were not added on the last call', function () { return __awaiter(void 0, void 0, void 0, function () {
            var lastSearchParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataSourceLazyLoader mockServerRowCount={2} initialState={{
                                pagination: { paginationModel: { page: 0, pageSize: 2 } },
                            }}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(2);
                            })];
                    case 1:
                        _a.sent();
                        lastSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
                        // 3rd and 4th row were requested but not added
                        expect(lastSearchParams.get('start')).to.equal('2');
                        expect(lastSearchParams.get('end')).to.equal('3');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reset the scroll position when sorting is applied', function () { return __awaiter(void 0, void 0, void 0, function () {
            var beforeSortingSearchParams, afterSortingSearchParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataSourceLazyLoader />);
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                    case 1:
                        // wait until the rows are rendered
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 9 })];
                            }); }); })];
                    case 2:
                        _a.sent();
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(10)).not.to.be.undefined; })];
                    case 3:
                        // wait until the rows are rendered
                        _a.sent();
                        beforeSortingSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
                        // last row is not the first page anymore
                        expect(beforeSortingSearchParams.get('end')).to.not.equal('9');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.sortColumn(mockServer.columns[0].field, 'asc')];
                            }); }); })];
                    case 4:
                        _a.sent();
                        afterSortingSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
                        // last row is the end of the first page
                        expect(afterSortingSearchParams.get('end')).to.equal('9');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reset the scroll position when filter is applied', function () { return __awaiter(void 0, void 0, void 0, function () {
            var beforeFilteringSearchParams, afterFilteringSearchParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataSourceLazyLoader />);
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                    case 1:
                        // wait until the rows are rendered
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndexes({ rowIndex: 9 })];
                            }); }); })];
                    case 2:
                        _a.sent();
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(10)).not.to.be.undefined; })];
                    case 3:
                        // wait until the rows are rendered
                        _a.sent();
                        beforeFilteringSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
                        // last row is not the first page anymore
                        expect(beforeFilteringSearchParams.get('end')).to.not.equal('9');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setFilterModel({
                                        items: [
                                            {
                                                field: mockServer.columns[0].field,
                                                value: '0',
                                                operator: 'contains',
                                            },
                                        ],
                                    });
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 4:
                        _a.sent();
                        afterFilteringSearchParams = new URL(fetchRowsSpy.lastCall.args[0]).searchParams;
                        // last row is the end of the first page
                        expect(afterFilteringSearchParams.get('end')).to.equal('9');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Row count updates', function () {
        it('should add skeleton rows once the rowCount becomes known', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // override rowCount
                        transformGetRowsResponse = function (response) { return (__assign(__assign({}, response), { rowCount: undefined })); };
                        setProps = render(<TestDataSourceLazyLoader />).setProps;
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                    case 1:
                        // wait until the rows are rendered
                        _a.sent();
                        // The 11th row should not exist
                        expect(function () { return (0, helperFn_1.getRow)(10); }).to.throw();
                        // make the rowCount known
                        setProps({ rowCount: 100 });
                        // The 11th row should be a skeleton
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                return expect((0, helperFn_1.getRow)(10).dataset.id).to.equal('auto-generated-skeleton-row-root-10');
                            })];
                    case 2:
                        // The 11th row should be a skeleton
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reset the grid if the rowCount becomes unknown', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // override rowCount
                        transformGetRowsResponse = function (response) { return (__assign(__assign({}, response), { rowCount: undefined })); };
                        setProps = render(<TestDataSourceLazyLoader rowCount={100}/>).setProps;
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                    case 1:
                        // wait until the rows are rendered
                        _a.sent();
                        // The 11th row should not exist
                        expect((0, helperFn_1.getRow)(10).dataset.id).to.equal('auto-generated-skeleton-row-root-10');
                        // make the rowCount unknown
                        setProps({ rowCount: -1 });
                        // The 11th row should not exist
                        expect(function () { return (0, helperFn_1.getRow)(10); }).to.throw();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reset the grid if the rowCount becomes smaller than the actual row count', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // override rowCount
                        transformGetRowsResponse = function (response) { return (__assign(__assign({}, response), { rowCount: undefined })); };
                        render(<TestDataSourceLazyLoader rowCount={100} paginationModel={{ page: 0, pageSize: 30 }}/>);
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                    case 1:
                        // wait until the rows are rendered
                        _a.sent();
                        // reset the spy call count
                        fetchRowsSpy.resetHistory();
                        // reduce the rowCount to be more than the number of rows
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowCount(80);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        // reduce the rowCount to be more than the number of rows
                        _a.sent();
                        expect(fetchRowsSpy.callCount).to.equal(0);
                        // reduce the rowCount once more, but now to be less than the number of rows
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowCount(20);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 3:
                        // reduce the rowCount once more, but now to be less than the number of rows
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(fetchRowsSpy.callCount).to.equal(1); })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow setting the row count via API', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // override rowCount
                        transformGetRowsResponse = function (response) { return (__assign(__assign({}, response), { rowCount: undefined })); };
                        render(<TestDataSourceLazyLoader />);
                        // wait until the rows are rendered
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(0)).not.to.be.undefined; })];
                    case 1:
                        // wait until the rows are rendered
                        _a.sent();
                        // The 11th row should not exist
                        expect(function () { return (0, helperFn_1.getRow)(10); }).to.throw();
                        // set the rowCount via API
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowCount(100)];
                            }); }); })];
                    case 2:
                        // set the rowCount via API
                        _a.sent();
                        // wait until the rows are added
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getRow)(10)).not.to.be.undefined; })];
                    case 3:
                        // wait until the rows are added
                        _a.sent();
                        // The 11th row should be a skeleton
                        expect((0, helperFn_1.getRow)(10).dataset.id).to.equal('auto-generated-skeleton-row-root-10');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Cache', function () {
        it('should combine cache chunks when possible to reduce the number of requests', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testCache, cacheGetSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testCache = new internals_1.TestCache();
                        cacheGetSpy = (0, sinon_1.spy)(testCache, 'get');
                        render(<TestDataSourceLazyLoader dataSourceCache={testCache}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(cacheGetSpy.called).to.equal(true);
                            })];
                    case 1:
                        _a.sent();
                        cacheGetSpy.resetHistory();
                        fetchRowsSpy.resetHistory();
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.dataSource.fetchRows(x_data_grid_pro_1.GRID_ROOT_GROUP_ID, {
                                start: 0,
                                end: 29,
                            });
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(cacheGetSpy.callCount).to.equal(3);
                            })];
                    case 2:
                        _a.sent();
                        expect(fetchRowsSpy.callCount).to.equal(1);
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.dataSource.fetchRows(x_data_grid_pro_1.GRID_ROOT_GROUP_ID, {
                                start: 20,
                                end: 29,
                            });
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(cacheGetSpy.callCount).to.equal(4);
                            })];
                    case 3:
                        _a.sent();
                        expect(fetchRowsSpy.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
