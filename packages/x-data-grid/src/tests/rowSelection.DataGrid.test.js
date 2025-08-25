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
var sinon_1 = require("sinon");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_1 = require("@mui/x-data-grid");
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
var skipIf_1 = require("test/utils/skipIf");
function getSelectedRowIds() {
    var hasCheckbox = !!document.querySelector('input[type="checkbox"]');
    return Array.from((0, helperFn_1.getRows)())
        .filter(function (row) { return row.classList.contains('Mui-selected'); })
        .map(function (row) {
        return Number(row.querySelector("[role=\"gridcell\"][data-colindex=\"".concat(hasCheckbox ? 1 : 0, "\"]")).textContent);
    });
}
describe('<DataGrid /> - Row selection', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var defaultData = (0, x_data_grid_generator_1.getBasicGridData)(4, 2);
    function TestDataGridSelection(props) {
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_1.DataGrid {...defaultData} {...props} autoHeight={skipIf_1.isJSDOM} experimentalFeatures={__assign({ 
                // Unsure why this fails with `user.click` but not with `fireEvent.click`
                warnIfFocusStateIsNotSynced: false }, props.experimentalFeatures)}/>
      </div>);
    }
    // Context: https://github.com/mui/mui-x/issues/15079
    it('should not call `onRowSelectionModelChange` twice when using filterMode="server"', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestDataGrid() {
            var _a = React.useState((0, helperFn_1.includeRowSelection)([])), setRowSelectionModel = _a[1];
            var handleRowSelectionModelChange = React.useCallback(function (model) {
                setRowSelectionModel(model);
                onRowSelectionModelChange(model);
            }, []);
            return (<TestDataGridSelection getRowId={function (row) { return row.id; }} checkboxSelection onRowSelectionModelChange={handleRowSelectionModelChange} filterMode="server"/>);
        }
        var onRowSelectionModelChange, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onRowSelectionModelChange = (0, sinon_1.spy)();
                    user = render(<TestDataGrid />).user;
                    return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                case 1:
                    _a.sent();
                    expect(onRowSelectionModelChange.callCount).to.equal(1);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('prop: checkboxSelection = false (single selection)', function () {
        it('should select one row at a time on click WITHOUT ctrl or meta pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0))];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should deselect the selected row on click", function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
        ['Meta', 'Ctrl'].forEach(function (key) {
            it("should select one row at a time on click WITH ".concat(key, " pressed"), function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<TestDataGridSelection />).user;
                            return [4 /*yield*/, user.keyboard("{".concat(key, ">}"))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                        case 2:
                            _a.sent();
                            expect(getSelectedRowIds()).to.deep.equal([0]);
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0))];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, user.keyboard("{/".concat(key, "}"))];
                        case 4:
                            _a.sent();
                            expect(getSelectedRowIds()).to.deep.equal([1]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("should deselect the selected row on click WITH ".concat(key, " pressed"), function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<TestDataGridSelection />).user;
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                        case 1:
                            _a.sent();
                            expect(getSelectedRowIds()).to.deep.equal([0]);
                            return [4 /*yield*/, user.keyboard("{".concat(key, ">}"))];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, user.keyboard("{/".concat(key, "}"))];
                        case 4:
                            _a.sent();
                            expect(getSelectedRowIds()).to.deep.equal([]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it('should not select a range with shift pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 4:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([2]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: checkboxSelection = false (single selection), with keyboard events', function () {
        it('should select one row at a time on Shift + Space', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell0, cell1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection disableRowSelectionOnClick/>).user;
                        cell0 = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.click(cell0)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}[Space]{/Shift}')];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        cell1 = (0, helperFn_1.getCell)(1, 0);
                        return [4 /*yield*/, user.click(cell1)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}[Space]{/Shift}')];
                    case 4:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1]);
                        return [2 /*return*/];
                }
            });
        }); });
        [x_data_grid_1.GridEditModes.Cell, x_data_grid_1.GridEditModes.Row].forEach(function (editMode) {
            it("should select row on Shift + Space without starting editing the ".concat(editMode), function () { return __awaiter(void 0, void 0, void 0, function () {
                var onCellEditStart, user, cell01, cell11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            onCellEditStart = (0, sinon_1.spy)();
                            user = render(<TestDataGridSelection columns={[
                                    { field: 'id', type: 'number' },
                                    { field: 'name', editable: true },
                                ]} rows={[
                                    { id: 0, name: 'React' },
                                    { id: 1, name: 'Vue' },
                                ]} onCellEditStart={onCellEditStart} editMode={editMode} disableRowSelectionOnClick/>).user;
                            expect(onCellEditStart.callCount).to.equal(0);
                            cell01 = (0, helperFn_1.getCell)(0, 1);
                            return [4 /*yield*/, user.click(cell01)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.keyboard('{Shift>}[Space]{/Shift}')];
                        case 2:
                            _a.sent();
                            expect(onCellEditStart.callCount).to.equal(0);
                            expect(getSelectedRowIds()).to.deep.equal([0]);
                            cell11 = (0, helperFn_1.getCell)(1, 1);
                            return [4 /*yield*/, user.click(cell11)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, user.keyboard('{Shift>}[Space]{/Shift}')];
                        case 4:
                            _a.sent();
                            expect(onCellEditStart.callCount).to.equal(0);
                            expect(getSelectedRowIds()).to.deep.equal([1]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        it("should deselect the selected row on Shift + Space", function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell00;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection disableRowSelectionOnClick/>).user;
                        cell00 = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.click(cell00)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}[Space]{/Shift}')];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [4 /*yield*/, user.keyboard('{Shift>}[Space]{/Shift}')];
                    case 3:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not select a range with shift pressed', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell00;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection disableRowSelectionOnClick/>).user;
                        cell00 = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.click(cell00)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}[Space]{/Shift}')];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [4 /*yield*/, user.keyboard('{Shift>}[ArrowDown]{/Shift}')];
                    case 3:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: checkboxSelection = true (multi selection)', function () {
        it('should allow to toggle prop.checkboxSelection', function () {
            var setProps = render(<TestDataGridSelection />).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'Currency Pair']);
            expect((0, helperFn_1.getColumnHeaderCell)(0).querySelectorAll('input')).to.have.length(0);
            setProps({ checkboxSelection: true });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['', 'id', 'Currency Pair']);
            expect((0, helperFn_1.getColumnHeaderCell)(0).querySelectorAll('input')).to.have.length(1);
        });
        it('should check then uncheck when clicking twice the row', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        expect((0, helperFn_1.getRow)(0).querySelector('input')).to.have.property('checked', false);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 1))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        expect((0, helperFn_1.getRow)(0).querySelector('input')).to.have.property('checked', true);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 1))];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        expect((0, helperFn_1.getRow)(0).querySelector('input')).to.have.property('checked', false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should check and uncheck when double clicking the checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        expect((0, helperFn_1.getRow)(0).querySelector('input')).to.have.property('checked', false);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        expect((0, helperFn_1.getRow)(0).querySelector('input')).to.have.property('checked', true);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        expect((0, helperFn_1.getRow)(0).querySelector('input')).to.have.property('checked', false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set focus on the cell when clicking the checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, checkboxInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        expect((0, helperFn_1.getActiveCell)()).to.equal(null);
                        checkboxInput = (0, helperFn_1.getCell)(0, 0).querySelector('input');
                        return [4 /*yield*/, user.click(checkboxInput)];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getActiveCell)()).to.equal('0-0');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should return all row IDs when selection type is exclude with empty ids', function () { return __awaiter(void 0, void 0, void 0, function () {
            function TestWithApiRef() {
                return (<TestDataGridSelection checkboxSelection apiRef={apiRef} onRowSelectionModelChange={onRowSelectionModelChange}/>);
            }
            var onRowSelectionModelChange, apiRef, user, selectAllCheckbox, selectionModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onRowSelectionModelChange = (0, sinon_1.spy)();
                        apiRef = { current: null };
                        user = render(<TestWithApiRef />).user;
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Select all rows' });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 1:
                        _a.sent();
                        // The callback should be called with exclude type and empty ids
                        expect(onRowSelectionModelChange.callCount).to.equal(1);
                        selectionModel = onRowSelectionModelChange.firstCall.args[0];
                        expect(selectionModel.type).to.equal('exclude');
                        expect(selectionModel.ids.size).to.equal(0);
                        // Verify that all rows are visually selected
                        expect(getSelectedRowIds()).to.deep.equal([0, 1, 2, 3]);
                        // Verify that `gridRowSelectionIdsSelector` returns all row data
                        (0, internal_test_utils_1.act)(function () {
                            if (apiRef.current) {
                                var selectedRows = (0, x_data_grid_1.gridRowSelectionIdsSelector)(apiRef);
                                expect(selectedRows.size).to.equal(4);
                                expect(Array.from(selectedRows.keys())).to.deep.equal([0, 1, 2, 3]);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should handle exclude type selection when deselecting a single row after select all', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, user, selectAllCheckbox, selectionModel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onRowSelectionModelChange = (0, sinon_1.spy)();
                        user = render(<TestDataGridSelection checkboxSelection onRowSelectionModelChange={onRowSelectionModelChange}/>).user;
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Select all rows' });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 1:
                        _a.sent();
                        // Reset the spy to check the next call
                        onRowSelectionModelChange.resetHistory();
                        // Deselect one row
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 2:
                        // Deselect one row
                        _a.sent();
                        // Should still be exclude type but with the deselected row ID
                        expect(onRowSelectionModelChange.callCount).to.equal(1);
                        selectionModel = onRowSelectionModelChange.firstCall.args[0];
                        expect(selectionModel.type).to.equal('exclude');
                        expect(selectionModel.ids.size).to.equal(1);
                        expect(selectionModel.ids.has(1)).to.equal(true);
                        // Verify visual selection (all rows except row 1)
                        expect(getSelectedRowIds()).to.deep.equal([0, 2, 3]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should select all visible rows regardless of pagination', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, selectAllCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection initialState={{ pagination: { paginationModel: { pageSize: 1 } } }} pageSizeOptions={[1]}/>).user;
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Select all rows' });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should check the checkbox when there is no rows', function () {
            render(<TestDataGridSelection rows={[]} checkboxSelection/>);
            var selectAll = internal_test_utils_1.screen.getByRole('checkbox', {
                name: /select all rows/i,
            });
            expect(selectAll).to.have.property('checked', false);
        });
        it('should disable the checkbox if isRowSelectable returns false', function () {
            render(<TestDataGridSelection isRowSelectable={function (params) { return params.id === 0; }} checkboxSelection/>);
            expect((0, helperFn_1.getRow)(0).querySelector('input')).to.have.property('disabled', false);
            expect((0, helperFn_1.getRow)(1).querySelector('input')).to.have.property('disabled', true);
        });
        it('should select a range with shift pressed when clicking the row', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 1))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 1))];
                    case 3:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should select a range with shift pressed when clicking the checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 3:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);
                        return [2 /*return*/];
                }
            });
        }); });
        // Context: https://github.com/mui/mui-x/issues/17441
        it('should deselect a row within the range when clicking the row', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 1))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 1))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 4:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 1))];
                    case 5:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should unselect from last clicked cell to cell after clicked cell if clicking inside a selected range', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection disableVirtualization/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(3, 0).querySelector('input'))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 4:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 1, 2, 3]);
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 7:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 1]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not change the selection with shift pressed when clicking on the last row of the selection', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 4:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 7:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reset selected rows when turning off checkboxSelection', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, setProps, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render(<TestDataGridSelection checkboxSelection/>), setProps = _a.setProps, user = _a.user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 2:
                        _b.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 1]);
                        setProps({ checkboxSelection: false });
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reset row selection in the current page as selected when turning off checkboxSelection', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, setProps, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render(<TestDataGridSelection checkboxSelection pagination initialState={{ pagination: { paginationModel: { pageSize: 2 } } }} pageSizeOptions={[2]}/>), setProps = _a.setProps, user = _a.user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 3:
                        _b.sent();
                        expect(internal_test_utils_1.screen.getByText('2 rows selected')).not.to.equal(null);
                        setProps({ checkboxSelection: false });
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        expect(internal_test_utils_1.screen.queryByText('2 row selected')).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set the correct aria-label on the column header checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        expect(internal_test_utils_1.screen.queryByRole('checkbox', { name: 'Unselect all rows' })).to.equal(null);
                        expect(internal_test_utils_1.screen.queryByRole('checkbox', { name: 'Select all rows' })).not.to.equal(null);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: 'Select all rows' }))];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('checkbox', { name: 'Select all rows' })).to.equal(null);
                        expect(internal_test_utils_1.screen.queryByRole('checkbox', { name: 'Unselect all rows' })).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set the correct aria-label on the cell checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection rows={[{ id: 0, name: 'React' }]}/>).user;
                        expect(internal_test_utils_1.screen.queryByRole('checkbox', { name: 'Unselect row' })).to.equal(null);
                        expect(internal_test_utils_1.screen.queryByRole('checkbox', { name: 'Select row' })).not.to.equal(null);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: 'Select row' }))];
                    case 1:
                        _a.sent();
                        expect(internal_test_utils_1.screen.queryByRole('checkbox', { name: 'Select row' })).to.equal(null);
                        expect(internal_test_utils_1.screen.queryByRole('checkbox', { name: 'Unselect row' })).not.to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not select more than one row when disableMultipleRowSelection = true', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, input1, input2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection disableMultipleRowSelection/>).user;
                        input1 = (0, helperFn_1.getCell)(0, 0).querySelector('input');
                        return [4 /*yield*/, user.click(input1)];
                    case 1:
                        _a.sent();
                        expect(input1.checked).to.equal(true);
                        input2 = (0, helperFn_1.getCell)(1, 0).querySelector('input');
                        return [4 /*yield*/, user.click(input2)];
                    case 2:
                        _a.sent();
                        expect(input1.checked).to.equal(false);
                        expect(input2.checked).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should remove the selection from rows that are filtered out', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, selectAllCheckbox, idText, idMenu, filterButton;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Select all rows' });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 1:
                        _c.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 1, 2, 3]);
                        expect((_a = (0, helperFn_1.grid)('selectedRowCount')) === null || _a === void 0 ? void 0 : _a.textContent).to.equal('4 rows selected');
                        idText = internal_test_utils_1.screen.getByRole('columnheader', { name: 'id' });
                        return [4 /*yield*/, user.hover(idText)];
                    case 2:
                        _c.sent();
                        idMenu = idText.querySelector('button[aria-label="id column menu"]');
                        return [4 /*yield*/, user.click(idMenu)];
                    case 3:
                        _c.sent();
                        filterButton = internal_test_utils_1.screen.getByText('Filter');
                        return [4 /*yield*/, user.click(filterButton)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, user.keyboard('1')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                // Previous selection is cleaned with only the filtered rows
                                expect(getSelectedRowIds()).to.deep.equal([1]);
                            })];
                    case 6:
                        _c.sent();
                        expect((_b = (0, helperFn_1.grid)('selectedRowCount')) === null || _b === void 0 ? void 0 : _b.textContent).to.equal('1 row selected');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should only select filtered items when "select all" is toggled after applying a filter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, selectAllCheckbox, idText, idMenu, filterButton;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Select all rows' });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(getSelectedRowIds()).to.deep.equal([0, 1, 2, 3]);
                            })];
                    case 2:
                        _d.sent();
                        expect((_a = (0, helperFn_1.grid)('selectedRowCount')) === null || _a === void 0 ? void 0 : _a.textContent).to.equal('4 rows selected');
                        idText = internal_test_utils_1.screen.getByRole('columnheader', { name: 'id' });
                        return [4 /*yield*/, user.hover(idText)];
                    case 3:
                        _d.sent();
                        idMenu = idText.querySelector('button[aria-label="id column menu"]');
                        return [4 /*yield*/, user.click(idMenu)];
                    case 4:
                        _d.sent();
                        filterButton = internal_test_utils_1.screen.getByText('Filter');
                        return [4 /*yield*/, user.click(filterButton)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, user.keyboard('1')];
                    case 6:
                        _d.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                // Previous selection is cleared and only the filtered row is selected
                                expect(getSelectedRowIds()).to.deep.equal([1]);
                            })];
                    case 7:
                        _d.sent();
                        expect((_b = (0, helperFn_1.grid)('selectedRowCount')) === null || _b === void 0 ? void 0 : _b.textContent).to.equal('1 row selected');
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 8:
                        _d.sent(); // Unselect all
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(getSelectedRowIds()).to.deep.equal([]);
                            })];
                    case 9:
                        _d.sent();
                        expect((0, helperFn_1.grid)('selectedRowCount')).to.equal(null);
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 10:
                        _d.sent(); // Select all filtered rows
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(getSelectedRowIds()).to.deep.equal([1]);
                            })];
                    case 11:
                        _d.sent();
                        expect((_c = (0, helperFn_1.grid)('selectedRowCount')) === null || _c === void 0 ? void 0 : _c.textContent).to.equal('1 row selected');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should select all the rows when clicking on "Select All" checkbox in indeterminate state', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, selectAllCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Select all rows' });
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getAllByRole('checkbox', { name: /select row/i })[0])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 1, 2, 3]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: checkboxSelection = true (multi selection), with keyboard events', function () {
        it('should select row below when pressing "ArrowDown" + shiftKey', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 1))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([2]);
                        return [4 /*yield*/, user.keyboard('{Shift>}[ArrowDown]{/Shift}')];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([2, 3]);
                        return [4 /*yield*/, user.keyboard('{Shift>}[ArrowDown]{/Shift}')];
                    case 3:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([2, 3]); // Already on the last row
                        return [2 /*return*/];
                }
            });
        }); });
        it('should unselect previous row when pressing "ArrowDown" + shiftKey', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(3, 1))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([3]);
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 1))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 4:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1, 2, 3]);
                        return [4 /*yield*/, user.keyboard('{Shift>}[ArrowDown]{/Shift}')];
                    case 5:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([2, 3]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not unselect row above when pressing "ArrowDown" + shiftKey', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 1))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1]);
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 1))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 4:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1, 2]);
                        return [4 /*yield*/, user.keyboard('{Shift>}[ArrowDown]{/Shift}')];
                    case 5:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1, 2, 3]);
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 6:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1, 2, 3]); // Already on the last row
                        return [2 /*return*/];
                }
            });
        }); });
        it('should unselect previous row when pressing "ArrowUp" + shiftKey', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 1))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([2]);
                        return [4 /*yield*/, user.keyboard('{Shift>}')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(3, 1))];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{/Shift}')];
                    case 4:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([2, 3]);
                        return [4 /*yield*/, user.keyboard('{Shift>}[ArrowUp]{/Shift}')];
                    case 5:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should add new row to the selection when pressing Shift+Space', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell21, cell11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection disableRowSelectionOnClick/>).user;
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        cell21 = (0, helperFn_1.getCell)(2, 1);
                        return [4 /*yield*/, user.click(cell21)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}[Space]{/Shift}')];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([2]);
                        cell11 = (0, helperFn_1.getCell)(1, 1);
                        return [4 /*yield*/, user.click(cell11)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}[Space]{/Shift}')];
                    case 4:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1, 2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should remove a row from the selection when pressing Shift+Space while the row is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection disableRowSelectionOnClick/>).user;
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        cell21 = (0, helperFn_1.getCell)(2, 1);
                        return [4 /*yield*/, user.click(cell21)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}[Space]{/Shift}')];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([2]);
                        return [4 /*yield*/, user.keyboard('{Shift>}[Space]{/Shift}')];
                    case 3:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
        // HTMLElement.focus() only scrolls to the element on a real browser
        it.skipIf(skipIf_1.isJSDOM)('should not jump during scroll while the focus is on the checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var data, user, checkboxes, virtualScroller;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = (0, x_data_grid_generator_1.getBasicGridData)(20, 1);
                        user = render(<TestDataGridSelection {...data} rowHeight={50} checkboxSelection hideFooter/>).user;
                        checkboxes = internal_test_utils_1.screen.queryAllByRole('checkbox', { name: /select row/i });
                        return [4 /*yield*/, user.click(checkboxes[0])];
                    case 1:
                        _a.sent();
                        expect(checkboxes[0]).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}')];
                    case 2:
                        _a.sent();
                        virtualScroller = document.querySelector('.MuiDataGrid-virtualScroller');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, virtualScroller.scrollTo({ top: 250, behavior: 'instant' })];
                            }); }); })];
                    case 3:
                        _a.sent();
                        expect(virtualScroller.scrollTop).to.equal(250);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set tabindex=0 on the checkbox when the it receives focus', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, checkbox, checkboxCell, secondCell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection/>).user;
                        checkbox = internal_test_utils_1.screen.getAllByRole('checkbox', { name: /select row/i })[0];
                        checkboxCell = (0, helperFn_1.getCell)(0, 0);
                        secondCell = (0, helperFn_1.getCell)(0, 1);
                        expect(checkbox).to.have.attribute('tabindex', '-1');
                        expect(checkboxCell).to.have.attribute('tabindex', '-1');
                        expect(secondCell).to.have.attribute('tabindex', '-1');
                        return [4 /*yield*/, user.click(secondCell)];
                    case 1:
                        _a.sent();
                        expect(secondCell).to.have.attribute('tabindex', '0');
                        return [4 /*yield*/, user.keyboard('{ArrowLeft}')];
                    case 2:
                        _a.sent();
                        expect(secondCell).to.have.attribute('tabindex', '-1');
                        // Ensure that checkbox has tabindex=0 and the cell has tabindex=-1
                        expect(checkbox).to.have.attribute('tabindex', '0');
                        expect(checkboxCell).to.have.attribute('tabindex', '-1');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should select/unselect all rows when pressing space', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, selectAllCell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection disableVirtualization/>).user;
                        selectAllCell = document.querySelector('[role="columnheader"][data-field="__check__"] input');
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, selectAllCell.focus()];
                            }); }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('[Space]')];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 1, 2, 3]);
                        return [4 /*yield*/, user.keyboard('[Space]')];
                    case 3:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
        // Skip on everything as this is failing on all environments on ubuntu/CI
        //   describe('ripple', () => {
        //
        //     // JSDOM doesn't fire "blur" when .focus is called in another element
        //     // FIXME Firefox doesn't show any ripple
        //     it.skipIf(isJSDOM)('should keep only one ripple visible when navigating between checkboxes', async () => {
        //       render(<TestDataGridSelection checkboxSelection />);
        //       const cell = getCell(1, 1);
        //       fireUserEvent.mousePress(cell);
        //       fireEvent.keyDown(cell, { key: 'ArrowLeft' });
        //       fireEvent.keyDown(getCell(1, 0).querySelector('input')!, { key: 'ArrowUp' });
        //
        //       await flushMicrotasks();
        //       expect(document.querySelectorAll('.MuiTouchRipple-rippleVisible')).to.have.length(1);
        //     });
        //   });
    });
    describe('prop: isRowSelectable', function () {
        it('should update the selected rows when the isRowSelectable prop changes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, setProps, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = render(<TestDataGridSelection isRowSelectable={function () { return true; }} checkboxSelection/>), setProps = _a.setProps, user = _a.user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 2:
                        _b.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 1]);
                        setProps({ isRowSelectable: function (params) { return Number(params.id) % 2 === 0; } });
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not select unselectable rows given in rowSelectionModel', function () {
            var setProps = render(<TestDataGridSelection rowSelectionModel={(0, helperFn_1.includeRowSelection)([0, 1])} isRowSelectable={function (params) { return Number(params.id) % 2 === 0; }} checkboxSelection/>).setProps;
            expect(getSelectedRowIds()).to.deep.equal([0]);
            setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([0, 1, 2, 3]) });
            expect(getSelectedRowIds()).to.deep.equal([0, 2]);
        });
        it('should filter out unselectable rows when the rowSelectionModel prop changes', function () {
            var setProps = render(<TestDataGridSelection rowSelectionModel={(0, helperFn_1.includeRowSelection)([1])} isRowSelectable={function (params) { return Number(params.id) > 0; }} checkboxSelection/>).setProps;
            expect(getSelectedRowIds()).to.deep.equal([1]);
            expect((0, helperFn_1.getColumnHeaderCell)(0).querySelector('input')).to.have.attr('data-indeterminate', 'true');
            setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([0]) });
            expect((0, helperFn_1.getColumnHeaderCell)(0).querySelector('input')).to.have.attr('data-indeterminate', 'false');
            expect(getSelectedRowIds()).to.deep.equal([]);
        });
        it('should not crash when paginationMode="server" and some selected rows are not provided to the grid', function () {
            expect(function () {
                render(<TestDataGridSelection paginationMode="server" rowCount={4} rowSelectionModel={(0, helperFn_1.includeRowSelection)([1, 4])} isRowSelectable={function (params) { return Number(params.id) > 0; }} checkboxSelection/>);
            }).not.toErrorDev();
        });
        it('should set the "Select all" checkbox to selected state on clicking even when some rows are not selectable', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection isRowSelectable={function (_a) {
                            var id = _a.id;
                            return Number(id) % 2 === 0;
                        }}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getColumnHeaderCell)(0).querySelector('input'))];
                    case 1:
                        _a.sent();
                        expect((0, helperFn_1.getColumnHeaderCell)(0).querySelector('input')).to.have.property('checked', true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: rows', function () {
        it('should remove the outdated selected rows when rows prop changes', function () {
            var data = (0, x_data_grid_generator_1.getBasicGridData)(4, 2);
            var setProps = render(<TestDataGridSelection rowSelectionModel={(0, helperFn_1.includeRowSelection)([0, 1, 2])} checkboxSelection {...data}/>).setProps;
            expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);
            setProps({
                rows: data.rows.slice(0, 1),
            });
            expect(getSelectedRowIds()).to.deep.equal([0]);
        });
        // Related to https://github.com/mui/mui-x/issues/14964
        it('should call `onRowSelectionModelChange` when outdated selected rows are removed', function () {
            var data = (0, x_data_grid_generator_1.getBasicGridData)(4, 2);
            var onRowSelectionModelChangeSpy = (0, sinon_1.spy)();
            var setProps = render(<TestDataGridSelection rowSelectionModel={(0, helperFn_1.includeRowSelection)([0, 1, 2])} onRowSelectionModelChange={onRowSelectionModelChangeSpy} checkboxSelection {...data}/>).setProps;
            setProps({
                rows: data.rows.slice(0, 1),
            });
            expect(onRowSelectionModelChangeSpy.called).to.equal(true);
        });
        it('should retain the outdated selected rows when the rows prop changes when keepNonExistentRowsSelected is true', function () {
            var data = (0, x_data_grid_generator_1.getBasicGridData)(10, 2);
            var onRowSelectionModelChange = (0, sinon_1.spy)();
            var setProps = render(<TestDataGridSelection rowSelectionModel={(0, helperFn_1.includeRowSelection)([0, 1, 2])} checkboxSelection keepNonExistentRowsSelected onRowSelectionModelChange={onRowSelectionModelChange} {...data}/>).setProps;
            expect(getSelectedRowIds()).to.deep.equal([0, 1, 2]);
            setProps({ rows: data.rows.slice(0, 1) });
            // This expectation is around visible rows
            expect(getSelectedRowIds()).to.deep.equal([0]);
            // Check number of selected rows in the footer
            expect(function () { return internal_test_utils_1.screen.getByText('3 rows selected'); }).not.to.throw();
            // The callback should not be called when the selection changes
            expect(onRowSelectionModelChange.getCalls()).to.have.length(0);
        });
    });
    describe('prop: rowSelectionModel and onRowSelectionModelChange', function () {
        it('should select rows when initialised', function () {
            render(<TestDataGridSelection rowSelectionModel={(0, helperFn_1.includeRowSelection)([1])}/>);
            expect(getSelectedRowIds()).to.deep.equal([1]);
        });
        it('should not call onRowSelectionModelChange on initialization or on rowSelectionModel prop change', function () {
            var onRowSelectionModelChange = (0, sinon_1.spy)();
            var setProps = render(<TestDataGridSelection onRowSelectionModelChange={onRowSelectionModelChange} rowSelectionModel={(0, helperFn_1.includeRowSelection)([0])}/>).setProps;
            expect(onRowSelectionModelChange.callCount).to.equal(0);
            setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([1]) });
            expect(onRowSelectionModelChange.callCount).to.equal(0);
        });
        it('should call onRowSelectionModelChange with an empty array if no row is selectable in the current page when turning off checkboxSelection', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, _a, setProps, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        onRowSelectionModelChange = (0, sinon_1.spy)();
                        _a = render(<TestDataGridSelection checkboxSelection pagination initialState={{ pagination: { paginationModel: { pageSize: 2 } } }} pageSizeOptions={[2]} onRowSelectionModelChange={onRowSelectionModelChange}/>), setProps = _a.setProps, user = _a.user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([0]));
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 3:
                        _b.sent();
                        expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([0, 2]));
                        setProps({ checkboxSelection: false, isRowSelectable: function () { return false; } });
                        expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([]));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onRowSelectionModelChange with the correct reason when clicking on a row', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onRowSelectionModelChange = (0, sinon_1.spy)();
                        user = render(<TestDataGridSelection checkboxSelection pagination onRowSelectionModelChange={onRowSelectionModelChange}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _a.sent();
                        expect(onRowSelectionModelChange.lastCall.args[1].reason).to.equal('singleRowSelection');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onRowSelectionModelChange with the correct reason when clicking on the header checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onRowSelectionModelChange = (0, sinon_1.spy)();
                        user = render(<TestDataGridSelection checkboxSelection pagination onRowSelectionModelChange={onRowSelectionModelChange}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getColumnHeaderCell)(0).querySelector('input'))];
                    case 1:
                        _a.sent();
                        expect(onRowSelectionModelChange.lastCall.args[1].reason).to.equal('multipleRowsSelection');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call onRowSelectionModelChange with an empty array if there is no selected row in the current page when turning off checkboxSelection', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, _a, setProps, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        onRowSelectionModelChange = (0, sinon_1.spy)();
                        _a = render(<TestDataGridSelection checkboxSelection initialState={{ pagination: { paginationModel: { pageSize: 2 } } }} pageSizeOptions={[2]} onRowSelectionModelChange={onRowSelectionModelChange}/>), setProps = _a.setProps, user = _a.user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 2:
                        _b.sent();
                        expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([0, 1]));
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                    case 3:
                        _b.sent();
                        setProps({ checkboxSelection: false });
                        expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([]));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should deselect the old selected rows when updating rowSelectionModel', function () {
            var setProps = render(<TestDataGridSelection rowSelectionModel={(0, helperFn_1.includeRowSelection)([0])}/>).setProps;
            expect(getSelectedRowIds()).to.deep.equal([0]);
            setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([1]) });
            expect(getSelectedRowIds()).to.deep.equal([1]);
        });
        it('should update the selection when neither the model nor the onChange are set', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not update the selection model when the rowSelectionModel prop is set', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rowSelectionModel, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rowSelectionModel = (0, helperFn_1.includeRowSelection)([1]);
                        user = render(<TestDataGridSelection rowSelectionModel={rowSelectionModel}/>).user;
                        expect(getSelectedRowIds()).to.deep.equal([1]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should update the selection when the model is not set, but the onChange is set', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onModelChange, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onModelChange = (0, sinon_1.spy)();
                        user = render(<TestDataGridSelection onRowSelectionModelChange={onModelChange}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        expect(onModelChange.callCount).to.equal(1);
                        expect(onModelChange.firstCall.firstArg).to.deep.equal((0, helperFn_1.includeRowSelection)([0]));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should control selection state when the model and the onChange are set', function () { return __awaiter(void 0, void 0, void 0, function () {
            function ControlCase() {
                var _a = React.useState((0, helperFn_1.includeRowSelection)([])), rowSelectionModel = _a[0], setRowSelectionModel = _a[1];
                var handleSelectionChange = function (newModel) {
                    if (newModel.ids.size > 0) {
                        var model = __assign(__assign({}, newModel), { ids: new Set(newModel.ids) });
                        model.ids.add(2);
                        setRowSelectionModel(model);
                        return;
                    }
                    setRowSelectionModel(newModel);
                };
                return (<TestDataGridSelection rowSelectionModel={rowSelectionModel} onRowSelectionModelChange={handleSelectionChange} checkboxSelection/>);
            }
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<ControlCase />).user;
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 1))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1, 2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should throw if rowSelectionModel contains more than 1 row', function () {
            var apiRef;
            function ControlCase() {
                apiRef = (0, x_data_grid_1.useGridApiRef)();
                return <TestDataGridSelection apiRef={apiRef}/>;
            }
            render(<ControlCase />);
            expect(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowSelectionModel((0, helperFn_1.includeRowSelection)([0, 1])); }).to.throw(/`rowSelectionModel` can only contain 1 item in DataGrid/);
        });
        it('should not throw if rowSelectionModel contains more than 1 item with checkbox selection', function () {
            var apiRef;
            function ControlCase() {
                apiRef = (0, x_data_grid_1.useGridApiRef)();
                return <TestDataGridSelection apiRef={apiRef} checkboxSelection/>;
            }
            render(<ControlCase />);
            expect(function () {
                return (0, internal_test_utils_1.act)(function () {
                    var _a;
                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowSelectionModel((0, helperFn_1.includeRowSelection)([0, 1]));
                });
            }).not.to.throw();
        });
    });
    describe('prop: rowSelection = false', function () {
        it('should not select rows when clicking the checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection rowSelection={false} checkboxSelection/>).user;
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        expect((0, helperFn_1.getRow)(0).querySelector('input')).to.have.property('checked', false);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 1))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        expect((0, helperFn_1.getRow)(0).querySelector('input')).to.have.property('checked', false);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not select rows with Shift + Space', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, cell0;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection rowSelection={false} disableRowSelectionOnClick/>).user;
                        cell0 = (0, helperFn_1.getCell)(0, 0);
                        return [4 /*yield*/, user.click(cell0)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{Shift>}[Space]{/Shift}')];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not select rows passed in the rowSelectionModel prop', function () {
            render(<TestDataGridSelection rowSelection={false} rowSelectionModel={(0, helperFn_1.includeRowSelection)([0])}/>);
            expect(getSelectedRowIds()).to.deep.equal([]);
        });
    });
    describe('accessibility', function () {
        it('should add aria-selected attributes to the selectable rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        // Select the first row
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        // Select the first row
                        _a.sent();
                        expect((0, helperFn_1.getRow)(0).getAttribute('aria-selected')).to.equal('true');
                        expect((0, helperFn_1.getRow)(1).getAttribute('aria-selected')).to.equal('false');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not add aria-selected attributes if the row selection is disabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection rowSelection={false}/>).user;
                        expect((0, helperFn_1.getRow)(0).getAttribute('aria-selected')).to.equal(null);
                        // Try to select the first row
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        // Try to select the first row
                        _a.sent();
                        // nothing should change
                        expect((0, helperFn_1.getRow)(0).getAttribute('aria-selected')).to.equal(null);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('performance', function () {
        it('should not rerender unrelated nodes', function () { return __awaiter(void 0, void 0, void 0, function () {
            function CustomCell(props) {
                React.useEffect(function () {
                    commits.push({
                        rowId: props.id,
                    });
                });
                return <div>Hello</div>;
            }
            var commits, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commits = [];
                        user = render(<div style={{ width: 300, height: 300 }}>
          <x_data_grid_1.DataGrid columns={[
                                { field: 'id', headerName: 'id', type: 'number' },
                                {
                                    field: 'currencyPair',
                                    headerName: 'Currency Pair',
                                    renderCell: function (params) { return <CustomCell {...params}/>; },
                                },
                            ]} rows={[
                                { id: 0, currencyPair: 'USDGBP' },
                                { id: 1, currencyPair: 'USDEUR' },
                            ]} autoHeight={skipIf_1.isJSDOM} checkboxSelection/>
        </div>).user;
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        expect((0, helperFn_1.getRow)(0).querySelector('input')).to.have.property('checked', false);
                        commits = [];
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 1))];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0]);
                        expect((0, helperFn_1.getRow)(0).querySelector('input')).to.have.property('checked', true);
                        // It shouldn't rerender any of the custom cells
                        expect(commits).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
