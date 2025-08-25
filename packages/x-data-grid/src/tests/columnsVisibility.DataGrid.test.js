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
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_1 = require("@mui/x-data-grid");
var helperFn_1 = require("test/utils/helperFn");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
var rows = [{ id: 1, idBis: 1 }];
var columns = [{ field: 'id' }, { field: 'idBis' }];
describe('<DataGrid /> - Columns visibility', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    function TestDataGrid(props) {
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid columns={columns} rows={rows} {...props} autoHeight={isJSDOM}/>
      </div>);
    }
    describe('prop: columnVisibilityModel and onColumnVisibilityModelChange', function () {
        it('should allow to set the columnVisibilityModel prop', function () {
            render(<TestDataGrid columnVisibilityModel={{ idBis: false }}/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
        });
        it('should allow to update the columnVisibilityModel prop from the outside', function () {
            var setProps = render(<TestDataGrid columnVisibilityModel={{ idBis: false }}/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
            setProps({
                columnVisibilityModel: {},
            });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'idBis']);
        });
        it('should update the visible columns when props.onColumnVisibilityModelChange and props.columnVisibilityModel are not defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGrid showToolbar/>).user;
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'idBis']);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: 'id' }))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['idBis']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onColumnVisibilityModelChange and update the visible columns when props.columnVisibilityModel is not defined', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onColumnVisibilityModelChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onColumnVisibilityModelChange = (0, sinon_1.spy)();
                        user = render(<TestDataGrid showToolbar onColumnVisibilityModelChange={onColumnVisibilityModelChange}/>).user;
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'idBis']);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: 'id' }))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['idBis']);
                        expect(onColumnVisibilityModelChange.callCount).to.equal(1);
                        expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({
                            id: false,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onColumnVisibilityModelChange with the new model when columnVisibilityModel is controlled', function () {
            var onColumnVisibilityModelChange = (0, sinon_1.spy)();
            render(<TestDataGrid showToolbar columnVisibilityModel={{ idBis: false }} onColumnVisibilityModelChange={onColumnVisibilityModelChange}/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('checkbox', { name: 'id' }));
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
            expect(onColumnVisibilityModelChange.callCount).to.equal(1);
            expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({
                id: false,
                idBis: false,
            });
        });
        it('should call onColumnVisibilityModelChange with the new model when toggling all columns', function () { return __awaiter(void 0, void 0, void 0, function () {
            function ControlledTest() {
                var _a = React.useState({ idBis: false }), model = _a[0], setModel = _a[1];
                return (<TestDataGrid showToolbar columnVisibilityModel={model} onColumnVisibilityModelChange={function (newModel) {
                        onColumnVisibilityModelChange(newModel);
                        setModel(newModel);
                    }}/>);
            }
            var onColumnVisibilityModelChange, user, showHideAllCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onColumnVisibilityModelChange = (0, sinon_1.spy)();
                        user = render(<ControlledTest />).user;
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 1:
                        _a.sent();
                        showHideAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Show/Hide All' });
                        // Hide all
                        return [4 /*yield*/, user.click(showHideAllCheckbox)];
                    case 2:
                        // Hide all
                        _a.sent();
                        expect(onColumnVisibilityModelChange.callCount).to.equal(1);
                        expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({});
                        // Show all
                        return [4 /*yield*/, user.click(showHideAllCheckbox)];
                    case 3:
                        // Show all
                        _a.sent();
                        expect(onColumnVisibilityModelChange.callCount).to.equal(2);
                        expect(onColumnVisibilityModelChange.lastCall.firstArg).to.deep.equal({
                            id: false,
                            idBis: false,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        // Fixes (1) and (2) in https://github.com/mui/mui-x/issues/7393#issuecomment-1372129661
        it('should not show hidden non hideable columns when "Show/Hide All" is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, showHideAllCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGrid showToolbar columns={[{ field: 'id' }, { field: 'idBis', hideable: false }]} initialState={{
                                columns: {
                                    columnVisibilityModel: { idBis: false },
                                },
                            }}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 1:
                        _a.sent();
                        showHideAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Show/Hide All' });
                        // Hide all
                        return [4 /*yield*/, user.click(showHideAllCheckbox)];
                    case 2:
                        // Hide all
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([]);
                        // Show all
                        return [4 /*yield*/, user.click(showHideAllCheckbox)];
                    case 3:
                        // Show all
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: initialState.columns.columnVisibilityModel', function () {
        it('should allow to initialize the columnVisibilityModel', function () {
            render(<TestDataGrid initialState={{
                    columns: {
                        columnVisibilityModel: { idBis: false },
                    },
                }}/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
        });
        it('should use the control state upon the initialize state when both are defined', function () {
            render(<TestDataGrid columnVisibilityModel={{}} initialState={{
                    columns: {
                        columnVisibilityModel: { idBis: false },
                    },
                }}/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'idBis']);
        });
        it('should not update the visible columns when updating the initial state', function () {
            var setProps = render(<TestDataGrid initialState={{
                    columns: {
                        columnVisibilityModel: { idBis: false },
                    },
                }}/>).setProps;
            setProps({
                initialState: {
                    columns: {
                        columnVisibilityModel: {},
                    },
                },
            });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
        });
        it('should allow to update the visible columns through the UI when initialized with initialState', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGrid initialState={{
                                columns: {
                                    columnVisibilityModel: { idBis: false },
                                },
                            }} showToolbar/>).user;
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: 'id' }))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should autofocus the first switch element in columns management when `autoFocusSearchField` disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestDataGrid showToolbar slotProps={{
                            columnsManagement: {
                                autoFocusSearchField: false,
                            },
                        }}/>).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                case 1:
                    _a.sent();
                    expect(internal_test_utils_1.screen.getByRole('checkbox', { name: columns[0].field })).toHaveFocus();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should hide `Show/Hide all` in columns management when `disableShowHideToggle` is `true`', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, setProps, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = render(<TestDataGrid showToolbar/>), setProps = _a.setProps, user = _a.user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                case 1:
                    _b.sent();
                    // check if `Show/Hide all` checkbox is present initially
                    expect(internal_test_utils_1.screen.getByRole('checkbox', { name: 'Show/Hide All' })).not.to.equal(null);
                    setProps({
                        slotProps: {
                            columnsManagement: {
                                disableShowHideToggle: true,
                            },
                        },
                    });
                    // check if `Show/Hide All` checkbox is not present  after setting `slotProps`
                    expect(internal_test_utils_1.screen.queryByRole('checkbox', { name: 'Show/Hide All' })).to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should hide `Reset` in columns panel when `disableResetButton` is `true`', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, setProps, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = render(<TestDataGrid showToolbar/>), setProps = _a.setProps, user = _a.user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                case 1:
                    _b.sent();
                    // check if Reset button is present initially
                    expect(internal_test_utils_1.screen.getByRole('button', { name: 'Reset' })).not.to.equal(null);
                    setProps({
                        slotProps: {
                            columnsManagement: {
                                disableResetButton: true,
                            },
                        },
                    });
                    // check if Reset button is not present after setting slotProps
                    expect(internal_test_utils_1.screen.queryByRole('button', { name: 'Reset' })).to.equal(null);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should reset the columns to initial columns state when `Reset` button is clicked in columns management panel', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, resetButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestDataGrid showToolbar/>).user;
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'idBis']);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                case 1:
                    _a.sent();
                    resetButton = internal_test_utils_1.screen.getByRole('button', { name: 'Reset' });
                    expect(resetButton).to.have.attribute('disabled');
                    // Hide `idBis` column
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: 'idBis' }))];
                case 2:
                    // Hide `idBis` column
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                    expect(resetButton).not.to.have.attribute('disabled');
                    // Reset columns
                    return [4 /*yield*/, user.click(resetButton)];
                case 3:
                    // Reset columns
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'idBis']);
                    expect(resetButton).to.have.attribute('disabled');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should use the initial column visibility model as a reference when `Reset` button is clicked in columns management panel', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, resetButton, resetButton1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestDataGrid showToolbar initialState={{
                            columns: {
                                columnVisibilityModel: { idBis: false },
                            },
                        }}/>).user;
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                case 1:
                    _a.sent();
                    resetButton = internal_test_utils_1.screen.getByRole('button', { name: 'Reset' });
                    expect(resetButton).to.have.attribute('disabled');
                    // Show `idBis` column
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: 'idBis' }))];
                case 2:
                    // Show `idBis` column
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'idBis']);
                    expect(resetButton).not.to.have.attribute('disabled');
                    // Close columns management
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                case 3:
                    // Close columns management
                    _a.sent();
                    // Reopen columns management
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                case 4:
                    // Reopen columns management
                    _a.sent();
                    resetButton1 = internal_test_utils_1.screen.getByRole('button', { name: 'Reset' });
                    expect(resetButton1).not.to.have.attribute('disabled');
                    // Reset columns
                    return [4 /*yield*/, user.click(resetButton1)];
                case 5:
                    // Reset columns
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                    expect(resetButton1).to.have.attribute('disabled');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should use the first controlled column visibility model as a reference when `Reset` button is clicked in columns management panel', function () { return __awaiter(void 0, void 0, void 0, function () {
        function ControlledTest() {
            var _a = React.useState({ idBis: false }), model = _a[0], setModel = _a[1];
            return (<TestDataGrid showToolbar columnVisibilityModel={model} onColumnVisibilityModelChange={setModel}/>);
        }
        var user, resetButton, resetButton1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<ControlledTest />).user;
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                case 1:
                    _a.sent();
                    resetButton = internal_test_utils_1.screen.getByRole('button', { name: 'Reset' });
                    expect(resetButton).to.have.attribute('disabled');
                    // Show `idBis` column
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: 'idBis' }))];
                case 2:
                    // Show `idBis` column
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'idBis']);
                    expect(resetButton).not.to.have.attribute('disabled');
                    // Close columns management
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                case 3:
                    // Close columns management
                    _a.sent();
                    // Reopen columns management
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                case 4:
                    // Reopen columns management
                    _a.sent();
                    resetButton1 = internal_test_utils_1.screen.getByRole('button', { name: 'Reset' });
                    expect(resetButton1).not.to.have.attribute('disabled');
                    // Reset columns
                    return [4 /*yield*/, user.click(resetButton1)];
                case 5:
                    // Reset columns
                    _a.sent();
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                    expect(resetButton1).to.have.attribute('disabled');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update the initial column visibility model when the columns are updated', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, user, setProps, resetButton;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = render(<TestDataGrid showToolbar initialState={{
                            columns: {
                                columnVisibilityModel: { idBis: false },
                            },
                        }}/>), user = _a.user, setProps = _a.setProps;
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id']);
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                case 1:
                    _b.sent();
                    resetButton = internal_test_utils_1.screen.getByRole('button', { name: 'Reset' });
                    expect(resetButton).to.have.attribute('disabled');
                    // Show `idBis` column
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: 'idBis' }))];
                case 2:
                    // Show `idBis` column
                    _b.sent();
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'idBis']);
                    expect(resetButton).not.to.have.attribute('disabled');
                    // Reset columns
                    setProps({
                        columns: [{ field: 'id' }, { field: 'idBis' }],
                    });
                    expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'idBis']);
                    // Reference updated to the current `columnVisibilityModel`
                    expect(resetButton).to.have.attribute('disabled');
                    return [2 /*return*/];
            }
        });
    }); });
    describe('prop: `getTogglableColumns`', function () {
        it('should control columns shown in columns panel using `getTogglableColumns` prop', function () {
            var getTogglableColumns = function (cols) {
                return cols.filter(function (column) { return column.field !== 'idBis'; }).map(function (column) { return column.field; });
            };
            render(<TestDataGrid showToolbar slotProps={{
                    columnsManagement: {
                        getTogglableColumns: getTogglableColumns,
                    },
                }}/>);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }));
            expect(internal_test_utils_1.screen.queryByRole('checkbox', { name: 'id' })).not.to.equal(null);
            expect(internal_test_utils_1.screen.queryByRole('checkbox', { name: 'idBis' })).to.equal(null);
        });
        it('should avoid toggling columns provided by `getTogglableColumns` prop on `Show/Hide All`', function () { return __awaiter(void 0, void 0, void 0, function () {
            var getTogglableColumns, user, showHideAllCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getTogglableColumns = function (cols) {
                            return cols.filter(function (column) { return column.field !== 'idBis'; }).map(function (column) { return column.field; });
                        };
                        user = render(<TestDataGrid showToolbar slotProps={{
                                columnsManagement: {
                                    getTogglableColumns: getTogglableColumns,
                                },
                            }}/>).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'Columns' }))];
                    case 1:
                        _a.sent();
                        showHideAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Show/Hide All' });
                        return [4 /*yield*/, user.click(showHideAllCheckbox)];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['idBis']);
                        return [4 /*yield*/, user.click(showHideAllCheckbox)];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'idBis']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: toggleAllMode', function () {
        it('should toggle filtered columns when `toggleAllMode` is `filtered`', function () { return __awaiter(void 0, void 0, void 0, function () {
            function getColumnsCheckboxesNames() {
                return (0, internal_test_utils_1.within)((0, helperFn_1.grid)('columnsManagement'))
                    .getAllByRole('checkbox')
                    .map(function (item) { return item.getAttribute('name'); });
            }
            var user, button, input, showHideAllCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 400, height: 300 }}>
          <x_data_grid_1.DataGrid columns={[
                                { field: 'id' },
                                { field: 'firstName' },
                                { field: 'lastName' },
                                { field: 'age' },
                            ]} rows={[{ id: 1, firstName: 'John', lastName: 'Doe', age: 20 }]} slotProps={{
                                columnsManagement: {
                                    toggleAllMode: 'filteredOnly',
                                },
                            }} showToolbar disableVirtualization/>
        </div>).user;
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'firstName', 'lastName', 'age']);
                        button = internal_test_utils_1.screen.getByRole('button', { name: 'Columns' });
                        return [4 /*yield*/, user.click(button)];
                    case 1:
                        _a.sent();
                        input = internal_test_utils_1.screen.getByPlaceholderText('Search');
                        return [4 /*yield*/, user.type(input, 'name')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(getColumnsCheckboxesNames()).to.deep.equal(['firstName', 'lastName']);
                            })];
                    case 3:
                        _a.sent();
                        showHideAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Show/Hide All' });
                        return [4 /*yield*/, user.click(showHideAllCheckbox)];
                    case 4:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'age']);
                        // clear the search before the new search
                        return [4 /*yield*/, user.clear(input)];
                    case 5:
                        // clear the search before the new search
                        _a.sent();
                        return [4 /*yield*/, user.type(input, 'firstName')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(getColumnsCheckboxesNames()).to.deep.equal(['firstName']);
                            })];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, user.click(showHideAllCheckbox)];
                    case 8:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'firstName', 'age']);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
