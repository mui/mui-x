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
var sinon_1 = require("sinon");
var helperFn_1 = require("test/utils/helperFn");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var x_data_grid_generator_1 = require("@mui/x-data-grid-generator");
function getSelectedRowIds() {
    var hasCheckbox = !!document.querySelector('input[type="checkbox"]');
    return Array.from((0, helperFn_1.getRows)())
        .filter(function (row) { return row.classList.contains('Mui-selected'); })
        .map(function (row) {
        return Number(row.querySelector("[role=\"gridcell\"][data-colindex=\"".concat(hasCheckbox ? 1 : 0, "\"]")).textContent);
    });
}
describe('<DataGridPro /> - Row selection', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function TestDataGridSelection(_a) {
        var _b = _a.rowLength, rowLength = _b === void 0 ? 4 : _b, other = __rest(_a, ["rowLength"]);
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        var data = React.useMemo(function () { return (0, x_data_grid_generator_1.getBasicGridData)(rowLength, 2); }, [rowLength]);
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro {...data} {...other} apiRef={apiRef} disableVirtualization/>
      </div>);
    }
    var rows = [
        {
            hierarchy: ['Sarah'],
            jobTitle: 'Head of Human Resources',
            recruitmentDate: new Date(2020, 8, 12),
            id: 0,
        },
        {
            hierarchy: ['Thomas'],
            jobTitle: 'Head of Sales',
            recruitmentDate: new Date(2017, 3, 4),
            id: 1,
        },
        {
            hierarchy: ['Thomas', 'Robert'],
            jobTitle: 'Sales Person',
            recruitmentDate: new Date(2020, 11, 20),
            id: 2,
        },
        {
            hierarchy: ['Thomas', 'Karen'],
            jobTitle: 'Sales Person',
            recruitmentDate: new Date(2020, 10, 14),
            id: 3,
        },
        {
            hierarchy: ['Thomas', 'Nancy'],
            jobTitle: 'Sales Person',
            recruitmentDate: new Date(2017, 10, 29),
            id: 4,
        },
        {
            hierarchy: ['Thomas', 'Daniel'],
            jobTitle: 'Sales Person',
            recruitmentDate: new Date(2020, 7, 21),
            id: 5,
        },
        {
            hierarchy: ['Thomas', 'Christopher'],
            jobTitle: 'Sales Person',
            recruitmentDate: new Date(2020, 7, 20),
            id: 6,
        },
        {
            hierarchy: ['Thomas', 'Donald'],
            jobTitle: 'Sales Person',
            recruitmentDate: new Date(2019, 6, 28),
            id: 7,
        },
        {
            hierarchy: ['Mary'],
            jobTitle: 'Head of Engineering',
            recruitmentDate: new Date(2016, 3, 14),
            id: 8,
        },
        {
            hierarchy: ['Mary', 'Jennifer'],
            jobTitle: 'Tech lead front',
            recruitmentDate: new Date(2016, 5, 17),
            id: 9,
        },
        {
            hierarchy: ['Mary', 'Jennifer', 'Anna'],
            jobTitle: 'Front-end developer',
            recruitmentDate: new Date(2019, 11, 7),
            id: 10,
        },
        {
            hierarchy: ['Mary', 'Michael'],
            jobTitle: 'Tech lead devops',
            recruitmentDate: new Date(2021, 7, 1),
            id: 11,
        },
        {
            hierarchy: ['Mary', 'Linda'],
            jobTitle: 'Tech lead back',
            recruitmentDate: new Date(2017, 0, 12),
            id: 12,
        },
        {
            hierarchy: ['Mary', 'Linda', 'Elizabeth'],
            jobTitle: 'Back-end developer',
            recruitmentDate: new Date(2019, 2, 22),
            id: 13,
        },
        {
            hierarchy: ['Mary', 'Linda', 'William'],
            jobTitle: 'Back-end developer',
            recruitmentDate: new Date(2018, 4, 19),
            id: 14,
        },
    ];
    var columns = [
        { field: 'jobTitle', headerName: 'Job Title', width: 200 },
        {
            field: 'recruitmentDate',
            headerName: 'Recruitment Date',
            type: 'date',
            width: 150,
        },
    ];
    var getTreeDataPath = function (row) { return row.hierarchy; };
    function TreeDataGrid(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        return (<div style={{ height: 800, width: '100%' }}>
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} treeData rows={rows} columns={columns} getTreeDataPath={getTreeDataPath} checkboxSelection {...props}/>
      </div>);
    }
    // Context: https://github.com/mui/mui-x/pull/15509#discussion_r1878082687
    it('should keep the selection on the clicked row if selection range is deselected', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestDataGridSelection />).user;
                    return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 1))];
                case 1:
                    _a.sent();
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
                    expect(getSelectedRowIds()).to.deep.equal([1]);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should keep the previously selected tree data parent selected if it becomes leaf after filtering', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    user = render(<TreeDataGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', {
                            name: /select all rows/i,
                        }))];
                case 1:
                    _c.sent();
                    expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.length(15);
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setFilterModel({
                                    items: [
                                        {
                                            field: 'jobTitle',
                                            value: 'Head of Sales',
                                            operator: 'equals',
                                        },
                                    ],
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _c.sent();
                    expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.keys([1]);
                    return [2 /*return*/];
            }
        });
    }); });
    // Context: https://github.com/mui/mui-x/issues/15045
    it('should not throw when using `isRowSelectable` and `keepNonExistentRowsSelected`', function () { return __awaiter(void 0, void 0, void 0, function () {
        function TestDataGrid() {
            var _a = React.useState(rows), gridRows = _a[0], setRows = _a[1];
            var onFilterChange = React.useCallback(function (filterModel) {
                var _a;
                if (((_a = filterModel.items) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                    return;
                }
                var filteredRows = rows.filter(function (row) {
                    return row.jobTitle.includes(filterModel.items[0].value);
                });
                setRows(filteredRows);
            }, [setRows]);
            return (<TreeDataGrid defaultGroupingExpansionDepth={-1} isRowSelectable={function () { return true; }} rows={gridRows} onFilterModelChange={onFilterChange} keepNonExistentRowsSelected rowSelectionPropagation={{ parents: false, descendants: false }}/>);
        }
        var user;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    user = render(<TestDataGrid />).user;
                    // Select `Thomas`
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getAllByRole('checkbox', {
                            name: /select row/i,
                        })[1])];
                case 1:
                    // Select `Thomas`
                    _c.sent();
                    expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.length(1);
                    expect(Array.from(apiRef.current.getSelectedRows())[0][0]).to.equal(1);
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setFilterModel({
                                    items: [{ field: 'jobTitle', value: 'Head of Human Resources', operator: 'contains' }],
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _c.sent();
                    expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.length(1);
                    expect(Array.from(apiRef.current.getSelectedRows())[0][0]).to.equal(1);
                    return [2 /*return*/];
            }
        });
    }); });
    // Context: https://github.com/mui/mui-x/issues/15068
    it('should not call `onRowSelectionModelChange` when adding a new row', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onRowSelectionModelChange, setProps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onRowSelectionModelChange = (0, sinon_1.spy)();
                    setProps = render(<TreeDataGrid onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                setProps({ rows: __spreadArray(__spreadArray([], rows, true), [{ id: 15, hierarchy: ['New'], jobTitle: 'Test Job' }], false) });
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    expect(onRowSelectionModelChange.callCount).to.equal(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should put the parent into indeterminate if some but not all the children are selected', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TreeDataGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                    return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getCell)(1, 0).querySelector('input')).to.have.attr('data-indeterminate', 'true');
                    return [2 /*return*/];
            }
        });
    }); });
    // Context: https://github.com/mui/mui-x/issues/14859
    it('should not throw when controlling a selection model', function () {
        function TestDataGrid() {
            var _a = React.useState((0, helperFn_1.includeRowSelection)([])), rowSelectionModel = _a[0], setRowSelectionModel = _a[1];
            return (<TreeDataGrid rowSelectionModel={rowSelectionModel} onRowSelectionModelChange={setRowSelectionModel}/>);
        }
        expect(function () {
            render(<TestDataGrid />);
        }).not.to.throw();
    });
    describe('prop: checkboxSelectionVisibleOnly = false', function () {
        it('should select all rows of all pages if no row is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, selectAllCheckbox;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection initialState={{ pagination: { paginationModel: { pageSize: 2 } } }} pagination pageSizeOptions={[2]}/>).user;
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', {
                            name: /select all rows/i,
                        });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 1:
                        _b.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.length(4);
                        expect(selectAllCheckbox.checked).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should select all rows of all the pages if 1 row of another page is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, selectAllCheckbox;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection initialState={{ pagination: { paginationModel: { pageSize: 2 } } }} pagination pageSizeOptions={[2]}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([0]);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                    case 2:
                        _c.sent();
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', {
                            name: /select all rows/i,
                        });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 3:
                        _c.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.length(4);
                        expect(selectAllCheckbox.checked).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should select all visible rows if pagination is not enabled', function () { return __awaiter(void 0, void 0, void 0, function () {
            var rowLength, user, selectAllCheckbox;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        rowLength = 10;
                        user = render(<TestDataGridSelection checkboxSelection checkboxSelectionVisibleOnly={false} rowLength={rowLength}/>).user;
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', {
                            name: /select all rows/i,
                        });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 1:
                        _b.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.length(rowLength);
                        expect(selectAllCheckbox.checked).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should set the header checkbox in a indeterminate state when some rows of other pages are not selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, selectAllCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection checkboxSelectionVisibleOnly={false} initialState={{ pagination: { paginationModel: { pageSize: 2 } } }} pagination pageSizeOptions={[2]}/>).user;
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', {
                            name: /select all rows/i,
                        });
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                    case 3:
                        _a.sent();
                        expect(selectAllCheckbox).to.have.attr('data-indeterminate', 'true');
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
    });
    describe('prop: checkboxSelectionVisibleOnly = true', function () {
        it('should throw a console error if used without pagination', function () {
            expect(function () {
                render(<TestDataGridSelection checkboxSelection checkboxSelectionVisibleOnly rowLength={100}/>);
            }).toErrorDev('MUI X: The `checkboxSelectionVisibleOnly` prop has no effect when the pagination is not enabled.');
        });
        it('should select all the rows of the current page if no row of the current page is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, selectAllCheckbox;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection checkboxSelectionVisibleOnly initialState={{ pagination: { paginationModel: { pageSize: 2 } } }} pagination pageSizeOptions={[2]}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([0]);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                    case 2:
                        _c.sent();
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', {
                            name: /select all rows/i,
                        });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 3:
                        _c.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.keys([0, 2, 3]);
                        expect(selectAllCheckbox.checked).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should select all the rows of the current page if 1 row of the current page is selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, selectAllCheckbox;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection initialState={{ pagination: { paginationModel: { pageSize: 2 } } }} pagination checkboxSelectionVisibleOnly pageSizeOptions={[2]}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _d.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([0]);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 3:
                        _d.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.keys([0, 2]);
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', {
                            name: /select all rows/i,
                        });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 4:
                        _d.sent();
                        expect((_c = apiRef.current) === null || _c === void 0 ? void 0 : _c.getSelectedRows()).to.have.keys([0, 2, 3]);
                        expect(selectAllCheckbox.checked).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not set the header checkbox in a indeterminate state when some rows of other pages are not selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, selectAllCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestDataGridSelection checkboxSelection initialState={{ pagination: { paginationModel: { pageSize: 2 } } }} pagination pageSizeOptions={[2]}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                    case 3:
                        _a.sent();
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', {
                            name: /select all rows/i,
                        });
                        expect(selectAllCheckbox).to.have.attr('data-indeterminate', 'false');
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to select all the current page rows when props.paginationMode="server"', function () { return __awaiter(void 0, void 0, void 0, function () {
            function TestDataGridSelectionServerSide(_a) {
                var _b = _a.rowLength, rowLength = _b === void 0 ? 4 : _b;
                apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
                var paginationModel = { pageSize: 2, page: 1 };
                var data = React.useMemo(function () { return (0, x_data_grid_generator_1.getBasicGridData)(rowLength, 2); }, [rowLength]);
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro {...data} rows={data.rows.slice(paginationModel.pageSize * paginationModel.page, paginationModel.pageSize * (paginationModel.page + 1))} checkboxSelection checkboxSelectionVisibleOnly initialState={{ pagination: { paginationModel: paginationModel } }} pagination paginationMode="server" pageSizeOptions={[2]} apiRef={apiRef} rowCount={rowLength} disableVirtualization/>
          </div>);
            }
            var user, selectAllCheckbox;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<TestDataGridSelectionServerSide />).user;
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', {
                            name: /select all rows/i,
                        });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 1:
                        _b.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.length(2);
                        return [2 /*return*/];
                }
            });
        }); });
        // https://github.com/mui/mui-x/issues/14074
        it('should select all the rows of the current page keeping the previously selected rows when a filter is applied', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, selectAllCheckbox;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<TestDataGridSelection rowLength={50} checkboxSelection checkboxSelectionVisibleOnly initialState={{
                                pagination: { paginationModel: { pageSize: 2 } },
                                filter: {
                                    filterModel: {
                                        items: [
                                            {
                                                field: 'currencyPair',
                                                value: 'usd',
                                                operator: 'contains',
                                            },
                                        ],
                                    },
                                },
                            }} pagination pageSizeOptions={[2]}/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                    case 1:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([0]);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }))];
                    case 2:
                        _c.sent();
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', {
                            name: /select all rows/i,
                        });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 3:
                        _c.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.keys([0, 3, 4]);
                        expect(selectAllCheckbox.checked).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('prop: rowSelectionPropagation = { descendants: false, parents: false }', function () {
        function SelectionPropagationGrid(props) {
            return (<TreeDataGrid rowSelectionPropagation={{ descendants: false, parents: false }} {...props}/>);
        }
        it('should not auto select parents when controlling row selection model', function () {
            var onRowSelectionModelChange = (0, sinon_1.spy)();
            render(<SelectionPropagationGrid rowSelectionModel={(0, helperFn_1.includeRowSelection)([2, 3, 4, 5, 6, 7])} onRowSelectionModelChange={onRowSelectionModelChange}/>);
            expect(onRowSelectionModelChange.callCount).to.equal(0);
        });
        it('should select the parent only when selecting it', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid />).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([1]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should deselect the parent only when deselecting it', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 2:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([1, 2]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 3:
                        _c.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.keys([2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not auto select the parent if all the children are selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(3, 0).querySelector('input'))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(4, 0).querySelector('input'))];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(5, 0).querySelector('input'))];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(6, 0).querySelector('input'))];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(7, 0).querySelector('input'))];
                    case 6:
                        _b.sent();
                        // The parent row (Thomas, id: 1) should not be among the selected rows
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([2, 3, 4, 5, 6, 7]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not deselect selected parent if one of the children is deselected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(3, 0).querySelector('input'))];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(4, 0).querySelector('input'))];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(5, 0).querySelector('input'))];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(6, 0).querySelector('input'))];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(7, 0).querySelector('input'))];
                    case 7:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([1, 2, 3, 4, 5, 6, 7]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 8:
                        _c.sent();
                        // The parent row (Thomas, id: 1) should still be among the selected rows
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.keys([1, 3, 4, 5, 6, 7]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should select only the unwrapped rows when clicking "Select All" checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid />).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: /select all rows/i }))];
                    case 1:
                        _b.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([0, 1, 8]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should deselect only the unwrapped rows when clicking "Select All" checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid />).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: /select all rows/i }))];
                    case 1:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([0, 1, 8]);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: /select all rows/i }))];
                    case 2:
                        _c.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows().size).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not auto select the parent when all the children are selected using controlled row selection model', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, setProps;
            return __generator(this, function (_a) {
                onRowSelectionModelChange = (0, sinon_1.spy)();
                setProps = render(<SelectionPropagationGrid rowSelectionModel={(0, helperFn_1.includeRowSelection)([])} onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([2, 3, 4, 5, 6, 7]) });
                });
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                return [2 /*return*/];
            });
        }); });
        it('should not auto select descendants when a parent is selected using controlled row selection model', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, setProps;
            return __generator(this, function (_a) {
                onRowSelectionModelChange = (0, sinon_1.spy)();
                setProps = render(<SelectionPropagationGrid rowSelectionModel={(0, helperFn_1.includeRowSelection)([])} onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([1]) });
                });
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                return [2 /*return*/];
            });
        }); });
    });
    describe('prop: rowSelectionPropagation = { descendants: true, parents: false }', function () {
        function SelectionPropagationGrid(props) {
            return (<TreeDataGrid rowSelectionPropagation={{ descendants: true, parents: false }} {...props}/>);
        }
        it('should select all the children when selecting a parent', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid />).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([1, 2, 3, 4, 5, 6, 7]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should deselect all the children when deselecting a parent', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid />).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 1:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([1, 2, 3, 4, 5, 6, 7]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 2:
                        _c.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows().size).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not auto select the parent if all the children are selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(3, 0).querySelector('input'))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(4, 0).querySelector('input'))];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(5, 0).querySelector('input'))];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(6, 0).querySelector('input'))];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(7, 0).querySelector('input'))];
                    case 6:
                        _b.sent();
                        // The parent row (Thomas, id: 1) should not be among the selected rows
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([2, 3, 4, 5, 6, 7]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not deselect selected parent if one of the children is deselected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 1:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([1, 2, 3, 4, 5, 6, 7]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 2:
                        _c.sent();
                        // The parent row (Thomas, id: 1) should still be among the selected rows
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.keys([1, 3, 4, 5, 6, 7]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should select all the nested rows when clicking "Select All" checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid />).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: /select all rows/i }))];
                    case 1:
                        _b.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows().size).to.equal(15);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should deselect all the nested rows when clicking "Select All" checkbox', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid />).user;
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: /select all rows/i }))];
                    case 1:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows().size).to.equal(15);
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('checkbox', { name: /select all rows/i }))];
                    case 2:
                        _c.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows().size).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not auto select the parent when all the children are selected using controlled row selection model', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, setProps;
            return __generator(this, function (_a) {
                onRowSelectionModelChange = (0, sinon_1.spy)();
                setProps = render(<SelectionPropagationGrid rowSelectionModel={(0, helperFn_1.includeRowSelection)([])} onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([2, 3, 4, 5, 6, 7]) });
                });
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                return [2 /*return*/];
            });
        }); });
        it('should auto select descendants when a parent is selected using controlled row selection model', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, setProps;
            return __generator(this, function (_a) {
                onRowSelectionModelChange = (0, sinon_1.spy)();
                setProps = render(<SelectionPropagationGrid rowSelectionModel={(0, helperFn_1.includeRowSelection)([])} onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([1]) });
                });
                expect(onRowSelectionModelChange.callCount).to.equal(1);
                expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([1, 2, 3, 4, 5, 6, 7]));
                return [2 /*return*/];
            });
        }); });
        describe('prop: isRowSelectable', function () {
            it("should not select a parent or it's descendants if not allowed", function () {
                var _a;
                render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact" isRowSelectable={function (params) { return params.id !== 1; }}/>);
                internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(1, 0).querySelector('input'));
                expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows().size).to.equal(0);
            });
            it('should not auto-select a descendant if not allowed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact" isRowSelectable={function (params) { return params.id !== 2; }}/>).user;
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                        case 1:
                            _b.sent();
                            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([1, 3, 4, 5, 6, 7]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('prop: rowSelectionPropagation = { descendants: false, parents: true }', function () {
        function SelectionPropagationGrid(props) {
            return (<TreeDataGrid rowSelectionPropagation={{ descendants: false, parents: true }} {...props}/>);
        }
        it('should auto select parents when controlling row selection model', function () {
            var onRowSelectionModelChange = (0, sinon_1.spy)();
            render(<SelectionPropagationGrid rowSelectionModel={(0, helperFn_1.includeRowSelection)([2, 3, 4, 5, 6, 7])} onRowSelectionModelChange={onRowSelectionModelChange}/>);
            expect(onRowSelectionModelChange.callCount).to.equal(4);
            expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([2, 3, 4, 5, 6, 7, 1]));
        });
        it('should select the parent only when selecting it', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid />).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([1]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should deselect the parent only when deselecting it', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 2:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([1, 2]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 3:
                        _c.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.keys([2]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should auto select the parent if all the children are selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(3, 0).querySelector('input'))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(4, 0).querySelector('input'))];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(5, 0).querySelector('input'))];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(6, 0).querySelector('input'))];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(7, 0).querySelector('input'))];
                    case 6:
                        _b.sent();
                        // The parent row (Thomas, id: 1) should be among the selected rows
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([2, 3, 4, 5, 6, 7, 1]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should deselect selected parent if one of the children is deselected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(3, 0).querySelector('input'))];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(4, 0).querySelector('input'))];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(5, 0).querySelector('input'))];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(6, 0).querySelector('input'))];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(7, 0).querySelector('input'))];
                    case 6:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([2, 3, 4, 5, 6, 7, 1]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 7:
                        _c.sent();
                        // The parent row (Thomas, id: 1) should not be among the selected rows
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.keys([3, 4, 5, 6, 7]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should auto select the parent when all the children are selected using controlled row selection model', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, setProps;
            return __generator(this, function (_a) {
                onRowSelectionModelChange = (0, sinon_1.spy)();
                setProps = render(<SelectionPropagationGrid rowSelectionModel={(0, helperFn_1.includeRowSelection)([])} onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([2, 3, 4, 5, 6, 7]) });
                });
                expect(onRowSelectionModelChange.callCount).to.equal(1);
                expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([2, 3, 4, 5, 6, 7, 1]));
                return [2 /*return*/];
            });
        }); });
        it('should not auto select descendants when a parent is selected using controlled row selection model', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, setProps;
            return __generator(this, function (_a) {
                onRowSelectionModelChange = (0, sinon_1.spy)();
                setProps = render(<SelectionPropagationGrid rowSelectionModel={(0, helperFn_1.includeRowSelection)([])} onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([1]) });
                });
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                return [2 /*return*/];
            });
        }); });
        describe('prop: isRowSelectable', function () {
            it('should not auto select a parent if not allowed', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact" isRowSelectable={function (params) { return params.id !== 1; }}/>).user;
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                        case 1:
                            _b.sent();
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(3, 0).querySelector('input'))];
                        case 2:
                            _b.sent();
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(4, 0).querySelector('input'))];
                        case 3:
                            _b.sent();
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(5, 0).querySelector('input'))];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(6, 0).querySelector('input'))];
                        case 5:
                            _b.sent();
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(7, 0).querySelector('input'))];
                        case 6:
                            _b.sent();
                            // The parent row (Thomas, id: 1) should still not be among the selected rows
                            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([2, 3, 4, 5, 6, 7]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('prop: rowSelectionPropagation = { descendants: true, parents: true }', function () {
        function SelectionPropagationGrid(props) {
            return (<TreeDataGrid rowSelectionPropagation={{ descendants: true, parents: true }} {...props}/>);
        }
        it('should select all the children when selecting a parent', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid />).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([1, 2, 3, 4, 5, 6, 7]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should deselect all the children when deselecting a parent', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid />).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 1:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([1, 2, 3, 4, 5, 6, 7]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 2:
                        _c.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows().size).to.equal(0);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should auto select the parent if all the children are selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(9, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(11, 0).querySelector('input'))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(12, 0).querySelector('input'))];
                    case 3:
                        _b.sent();
                        // The parent row (Mary, id: 8) should be among the selected rows
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([9, 10, 11, 12, 8, 13, 14]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should deselect auto selected parent if one of the children is deselected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(9, 0).querySelector('input'))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(11, 0).querySelector('input'))];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(12, 0).querySelector('input'))];
                    case 3:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([9, 10, 11, 12, 8, 13, 14]);
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(9, 0).querySelector('input'))];
                    case 4:
                        _c.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows()).to.have.keys([11, 12, 13, 14]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should select all the children when selecting an indeterminate parent', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = render(<SelectionPropagationGrid defaultGroupingExpansionDepth={-1} density="compact"/>).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(2, 0).querySelector('input'))];
                    case 1:
                        _b.sent();
                        expect((0, helperFn_1.getCell)(1, 0).querySelector('input')).to.have.attr('data-indeterminate', 'true');
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                    case 2:
                        _b.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.keys([1, 2, 3, 4, 5, 6, 7]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should auto select the parent when all the children are selected using controlled row selection model', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, setProps;
            return __generator(this, function (_a) {
                onRowSelectionModelChange = (0, sinon_1.spy)();
                setProps = render(<SelectionPropagationGrid rowSelectionModel={(0, helperFn_1.includeRowSelection)([])} onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([2, 3, 4, 5, 6, 7]) });
                });
                expect(onRowSelectionModelChange.callCount).to.equal(1);
                expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([2, 3, 4, 5, 6, 7, 1]));
                return [2 /*return*/];
            });
        }); });
        it('should auto select descendants when a parent is selected using controlled row selection model', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, setProps;
            return __generator(this, function (_a) {
                onRowSelectionModelChange = (0, sinon_1.spy)();
                setProps = render(<SelectionPropagationGrid rowSelectionModel={(0, helperFn_1.includeRowSelection)([])} onRowSelectionModelChange={onRowSelectionModelChange}/>).setProps;
                expect(onRowSelectionModelChange.callCount).to.equal(0);
                (0, internal_test_utils_1.act)(function () {
                    setProps({ rowSelectionModel: (0, helperFn_1.includeRowSelection)([1]) });
                });
                expect(onRowSelectionModelChange.callCount).to.equal(1);
                expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([1, 2, 3, 4, 5, 6, 7]));
                return [2 /*return*/];
            });
        }); });
        describe('prop: keepNonExistentRowsSelected = true', function () {
            it('should keep non-existent rows selected on filtering', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<SelectionPropagationGrid keepNonExistentRowsSelected/>).user;
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0).querySelector('input'))];
                        case 1:
                            _a.sent();
                            expect((0, x_data_grid_pro_1.gridRowSelectionIdsSelector)(apiRef)).to.have.keys([1, 2, 3, 4, 5, 6, 7]);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setFilterModel({
                                            items: [
                                                {
                                                    field: 'jobTitle',
                                                    value: 'Head of Human Resources',
                                                    operator: 'equals',
                                                },
                                            ],
                                        });
                                        return [2 /*return*/];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(0, 0).querySelector('input'))];
                        case 3:
                            _a.sent();
                            expect((0, x_data_grid_pro_1.gridRowSelectionIdsSelector)(apiRef)).to.have.keys([0, 1, 2, 3, 4, 5, 6, 7]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not apply row selection propagation on filtered rows', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<SelectionPropagationGrid keepNonExistentRowsSelected defaultGroupingExpansionDepth={-1}/>).user;
                            return [4 /*yield*/, user.click((0, helperFn_1.getCell)(3, 0).querySelector('input'))];
                        case 1:
                            _a.sent();
                            expect((0, x_data_grid_pro_1.gridRowSelectionIdsSelector)(apiRef)).to.have.keys([3]);
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setFilterModel({
                                            items: [
                                                {
                                                    field: 'jobTitle',
                                                    value: 'a-value-that-does-not-exist',
                                                    operator: 'equals',
                                                },
                                            ],
                                        });
                                        return [2 /*return*/];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            expect((0, x_data_grid_pro_1.gridRowSelectionIdsSelector)(apiRef)).to.have.keys([3]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('apiRef: getSelectedRows', function () {
        it('should handle the event internally before triggering onRowSelectionModelChange', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        render(<TestDataGridSelection onRowSelectionModelChange={function (model) {
                                var _a;
                                expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.length(1);
                                expect(model).to.deep.equal((0, helperFn_1.includeRowSelection)([1]));
                            }}/>);
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getSelectedRows()).to.have.length(0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRow(1)];
                            }); }); })];
                    case 1:
                        _c.sent();
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getSelectedRows().get(1)).to.deep.equal({
                            id: 1,
                            currencyPair: 'USDEUR',
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('apiRef: isRowSelected', function () {
        it('should check if the rows selected by clicking on the rows are selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        user = render(<TestDataGridSelection />).user;
                        return [4 /*yield*/, user.click((0, helperFn_1.getCell)(1, 0))];
                    case 1:
                        _c.sent();
                        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.isRowSelected(0)).to.equal(false);
                        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.isRowSelected(1)).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should check if the rows selected with the rowSelectionModel prop are selected', function () {
            var _a, _b;
            render(<TestDataGridSelection rowSelectionModel={(0, helperFn_1.includeRowSelection)([1])}/>);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.isRowSelected(0)).to.equal(false);
            expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.isRowSelected(1)).to.equal(true);
        });
    });
    describe('apiRef: selectRow', function () {
        it('should call onRowSelectionModelChange with the ids selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleRowSelectionModelChange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handleRowSelectionModelChange = (0, sinon_1.spy)();
                        render(<TestDataGridSelection onRowSelectionModelChange={handleRowSelectionModelChange}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRow(1)];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([1]));
                        // Reset old selection
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRow(2, true, true)];
                            }); }); })];
                    case 2:
                        // Reset old selection
                        _a.sent();
                        expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([2]));
                        // Keep old selection
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRow(3)];
                            }); }); })];
                    case 3:
                        // Keep old selection
                        _a.sent();
                        expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([2, 3]));
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRow(3, false)];
                            }); }); })];
                    case 4:
                        _a.sent();
                        expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([2]));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not call onRowSelectionModelChange if the row is unselectable', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleRowSelectionModelChange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handleRowSelectionModelChange = (0, sinon_1.spy)();
                        render(<TestDataGridSelection isRowSelectable={function (params) { return Number(params.id) > 0; }} onRowSelectionModelChange={handleRowSelectionModelChange}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRow(0)];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(handleRowSelectionModelChange.callCount).to.equal(0);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRow(1)];
                            }); }); })];
                    case 2:
                        _a.sent();
                        expect(handleRowSelectionModelChange.callCount).to.equal(1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('apiRef: selectRows', function () {
        it('should call onRowSelectionModelChange with the ids selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleRowSelectionModelChange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handleRowSelectionModelChange = (0, sinon_1.spy)();
                        render(<TestDataGridSelection onRowSelectionModelChange={handleRowSelectionModelChange} rowSelectionPropagation={{ parents: false, descendants: false }}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRows([1, 2])];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([1, 2]));
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRows([3])];
                            }); }); })];
                    case 2:
                        _a.sent();
                        expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([1, 2, 3]));
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRows([1, 2], false)];
                            }); }); })];
                    case 3:
                        _a.sent();
                        expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([3]));
                        // Deselect others
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRows([4, 5], true, true)];
                            }); }); })];
                    case 4:
                        // Deselect others
                        _a.sent();
                        expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([4, 5]));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should filter out unselectable rows before calling onRowSelectionModelChange', function () { return __awaiter(void 0, void 0, void 0, function () {
            var handleRowSelectionModelChange;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        handleRowSelectionModelChange = (0, sinon_1.spy)();
                        render(<TestDataGridSelection isRowSelectable={function (params) { return Number(params.id) > 0; }} onRowSelectionModelChange={handleRowSelectionModelChange}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRows([0, 1, 2])];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(handleRowSelectionModelChange.lastCall.args[0]).to.deep.equal((0, helperFn_1.includeRowSelection)([1, 2]));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not select a range of several elements when disableMultipleRowSelection = true', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataGridSelection disableMultipleRowSelection/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRows([0, 1, 2], true)];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('apiRef: selectRowRange', function () {
        it('should select all the rows in the range', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataGridSelection />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRowRange({ startId: 1, endId: 3 }, true)];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1, 2, 3]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should unselect all the rows in the range', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataGridSelection />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowSelectionModel((0, helperFn_1.includeRowSelection)([2, 3]))];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([2, 3]);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRowRange({ startId: 0, endId: 3 }, false)];
                            }); }); })];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not unselect the selected elements if the range is to be selected', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataGridSelection />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowSelectionModel((0, helperFn_1.includeRowSelection)([2]));
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRowRange({ startId: 1, endId: 3 }, true);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1, 2, 3]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not reset the other selections when resetSelection = false', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataGridSelection />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowSelectionModel((0, helperFn_1.includeRowSelection)([0]));
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRowRange({ startId: 2, endId: 3 }, true, false);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 2, 3]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should reset the other selections when resetSelection = true', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataGridSelection />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowSelectionModel((0, helperFn_1.includeRowSelection)([0]));
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var _a;
                                return __generator(this, function (_b) {
                                    (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRowRange({ startId: 2, endId: 3 }, true, true);
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([2, 3]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not select unselectable rows inside the range', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataGridSelection isRowSelectable={function (params) { return Number(params.id) % 2 === 1; }}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRowRange({ startId: 1, endId: 3 }, true)];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([1, 3]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not select a range of several elements when disableMultipleRowSelection = true', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataGridSelection disableMultipleRowSelection/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRowRange({ startId: 1, endId: 3 }, true)];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([]);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should select only filtered rows selecting a range', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestDataGridSelection filterModel={{ items: [{ field: 'id', value: 1, operator: '!=' }] }}/>);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.selectRowRange({ startId: 0, endId: 2 }, true)];
                            }); }); })];
                    case 1:
                        _a.sent();
                        expect(getSelectedRowIds()).to.deep.equal([0, 2]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should select only filtered rows after filter is applied', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, selectAll;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<TestDataGridSelection checkboxSelection/>).user;
                    selectAll = internal_test_utils_1.screen.getByRole('checkbox', {
                        name: /select all rows/i,
                    });
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                return [2 /*return*/, (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setFilterModel({
                                        items: [
                                            {
                                                field: 'currencyPair',
                                                value: 'usd',
                                                operator: 'startsWith',
                                            },
                                        ],
                                    })];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['0', '1']);
                    return [4 /*yield*/, user.click(selectAll)];
                case 2:
                    _a.sent();
                    expect(getSelectedRowIds()).to.deep.equal([0, 1]);
                    return [4 /*yield*/, user.click(selectAll)];
                case 3:
                    _a.sent();
                    expect(getSelectedRowIds()).to.deep.equal([]);
                    return [4 /*yield*/, user.click(selectAll)];
                case 4:
                    _a.sent();
                    expect(getSelectedRowIds()).to.deep.equal([0, 1]);
                    return [4 /*yield*/, user.click(selectAll)];
                case 5:
                    _a.sent();
                    expect(getSelectedRowIds()).to.deep.equal([]);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('controlled selection', function () {
        it('should not publish "rowSelectionChange" if the selection state did not change ', function () {
            var _a, _b;
            var handleSelectionChange = (0, sinon_1.spy)();
            var rowSelectionModel = (0, helperFn_1.includeRowSelection)([]);
            render(<TestDataGridSelection rowSelectionModel={rowSelectionModel}/>);
            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('rowSelectionChange', handleSelectionChange);
            (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.setRowSelectionModel(rowSelectionModel);
            expect(handleSelectionChange.callCount).to.equal(0);
        });
        it('should not call onRowSelectionModelChange on initialization if rowSelectionModel contains more than one id and checkboxSelection=false', function () {
            var onRowSelectionModelChange = (0, sinon_1.spy)();
            render(<TestDataGridSelection onRowSelectionModelChange={onRowSelectionModelChange} rowSelectionModel={(0, helperFn_1.includeRowSelection)([0, 1])}/>);
            expect(onRowSelectionModelChange.callCount).to.equal(0);
        });
        it('should call onRowSelectionModelChange with the `exclude` set when select all checkbox is clicked and filters are empty', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onRowSelectionModelChange, user, selectAllCheckbox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onRowSelectionModelChange = (0, sinon_1.spy)();
                        user = render(<TestDataGridSelection checkboxSelection onRowSelectionModelChange={onRowSelectionModelChange} initialState={{
                                filter: {
                                    filterModel: {
                                        items: [],
                                        quickFilterValues: [''],
                                    },
                                },
                            }}/>).user;
                        selectAllCheckbox = internal_test_utils_1.screen.getByRole('checkbox', { name: 'Select all rows' });
                        return [4 /*yield*/, user.click(selectAllCheckbox)];
                    case 1:
                        _a.sent();
                        expect(onRowSelectionModelChange.lastCall.args[0]).to.deep.equal({
                            type: 'exclude',
                            ids: new Set(),
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
