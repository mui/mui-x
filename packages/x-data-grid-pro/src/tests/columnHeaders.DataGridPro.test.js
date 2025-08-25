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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_transition_group_1 = require("react-transition-group");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
var vitest_1 = require("vitest");
describe('<DataGridPro /> - Column headers', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        autoHeight: skipIf_1.isJSDOM,
        disableColumnResize: false,
        rows: [
            {
                id: 0,
                brand: 'Nike',
                foundationYear: 1964,
            },
            {
                id: 1,
                brand: 'Adidas',
                foundationYear: 1949,
            },
            {
                id: 2,
                brand: 'Puma',
                foundationYear: 1948,
            },
        ],
    };
    // JSDOM version of .focus() doesn't scroll
    it.skipIf(skipIf_1.isJSDOM)('should not scroll the column headers when a column is focused', function () { return __awaiter(void 0, void 0, void 0, function () {
        var columnHeaders, columnCell;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<div style={{ width: 102, height: 500 }}>
        <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[{ field: 'brand' }, { field: 'foundationYear' }]}/>
      </div>);
                    columnHeaders = document.querySelector('.MuiDataGrid-columnHeaders');
                    expect(columnHeaders.scrollLeft).to.equal(0);
                    columnCell = (0, helperFn_1.getColumnHeaderCell)(0);
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return columnCell.focus(); })];
                case 1:
                    _a.sent();
                    internal_test_utils_1.fireEvent.keyDown(columnCell, { key: 'End' });
                    expect(columnHeaders.scrollLeft).to.equal(0);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('GridColumnHeaderMenu', function () {
        beforeEach(function () {
            vitest_1.vi.useFakeTimers();
        });
        afterEach(function () {
            vitest_1.vi.useRealTimers();
        });
        it('should close the menu when the window is scrolled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var columnCell, menuIconButton, virtualScroller;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<div style={{ width: 300, height: 200 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[{ field: 'brand' }]}/>
        </div>);
                        columnCell = (0, helperFn_1.getColumnHeaderCell)(0);
                        menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]');
                        internal_test_utils_1.fireEvent.click(menuIconButton);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                        internal_test_utils_1.fireEvent.wheel(virtualScroller);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not close the menu when updating the rows prop', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Test(props) {
                return (<div style={{ width: 300, height: 500 }}>
            <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[{ field: 'brand' }]} {...props}/>
          </div>);
            }
            var setProps, columnCell, menuIconButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProps = render(<Test />).setProps;
                        columnCell = (0, helperFn_1.getColumnHeaderCell)(0);
                        menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]');
                        internal_test_utils_1.fireEvent.click(menuIconButton);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        setProps({ rows: __spreadArray([], baselineProps.rows, true) });
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not modify column order when menu is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var columnCell, menuIconButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[{ field: 'brand' }]}/>
        </div>);
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                        columnCell = (0, helperFn_1.getColumnHeaderCell)(0);
                        menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]');
                        internal_test_utils_1.fireEvent.click(menuIconButton);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('menu'));
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should sort column when sort by Asc is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var columnCell, menuIconButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[{ field: 'brand' }]}/>
        </div>);
                        columnCell = (0, helperFn_1.getColumnHeaderCell)(0);
                        menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]');
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                        internal_test_utils_1.fireEvent.click(menuIconButton);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Sort by ASC' }));
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Nike', 'Puma']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should close the menu of a column when resizing this column', function () { return __awaiter(void 0, void 0, void 0, function () {
            var columnCell, menuIconButton, separator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[
                                { field: 'brand', resizable: true },
                                { field: 'foundationYear', resizable: true },
                            ]}/>
        </div>);
                        columnCell = (0, helperFn_1.getColumnHeaderCell)(0);
                        menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]');
                        internal_test_utils_1.fireEvent.click(menuIconButton);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        separator = columnCell.querySelector('.MuiDataGrid-iconSeparator');
                        internal_test_utils_1.fireEvent.mouseDown(separator);
                        // TODO remove mouseUp once useGridColumnReorder will handle cleanup properly
                        internal_test_utils_1.fireEvent.mouseUp(separator);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should close the menu of a column when resizing another column', function () { return __awaiter(void 0, void 0, void 0, function () {
            var columnWithMenuCell, columnToResizeCell, menuIconButton, separator;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[
                                { field: 'brand', resizable: true },
                                { field: 'foundationYear', resizable: true },
                            ]}/>
        </div>);
                        columnWithMenuCell = (0, helperFn_1.getColumnHeaderCell)(0);
                        columnToResizeCell = (0, helperFn_1.getColumnHeaderCell)(1);
                        menuIconButton = columnWithMenuCell.querySelector('button[aria-label="brand column menu"]');
                        internal_test_utils_1.fireEvent.click(menuIconButton);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        separator = columnToResizeCell.querySelector(".".concat(x_data_grid_pro_1.gridClasses['columnSeparator--resizable']));
                        internal_test_utils_1.fireEvent.mouseDown(separator);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).to.equal(null);
                        // cleanup
                        internal_test_utils_1.fireEvent.mouseUp(separator);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should close the menu of a column when pressing the Escape key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var columnCell, menuIconButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[{ field: 'brand' }]}/>
        </div>);
                        columnCell = (0, helperFn_1.getColumnHeaderCell)(0);
                        menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]');
                        internal_test_utils_1.fireEvent.click(menuIconButton);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
                        /* eslint-disable material-ui/disallow-active-element-as-key-event-target */
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Escape' });
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('menu')).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should remove the MuiDataGrid-menuOpen CSS class only after the transition has ended', function () { return __awaiter(void 0, void 0, void 0, function () {
            var restoreDisabledConfig, columnCell, menuIconButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        restoreDisabledConfig = react_transition_group_1.config.disabled;
                        // enable `react-transition-group` transitions for this test
                        react_transition_group_1.config.disabled = false;
                        render(<div style={{ width: 300, height: 500 }}>
          <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[{ field: 'brand' }]}/>
        </div>);
                        columnCell = (0, helperFn_1.getColumnHeaderCell)(0);
                        menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]');
                        internal_test_utils_1.fireEvent.click(menuIconButton);
                        expect(menuIconButton === null || menuIconButton === void 0 ? void 0 : menuIconButton.parentElement).to.have.class(x_data_grid_pro_1.gridClasses.menuOpen);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 1:
                        _a.sent(); // Wait for the transition to run
                        internal_test_utils_1.fireEvent.keyDown(document.activeElement, { key: 'Escape' });
                        expect(menuIconButton === null || menuIconButton === void 0 ? void 0 : menuIconButton.parentElement).to.have.class(x_data_grid_pro_1.gridClasses.menuOpen);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 2:
                        _a.sent(); // Wait for the transition to run
                        expect(menuIconButton === null || menuIconButton === void 0 ? void 0 : menuIconButton.parentElement).not.to.have.class(x_data_grid_pro_1.gridClasses.menuOpen);
                        // restore previous config
                        react_transition_group_1.config.disabled = restoreDisabledConfig;
                        return [2 /*return*/];
                }
            });
        }); });
        it('should restore focus to the column header when dismissing the menu by selecting any item', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Test(props) {
                return (<div style={{ width: 300, height: 500 }}>
            <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[{ field: 'brand' }]} initialState={{ sorting: { sortModel: [{ field: 'brand', sort: 'asc' }] } }} {...props}/>
          </div>);
            }
            var columnCell, menuIconButton, menu, descMenuitem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<Test />);
                        columnCell = (0, helperFn_1.getColumnHeaderCell)(0);
                        menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]');
                        internal_test_utils_1.fireEvent.click(menuIconButton);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        menu = internal_test_utils_1.screen.getByRole('menu');
                        descMenuitem = internal_test_utils_1.screen.getByRole('menuitem', { name: /sort by desc/i });
                        expect(menu).toHaveFocus();
                        internal_test_utils_1.fireEvent.keyDown(menu, { key: 'ArrowDown' });
                        expect(descMenuitem).toHaveFocus();
                        internal_test_utils_1.fireEvent.keyDown(descMenuitem, { key: 'Enter' });
                        expect(columnCell).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should restore focus to the column header when dismissing the menu without selecting any item', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Test(props) {
                return (<div style={{ width: 300, height: 500 }}>
            <x_data_grid_pro_1.DataGridPro {...baselineProps} columns={[{ field: 'brand' }]} {...props}/>
          </div>);
            }
            var columnCell, menuIconButton, menu;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<Test />);
                        columnCell = (0, helperFn_1.getColumnHeaderCell)(0);
                        menuIconButton = columnCell.querySelector('button[aria-label="brand column menu"]');
                        internal_test_utils_1.fireEvent.click(menuIconButton);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, vitest_1.vi.runAllTimersAsync()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        menu = internal_test_utils_1.screen.getByRole('menu');
                        expect(menu).toHaveFocus();
                        internal_test_utils_1.fireEvent.keyDown(menu, { key: 'Escape' });
                        expect(menu).not.toHaveFocus();
                        expect(columnCell).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
