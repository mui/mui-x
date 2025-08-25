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
var x_data_grid_1 = require("@mui/x-data-grid");
var sinon_1 = require("sinon");
var skipIf_1 = require("test/utils/skipIf");
var helperFn_1 = require("test/utils/helperFn");
var cache_1 = require("../hooks/features/dataSource/cache");
var utils_1 = require("../internals/utils");
var pageSizeOptions = [10, 20];
var serverOptions = { useCursorPagination: false, minDelay: 0, maxDelay: 0, verbose: false };
var dataSetOptions = { rowLength: 100, maxColumns: 1, editable: true };
// Needs layout
describe.skipIf(skipIf_1.isJSDOM)('<DataGrid /> - Data source', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var fetchRowsSpy = (0, sinon_1.spy)();
    var editRowSpy = (0, sinon_1.spy)();
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
        apiRef = (0, x_data_grid_1.useGridApiRef)();
        var dataSetOptionsProp = props.dataSetOptions, shouldRequestsFail = props.shouldRequestsFail, rest = __rest(props, ["dataSetOptions", "shouldRequestsFail"]);
        mockServer = (0, x_data_grid_generator_1.useMockServer)(dataSetOptionsProp !== null && dataSetOptionsProp !== void 0 ? dataSetOptionsProp : dataSetOptions, serverOptions, shouldRequestsFail !== null && shouldRequestsFail !== void 0 ? shouldRequestsFail : false);
        var fetchRows = mockServer.fetchRows, editRow = mockServer.editRow;
        var dataSource = React.useMemo(function () {
            return {
                getRows: function (params) { return __awaiter(_this, void 0, void 0, function () {
                    var urlParams, url, getRowsResponse;
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
                                return [2 /*return*/, {
                                        rows: getRowsResponse.rows,
                                        rowCount: getRowsResponse.rowCount,
                                    }];
                        }
                    });
                }); },
                updateRow: function (params) { return __awaiter(_this, void 0, void 0, function () {
                    var syncedRow;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                editRowSpy(params);
                                return [4 /*yield*/, editRow(params.rowId, params.updatedRow)];
                            case 1:
                                syncedRow = _a.sent();
                                return [2 /*return*/, syncedRow];
                        }
                    });
                }); },
            };
        }, [fetchRows, editRow]);
        if (!mockServer.isReady) {
            return null;
        }
        return (<div style={{ width: 300, height: 300 }}>
        <Reset />
        <x_data_grid_1.DataGrid apiRef={apiRef} columns={mockServer.columns} dataSource={dataSource} initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 } }} pagination pageSizeOptions={pageSizeOptions} disableVirtualization {...rest}/>
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
                    setProps({
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
                    setProps({ sortModel: [{ field: 'id', sort: 'asc' }] });
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
    it('should re-fetch the data once if multiple models have changed', function () { return __awaiter(void 0, void 0, void 0, function () {
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
                    setProps({
                        paginationModel: { page: 1, pageSize: 10 },
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
    describe('Cache', function () {
        it('should cache the data using the default cache', function () { return __awaiter(void 0, void 0, void 0, function () {
            var pageChangeSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pageChangeSpy = (0, sinon_1.spy)();
                        render(<TestDataSource onPaginationModelChange={pageChangeSpy}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(1);
                            })];
                    case 1:
                        _a.sent();
                        expect(pageChangeSpy.callCount).to.equal(0);
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setPage(1);
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(2);
                            })];
                    case 2:
                        _a.sent();
                        expect(pageChangeSpy.callCount).to.equal(1);
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setPage(0);
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(2);
                            })];
                    case 3:
                        _a.sent();
                        expect(pageChangeSpy.callCount).to.equal(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should cache the data using the custom cache', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testCache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testCache = new utils_1.TestCache();
                        render(<TestDataSource dataSourceCache={testCache}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(1);
                            })];
                    case 1:
                        _a.sent();
                        expect(testCache.size()).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should cache the data in the chunks defined by the minimum page size', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testCache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testCache = new utils_1.TestCache();
                        render(<TestDataSource dataSourceCache={testCache} paginationModel={{ page: 0, pageSize: 20 }}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(1);
                            })];
                    case 1:
                        _a.sent();
                        expect(testCache.size()).to.equal(2); // 2 chunks of 10 rows
                        return [2 /*return*/];
                }
            });
        }); });
        it('should use the cached data when the same query is made again', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testCache, pageChangeSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testCache = new utils_1.TestCache();
                        pageChangeSpy = (0, sinon_1.spy)();
                        render(<TestDataSource dataSourceCache={testCache} onPaginationModelChange={pageChangeSpy}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(1);
                            })];
                    case 1:
                        _a.sent();
                        expect(testCache.size()).to.equal(1);
                        expect(pageChangeSpy.callCount).to.equal(0);
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setPage(1);
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(2);
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(testCache.size()).to.equal(2);
                            })];
                    case 3:
                        _a.sent();
                        expect(pageChangeSpy.callCount).to.equal(1);
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setPage(0);
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(2);
                            })];
                    case 4:
                        _a.sent();
                        expect(testCache.size()).to.equal(2);
                        expect(pageChangeSpy.callCount).to.equal(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to disable the default cache', function () { return __awaiter(void 0, void 0, void 0, function () {
            var pageChangeSpy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pageChangeSpy = (0, sinon_1.spy)();
                        render(<TestDataSource dataSourceCache={null} onPaginationModelChange={pageChangeSpy}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(1);
                            })];
                    case 1:
                        _a.sent();
                        expect(pageChangeSpy.callCount).to.equal(0);
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setPage(1);
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(2);
                            })];
                    case 2:
                        _a.sent();
                        expect(pageChangeSpy.callCount).to.equal(1);
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setPage(0);
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(3);
                            })];
                    case 3:
                        _a.sent();
                        expect(pageChangeSpy.callCount).to.equal(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should bypass cache when "skipCache" is true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var testCache;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        testCache = new utils_1.TestCache();
                        render(<TestDataSource dataSourceCache={testCache}/>);
                        // Wait for initial fetch
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(1);
                            })];
                    case 1:
                        // Wait for initial fetch
                        _a.sent();
                        expect(testCache.size()).to.equal(1);
                        // Fetch same data again with skipCache = true
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.dataSource.fetchRows(undefined, { skipCache: true });
                        });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(2);
                            })];
                    case 2:
                        _a.sent();
                        // Cache should still be updated with new data
                        expect(testCache.size()).to.equal(1);
                        // Fetch same data again without skipCache (should use cache)
                        (0, internal_test_utils_1.act)(function () {
                            var _a;
                            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.dataSource.fetchRows();
                        });
                        // Should not trigger another fetch since data is cached
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(2);
                            })];
                    case 3:
                        // Should not trigger another fetch since data is cached
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Error handling', function () {
        it('should call `onDataSourceError` when the data source returns an error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onDataSourceError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onDataSourceError = (0, sinon_1.spy)();
                        render(<TestDataSource onDataSourceError={onDataSourceError} shouldRequestsFail/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(onDataSourceError.callCount).to.equal(1);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not call `onDataSourceError` after unmount', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onDataSourceError, _a, promise, reject, getRows, dataSource, unmount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        onDataSourceError = (0, sinon_1.spy)();
                        _a = Promise.withResolvers(), promise = _a.promise, reject = _a.reject;
                        getRows = (0, sinon_1.spy)(function () { return promise; });
                        dataSource = {
                            getRows: getRows,
                        };
                        unmount = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid columns={[{ field: 'id' }]} dataSource={dataSource} onDataSourceError={onDataSourceError} initialState={{
                                pagination: { paginationModel: { page: 0, pageSize: 10 }, rowCount: 0 },
                            }} pagination pageSizeOptions={pageSizeOptions} disableVirtualization/>
        </div>).unmount;
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(getRows.called).to.equal(true);
                            })];
                    case 1:
                        _b.sent();
                        unmount();
                        reject();
                        return [4 /*yield*/, promise.catch(function () { return 'rejected'; })];
                    case 2:
                        _b.sent();
                        expect(onDataSourceError.notCalled).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Editing', function () {
        it('should call `editRow()` and clear the cache when a row is updated', function () { return __awaiter(void 0, void 0, void 0, function () {
            var clearSpy, cache, dataSourceCache, user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clearSpy = (0, sinon_1.spy)();
                        cache = new Map();
                        dataSourceCache = {
                            get: function (key) { return cache.get((0, cache_1.getKeyDefault)(key)); },
                            set: function (key, value) {
                                return cache.set((0, cache_1.getKeyDefault)(key), value);
                            },
                            clear: function () {
                                cache.clear();
                                clearSpy();
                            },
                        };
                        user = render(<TestDataSource dataSourceCache={dataSourceCache} dataSetOptions={__assign(__assign({}, dataSetOptions), { maxColumns: 3 })}/>).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(1);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(Object.keys(apiRef.current.state.rows.tree).length).to.equal(10 + 1);
                            })];
                    case 2:
                        _a.sent();
                        cell = (0, helperFn_1.getCell)(0, 2);
                        return [4 /*yield*/, user.click(cell)];
                    case 3:
                        _a.sent();
                        expect(cell).toHaveFocus();
                        clearSpy.resetHistory();
                        expect(cache.size).to.equal(1);
                        // edit the cell
                        return [4 /*yield*/, user.keyboard('{Enter} updated{Enter}')];
                    case 4:
                        // edit the cell
                        _a.sent();
                        expect(editRowSpy.callCount).to.equal(1);
                        expect(editRowSpy.lastCall.args[0].updatedRow.commodity).to.contain('updated');
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(clearSpy.callCount).to.equal(1);
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        // Context: https://github.com/mui/mui-x/pull/17684
        it('should call `editRow()` when a computed column is updated', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataSource dataSetOptions={__assign(__assign({}, dataSetOptions), { maxColumns: 3 })} columns={[
                                {
                                    field: 'commodity',
                                },
                                {
                                    field: 'computed',
                                    editable: true,
                                    valueGetter: function (value, row) { return "".concat(row.commodity, "-computed"); },
                                    valueSetter: function (value, row) {
                                        var commodity = value.toString().split('-')[0];
                                        return __assign(__assign({}, row), { commodity: "".concat(commodity, "-edited") });
                                    },
                                },
                            ]} dataSourceCache={null}/>).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(fetchRowsSpy.callCount).to.equal(1);
                            })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(Object.keys(apiRef.current.state.rows.tree).length).to.equal(10 + 1);
                            })];
                    case 2:
                        _a.sent();
                        cell = (0, helperFn_1.getCell)(1, 1);
                        return [4 /*yield*/, user.click(cell)];
                    case 3:
                        _a.sent();
                        expect(cell).toHaveFocus();
                        editRowSpy.resetHistory();
                        // edit the cell
                        return [4 /*yield*/, user.keyboard('{Enter}{Enter}')];
                    case 4:
                        // edit the cell
                        _a.sent();
                        expect(editRowSpy.callCount).to.equal(1);
                        expect(editRowSpy.lastCall.args[0].updatedRow.commodity).to.contain('-edited');
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
