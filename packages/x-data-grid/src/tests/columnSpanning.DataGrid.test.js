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
var x_data_grid_1 = require("@mui/x-data-grid");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGrid /> - Column spanning', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        rows: [
            {
                id: 0,
                brand: 'Nike',
                category: 'Shoes',
                price: '$120',
                rating: '4.5',
            },
            {
                id: 1,
                brand: 'Adidas',
                category: 'Shoes',
                price: '$100',
                rating: '4.5',
            },
            {
                id: 2,
                brand: 'Puma',
                category: 'Shoes',
                price: '$90',
                rating: '4.5',
            },
        ],
    };
    it('should support `colSpan` number signature', function () {
        render(<div style={{ width: 500, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} columns={[
                { field: 'brand', colSpan: 3 },
                { field: 'category' },
                { field: 'price' },
                { field: 'rating' },
            ]} disableVirtualization={skipIf_1.isJSDOM}/>
      </div>);
        expect(function () { return (0, helperFn_1.getCell)(0, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 1); }).to.throw(/not found/);
        expect(function () { return (0, helperFn_1.getCell)(0, 2); }).to.throw(/not found/);
        expect(function () { return (0, helperFn_1.getCell)(0, 3); }).not.to.throw();
    });
    it('should support `colSpan` function signature', function () {
        render(<div style={{ width: 500, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} columns={[
                { field: 'brand', colSpan: function (value, row) { return (row.brand === 'Nike' ? 2 : 1); } },
                { field: 'category', colSpan: function (value, row) { return (row.brand === 'Adidas' ? 2 : 1); } },
                { field: 'price', colSpan: function (value, row) { return (row.brand === 'Puma' ? 2 : 1); } },
                { field: 'rating' },
            ]} disableVirtualization={skipIf_1.isJSDOM}/>
      </div>);
        // Nike
        expect(function () { return (0, helperFn_1.getCell)(0, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 1); }).to.throw(/not found/);
        expect(function () { return (0, helperFn_1.getCell)(0, 2); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 3); }).not.to.throw();
        // Adidas
        expect(function () { return (0, helperFn_1.getCell)(1, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(1, 1); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(1, 2); }).to.throw(/not found/);
        expect(function () { return (0, helperFn_1.getCell)(1, 3); }).not.to.throw();
        // Puma
        expect(function () { return (0, helperFn_1.getCell)(2, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(2, 1); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(2, 2); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(2, 3); }).to.throw(/not found/);
    });
    it('should treat `colSpan` 0 value as 1', function () {
        render(<div style={{ width: 500, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} columns={[
                { field: 'brand', colSpan: 0 },
                { field: 'category', colSpan: function () { return 0; } },
                { field: 'price' },
            ]} rows={[{ id: 0, brand: 'Nike', category: 'Shoes', price: '$120' }]}/>
      </div>);
        // First Nike row
        expect(function () { return (0, helperFn_1.getCell)(0, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 1); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 2); }).not.to.throw();
    });
    describe('key navigation', function () {
        var columns = [
            { field: 'brand', colSpan: function (value, row) { return (row.brand === 'Nike' ? 2 : 1); } },
            { field: 'category', colSpan: function (value, row) { return (row.brand === 'Adidas' ? 2 : 1); } },
            { field: 'price', colSpan: function (value, row) { return (row.brand === 'Puma' ? 2 : 1); } },
            { field: 'rating' },
        ];
        it('should move to the cell right when pressing "ArrowRight"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 500, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={columns}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-2');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the cell left when pressing "ArrowLeft"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 500, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={columns}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 2))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-2');
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the cell above when pressing "ArrowUp"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 500, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={columns}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 1))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-1');
                        return [4 /*yield*/, user.keyboard('{ArrowUp}')];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the cell below when pressing "ArrowDown"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 500, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={columns} disableVirtualization={skipIf_1.isJSDOM}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 3))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-3');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('2-2');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move down by the amount of rows visible on screen when pressing "PageDown"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 500, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={columns} autoHeight={skipIf_1.isJSDOM} disableVirtualization={skipIf_1.isJSDOM}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 3))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-3');
                        return [4 /*yield*/, user.keyboard('{PageDown}')];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('2-2');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move up by the amount of rows visible on screen when pressing "PageUp"', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 500, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={columns} autoHeight={skipIf_1.isJSDOM}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 1))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('2-1');
                        return [4 /*yield*/, user.keyboard('{PageUp}')];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the cell below when pressing "Enter" after editing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var editableColumns, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        editableColumns = columns.map(function (column) { return (__assign(__assign({}, column), { editable: true })); });
                        user = render(<div style={{ width: 500, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={editableColumns} autoHeight={skipIf_1.isJSDOM} disableVirtualization={skipIf_1.isJSDOM}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 3))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-3');
                        // start editing / commit
                        return [4 /*yield*/, user.keyboard('{Enter}{Enter}')];
                    case 2:
                        // start editing / commit
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('2-2');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the cell on the right when pressing "Tab" after editing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var editableColumns, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        editableColumns = columns.map(function (column) { return (__assign(__assign({}, column), { editable: true })); });
                        user = render(<div style={{ width: 500, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={editableColumns} disableVirtualization={skipIf_1.isJSDOM}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 1))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-1');
                        // start editing
                        return [4 /*yield*/, user.keyboard('{Enter}{Tab}')];
                    case 2:
                        // start editing
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-3');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move to the cell on the left when pressing "Shift+Tab" after editing', function () { return __awaiter(void 0, void 0, void 0, function () {
            var editableColumns, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        editableColumns = columns.map(function (column) { return (__assign(__assign({}, column), { editable: true })); });
                        user = render(<div style={{ width: 500, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={editableColumns} disableVirtualization={skipIf_1.isJSDOM}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 2))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-2');
                        // start editing
                        return [4 /*yield*/, user.keyboard('{Enter}{Shift>}{Tab}{/Shift}')];
                    case 2:
                        // start editing
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [2 /*return*/];
                }
            });
        }); });
        // needs virtualization
        it.skipIf(skipIf_1.isJSDOM)('should work with row virtualization', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rows, rowHeight, user, activeCell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rows = [
                            {
                                id: 0,
                                brand: 'Nike',
                                category: 'Shoes',
                                price: '$120',
                            },
                            {
                                id: 1,
                                brand: 'Nike',
                                category: 'Shoes',
                                price: '$120',
                            },
                            {
                                id: 2,
                                brand: 'Nike',
                                category: 'Shoes',
                                price: '$120',
                            },
                            {
                                id: 3,
                                brand: 'Adidas',
                                category: 'Shoes',
                                price: '$100',
                            },
                        ];
                        rowHeight = 52;
                        user = render(<div style={{ width: 500, height: (rows.length + 1) * rowHeight }}>
          <x_data_grid_1.DataGrid columns={[
                                { field: 'brand', colSpan: function (value, row) { return (row.brand === 'Adidas' ? 2 : 1); } },
                                { field: 'category' },
                                { field: 'price' },
                            ]} rows={rows} rowBufferPx={rowHeight} rowHeight={rowHeight}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 1))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-1');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}{ArrowDown}')];
                    case 2:
                        _a.sent();
                        activeCell = (0, helperFn_1.getActiveCell)();
                        expect(activeCell).to.equal('3-0');
                        return [2 /*return*/];
                }
            });
        }); });
        // needs layout
        it.skipIf(skipIf_1.isJSDOM)('should work with column virtualization', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 200, height: 200 }}>
          <x_data_grid_1.DataGrid columns={[
                                { field: 'col0', width: 100, colSpan: 3 },
                                { field: 'col1', width: 100 },
                                { field: 'col2', width: 100 },
                                { field: 'col3', width: 100 },
                            ]} rows={[{ id: 0, col0: '0-0', col1: '0-1', col2: '0-2', col3: '0-3' }]} columnBufferPx={100}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 2:
                        _a.sent();
                        expect(function () { return (0, helperFn_1.getCell)(0, 3); }).not.to.throw();
                        // should not be rendered because of first column colSpan
                        expect(function () { return (0, helperFn_1.getCell)(0, 2); }).to.throw(/not found/);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should work with filtering', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 500, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[
                                { field: 'brand', colSpan: function (value, row) { return (row.brand === 'Nike' ? 2 : 1); } },
                                { field: 'category' },
                                { field: 'price' },
                                { field: 'rating' },
                            ]} rows={[
                                {
                                    id: 0,
                                    brand: 'Nike',
                                    category: 'Shoes',
                                    price: '$120',
                                    rating: '4.5',
                                },
                                {
                                    id: 1,
                                    brand: 'Adidas',
                                    category: 'Shoes',
                                    price: '$100',
                                    rating: '4.5',
                                },
                                {
                                    id: 2,
                                    brand: 'Puma',
                                    category: 'Shoes',
                                    price: '$90',
                                    rating: '4.5',
                                },
                                {
                                    id: 3,
                                    brand: 'Nike',
                                    category: 'Shoes',
                                    price: '$120',
                                    rating: '4.5',
                                },
                                {
                                    id: 4,
                                    brand: 'Adidas',
                                    category: 'Shoes',
                                    price: '$100',
                                    rating: '4.5',
                                },
                                {
                                    id: 5,
                                    brand: 'Puma',
                                    category: 'Shoes',
                                    price: '$90',
                                    rating: '4.5',
                                },
                            ]} initialState={{
                                filter: {
                                    filterModel: {
                                        items: [{ field: 'brand', operator: 'equals', value: 'Nike' }],
                                    },
                                },
                            }}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-0');
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('1-2');
                        return [2 /*return*/];
                }
            });
        }); });
        // needs layout
        it.skipIf(skipIf_1.isJSDOM)('should scroll the whole cell into view when `colSpan` > 1', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, virtualScroller;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 200, height: 200 }}>
          <x_data_grid_1.DataGrid columns={[
                                { field: 'col0', width: 100, colSpan: 2 },
                                { field: 'col1', width: 100 },
                                { field: 'col2', width: 100 },
                                { field: 'col3', width: 100, colSpan: 2 },
                                { field: 'col4', width: 100 },
                            ]} rows={[{ id: 0, col0: '0-0', col1: '0-1', col2: '0-2', col3: '0-3', col4: '0-4' }]} columnBufferPx={100}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        virtualScroller = document.querySelector(".".concat(x_data_grid_1.gridClasses.virtualScroller));
                        return [4 /*yield*/, user.keyboard('{ArrowRight}{ArrowRight}')];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-3');
                        // should be scrolled to the end of the cell
                        expect(virtualScroller.scrollLeft).to.equal(3 * 100);
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}{ArrowLeft}')];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(virtualScroller.scrollLeft).to.equal(0);
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should work with filtering', function () {
        render(<div style={{ width: 500, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} columns={[
                { field: 'brand', colSpan: function (value, row) { return (row.brand === 'Nike' ? 2 : 1); } },
                { field: 'category', colSpan: function (value, row) { return (row.brand === 'Adidas' ? 2 : 1); } },
                { field: 'price', colSpan: function (value, row) { return (row.brand === 'Puma' ? 2 : 1); } },
                { field: 'rating' },
            ]} rows={[
                {
                    id: 0,
                    brand: 'Nike',
                    category: 'Shoes',
                    price: '$120',
                    rating: '4.5',
                },
                {
                    id: 1,
                    brand: 'Adidas',
                    category: 'Shoes',
                    price: '$100',
                    rating: '4.5',
                },
                {
                    id: 2,
                    brand: 'Puma',
                    category: 'Shoes',
                    price: '$90',
                    rating: '4.5',
                },
                {
                    id: 3,
                    brand: 'Nike',
                    category: 'Shoes',
                    price: '$120',
                    rating: '4.5',
                },
                {
                    id: 4,
                    brand: 'Adidas',
                    category: 'Shoes',
                    price: '$100',
                    rating: '4.5',
                },
                {
                    id: 5,
                    brand: 'Puma',
                    category: 'Shoes',
                    price: '$90',
                    rating: '4.5',
                },
            ]} initialState={{
                filter: {
                    filterModel: {
                        items: [{ field: 'brand', operator: 'equals', value: 'Nike' }],
                    },
                },
            }} disableVirtualization={skipIf_1.isJSDOM}/>
      </div>);
        // First Nike row
        expect(function () { return (0, helperFn_1.getCell)(0, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 1); }).to.throw(/not found/);
        expect(function () { return (0, helperFn_1.getCell)(0, 2); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(0, 3); }).not.to.throw();
        // Second Nike row
        expect(function () { return (0, helperFn_1.getCell)(1, 0); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(1, 1); }).to.throw(/not found/);
        expect(function () { return (0, helperFn_1.getCell)(1, 2); }).not.to.throw();
        expect(function () { return (0, helperFn_1.getCell)(1, 3); }).not.to.throw();
    });
    it('should apply `colSpan` properly after hiding a column', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<div style={{ width: 500, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} columns={[
                            { field: 'brand', colSpan: function (value, row) { return (row.brand === 'Nike' ? 2 : 1); } },
                            { field: 'category', colSpan: function (value, row) { return (row.brand === 'Adidas' ? 2 : 1); } },
                            { field: 'price', colSpan: function (value, row) { return (row.brand === 'Puma' ? 2 : 1); } },
                            { field: 'rating' },
                        ]}/>
      </div>).user;
                    // hide `category` column
                    return [4 /*yield*/, user.click((0, internal_test_utils_1.within)((0, helperFn_1.getColumnHeaderCell)(1)).getByLabelText('category column menu'))];
                case 1:
                    // hide `category` column
                    _a.sent();
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Hide column' }))];
                case 2:
                    _a.sent();
                    // Nike row
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(function () { return (0, helperFn_1.getCell)(0, 0); }).not.to.throw();
                        })];
                case 3:
                    // Nike row
                    _a.sent();
                    expect(function () { return (0, helperFn_1.getCell)(0, 1); }).to.throw(/not found/);
                    expect(function () { return (0, helperFn_1.getCell)(0, 2); }).not.to.throw();
                    // Adidas row
                    expect(function () { return (0, helperFn_1.getCell)(1, 0); }).not.to.throw();
                    expect(function () { return (0, helperFn_1.getCell)(1, 1); }).not.to.throw();
                    expect(function () { return (0, helperFn_1.getCell)(1, 2); }).not.to.throw();
                    // Puma row
                    expect(function () { return (0, helperFn_1.getCell)(2, 0); }).not.to.throw();
                    expect(function () { return (0, helperFn_1.getCell)(2, 1); }).not.to.throw();
                    expect(function () { return (0, helperFn_1.getCell)(2, 2); }).to.throw(/not found/);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should add `aria-colspan` attribute when `colSpan` > 1', function () {
        render(<div style={{ width: 500, height: 300 }}>
        <x_data_grid_1.DataGrid {...baselineProps} columns={[
                { field: 'brand', colSpan: 2 },
                { field: 'category' },
                { field: 'price' },
                { field: 'rating' },
            ]}/>
      </div>);
        expect((0, helperFn_1.getCell)(0, 0)).to.have.attribute('aria-colspan', '2');
        expect((0, helperFn_1.getCell)(0, 2)).to.have.attribute('aria-colspan', '1');
    });
    it('should work with pagination', function () { return __awaiter(void 0, void 0, void 0, function () {
        function checkRows(pageNumber, rowsList) {
            rowsList.forEach(function (rowName, index) {
                var rowIndex = pageNumber * pageSize + index;
                if (rowName === 'Nike') {
                    expect(function () { return (0, helperFn_1.getCell)(rowIndex, 0); }).not.to.throw();
                    expect(function () { return (0, helperFn_1.getCell)(rowIndex, 1); }).to.throw(/not found/);
                    expect(function () { return (0, helperFn_1.getCell)(rowIndex, 2); }).not.to.throw();
                    expect(function () { return (0, helperFn_1.getCell)(rowIndex, 3); }).not.to.throw();
                }
                else if (rowName === 'Adidas') {
                    expect(function () { return (0, helperFn_1.getCell)(rowIndex, 0); }).not.to.throw();
                    expect(function () { return (0, helperFn_1.getCell)(rowIndex, 1); }).not.to.throw();
                    expect(function () { return (0, helperFn_1.getCell)(rowIndex, 2); }).to.throw(/not found/);
                    expect(function () { return (0, helperFn_1.getCell)(rowIndex, 3); }).not.to.throw();
                }
                else if (rowName === 'Puma') {
                    expect(function () { return (0, helperFn_1.getCell)(rowIndex, 0); }).not.to.throw();
                    expect(function () { return (0, helperFn_1.getCell)(rowIndex, 1); }).not.to.throw();
                    expect(function () { return (0, helperFn_1.getCell)(rowIndex, 2); }).not.to.throw();
                    expect(function () { return (0, helperFn_1.getCell)(rowIndex, 3); }).to.throw(/not found/);
                }
            });
        }
        function TestCase() {
            return (<div style={{ width: 500, height: 300 }}>
          <x_data_grid_1.DataGrid columns={columns} rows={rows} initialState={{ pagination: { paginationModel: { pageSize: pageSize } } }} pageSizeOptions={[pageSize]} disableVirtualization={skipIf_1.isJSDOM}/>
        </div>);
        }
        var rows, columns, pageSize, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rows = [
                        {
                            id: 0,
                            brand: 'Nike',
                            category: 'Shoes',
                            price: '$120',
                            rating: '4.5',
                        },
                        {
                            id: 1,
                            brand: 'Adidas',
                            category: 'Shoes',
                            price: '$100',
                            rating: '4.5',
                        },
                        {
                            id: 2,
                            brand: 'Puma',
                            category: 'Shoes',
                            price: '$90',
                            rating: '4.5',
                        },
                        {
                            id: 3,
                            brand: 'Nike',
                            category: 'Shoes',
                            price: '$120',
                            rating: '4.5',
                        },
                        {
                            id: 4,
                            brand: 'Adidas',
                            category: 'Shoes',
                            price: '$100',
                            rating: '4.5',
                        },
                        {
                            id: 5,
                            brand: 'Puma',
                            category: 'Shoes',
                            price: '$90',
                            rating: '4.5',
                        },
                    ];
                    columns = [
                        { field: 'brand', colSpan: function (value, row) { return (row.brand === 'Nike' ? 2 : 1); } },
                        { field: 'category', colSpan: function (value, row) { return (row.brand === 'Adidas' ? 2 : 1); } },
                        { field: 'price', colSpan: function (value, row) { return (row.brand === 'Puma' ? 2 : 1); } },
                        { field: 'rating' },
                    ];
                    pageSize = 2;
                    user = render(<TestCase />).user;
                    checkRows(0, ['Nike', 'Adidas']);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                case 1:
                    _a.sent();
                    checkRows(1, ['Puma', 'Nike']);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                case 2:
                    _a.sent();
                    checkRows(2, ['Adidas', 'Puma']);
                    return [2 /*return*/];
            }
        });
    }); });
    // Need layout for column virtualization
    it.skipIf(skipIf_1.isJSDOM)('should work with column virtualization', function () { return __awaiter(void 0, void 0, void 0, function () {
        var virtualScroller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<div style={{ width: 390, height: 300 }}>
        <x_data_grid_1.DataGrid columns={[
                            { field: 'col0', width: 100, colSpan: function (value) { return (value === '1-0' ? 3 : 1); } },
                            { field: 'col1', width: 100 },
                            { field: 'col2', width: 100 },
                            { field: 'col3', width: 100 },
                            { field: 'col4', width: 100 },
                            { field: 'col5', width: 100 },
                        ]} rows={[
                            { id: 0, col0: '0-0', col1: '0-1', col2: '0-2', col3: '0-3', col4: '0-4', col5: '0-5' },
                            { id: 1, col0: '1-0', col1: '1-1', col2: '1-2', col3: '1-3', col4: '1-4', col5: '1-5' },
                        ]} columnBufferPx={100}/>
      </div>);
                    expect((0, helperFn_1.getCell)(0, 4).offsetLeft).to.equal((0, helperFn_1.getCell)(1, 4).offsetLeft, 'last cells in both rows should be aligned');
                    expect((0, helperFn_1.getColumnHeaderCell)(4).offsetLeft).to.equal((0, helperFn_1.getCell)(1, 4).offsetLeft, 'last cell and column header cell should be aligned');
                    virtualScroller = document.querySelector(".".concat(x_data_grid_1.gridClasses.virtualScroller));
                    // scroll to the very end
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, virtualScroller.scrollTo({ left: 1000, behavior: 'instant' })];
                        }); }); })];
                case 1:
                    // scroll to the very end
                    _a.sent();
                    expect((0, helperFn_1.getCell)(0, 5).offsetLeft).to.equal((0, helperFn_1.getCell)(1, 5).offsetLeft, 'last cells in both rows should be aligned after scroll');
                    expect((0, helperFn_1.getColumnHeaderCell)(5).offsetLeft).to.equal((0, helperFn_1.getCell)(1, 5).offsetLeft, 'last cell and column header cell should be aligned after scroll');
                    return [2 /*return*/];
            }
        });
    }); });
    // Need layout for column virtualization
    it.skipIf(skipIf_1.isJSDOM)('should work with both column and row virtualization', function () { return __awaiter(void 0, void 0, void 0, function () {
        var rowHeight, virtualScroller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rowHeight = 50;
                    render(<div style={{ width: 390, height: 300 }}>
        <x_data_grid_1.DataGrid columns={[
                            { field: 'col0', width: 100, colSpan: function (value) { return (value === '1-0' ? 3 : 1); } },
                            { field: 'col1', width: 100 },
                            { field: 'col2', width: 100 },
                            { field: 'col3', width: 100 },
                            { field: 'col4', width: 100 },
                            { field: 'col5', width: 100 },
                        ]} rows={[
                            { id: 0, col0: '0-0', col1: '0-1', col2: '0-2', col3: '0-3', col4: '0-4', col5: '0-5' },
                            { id: 1, col0: '1-0', col1: '1-1', col2: '1-2', col3: '1-3', col4: '1-4', col5: '1-5' },
                            { id: 2, col0: '2-0', col1: '2-1', col2: '2-2', col3: '2-3', col4: '2-4', col5: '2-5' },
                            { id: 3, col0: '3-0', col1: '3-1', col2: '3-2', col3: '3-3', col4: '3-4', col5: '3-5' },
                            { id: 4, col0: '4-0', col1: '4-1', col2: '4-2', col3: '4-3', col4: '4-4', col5: '4-5' },
                            { id: 5, col0: '5-0', col1: '5-1', col2: '5-2', col3: '5-3', col4: '5-4', col5: '5-5' },
                            { id: 6, col0: '6-0', col1: '6-1', col2: '6-2', col3: '6-3', col4: '6-4', col5: '6-5' },
                        ]} columnBufferPx={100} rowBufferPx={50} rowHeight={rowHeight}/>
      </div>);
                    expect((0, helperFn_1.getCell)(2, 4).offsetLeft).to.equal((0, helperFn_1.getCell)(1, 4).offsetLeft, 'last cells in both rows should be aligned');
                    expect((0, helperFn_1.getColumnHeaderCell)(4).offsetLeft).to.equal((0, helperFn_1.getCell)(1, 4).offsetLeft, 'last cell and column header cell should be aligned');
                    virtualScroller = document.querySelector(".".concat(x_data_grid_1.gridClasses.virtualScroller));
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, virtualScroller.scrollTo({
                                        // hide first row to trigger row virtualization
                                        top: rowHeight + 10,
                                        // scroll to the very end
                                        left: 1000,
                                        behavior: 'instant',
                                    })];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getCell)(2, 5).offsetLeft).to.equal((0, helperFn_1.getCell)(1, 5).offsetLeft, 'last cells in both rows should be aligned after scroll');
                        })];
                case 2:
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeaderCell)(5).offsetLeft).to.equal((0, helperFn_1.getCell)(1, 5).offsetLeft, 'last cell and column header cell should be aligned after scroll');
                    return [2 /*return*/];
            }
        });
    }); });
    // Need layout for column virtualization
    it.skipIf(skipIf_1.isJSDOM)('should work with pagination and column virtualization', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestCase() {
            return (<div style={{ width: 390, height: 300 }}>
          <x_data_grid_1.DataGrid pageSizeOptions={[3]} initialState={{ pagination: { paginationModel: { pageSize: 3 } } }} columns={[
                    { field: 'col0', width: 100, colSpan: function (value) { return (value === '4-0' ? 3 : 1); } },
                    { field: 'col1', width: 100 },
                    { field: 'col2', width: 100 },
                    { field: 'col3', width: 100 },
                    { field: 'col4', width: 100 },
                    { field: 'col5', width: 100 },
                ]} rows={[
                    {
                        id: 0,
                        col0: '0-0',
                        col1: '0-1',
                        col2: '0-2',
                        col3: '0-3',
                        col4: '0-4',
                        col5: '0-5',
                    },
                    {
                        id: 1,
                        col0: '1-0',
                        col1: '1-1',
                        col2: '1-2',
                        col3: '1-3',
                        col4: '1-4',
                        col5: '1-5',
                    },
                    {
                        id: 2,
                        col0: '2-0',
                        col1: '2-1',
                        col2: '2-2',
                        col3: '2-3',
                        col4: '2-4',
                        col5: '2-5',
                    },
                    {
                        id: 3,
                        col0: '3-0',
                        col1: '3-1',
                        col2: '3-2',
                        col3: '3-3',
                        col4: '3-4',
                        col5: '3-5',
                    },
                    {
                        id: 4,
                        col0: '4-0',
                        col1: '4-1',
                        col2: '4-2',
                        col3: '4-3',
                        col4: '4-4',
                        col5: '4-5',
                    },
                    {
                        id: 5,
                        col0: '5-0',
                        col1: '5-1',
                        col2: '5-2',
                        col3: '5-3',
                        col4: '5-4',
                        col5: '5-5',
                    },
                ]} columnBufferPx={100} rowBufferPx={50} rowHeight={rowHeight}/>
        </div>);
        }
        var rowHeight, user, virtualScroller;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rowHeight = 50;
                    user = render(<TestCase />).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getCell)(5, 4).offsetLeft).to.equal((0, helperFn_1.getCell)(4, 4).offsetLeft, 'last cells in both rows should be aligned');
                    expect((0, helperFn_1.getColumnHeaderCell)(4).offsetLeft).to.equal((0, helperFn_1.getCell)(4, 4).offsetLeft, 'last cell and column header cell should be aligned');
                    virtualScroller = document.querySelector(".".concat(x_data_grid_1.gridClasses.virtualScroller));
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, virtualScroller.scrollTo({
                                        // hide first row to trigger row virtualization
                                        top: rowHeight + 10,
                                        // scroll to the very end
                                        left: 1000,
                                        behavior: 'instant',
                                    })];
                            });
                        }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getCell)(5, 5).offsetLeft).to.equal((0, helperFn_1.getCell)(4, 5).offsetLeft, 'last cells in both rows should be aligned after scroll');
                        })];
                case 3:
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeaderCell)(5).offsetLeft).to.equal((0, helperFn_1.getCell)(4, 5).offsetLeft, 'last cell and column header cell should be aligned after scroll');
                    return [2 /*return*/];
            }
        });
    }); });
});
