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
var x_data_grid_1 = require("@mui/x-data-grid");
var helperFn_1 = require("test/utils/helperFn");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
describe('<DataGrid /> - Column headers', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        autoHeight: isJSDOM,
        rows: [
            {
                id: 0,
                brand: 'Nike',
            },
            {
                id: 1,
                brand: 'Adidas',
            },
            {
                id: 2,
                brand: 'Puma',
            },
        ],
    };
    describe('headerClassName', function () {
        it('should append the CSS class defined in headerClassName', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'brand', headerClassName: 'foobar' }]}/>
        </div>);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).to.have.class('foobar');
        });
        it('should append the CSS class returned by headerClassName', function () {
            render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'brand', headerClassName: function () { return 'foobar'; } }]}/>
        </div>);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).to.have.class('foobar');
        });
    });
    describe('Column menu', function () {
        it('should allow to hide column', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'id' }, { field: 'brand', headerClassName: 'foobar' }]}/>
        </div>).user;
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'brand']);
                        return [4 /*yield*/, user.click((0, internal_test_utils_1.within)((0, helperFn_1.getColumnHeaderCell)(0)).getByLabelText('id column menu'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Hide column' }))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not allow to hide the only visible column', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'id' }, { field: 'brand', headerClassName: 'foobar' }]} initialState={{
                                columns: {
                                    columnVisibilityModel: { brand: false },
                                },
                            }}/>
        </div>).user;
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                        return [4 /*yield*/, user.click((0, internal_test_utils_1.within)((0, helperFn_1.getColumnHeaderCell)(0)).getByLabelText('id column menu'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user
                                .setup({ pointerEventsCheck: 0 })
                                .click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Hide column' }))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not allow to hide the only visible column that has menu', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[
                                { field: 'id', disableColumnMenu: true },
                                { field: 'brand', headerClassName: 'foobar' },
                            ]}/>
        </div>).user;
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'brand']);
                        return [4 /*yield*/, user.click((0, internal_test_utils_1.within)((0, helperFn_1.getColumnHeaderCell)(1)).getByLabelText('brand column menu'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user
                                .setup({ pointerEventsCheck: 0 })
                                .click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Hide column' }))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'brand']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('menu icon button should close column menu when already open', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'brand' }]}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, internal_test_utils_1.within)((0, helperFn_1.getColumnHeaderCell)(0)).getByLabelText('brand column menu'))];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        return [4 /*yield*/, user.click((0, internal_test_utils_1.within)((0, helperFn_1.getColumnHeaderCell)(0)).getByLabelText('brand column menu'))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(internal_test_utils_1.screen.queryByRole('menu')).to.equal(null);
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should prevent wheel scroll event from closing the menu when scrolling within the menu', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, menu;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={[{ field: 'brand' }]}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, internal_test_utils_1.within)((0, helperFn_1.getColumnHeaderCell)(0)).getByLabelText('brand column menu'))];
                    case 1:
                        _a.sent();
                        menu = internal_test_utils_1.screen.getByRole('menu');
                        internal_test_utils_1.fireEvent.wheel(menu);
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should close the column menu when the grid is scrolled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, scroller;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ height: 300, width: 300 }}>
          <x_data_grid_1.DataGrid rows={Array.from({ length: 50 }, function (_, id) { return ({ id: id, name: id }); })} columns={[{ field: 'brand' }]}/>
        </div>).user;
                        return [4 /*yield*/, user.click((0, internal_test_utils_1.within)((0, helperFn_1.getColumnHeaderCell)(0)).getByLabelText('brand column menu'))];
                    case 1:
                        _a.sent();
                        scroller = document.querySelector('.MuiDataGrid-virtualScroller');
                        internal_test_utils_1.fireEvent.wheel(scroller, { deltaY: 120 });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(internal_test_utils_1.screen.queryByRole('menu')).to.equal(null);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it("should use 'headerName' as the aria-label for the menu icon button", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    render(<div style={{ width: 300, height: 500 }}>
        <x_data_grid_1.DataGrid {...baselineProps} disableColumnSorting columns={[{ headerName: 'brand header name', field: 'brand' }]}/>
      </div>);
                    _a = expect;
                    return [4 /*yield*/, internal_test_utils_1.screen.findByLabelText('brand header name column menu')];
                case 1:
                    _a.apply(void 0, [_b.sent()]).not.to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should display sort column menu items as per sortingOrder prop', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, columnCell, menuIconButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<div style={{ width: 300, height: 500 }}>
        <x_data_grid_1.DataGrid {...baselineProps} sortingOrder={['desc', 'asc']} columns={[{ field: 'brand', headerClassName: 'foobar' }]}/>
      </div>).user;
                    columnCell = (0, helperFn_1.getColumnHeaderCell)(0);
                    menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]');
                    return [4 /*yield*/, user.click(menuIconButton)];
                case 1:
                    _a.sent();
                    expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: /asc/i })).not.to.equal(null);
                    expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: /desc/i })).not.to.equal(null);
                    expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: /unsort/i })).to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
});
