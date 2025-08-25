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
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_1 = require("@mui/x-data-grid");
var skipIf_1 = require("test/utils/skipIf");
function CustomToolbar(_a) {
    var _b = _a.items, items = _b === void 0 ? ['Item 1', 'Item 2', 'Item 3'] : _b;
    return (<x_data_grid_1.Toolbar>
      {items.map(function (item) { return (<x_data_grid_1.ToolbarButton key={item}>{item}</x_data_grid_1.ToolbarButton>); })}
    </x_data_grid_1.Toolbar>);
}
describe('<DataGrid /> - Toolbar', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        autoHeight: skipIf_1.isJSDOM,
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
        columns: [
            {
                field: 'id',
            },
            {
                field: 'brand',
            },
        ],
    };
    describe('component', function () {
        it('should move focus to the next item when pressing ArrowRight', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<x_data_grid_1.DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar/>).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 3:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should move focus to the previous item when pressing ArrowLeft', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<x_data_grid_1.DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar/>).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 3:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should focus on the first item when pressing Home key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<x_data_grid_1.DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar/>).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Home}')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should focus on the last item when pressing End key', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<x_data_grid_1.DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar/>).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{End}')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should wrap to first item when pressing ArrowRight on last item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<x_data_grid_1.DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar/>).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should wrap to last item when pressing ArrowLeft on first item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<x_data_grid_1.DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar/>).user;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should maintain focus position when an item is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProps = render(<x_data_grid_1.DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar/>).setProps;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 2' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    setProps({
                                        slotProps: {
                                            toolbar: { items: ['Item 1', 'Item 3'] },
                                        },
                                    });
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should maintain focus on the last item when the last item is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var setProps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setProps = render(<x_data_grid_1.DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar/>).setProps;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' }).focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    setProps({
                                        slotProps: {
                                            toolbar: { items: ['Item 1', 'Item 2'] },
                                        },
                                    });
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 2' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should preserve arrow key navigation after item removal', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, user, setProps;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render(<x_data_grid_1.DataGrid {...baselineProps} slots={{ toolbar: CustomToolbar }} showToolbar/>), user = _a.user, setProps = _a.setProps;
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' }).focus()];
                            }); }); })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    setProps({
                                        slotProps: {
                                            toolbar: { items: ['Item 1', 'Item 3'] },
                                        },
                                    });
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 3:
                        _b.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 3' })).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 4:
                        _b.sent();
                        expect(internal_test_utils_1.screen.getByRole('button', { name: 'Item 1' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('column selector', function () {
        it('should hide "id" column when hiding it from the column selector', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} showToolbar/>
        </div>).user;
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'brand']);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText('Columns'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(document.querySelector('[role="tooltip"] [name="id"]'))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['brand']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should show and hide all columns when clicking "Show/Hide All" checkbox from the column selector', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customColumns, user, showHideAllCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customColumns = [
                            {
                                field: 'id',
                            },
                            {
                                field: 'brand',
                            },
                        ];
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={customColumns} showToolbar initialState={{
                                columns: {
                                    columnVisibilityModel: { id: false, brand: false },
                                },
                            }}/>
        </div>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText('Columns'))];
                    case 1:
                        _a.sent();
                        showHideAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Show/Hide All' });
                        return [4 /*yield*/, user.click(showHideAllCheckbox)];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'brand']);
                        return [4 /*yield*/, user.click(showHideAllCheckbox)];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should keep the focus on the switch after toggling a column', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, button, column;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} showToolbar/>
        </div>).user;
                        button = internal_test_utils_1.screen.getByRole('button', { name: 'Columns' });
                        return [4 /*yield*/, user.click(button)];
                    case 1:
                        _a.sent();
                        column = document.querySelector('[role="tooltip"] [name="id"]');
                        return [4 /*yield*/, user.click(column)];
                    case 2:
                        _a.sent();
                        expect(column).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to override search predicate function', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customColumns, columnSearchPredicate, user, searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customColumns = [
                            {
                                field: 'id',
                                description: 'test',
                            },
                            {
                                field: 'brand',
                            },
                        ];
                        columnSearchPredicate = function (column, searchValue) {
                            return ((column.headerName || column.field).toLowerCase().indexOf(searchValue) > -1 ||
                                (column.description || '').toLowerCase().indexOf(searchValue) > -1);
                        };
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} columns={customColumns} showToolbar slotProps={{
                                columnsManagement: {
                                    searchPredicate: columnSearchPredicate,
                                },
                            }}/>
        </div>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByLabelText('Columns'))];
                    case 1:
                        _a.sent();
                        searchInput = document.querySelector('input[type="search"]');
                        return [4 /*yield*/, user.type(searchInput, 'test')];
                    case 2:
                        _a.sent();
                        expect(document.querySelector('[role="tooltip"] [name="id"]')).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
