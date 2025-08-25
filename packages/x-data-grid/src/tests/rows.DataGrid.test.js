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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var clsx_1 = require("clsx");
var sinon_1 = require("sinon");
var Portal_1 = require("@mui/material/Portal");
var x_data_grid_1 = require("@mui/x-data-grid");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var helperFn_1 = require("test/utils/helperFn");
var Dialog_1 = require("@mui/material/Dialog");
var skipIf_1 = require("test/utils/skipIf");
var densitySelector_1 = require("../hooks/features/density/densitySelector");
describe('<DataGrid /> - Rows', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    var baselineProps = {
        autoHeight: skipIf_1.isJSDOM,
        rows: [
            {
                clientId: 'c1',
                first: 'Mike',
                age: 11,
            },
            {
                clientId: 'c2',
                first: 'Jack',
                age: 11,
            },
            {
                clientId: 'c3',
                first: 'Mike',
                age: 20,
            },
        ],
        columns: [{ field: 'clientId' }, { field: 'first' }, { field: 'age' }],
    };
    describe('prop: getRowId', function () {
        it('should allow to select a field as id', function () {
            var getRowId = function (row) { return "".concat(row.clientId); };
            render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} getRowId={getRowId}/>
        </div>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['c1', 'c2', 'c3']);
        });
    });
    describe('prop: rows', function () {
        it('should support new dataset', function () {
            var _a = (0, x_data_grid_generator_1.getBasicGridData)(5, 2), rows = _a.rows, columns = _a.columns;
            function Test(props) {
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid {...props} columns={columns} disableVirtualization/>
          </div>);
            }
            var setProps = render(<Test rows={rows.slice(0, 2)}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1']);
            setProps({ rows: rows });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0', '1', '2', '3', '4']);
        });
    });
    it('should ignore events coming from a portal in the cell', function () { return __awaiter(void 0, void 0, void 0, function () {
        function InputCell() {
            return <input type="text" name="input"/>;
        }
        function PortalCell() {
            return (<Portal_1.default>
          <input type="text" name="portal-input"/>
        </Portal_1.default>);
        }
        var handleRowClick, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    handleRowClick = (0, sinon_1.spy)();
                    user = render(<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid rows={[{ id: '1' }]} onRowClick={handleRowClick} columns={[
                            {
                                field: 'id',
                                renderCell: function () { return <PortalCell />; },
                            },
                            {
                                field: 'input',
                                renderCell: function () { return <InputCell />; },
                            },
                        ]}/>
      </div>).user;
                    return [4 /*yield*/, user.click(document.querySelector('input[name="portal-input"]'))];
                case 1:
                    _a.sent();
                    expect(handleRowClick.callCount).to.equal(0);
                    return [4 /*yield*/, user.click(document.querySelector('input[name="input"]'))];
                case 2:
                    _a.sent();
                    expect(handleRowClick.callCount).to.equal(1);
                    return [2 /*return*/];
            }
        });
    }); });
    // https://github.com/mui/mui-x/issues/8042
    it('should not throw when clicking the cell in the nested grid in a portal', function () {
        var rows = [
            { id: 1, firstName: 'Jon', age: 35 },
            { id: 2, firstName: 'Cersei', age: 42 },
            { id: 3, firstName: 'Jaime', age: 45 },
        ];
        function NestedGridDialog() {
            return (<Dialog_1.default open>
          <div style={{ height: 300, width: '100%' }}>
            <x_data_grid_1.DataGrid rows={rows} columns={[{ field: 'id' }, { field: 'age' }]}/>
          </div>
        </Dialog_1.default>);
        }
        expect(function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid columns={[
                                { field: 'id' },
                                { field: 'firstName', renderCell: function () { return <NestedGridDialog />; } },
                            ]} rows={rows}/>
        </div>).user;
                        cell = document.querySelector('[data-rowindex="0"] [role="gridcell"][data-field="age"]');
                        return [4 /*yield*/, user.click(cell)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }).not.toErrorDev();
    });
    describe('prop: getRowClassName', function () {
        it('should apply the CSS class returned by getRowClassName', function () {
            var getRowId = function (row) { return "".concat(row.clientId); };
            var handleRowClassName = function (params) {
                return params.row.age < 20 ? 'under-age' : '';
            };
            render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid getRowClassName={handleRowClassName} getRowId={getRowId} {...baselineProps}/>
        </div>);
            expect((0, helperFn_1.getRow)(0)).to.have.class('under-age');
            expect((0, helperFn_1.getRow)(1)).to.have.class('under-age');
            expect((0, helperFn_1.getRow)(2)).not.to.have.class('under-age');
        });
        it('should call with isFirstVisible=true in the first row and isLastVisible=true in the last', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, rows, columns, getRowClassName, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = (0, x_data_grid_generator_1.getBasicGridData)(4, 2), rows = _a.rows, columns = _a.columns;
                        getRowClassName = function (params) {
                            return (0, clsx_1.default)({ first: params.isFirstVisible, last: params.isLastVisible });
                        };
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid rows={rows} columns={columns} getRowClassName={getRowClassName} initialState={{ pagination: { paginationModel: { pageSize: 3, page: 0 } } }} pageSizeOptions={[3]}/>
        </div>).user;
                        expect((0, helperFn_1.getRow)(0)).to.have.class('first');
                        expect((0, helperFn_1.getRow)(1)).not.to.have.class('first');
                        expect((0, helperFn_1.getRow)(1)).not.to.have.class('last');
                        expect((0, helperFn_1.getRow)(2)).to.have.class('last');
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                    case 1:
                        _b.sent();
                        expect((0, helperFn_1.getRow)(3)).to.have.class('first');
                        expect((0, helperFn_1.getRow)(3)).to.have.class('last');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('columnType: actions', function () {
        function TestCase(_a) {
            var getActions = _a.getActions, other = __rest(_a, ["getActions"]);
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid {...baselineProps} rows={[{ id: 1 }]} columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'actions',
                        type: 'actions',
                        getActions: getActions,
                    },
                ]} {...other}/>
        </div>);
        }
        it.skipIf(!skipIf_1.isJSDOM)('should throw an error if getActions is missing', function () {
            expect(function () {
                render(<internal_test_utils_1.ErrorBoundary>
            <TestCase />
          </internal_test_utils_1.ErrorBoundary>);
            }).toErrorDev([
                'MUI X: Missing the `getActions` property in the `GridColDef`.',
                internal_test_utils_1.reactMajor < 19 && 'MUI X: Missing the `getActions` property in the `GridColDef`.',
                internal_test_utils_1.reactMajor < 19 && 'The above error occurred in the <GridActionsCell> component',
            ]);
        });
        it('should call getActions with the row params', function () {
            var getActions = (0, sinon_1.stub)().returns([]);
            render(<TestCase getActions={getActions}/>);
            expect(getActions.args[0][0].id).to.equal(1);
            expect(getActions.args[0][0].row).to.deep.equal({ id: 1 });
        });
        it('should always show the actions not marked as showInMenu', function () {
            render(<TestCase getActions={function () { return [
                    <x_data_grid_1.GridActionsCellItem icon={<span />} label="delete"/>,
                    <x_data_grid_1.GridActionsCellItem label="print" showInMenu/>,
                ]; }}/>);
            expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: 'delete' })).not.to.equal(null);
            expect(internal_test_utils_1.screen.queryByText('print')).to.equal(null);
        });
        it('should show in a menu the actions marked as showInMenu', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase getActions={function () { return [<x_data_grid_1.GridActionsCellItem label="print" showInMenu/>]; }}/>).user;
                        expect(internal_test_utils_1.screen.queryByText('print')).to.equal(null);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'more' }))];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByText('print')).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not select the row when clicking in an action', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase getActions={function () { return [<x_data_grid_1.GridActionsCellItem icon={<span />} label="print"/>]; }}/>).user;
                        expect((0, helperFn_1.getRow)(0)).not.to.have.class('Mui-selected');
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'print' }))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getRow)(0)).not.to.have.class('Mui-selected');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not select the row when clicking in a menu action', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase getActions={function () { return [<x_data_grid_1.GridActionsCellItem icon={<span />} label="print" showInMenu/>]; }}/>).user;
                        expect((0, helperFn_1.getRow)(0)).not.to.have.class('Mui-selected');
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'more' }))];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByText('print')).not.to.equal(null);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByText('print'))];
                    case 2:
                        _a.sent();
                        expect((0, helperFn_1.getRow)(0)).not.to.have.class('Mui-selected');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not select the row when opening the menu', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase getActions={function () { return [<x_data_grid_1.GridActionsCellItem label="print" showInMenu/>]; }}/>).user;
                        expect((0, helperFn_1.getRow)(0)).not.to.have.class('Mui-selected');
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'more' }))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getRow)(0)).not.to.have.class('Mui-selected');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should close other menus before opening a new one', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, more1, more2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase rows={[{ id: 1 }, { id: 2 }]} getActions={function () { return [<x_data_grid_1.GridActionsCellItem label="print" showInMenu/>]; }}/>).user;
                        expect(internal_test_utils_1.screen.queryAllByRole('menu')).to.have.length(2);
                        more1 = internal_test_utils_1.screen.getAllByRole('menuitem', { name: 'more' })[0];
                        return [4 /*yield*/, user.click(more1)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(internal_test_utils_1.screen.queryAllByRole('menu')).to.have.length(2 + 1);
                            })];
                    case 2:
                        _a.sent();
                        more2 = internal_test_utils_1.screen.getAllByRole('menuitem', { name: 'more' })[1];
                        return [4 /*yield*/, user.click(more2)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(internal_test_utils_1.screen.queryAllByRole('menu')).to.have.length(2 + 1);
                            })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to move focus to another cell with the arrow keys', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, printButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase getActions={function () { return [<x_data_grid_1.GridActionsCellItem icon={<span />} label="print"/>]; }}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 2:
                        _a.sent();
                        printButton = internal_test_utils_1.screen.getByRole('menuitem', { name: 'print' });
                        expect(printButton).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should focus the first item when opening the menu', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, moreButton, printButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase getActions={function () { return [
                                <x_data_grid_1.GridActionsCellItem icon={<span />} label="print" showInMenu/>,
                                <x_data_grid_1.GridActionsCellItem icon={<span />} label="delete" showInMenu/>,
                            ]; }}/>).user;
                        moreButton = internal_test_utils_1.screen.getByRole('menuitem', { name: 'more' });
                        return [4 /*yield*/, user.click(moreButton)];
                    case 1:
                        _a.sent();
                        printButton = internal_test_utils_1.screen.queryByRole('menuitem', { name: 'print' });
                        expect(printButton).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to navigate between actions using the arrow keys', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, firstCell, printButton, deleteButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase getActions={function () { return [
                                <x_data_grid_1.GridActionsCellItem icon={<span />} label="print"/>,
                                <x_data_grid_1.GridActionsCellItem icon={<span />} label="delete"/>,
                            ]; }}/>).user;
                        firstCell = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.click(firstCell)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 2:
                        _a.sent();
                        printButton = internal_test_utils_1.screen.getByRole('menuitem', { name: 'print' });
                        expect(printButton).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 3:
                        _a.sent();
                        deleteButton = internal_test_utils_1.screen.getByRole('menuitem', { name: 'delete' });
                        expect(deleteButton).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 4:
                        _a.sent();
                        expect(printButton).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 5:
                        _a.sent();
                        expect(firstCell).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not move focus to first item when clicking in another item', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, deleteButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase getActions={function () { return [
                                <x_data_grid_1.GridActionsCellItem icon={<span />} label="print"/>,
                                <x_data_grid_1.GridActionsCellItem icon={<span />} label="delete"/>,
                            ]; }}/>).user;
                        deleteButton = internal_test_utils_1.screen.getByRole('menuitem', { name: 'delete' });
                        return [4 /*yield*/, user.click(deleteButton)];
                    case 1:
                        _a.sent();
                        expect(deleteButton).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set the correct tabIndex to the focused button', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, firstCell, secondCell, printButton, menuButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase getActions={function () { return [
                                <x_data_grid_1.GridActionsCellItem icon={<span />} label="print"/>,
                                <x_data_grid_1.GridActionsCellItem icon={<span />} label="delete" showInMenu/>,
                            ]; }}/>).user;
                        firstCell = (0, helperFn_1.getCell)(0, 0);
                        secondCell = (0, helperFn_1.getCell)(0, 1);
                        return [4 /*yield*/, user.click(firstCell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 2:
                        _a.sent();
                        expect(secondCell).to.have.property('tabIndex', -1);
                        printButton = internal_test_utils_1.screen.getByRole('menuitem', { name: 'print' });
                        menuButton = internal_test_utils_1.screen.getByRole('menuitem', { name: 'more' });
                        expect(printButton).to.have.property('tabIndex', 0);
                        expect(menuButton).to.have.property('tabIndex', -1);
                        return [4 /*yield*/, user.click(printButton)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{ArrowRight}')];
                    case 4:
                        _a.sent();
                        expect(printButton).to.have.property('tabIndex', -1);
                        expect(menuButton).to.have.property('tabIndex', 0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should focus the last button if the clicked button removes itself', function () { return __awaiter(void 0, void 0, void 0, function () {
            function Test() {
                return (<TestCase getActions={function () {
                        return canDelete
                            ? [
                                <x_data_grid_1.GridActionsCellItem icon={<span />} label="print"/>,
                                <x_data_grid_1.GridActionsCellItem icon={<span />} label="delete" onClick={function () {
                                        canDelete = false;
                                    }}/>,
                            ]
                            : [<x_data_grid_1.GridActionsCellItem icon={<span />} label="print"/>];
                    }}/>);
            }
            var canDelete, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        canDelete = true;
                        user = render(<Test />).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'delete' }))];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.getByRole('menuitem', { name: 'print' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should focus the last button if the currently focused button is removed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, setProps, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render(<TestCase getActions={function () { return [
                                <x_data_grid_1.GridActionsCellItem icon={<span />} label="print"/>,
                                <x_data_grid_1.GridActionsCellItem icon={<span />} label="delete"/>,
                            ]; }}/>), setProps = _a.setProps, user = _a.user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'delete' }))];
                    case 1:
                        _b.sent(); // Sets focusedButtonIndex=1
                        expect(internal_test_utils_1.screen.getByRole('menuitem', { name: 'delete' })).toHaveFocus();
                        setProps({ getActions: function () { return [<x_data_grid_1.GridActionsCellItem icon={<span />} label="print"/>]; } }); // Sets focusedButtonIndex=0
                        expect(internal_test_utils_1.screen.getByRole('menuitem', { name: 'print' })).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Need layouting
    describe.skipIf(skipIf_1.isJSDOM)('prop: getRowHeight', function () {
        describe('static row height', function () {
            var ROW_HEIGHT = 52;
            function TestCase(props) {
                var getRowId = function (row) { return "".concat(row.clientId); };
                apiRef = (0, x_data_grid_1.useGridApiRef)();
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_1.DataGrid apiRef={apiRef} {...baselineProps} {...props} getRowId={getRowId}/>
          </div>);
            }
            it('should set each row height whe rowHeight prop is used', function () {
                var setProps = render(<TestCase />).setProps;
                expect((0, helperFn_1.getRow)(0).clientHeight).to.equal(ROW_HEIGHT);
                expect((0, helperFn_1.getRow)(1).clientHeight).to.equal(ROW_HEIGHT);
                expect((0, helperFn_1.getRow)(2).clientHeight).to.equal(ROW_HEIGHT);
                setProps({ rowHeight: 30 });
                expect((0, helperFn_1.getRow)(0).clientHeight).to.equal(30);
                expect((0, helperFn_1.getRow)(1).clientHeight).to.equal(30);
                expect((0, helperFn_1.getRow)(2).clientHeight).to.equal(30);
            });
            it('should set the second row to have a different row height than the others', function () {
                render(<TestCase getRowHeight={function (_a) {
                    var id = _a.id;
                    return (id === 'c2' ? 100 : null);
                }}/>);
                expect((0, helperFn_1.getRow)(0).clientHeight).to.equal(ROW_HEIGHT);
                expect((0, helperFn_1.getRow)(1).clientHeight).to.equal(100);
                expect((0, helperFn_1.getRow)(2).clientHeight).to.equal(ROW_HEIGHT);
            });
            it('should set density to all but the row with variable row height', function () {
                var setProps = render(<TestCase getRowHeight={function (_a) {
                    var id = _a.id;
                    return (id === 'c2' ? 100 : null);
                }}/>).setProps;
                expect((0, helperFn_1.getRow)(0).clientHeight).to.equal(ROW_HEIGHT);
                expect((0, helperFn_1.getRow)(1).clientHeight).to.equal(100);
                expect((0, helperFn_1.getRow)(2).clientHeight).to.equal(ROW_HEIGHT);
                setProps({ density: 'compact' });
                expect((0, helperFn_1.getRow)(0).clientHeight).to.equal(Math.floor(ROW_HEIGHT * densitySelector_1.COMPACT_DENSITY_FACTOR));
                expect((0, helperFn_1.getRow)(1).clientHeight).to.equal(100);
                expect((0, helperFn_1.getRow)(2).clientHeight).to.equal(Math.floor(ROW_HEIGHT * densitySelector_1.COMPACT_DENSITY_FACTOR));
            });
            it('should set the correct rowHeight and variable row height', function () {
                var setProps = render(<TestCase getRowHeight={function (_a) {
                    var id = _a.id;
                    return (id === 'c2' ? 100 : null);
                }}/>).setProps;
                expect((0, helperFn_1.getRow)(0).clientHeight).to.equal(ROW_HEIGHT);
                expect((0, helperFn_1.getRow)(1).clientHeight).to.equal(100);
                expect((0, helperFn_1.getRow)(2).clientHeight).to.equal(ROW_HEIGHT);
                setProps({ rowHeight: 30 });
                expect((0, helperFn_1.getRow)(0).clientHeight).to.equal(30);
                expect((0, helperFn_1.getRow)(1).clientHeight).to.equal(100);
                expect((0, helperFn_1.getRow)(2).clientHeight).to.equal(30);
            });
        });
        describe('dynamic row height', function () {
            function ResizeObserverMock(callback) {
                var timeout;
                return {
                    observe: function (element) {
                        // Simulates the async behavior of the native ResizeObserver
                        timeout = setTimeout(function () {
                            callback([{ borderBoxSize: [{ blockSize: element.clientHeight }] }]);
                        });
                    },
                    disconnect: function () {
                        clearTimeout(timeout);
                    },
                };
            }
            var originalResizeObserver = window.ResizeObserver;
            beforeEach(function () {
                var userAgent = window.navigator.userAgent;
                if (userAgent.includes('Chrome') && !userAgent.includes('Headless')) {
                    // Only use the mock in non-headless Chrome
                    window.ResizeObserver = ResizeObserverMock;
                }
            });
            afterEach(function () {
                window.ResizeObserver = originalResizeObserver;
            });
            function TestCase(props) {
                var getBioContentHeight = props.getBioContentHeight, _a = props.width, width = _a === void 0 ? 300 : _a, _b = props.height, height = _b === void 0 ? 300 : _b, other = __rest(props, ["getBioContentHeight", "width", "height"]);
                var customCellRenderer = React.useCallback(function (_a) {
                    var row = _a.row;
                    return (<div style={{ width: 100, height: getBioContentHeight(row) }}/>);
                }, [getBioContentHeight]);
                var columns = React.useMemo(function () { return [{ field: 'clientId' }, { field: 'bio', renderCell: customCellRenderer }]; }, [customCellRenderer]);
                return (<div style={{ width: width, height: height }}>
            <x_data_grid_1.DataGrid {...baselineProps} columns={columns} getRowId={function (row) { return "".concat(row.clientId); }} hideFooter {...other}/>
          </div>);
            }
            it('should measure all rows and update the content size', function () { return __awaiter(void 0, void 0, void 0, function () {
                var border, contentHeight, virtualScrollerContent, expectedHeight;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            border = 1;
                            contentHeight = 100;
                            render(<TestCase getBioContentHeight={function () { return contentHeight; }} getRowHeight={function () { return 'auto'; }}/>);
                            virtualScrollerContent = document.querySelector('.MuiDataGrid-virtualScrollerContent');
                            expectedHeight = baselineProps.rows.length * (contentHeight + border);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(virtualScrollerContent).toHaveComputedStyle({ height: "".concat(expectedHeight, "px") });
                                })];
                        case 1:
                            _a.sent();
                            expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use the default row height to calculate the content size when the row has not been measured yet', function () { return __awaiter(void 0, void 0, void 0, function () {
                var columnHeaderHeight, border, defaultRowHeight, measuredRowHeight, virtualScrollerContent, expectedHeight;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            columnHeaderHeight = 50;
                            border = 1;
                            defaultRowHeight = 52;
                            measuredRowHeight = 101;
                            render(<TestCase columnHeaderHeight={columnHeaderHeight} height={columnHeaderHeight + 20 + border * 2} // Force to only measure the first row
                             getBioContentHeight={function () { return measuredRowHeight; }} getRowHeight={function () { return 'auto'; }} rowBufferPx={0}/>);
                            virtualScrollerContent = document.querySelector('.MuiDataGrid-virtualScrollerContent');
                            expectedHeight = measuredRowHeight +
                                border + // Measured rows also include the border
                                (baselineProps.rows.length - 1) * defaultRowHeight;
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(virtualScrollerContent).toHaveComputedStyle({ height: "".concat(expectedHeight, "px") });
                                })];
                        case 1:
                            _a.sent();
                            expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use the value from getEstimatedRowHeight to estimate the content size', function () { return __awaiter(void 0, void 0, void 0, function () {
                var columnHeaderHeight, border, measuredRowHeight, estimatedRowHeight, virtualScrollerContent, firstRowHeight, expectedHeight;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            columnHeaderHeight = 50;
                            border = 1;
                            measuredRowHeight = 100;
                            estimatedRowHeight = 90;
                            render(<TestCase columnHeaderHeight={columnHeaderHeight} height={columnHeaderHeight + 20 + border * 2} // Force to only measure the first row
                             getBioContentHeight={function () { return measuredRowHeight; }} getEstimatedRowHeight={function () { return estimatedRowHeight; }} getRowHeight={function () { return 'auto'; }} rowBufferPx={0}/>);
                            virtualScrollerContent = document.querySelector('.MuiDataGrid-virtualScrollerContent');
                            firstRowHeight = measuredRowHeight + border;
                            expectedHeight = firstRowHeight + (baselineProps.rows.length - 1) * estimatedRowHeight;
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(virtualScrollerContent).toHaveComputedStyle({ height: "".concat(expectedHeight, "px") });
                                })];
                        case 1:
                            _a.sent();
                            expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should recalculate the content size when the rows prop changes', function () { return __awaiter(void 0, void 0, void 0, function () {
                var setProps, virtualScrollerContent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setProps = render(<TestCase getBioContentHeight={function (row) { return (row.expanded ? 200 : 100); }} rows={[{ clientId: 'c1', expanded: false }]} getRowHeight={function () { return 'auto'; }} rowBufferPx={0}/>).setProps;
                            virtualScrollerContent = document.querySelector('.MuiDataGrid-virtualScrollerContent');
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(virtualScrollerContent).toHaveComputedStyle({ height: '101px' });
                                })];
                        case 1:
                            _a.sent();
                            expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });
                            setProps({ rows: [{ clientId: 'c1', expanded: true }] });
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(virtualScrollerContent).toHaveComputedStyle({ height: '201px' });
                                })];
                        case 2:
                            _a.sent();
                            expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should set minHeight to "auto" in all rows with dynamic row height', function () {
                render(<TestCase getBioContentHeight={function () { return 50; }} getRowHeight={function (_a) {
                    var id = _a.id;
                    return (id === 'c3' ? 100 : 'auto');
                }} rowBufferPx={0}/>);
                expect((0, helperFn_1.getRow)(0)).toHaveInlineStyle({ minHeight: 'auto' });
                expect((0, helperFn_1.getRow)(1)).toHaveInlineStyle({ minHeight: 'auto' });
                expect((0, helperFn_1.getRow)(2)).toHaveInlineStyle({ minHeight: '100px' });
            });
            it('should not virtualize columns if a row has auto height', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<TestCase rows={baselineProps.rows.slice(0, 1)} getBioContentHeight={function () { return 100; }} getRowHeight={function () { return 'auto'; }} columnBufferPx={0} width={100}/>);
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.$$)(".".concat(x_data_grid_1.gridClasses.cell, ":not(.").concat(x_data_grid_1.gridClasses.cellEmpty, ")"))).to.have.length(2);
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should measure rows while scrolling', function () { return __awaiter(void 0, void 0, void 0, function () {
                var columnHeaderHeight, border, cellHeight, virtualScroller;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            columnHeaderHeight = 50;
                            border = 1;
                            cellHeight = columnHeaderHeight + border * 2;
                            render(<TestCase getBioContentHeight={function () { return 100; }} getRowHeight={function () { return 'auto'; }} rowBufferPx={0} columnHeaderHeight={columnHeaderHeight} height={cellHeight * 2}/>);
                            virtualScroller = (0, helperFn_1.grid)('virtualScroller');
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(virtualScroller.scrollHeight).to.equal(columnHeaderHeight + 101 + 52 + 52);
                                })];
                        case 1:
                            _a.sent();
                            // It calculates the entire height of the scrollbar whenever the scroll event happens
                            // https://stackblitz.com/edit/react-kejzfzfx?file=Demo.tsx%3AL26
                            // Scroll to measure all cells
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, virtualScroller.scrollTo({ top: 1, behavior: 'instant' })];
                                }); }); })];
                        case 2:
                            // It calculates the entire height of the scrollbar whenever the scroll event happens
                            // https://stackblitz.com/edit/react-kejzfzfx?file=Demo.tsx%3AL26
                            // Scroll to measure all cells
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    return expect(virtualScroller.scrollHeight).to.equal(columnHeaderHeight + 101 + 101 + 101);
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should allow to mix rows with dynamic row height and default row height', function () { return __awaiter(void 0, void 0, void 0, function () {
                var columnHeaderHeight, densityFactor, rowHeight, border, measuredRowHeight, expectedHeight, virtualScrollerContent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            columnHeaderHeight = 50;
                            densityFactor = 1.3;
                            rowHeight = 52;
                            border = 1;
                            measuredRowHeight = 100;
                            expectedHeight = measuredRowHeight + border + rowHeight * densityFactor;
                            render(<TestCase getBioContentHeight={function (_a) {
                                var clientId = _a.clientId;
                                return (clientId === 'c1' ? measuredRowHeight : 0);
                            }} getRowHeight={function (_a) {
                                var id = _a.id;
                                return (id === 'c1' ? 'auto' : null);
                            }} density="comfortable" rows={baselineProps.rows.slice(0, 2)} rowBufferPx={0} columnHeaderHeight={columnHeaderHeight}/>);
                            virtualScrollerContent = document.querySelector('.MuiDataGrid-virtualScrollerContent');
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect(virtualScrollerContent).toHaveComputedStyle({
                                        height: "".concat(Math.floor(expectedHeight), "px"),
                                    });
                                })];
                        case 1:
                            _a.sent();
                            expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });
                            return [2 /*return*/];
                    }
                });
            }); });
            var userAgent = window.navigator.userAgent;
            it.skipIf(!userAgent.includes('Headless') || /edg/i.test(userAgent))('should position correctly the render zone when the 2nd page has less rows than the 1st page', function () { return __awaiter(void 0, void 0, void 0, function () {
                var data, columnHeaderHeight, measuredRowHeight, user, virtualScroller;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = (0, x_data_grid_generator_1.getBasicGridData)(120, 3);
                            columnHeaderHeight = 50;
                            measuredRowHeight = 100;
                            user = render(<TestCase getBioContentHeight={function () { return measuredRowHeight; }} getRowHeight={function () { return 'auto'; }} rowBufferPx={0} columnHeaderHeight={columnHeaderHeight} getRowId={function (row) { return row.id; }} hideFooter={false} {...data}/>).user;
                            virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, virtualScroller.scrollTo({ top: 1000, behavior: 'instant' })];
                                }); }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.gridOffsetTop)()).not.to.equal(0);
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.gridOffsetTop)()).to.equal(0);
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should position correctly the render zone when changing pageSize to a lower value', function () { return __awaiter(void 0, void 0, void 0, function () {
                var data, columnHeaderHeight, measuredRowHeight, apiRefPage;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = (0, x_data_grid_generator_1.getBasicGridData)(120, 3);
                            columnHeaderHeight = 50;
                            measuredRowHeight = 100;
                            apiRefPage = React.createRef();
                            render(<TestCase getBioContentHeight={function () { return measuredRowHeight; }} getRowHeight={function () { return 'auto'; }} rowBufferPx={0} columnHeaderHeight={columnHeaderHeight} getRowId={function (row) { return row.id; }} hideFooter={false} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} pageSizeOptions={[5, 10]} height={columnHeaderHeight + 10 * measuredRowHeight} apiRef={apiRefPage} {...data}/>);
                            expect((0, helperFn_1.gridOffsetTop)()).to.equal(0);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                    return [2 /*return*/, (_a = apiRefPage.current) === null || _a === void 0 ? void 0 : _a.setPageSize(5)];
                                }); }); })];
                        case 1:
                            _a.sent();
                            expect((0, helperFn_1.gridOffsetTop)()).to.equal(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            // In Chrome non-headless and Edge this test is flaky
            it.skipIf(!skipIf_1.isJSDOM || !userAgent.includes('Headless') || /edg/i.test(userAgent))('should position correctly the render zone when changing pageSize to a lower value and moving to next page', {
                // Retry the test because it is flaky
                retry: 3,
            }, function () { return __awaiter(void 0, void 0, void 0, function () {
                var data, columnHeaderHeight, measuredRowHeight, apiRefPage, user, virtualScroller;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = (0, x_data_grid_generator_1.getBasicGridData)(120, 3);
                            columnHeaderHeight = 50;
                            measuredRowHeight = 100;
                            apiRefPage = React.createRef();
                            user = render(<TestCase getBioContentHeight={function () { return measuredRowHeight; }} getRowHeight={function () { return 'auto'; }} rowBufferPx={0} columnHeaderHeight={columnHeaderHeight} getRowId={function (row) { return row.id; }} hideFooter={false} initialState={{ pagination: { paginationModel: { pageSize: 25 } } }} pageSizeOptions={[10, 25]} height={columnHeaderHeight + 10 * measuredRowHeight} apiRef={apiRefPage} {...data}/>).user;
                            expect((0, helperFn_1.gridOffsetTop)()).to.equal(0);
                            virtualScroller = (0, helperFn_1.grid)('virtualScroller');
                            // Scroll to measure all cells
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, virtualScroller.scrollTo({ top: 1000, behavior: 'instant' })];
                                }); }); })];
                        case 1:
                            // Scroll to measure all cells
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.gridOffsetTop)()).not.to.equal(0);
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        (_a = apiRefPage.current) === null || _a === void 0 ? void 0 : _a.setPageSize(10);
                                        return [2 /*return*/];
                                    });
                                }); })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.gridOffsetTop)()).to.equal(0);
                                })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('prop: getRowSpacing', function () {
        var _a = (0, x_data_grid_generator_1.getBasicGridData)(4, 2), rows = _a.rows, columns = _a.columns;
        function TestCase(props) {
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid rows={rows} columns={columns} {...props}/>
        </div>);
        }
        it('should be called with the correct params', function () { return __awaiter(void 0, void 0, void 0, function () {
            var getRowSpacing, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getRowSpacing = (0, sinon_1.stub)().returns({});
                        user = render(<TestCase getRowSpacing={getRowSpacing} initialState={{ pagination: { paginationModel: { pageSize: 2, page: 0 } } }} pageSizeOptions={[2]}/>).user;
                        expect(getRowSpacing.args[0][0]).to.deep.equal({
                            isFirstVisible: true,
                            isLastVisible: false,
                            indexRelativeToCurrentPage: 0,
                            id: 0,
                            model: rows[0],
                        });
                        expect(getRowSpacing.args[1][0]).to.deep.equal({
                            isFirstVisible: false,
                            isLastVisible: true,
                            indexRelativeToCurrentPage: 1,
                            id: 1,
                            model: rows[1],
                        });
                        getRowSpacing.resetHistory();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                    case 1:
                        _a.sent();
                        expect(getRowSpacing.args[0][0]).to.deep.equal({
                            isFirstVisible: true,
                            isLastVisible: false,
                            indexRelativeToCurrentPage: 0,
                            id: 2,
                            model: rows[2],
                        });
                        expect(getRowSpacing.args[1][0]).to.deep.equal({
                            isFirstVisible: false,
                            isLastVisible: true,
                            indexRelativeToCurrentPage: 1,
                            id: 3,
                            model: rows[3],
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        // Needs layout
        it.skipIf(skipIf_1.isJSDOM)('should consider the spacing when computing the content size', function () {
            var spacingTop = 5;
            var spacingBottom = 10;
            var rowHeight = 50;
            render(<TestCase rowHeight={rowHeight} getRowSpacing={function () { return ({ top: spacingTop, bottom: spacingBottom }); }} disableVirtualization/>);
            var virtualScrollerContent = document.querySelector('.MuiDataGrid-virtualScrollerContent');
            var expectedHeight = rows.length * (rowHeight + spacingTop + spacingBottom);
            expect(virtualScrollerContent).toHaveComputedStyle({ height: "".concat(expectedHeight, "px") });
            expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });
        });
        // Needs layout
        it.skipIf(skipIf_1.isJSDOM)('should update the content size when getRowSpacing is removed', function () {
            var spacingTop = 5;
            var spacingBottom = 10;
            var rowHeight = 50;
            var setProps = render(<TestCase rowHeight={rowHeight} getRowSpacing={function () { return ({ top: spacingTop, bottom: spacingBottom }); }} disableVirtualization/>).setProps;
            var virtualScrollerContent = document.querySelector('.MuiDataGrid-virtualScrollerContent');
            var expectedHeight = rows.length * (rowHeight + spacingTop + spacingBottom);
            expect(virtualScrollerContent).toHaveComputedStyle({ height: "".concat(expectedHeight, "px") });
            expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });
            setProps({ getRowSpacing: null });
            expect(virtualScrollerContent).toHaveComputedStyle({
                height: "".concat(rows.length * rowHeight, "px"),
            });
            expect(virtualScrollerContent).toHaveInlineStyle({ width: 'auto' });
        });
        it('should set the row margin to the value returned by getRowSpacing if rowSpacingType is not defined', function () {
            var spacingTop = 5;
            var spacingBottom = 10;
            render(<TestCase getRowSpacing={function () { return ({ top: spacingTop, bottom: spacingBottom }); }} disableVirtualization/>);
            expect((0, helperFn_1.getRow)(0)).toHaveInlineStyle({
                marginTop: "".concat(spacingTop, "px"),
                marginBottom: "".concat(spacingBottom, "px"),
            });
        });
        it('should set the row border to the value returned by getRowSpacing if rowSpacingType=border', function () {
            var borderTop = 5;
            var borderBottom = 10;
            render(<TestCase rowSpacingType="border" getRowSpacing={function () { return ({ top: borderTop, bottom: borderBottom }); }} disableVirtualization/>);
            expect((0, helperFn_1.getRow)(0)).toHaveInlineStyle({
                borderTopWidth: "".concat(borderTop, "px"),
                borderBottomWidth: "".concat(borderBottom, "px"),
            });
        });
    });
    describe('apiRef: updateRows', function () {
        var rows = [
            { id: 0, brand: 'Nike' },
            { id: 1, brand: 'Adidas' },
            { id: 2, brand: 'Puma' },
        ];
        var columns = [{ field: 'brand', headerName: 'Brand' }];
        function TestCase(props) {
            apiRef = (0, x_data_grid_1.useGridApiRef)();
            return (<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid autoHeight={skipIf_1.isJSDOM} apiRef={apiRef} rows={rows} columns={columns} {...props} disableVirtualization/>
        </div>);
        }
        it('should throw when updating more than one row at once', function () {
            render(<TestCase />);
            expect(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([
                    { id: 1, brand: 'Fila' },
                    { id: 0, brand: 'Pata' },
                    { id: 2, brand: 'Pum' },
                    { id: 3, brand: 'Jordan' },
                ]);
            }).to.throw(/You cannot update several rows at once/);
        });
        it('should allow to update one row at the time', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestCase />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, brand: 'Fila' }])];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 0, brand: 'Pata' }])];
                            }); }); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 2, brand: 'Pum' }])];
                            }); }); })];
                    case 3:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Pata', 'Fila', 'Pum']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow adding rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestCase />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, brand: 'Fila' }])];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 0, brand: 'Pata' }])];
                            }); }); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 2, brand: 'Pum' }])];
                            }); }); })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 3, brand: 'Jordan' }])];
                            }); }); })];
                    case 4:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Pata', 'Fila', 'Pum', 'Jordan']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to delete rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestCase />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, _action: 'delete' }])];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 0, brand: 'Apple' }])];
                            }); }); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 2, _action: 'delete' }])];
                            }); }); })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 5, brand: 'Atari' }])];
                            }); }); })];
                    case 4:
                        _a.sent();
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Apple', 'Atari']);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw a console error if autoPageSize is used with autoHeight', function () {
            expect(function () {
                render(<TestCase autoPageSize autoHeight/>);
            }).toErrorDev([
                'MUI X: `<DataGrid autoPageSize={true} autoHeight={true} />` are not valid props.',
                'You cannot use both the `autoPageSize` and `autoHeight` props at the same time because `autoHeight` scales the height of the Data Grid according to the `pageSize`.',
                '',
                'Please remove one of these two props.',
            ].join('\n'));
        });
    });
    // https://github.com/mui/mui-x/issues/10373
    // needs virtualization
    it.skipIf(skipIf_1.isJSDOM)('should set proper `data-rowindex` and `aria-rowindex` when focused row is out of the viewport', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, cell, virtualScroller, focusedRow, lastRow;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid columns={[{ field: 'id' }]} rows={[
                            { id: 0 },
                            { id: 1 },
                            { id: 2 },
                            { id: 3 },
                            { id: 4 },
                            { id: 5 },
                            { id: 6 },
                            { id: 7 },
                            { id: 8 },
                            { id: 9 },
                        ]}/>
        </div>).user;
                    cell = (0, helperFn_1.getCell)(0, 0);
                    return [4 /*yield*/, user.click(cell)];
                case 1:
                    _a.sent();
                    virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, virtualScroller.scrollTo({ top: 1000, behavior: 'instant' })];
                        }); }); })];
                case 2:
                    _a.sent();
                    focusedRow = (0, helperFn_1.getRow)(0);
                    expect(focusedRow.getAttribute('data-id')).to.equal('0');
                    expect(focusedRow.getAttribute('data-rowindex')).to.equal('0');
                    expect(focusedRow.getAttribute('aria-rowindex')).to.equal('2'); // 1-based, 1 is the header
                    lastRow = 9;
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                expect((0, helperFn_1.getRow)(lastRow).getAttribute('data-id')).to.equal('9');
                                return [2 /*return*/];
                            });
                        }); })];
                case 3:
                    _a.sent();
                    expect((0, helperFn_1.getRow)(lastRow).getAttribute('data-rowindex')).to.equal('9');
                    expect((0, helperFn_1.getRow)(lastRow).getAttribute('aria-rowindex')).to.equal('11'); // 1-based, 1 is the header
                    return [2 /*return*/];
            }
        });
    }); });
});
