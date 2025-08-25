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
var sinon_1 = require("sinon");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGrid /> - Row spanning', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var publicApiRef;
    var baselineProps = {
        rowSpanning: true,
        columns: [
            {
                field: 'code',
                headerName: 'Item Code',
                width: 85,
                cellClassName: function (_a) {
                    var row = _a.row;
                    return (row.summaryRow ? 'bold' : '');
                },
            },
            {
                field: 'description',
                headerName: 'Description',
                width: 170,
            },
            {
                field: 'quantity',
                headerName: 'Quantity',
                width: 80,
                // Do not span the values
                rowSpanValueGetter: function () { return null; },
            },
            {
                field: 'unitPrice',
                headerName: 'Unit Price',
                type: 'number',
                valueFormatter: function (value) { return (value ? "$".concat(value, ".00") : ''); },
            },
            {
                field: 'totalPrice',
                headerName: 'Total Price',
                type: 'number',
                valueGetter: function (value, row) { return value !== null && value !== void 0 ? value : row === null || row === void 0 ? void 0 : row.unitPrice; },
                valueFormatter: function (value) { return "$".concat(value, ".00"); },
            },
        ],
        rows: [
            {
                id: 1,
                code: 'A101',
                description: 'Wireless Mouse',
                quantity: 2,
                unitPrice: 50,
                totalPrice: 100,
            },
            {
                id: 2,
                code: 'A102',
                description: 'Mechanical Keyboard',
                quantity: 1,
                unitPrice: 75,
            },
            {
                id: 3,
                code: 'A103',
                description: 'USB Dock Station',
                quantity: 1,
                unitPrice: 400,
            },
            {
                id: 4,
                code: 'A104',
                description: 'Laptop',
                quantity: 1,
                unitPrice: 1800,
                totalPrice: 2050,
            },
            {
                id: 5,
                code: 'A104',
                description: '- 16GB RAM Upgrade',
                quantity: 1,
                unitPrice: 100,
                totalPrice: 2050,
            },
            {
                id: 6,
                code: 'A104',
                description: '- 512GB SSD Upgrade',
                quantity: 1,
                unitPrice: 150,
                totalPrice: 2050,
            },
            {
                id: 7,
                code: 'TOTAL',
                totalPrice: 2625,
                summaryRow: true,
            },
        ],
    };
    function TestDataGrid(props) {
        publicApiRef = (0, x_data_grid_1.useGridApiRef)();
        return (<div style={{ width: 500, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} apiRef={publicApiRef} {...props} disableVirtualization={skipIf_1.isJSDOM}/>
      </div>);
    }
    var rowHeight = 52;
    it.skipIf(skipIf_1.isJSDOM)('should span the repeating row values', function () {
        render(<TestDataGrid />);
        var api = (0, internals_1.unwrapPrivateAPI)(publicApiRef.current);
        if (!(api === null || api === void 0 ? void 0 : api.state)) {
            throw new Error('api.virtualizer.store.state is undefined');
        }
        var store = api.virtualizer.store;
        var rowsWithSpannedCells = Object.keys(store.state.rowSpanning.caches.spannedCells);
        expect(rowsWithSpannedCells.length).to.equal(1);
        var rowIndex = api.getRowIndexRelativeToVisibleRows(4);
        expect(rowIndex).to.equal(3);
        var spanValue = store.state.rowSpanning.caches.spannedCells['4'];
        expect(spanValue).to.deep.equal({ '0': 3, '4': 3 });
        var spannedCell = (0, helperFn_1.getCell)(rowIndex, 0);
        expect(spannedCell).to.have.style('height', "".concat(rowHeight * spanValue[0], "px"));
    });
    describe('sorting', function () {
        it.skipIf(skipIf_1.isJSDOM)('should work with sorting when initializing sorting', function () {
            render(<TestDataGrid initialState={{ sorting: { sortModel: [{ field: 'code', sort: 'desc' }] } }}/>);
            var api = (0, internals_1.unwrapPrivateAPI)(publicApiRef.current);
            var store = api.virtualizer.store;
            var rowsWithSpannedCells = Object.keys(store.state.rowSpanning.caches.spannedCells);
            expect(rowsWithSpannedCells.length).to.equal(1);
            var rowIndex = api.getRowIndexRelativeToVisibleRows(4);
            expect(rowIndex).to.equal(1);
            var spanValue = store.state.rowSpanning.caches.spannedCells['4'];
            expect(spanValue).to.deep.equal({ '0': 3, '4': 3 });
            var spannedCell = (0, helperFn_1.getCell)(rowIndex, 0);
            expect(spannedCell).to.have.style('height', "".concat(rowHeight * spanValue[0], "px"));
        });
        it.skipIf(skipIf_1.isJSDOM)('should work with sorting when controlling sorting', function () {
            render(<TestDataGrid sortModel={[{ field: 'code', sort: 'desc' }]}/>);
            var api = (0, internals_1.unwrapPrivateAPI)(publicApiRef.current);
            var store = api.virtualizer.store;
            var rowsWithSpannedCells = Object.keys(store.state.rowSpanning.caches.spannedCells);
            expect(rowsWithSpannedCells.length).to.equal(1);
            var rowIndex = api.getRowIndexRelativeToVisibleRows(4);
            expect(rowIndex).to.equal(1);
            var spanValue = store.state.rowSpanning.caches.spannedCells['4'];
            expect(spanValue).to.deep.equal({ '0': 3, '4': 3 });
            var spannedCell = (0, helperFn_1.getCell)(rowIndex, 0);
            expect(spannedCell).to.have.style('height', "".concat(rowHeight * spanValue[0], "px"));
        });
    });
    describe('filtering', function () {
        it.skipIf(skipIf_1.isJSDOM)('should work with filtering when initializing filter', function () {
            render(<TestDataGrid initialState={{
                    filter: {
                        filterModel: {
                            items: [{ field: 'description', operator: 'contains', value: 'Upgrade' }],
                        },
                    },
                }}/>);
            var api = (0, internals_1.unwrapPrivateAPI)(publicApiRef.current);
            var store = api.virtualizer.store;
            var rowsWithSpannedCells = Object.keys(store.state.rowSpanning.caches.spannedCells);
            expect(rowsWithSpannedCells.length).to.equal(1);
            var rowIndex = api.getRowIndexRelativeToVisibleRows(5);
            expect(rowIndex).to.equal(0);
            var spanValue = store.state.rowSpanning.caches.spannedCells['5'];
            expect(spanValue).to.deep.equal({ '0': 2, '4': 2 });
            var spannedCell = (0, helperFn_1.getCell)(rowIndex, 0);
            expect(spannedCell).to.have.style('height', "".concat(rowHeight * spanValue[0], "px"));
        });
        it.skipIf(skipIf_1.isJSDOM)('should work with filtering when controlling filter', function () {
            render(<TestDataGrid filterModel={{
                    items: [{ field: 'description', operator: 'contains', value: 'Upgrade' }],
                }}/>);
            var api = (0, internals_1.unwrapPrivateAPI)(publicApiRef.current);
            var store = api.virtualizer.store;
            var rowsWithSpannedCells = Object.keys(store.state.rowSpanning.caches.spannedCells);
            expect(rowsWithSpannedCells.length).to.equal(1);
            var rowIndex = api.getRowIndexRelativeToVisibleRows(5);
            expect(rowIndex).to.equal(0);
            var spanValue = store.state.rowSpanning.caches.spannedCells['5'];
            expect(spanValue).to.deep.equal({ '0': 2, '4': 2 });
            var spannedCell = (0, helperFn_1.getCell)(rowIndex, 0);
            expect(spannedCell).to.have.style('height', "".concat(rowHeight * spanValue[0], "px"));
        });
    });
    describe('pagination', function () {
        it.skipIf(skipIf_1.isJSDOM)('should only compute the row spanning state for current page', function () { return __awaiter(void 0, void 0, void 0, function () {
            var api, store;
            return __generator(this, function (_a) {
                render(<TestDataGrid pagination initialState={{ pagination: { paginationModel: { pageSize: 4, page: 0 } } }} pageSizeOptions={[4]}/>);
                api = (0, internals_1.unwrapPrivateAPI)(publicApiRef.current);
                store = api.virtualizer.store;
                expect(Object.keys(store.state.rowSpanning.caches.spannedCells).length).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    api === null || api === void 0 ? void 0 : api.setPage(1);
                });
                expect(Object.keys(store.state.rowSpanning.caches.spannedCells).length).to.equal(1);
                expect(Object.keys(store.state.rowSpanning.caches.hiddenCells).length).to.equal(1);
                return [2 /*return*/];
            });
        }); });
    });
    describe('keyboard navigation', function () {
        it('should respect the spanned cells when navigating using keyboard', function () {
            render(<TestDataGrid />);
            // Set focus to the cell with value `- 16GB RAM Upgrade`
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = publicApiRef.current) === null || _a === void 0 ? void 0 : _a.setCellFocus(5, 'description'); });
            expect((0, helperFn_1.getActiveCell)()).to.equal('4-1');
            var cell41 = (0, helperFn_1.getCell)(4, 1);
            internal_test_utils_1.fireEvent.keyDown(cell41, { key: 'ArrowLeft' });
            expect((0, helperFn_1.getActiveCell)()).to.equal('3-0');
            var cell30 = (0, helperFn_1.getCell)(3, 0);
            internal_test_utils_1.fireEvent.keyDown(cell30, { key: 'ArrowRight' });
            expect((0, helperFn_1.getActiveCell)()).to.equal('3-1');
        });
    });
    describe('rows update', function () {
        it('should update the row spanning state when the rows are updated', function () {
            var rowSpanValueGetter = (0, sinon_1.spy)(function (value) { return value; });
            var rowSpanningStateUpdates = 0;
            var spannedCells = {};
            render(<TestDataGrid columns={[{ field: 'code', rowSpanValueGetter: rowSpanValueGetter }]} rows={[{ id: 1, code: 'A101' }]}/>);
            var api = (0, internals_1.unwrapPrivateAPI)(publicApiRef.current);
            var store = api.virtualizer.store;
            var dispose = store.subscribe(function (newState) {
                var newSpannedCells = newState.rowSpanning.caches.spannedCells;
                if (newSpannedCells !== spannedCells) {
                    rowSpanningStateUpdates += 1;
                    spannedCells = newSpannedCells;
                }
            });
            (0, internal_test_utils_1.act)(function () {
                var _a;
                (_a = publicApiRef.current) === null || _a === void 0 ? void 0 : _a.setRows([
                    { id: 1, code: 'A101' },
                    { id: 2, code: 'A101' },
                ]);
            });
            // Update on row update
            expect(rowSpanningStateUpdates).to.equal(1);
            dispose();
        });
    });
    // TODO: Add tests for row reordering
});
