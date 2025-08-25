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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var sinon_1 = require("sinon");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGridPro /> - Infinite loader', function () {
    afterEach(function () {
        (0, sinon_1.restore)();
    });
    var render = (0, internal_test_utils_1.createRenderer)().render;
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should call `onRowsScrollEnd` when viewport scroll reaches the bottom', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestCase(_a) {
            var rows = _a.rows;
            return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro columns={[{ field: 'brand', width: 100 }]} rows={rows} onRowsScrollEnd={handleRowsScrollEnd}/>
          </div>);
        }
        var baseRows, handleRowsScrollEnd, _a, container, setProps, virtualScroller;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    baseRows = [
                        { id: 0, brand: 'Nike' },
                        { id: 1, brand: 'Adidas' },
                        { id: 2, brand: 'Puma' },
                        { id: 3, brand: 'Under Armor' },
                        { id: 4, brand: 'Jordan' },
                        { id: 5, brand: 'Reebok' },
                    ];
                    handleRowsScrollEnd = (0, sinon_1.spy)();
                    _a = render(<TestCase rows={baseRows}/>), container = _a.container, setProps = _a.setProps;
                    virtualScroller = container.querySelector('.MuiDataGrid-virtualScroller');
                    // arbitrary number to make sure that the bottom of the grid window is reached.
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, virtualScroller.scrollTo({ top: 12345, behavior: 'instant' })];
                        }); }); })];
                case 1:
                    // arbitrary number to make sure that the bottom of the grid window is reached.
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(handleRowsScrollEnd.callCount).to.equal(1);
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                setProps({
                                    rows: baseRows.concat({ id: 6, brand: 'Gucci' }, { id: 7, brand: "Levi's" }, { id: 8, brand: 'Ray-Ban' }),
                                });
                                // Trigger a scroll again to notify the grid that we're not in the bottom area anymore
                                virtualScroller.dispatchEvent(new Event('scroll'));
                                return [2 /*return*/];
                            });
                        }); })];
                case 3:
                    _b.sent();
                    expect(handleRowsScrollEnd.callCount).to.equal(1);
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, virtualScroller.scrollTo({ top: 12345, behavior: 'instant' })];
                        }); }); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(handleRowsScrollEnd.callCount).to.equal(2);
                        })];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should call `onRowsScrollEnd` when there is not enough rows to cover the viewport height', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestCase() {
            var _this = this;
            var _a = React.useState(initialRows), rows = _a[0], setRows = _a[1];
            var _b = React.useState(false), loading = _b[0], setLoading = _b[1];
            var handleRowsScrollEnd = React.useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    setLoading(true);
                    setRows(function (prevRows) {
                        var lastRowId = prevRows[prevRows.length - 1].id;
                        var nextRow = getRow(lastRowId + 1);
                        return nextRow ? prevRows.concat(nextRow) : prevRows;
                    });
                    setLoading(false);
                    return [2 /*return*/];
                });
            }); }, []);
            return (<div style={{ width: 300, height: gridHeight }}>
            <x_data_grid_pro_1.DataGridPro columns={[{ field: 'id' }, { field: 'brand', width: 100 }]} rows={rows} loading={loading} onRowsScrollEnd={handleRowsScrollEnd} scrollEndThreshold={scrollEndThreshold} rowHeight={rowHeight} columnHeaderHeight={columnHeaderHeight} hideFooter/>
          </div>);
        }
        var allRows, initialRows, getRow, scrollEndThreshold, rowHeight, columnHeaderHeight, gridHeight, multiplier, getRowCalls, callIndex, call;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    allRows = [
                        { id: 0, brand: 'Nike' },
                        { id: 1, brand: 'Adidas' },
                        { id: 2, brand: 'Puma' },
                        { id: 3, brand: 'Under Armor' },
                        { id: 4, brand: 'Jordan' },
                        { id: 5, brand: 'Reebok' },
                    ];
                    initialRows = [allRows[0]];
                    getRow = (0, sinon_1.spy)(function (id) {
                        return allRows.find(function (row) { return row.id === id; });
                    });
                    scrollEndThreshold = 60;
                    rowHeight = 50;
                    columnHeaderHeight = 50;
                    gridHeight = 4 * rowHeight +
                        columnHeaderHeight +
                        // border
                        2;
                    render(<TestCase />);
                    multiplier = 2;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(getRow.callCount).to.equal(5 * multiplier);
                        })];
                case 1:
                    _b.sent();
                    getRowCalls = getRow.getCalls();
                    for (callIndex = 0; callIndex < getRowCalls.length; callIndex += multiplier) {
                        call = getRowCalls[callIndex];
                        expect((_a = call.returnValue) === null || _a === void 0 ? void 0 : _a.id).to.equal(callIndex / multiplier + 1);
                    }
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4', '5']);
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should not observe intersections with the rows pinned to the bottom', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestCase(_a) {
            var rows = _a.rows, pinnedRows = _a.pinnedRows;
            return (<div style={{ width: 300, height: 100 }}>
            <x_data_grid_pro_1.DataGridPro columns={[{ field: 'brand', width: 100 }]} rows={rows} onRowsScrollEnd={handleRowsScrollEnd} pinnedRows={pinnedRows}/>
          </div>);
        }
        var baseRows, basePinnedRows, handleRowsScrollEnd, observe, container, virtualScroller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    baseRows = [
                        { id: 0, brand: 'Nike' },
                        { id: 1, brand: 'Adidas' },
                        { id: 2, brand: 'Puma' },
                        { id: 3, brand: 'Under Armor' },
                        { id: 4, brand: 'Jordan' },
                        { id: 5, brand: 'Reebok' },
                    ];
                    basePinnedRows = {
                        bottom: [{ id: 6, brand: 'Unbranded' }],
                    };
                    handleRowsScrollEnd = (0, sinon_1.spy)();
                    observe = (0, sinon_1.spy)(window.IntersectionObserver.prototype, 'observe');
                    container = render(<TestCase rows={baseRows} pinnedRows={basePinnedRows}/>).container;
                    virtualScroller = container.querySelector('.MuiDataGrid-virtualScroller');
                    // on the initial render, last row is not visible and the `observe` method is not called
                    expect(observe.callCount).to.equal(0);
                    // arbitrary number to make sure that the bottom of the grid window is reached.
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, virtualScroller.scrollTo({ top: 12345, behavior: 'instant' })];
                        }); }); })];
                case 1:
                    // arbitrary number to make sure that the bottom of the grid window is reached.
                    _a.sent();
                    // observer was attached
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(observe.callCount).to.equal(1);
                        })];
                case 2:
                    // observer was attached
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
