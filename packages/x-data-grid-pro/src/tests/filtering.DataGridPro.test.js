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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var sinon_1 = require("sinon");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var helperFn_1 = require("test/utils/helperFn");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGridPro /> - Filter', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
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
        columns: [{ field: 'brand' }],
    };
    function TestCase(props) {
        var rows = props.rows, other = __rest(props, ["rows"]);
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...baselineProps} rows={rows || baselineProps.rows} disableColumnFilter={false} {...other}/>
      </div>);
    }
    var filterModel = {
        items: [
            {
                field: 'brand',
                value: 'a',
                operator: 'contains',
            },
        ],
    };
    describe('api method: `upsertFilterItems`', function () {
        it('should be able to add multiple filters', function () {
            render(<TestCase getRowId={function (row) { return row.brand; }}/>);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.upsertFilterItems([
                    {
                        field: 'brand',
                        value: 'i',
                        operator: 'contains',
                        id: 1,
                    },
                    {
                        field: 'brand',
                        value: 'as',
                        operator: 'contains',
                        id: 2,
                    },
                ]);
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
        });
        // See https://github.com/mui/mui-x/issues/11793
        it('should not remove filters which are not passed to `upsertFilterItems`', function () {
            render(<TestCase getRowId={function (row) { return row.brand; }}/>);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.upsertFilterItems([
                    {
                        field: 'brand',
                        value: 'i',
                        operator: 'contains',
                        id: 1,
                    },
                    {
                        field: 'brand',
                        value: 'as',
                        operator: 'contains',
                        id: 2,
                    },
                ]);
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.upsertFilterItems([
                    {
                        field: 'brand',
                        value: '',
                        operator: 'contains',
                        id: 2,
                    },
                ]);
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas']);
        });
    });
    it('slotProps `filterColumns` and `getColumnForNewFilter` should allow custom filtering', function () {
        var filterColumns = function (_a) {
            var field = _a.field, columns = _a.columns, currentFilters = _a.currentFilters;
            // remove already filtered fields from list of columns
            var filteredFields = currentFilters === null || currentFilters === void 0 ? void 0 : currentFilters.map(function (item) { return item.field; });
            return columns
                .filter(function (colDef) {
                return colDef.filterable && (colDef.field === field || !filteredFields.includes(colDef.field));
            })
                .map(function (column) { return column.field; });
        };
        var getColumnForNewFilter = function (_a) {
            var _b;
            var currentFilters = _a.currentFilters, columns = _a.columns;
            var filteredFields = currentFilters === null || currentFilters === void 0 ? void 0 : currentFilters.map(function (_a) {
                var field = _a.field;
                return field;
            });
            var columnForNewFilter = columns
                .filter(function (colDef) { return colDef.filterable && !filteredFields.includes(colDef.field); })
                .find(function (colDef) { var _a; return (_a = colDef.filterOperators) === null || _a === void 0 ? void 0 : _a.length; });
            return (_b = columnForNewFilter === null || columnForNewFilter === void 0 ? void 0 : columnForNewFilter.field) !== null && _b !== void 0 ? _b : null;
        };
        render(<TestCase initialState={{
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                },
            }} showToolbar slotProps={{
                filterPanel: {
                    filterFormProps: {
                        filterColumns: filterColumns,
                    },
                    getColumnForNewFilter: getColumnForNewFilter,
                },
            }}/>);
        var addButton = internal_test_utils_1.screen.getByRole('button', { name: /Add Filter/i });
        internal_test_utils_1.fireEvent.click(addButton);
        // Shouldn't allow adding multi-filters for same column
        // Since we have only one column, filter shouldn't be applied onClick
        var filterForms = document.querySelectorAll(".MuiDataGrid-filterForm");
        expect(filterForms).to.have.length(1);
    });
    it('should call `getColumnForNewFilter` when filters are added', function () {
        var getColumnForNewFilter = (0, sinon_1.spy)();
        render(<TestCase initialState={{
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                },
            }} showToolbar slotProps={{
                filterPanel: {
                    getColumnForNewFilter: getColumnForNewFilter,
                },
            }}/>);
        expect(getColumnForNewFilter.callCount).to.equal(2);
        var addButton = internal_test_utils_1.screen.getByRole('button', { name: /Add Filter/i });
        internal_test_utils_1.fireEvent.click(addButton);
        expect(getColumnForNewFilter.callCount).to.equal(4);
        internal_test_utils_1.fireEvent.click(addButton);
        expect(getColumnForNewFilter.callCount).to.equal(6);
    });
    it('should pass columns filtered by `filterColumns` to filters column list', function () {
        var filterColumns = function () { return ['testField']; };
        render(<TestCase initialState={{
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                },
            }} showToolbar slotProps={{
                filterPanel: {
                    filterFormProps: {
                        filterColumns: filterColumns,
                    },
                },
            }} columns={__spreadArray(__spreadArray([], baselineProps.columns, true), [{ field: 'testField' }], false)}/>);
        var select = internal_test_utils_1.screen.getByRole('combobox', { name: 'Columns' });
        internal_test_utils_1.fireEvent.mouseDown(select);
        var listbox = internal_test_utils_1.screen.getByRole('listbox', { name: 'Columns' });
        var availableColumns = (0, internal_test_utils_1.within)(listbox).getAllByRole('option');
        expect(availableColumns.length).to.equal(1);
    });
    it('should apply the filterModel prop correctly', function () {
        render(<TestCase filterModel={filterModel}/>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Puma']);
    });
    it('should not apply items that are incomplete with AND operator', function () {
        render(<TestCase filterModel={{
                items: [
                    {
                        id: 1,
                        field: 'brand',
                        value: 'a',
                        operator: 'contains',
                    },
                    {
                        id: 2,
                        field: 'brand',
                        operator: 'contains',
                    },
                ],
                logicOperator: x_data_grid_pro_1.GridLogicOperator.And,
            }}/>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Puma']);
    });
    it('should not apply items that are incomplete with OR operator', function () {
        render(<TestCase filterModel={{
                logicOperator: x_data_grid_pro_1.GridLogicOperator.Or,
                items: [
                    {
                        id: 1,
                        field: 'brand',
                        value: 'a',
                        operator: 'contains',
                    },
                    {
                        id: 2,
                        field: 'brand',
                        operator: 'contains',
                    },
                ],
            }}/>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Puma']);
    });
    it('should apply the filterModel prop correctly on GridApiRef setRows', function () {
        render(<TestCase filterModel={filterModel}/>);
        var newRows = [
            {
                id: 3,
                brand: 'Asics',
            },
            {
                id: 4,
                brand: 'RedBull',
            },
            {
                id: 5,
                brand: 'Hugo',
            },
        ];
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRows(newRows); });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Asics']);
    });
    it('should apply the filterModel prop correctly on GridApiRef update row data', function () {
        render(<TestCase filterModel={filterModel}/>);
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, brand: 'Fila' }]); });
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 0, brand: 'Patagonia' }]); });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Patagonia', 'Fila', 'Puma']);
    });
    it('should allow apiRef to setFilterModel', function () {
        render(<TestCase />);
        (0, internal_test_utils_1.act)(function () {
            var _a;
            return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setFilterModel({
                items: [
                    {
                        field: 'brand',
                        value: 'a',
                        operator: 'startsWith',
                    },
                ],
            });
        });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
    });
    it('should allow multiple filter and default to AND', function () {
        var newModel = {
            items: [
                {
                    id: 1,
                    field: 'brand',
                    value: 'a',
                    operator: 'contains',
                },
                {
                    id: 2,
                    field: 'brand',
                    value: 'm',
                    operator: 'contains',
                },
            ],
        };
        render(<TestCase filterModel={newModel}/>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Puma']);
    });
    it('should allow multiple filter via apiRef', function () {
        render(<TestCase />);
        var newModel = {
            items: [
                {
                    id: 1,
                    field: 'brand',
                    value: 'a',
                    operator: 'startsWith',
                },
                {
                    id: 2,
                    field: 'brand',
                    value: 's',
                    operator: 'endsWith',
                },
            ],
        };
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setFilterModel(newModel); });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
    });
    it('should work as expected with "Add filter" and "Remove all" buttons ', function () {
        var _a, _b, _c;
        render(<TestCase initialState={{
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                },
            }}/>);
        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.filter.filterModel.items).to.have.length(0);
        var addButton = internal_test_utils_1.screen.getByRole('button', { name: /Add Filter/i });
        var removeButton = internal_test_utils_1.screen.getByRole('button', { name: /Remove all/i });
        internal_test_utils_1.fireEvent.click(addButton);
        internal_test_utils_1.fireEvent.click(addButton);
        expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.state.filter.filterModel.items).to.have.length(3);
        internal_test_utils_1.fireEvent.click(removeButton);
        expect((_c = apiRef.current) === null || _c === void 0 ? void 0 : _c.state.filter.filterModel.items).to.have.length(0);
        // clicking on `remove all` should close the panel when no filters
        internal_test_utils_1.fireEvent.click(removeButton);
        expect(internal_test_utils_1.screen.queryByRole('button', { name: /Remove all/i })).to.equal(null);
    });
    it('should hide `Add filter` in filter panel when `disableAddFilterButton` is `true`', function () {
        render(<TestCase initialState={{
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                },
            }} slotProps={{
                filterPanel: {
                    disableAddFilterButton: true,
                },
            }}/>);
        expect(internal_test_utils_1.screen.queryByRole('button', { name: 'Add filter' })).to.equal(null);
        expect(internal_test_utils_1.screen.queryByRole('button', { name: 'Remove all' })).not.to.equal(null);
    });
    it('should hide `Remove all` in filter panel when `disableRemoveAllButton` is `true`', function () {
        render(<TestCase initialState={{
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                },
            }} slotProps={{
                filterPanel: {
                    disableRemoveAllButton: true,
                },
            }}/>);
        expect(internal_test_utils_1.screen.queryByRole('button', { name: 'Add filter' })).not.to.equal(null);
        expect(internal_test_utils_1.screen.queryByRole('button', { name: 'Remove all' })).to.equal(null);
    });
    it('should allow multiple filter and changing the logicOperator', function () {
        var newModel = {
            items: [
                {
                    id: 1,
                    field: 'brand',
                    value: 'a',
                    operator: 'startsWith',
                },
                {
                    id: 2,
                    field: 'brand',
                    value: 'a',
                    operator: 'endsWith',
                },
            ],
            logicOperator: x_data_grid_pro_1.GridLogicOperator.Or,
        };
        render(<TestCase filterModel={newModel}/>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Puma']);
    });
    it("should call onFilterModelChange with reason=changeLogicOperator when the logic operator changes but doesn't change the state", function () {
        var onFilterModelChange = (0, sinon_1.spy)();
        var newModel = {
            items: [
                {
                    id: 1,
                    field: 'brand',
                    value: 'a',
                    operator: 'startsWith',
                },
                {
                    id: 2,
                    field: 'brand',
                    value: 'a',
                    operator: 'endsWith',
                },
            ],
        };
        render(<TestCase filterModel={newModel} onFilterModelChange={onFilterModelChange} initialState={{
                preferencePanel: { openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters, open: true },
            }}/>);
        expect(onFilterModelChange.callCount).to.equal(0);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
        // The first combo is hidden and we include hidden elements to make the query faster
        // https://github.com/testing-library/dom-testing-library/issues/820#issuecomment-726936225
        var input = (0, helperFn_1.getSelectInput)(internal_test_utils_1.screen.queryAllByRole('combobox', { name: 'Logic operator', hidden: true })[0]);
        internal_test_utils_1.fireEvent.change(input, { target: { value: 'or' } });
        expect(onFilterModelChange.callCount).to.equal(1);
        expect(onFilterModelChange.lastCall.args[1].reason).to.equal('changeLogicOperator');
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
    });
    it('should call onFilterModelChange with reason=upsertFilterItem when the value is emptied', function () { return __awaiter(void 0, void 0, void 0, function () {
        var onFilterModelChange;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onFilterModelChange = (0, sinon_1.spy)();
                    render(<TestCase onFilterModelChange={onFilterModelChange} filterModel={{
                            items: [
                                {
                                    id: 1,
                                    field: 'brand',
                                    value: 'a',
                                    operator: 'contains',
                                },
                            ],
                        }} initialState={{
                            preferencePanel: { openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters, open: true },
                        }}/>);
                    expect(onFilterModelChange.callCount).to.equal(0);
                    internal_test_utils_1.fireEvent.change(internal_test_utils_1.screen.getByRole('textbox', { name: 'Value' }), { target: { value: '' } });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect(onFilterModelChange.callCount).to.equal(1);
                        })];
                case 1:
                    _a.sent();
                    expect(onFilterModelChange.lastCall.args[1].reason).to.equal('upsertFilterItem');
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call onFilterModelChange with reason=deleteFilterItem when a filter is removed', function () {
        var onFilterModelChange = (0, sinon_1.spy)();
        render(<TestCase onFilterModelChange={onFilterModelChange} filterModel={{
                items: [
                    {
                        id: 1,
                        field: 'brand',
                        value: 'a',
                        operator: 'contains',
                    },
                    {
                        id: 2,
                        field: 'brand',
                        value: 'a',
                        operator: 'endsWith',
                    },
                ],
            }} initialState={{
                preferencePanel: { openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters, open: true },
            }}/>);
        expect(onFilterModelChange.callCount).to.equal(0);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.queryAllByRole('button', { name: 'Delete' })[0]);
        expect(onFilterModelChange.callCount).to.equal(1);
        expect(onFilterModelChange.lastCall.args[1].reason).to.equal('deleteFilterItem');
    });
    it('should call onFilterModelChange with reason=upsertFilterItems when a filter is added', function () {
        var onFilterModelChange = (0, sinon_1.spy)();
        render(<TestCase onFilterModelChange={onFilterModelChange} filterModel={{
                items: [{ id: 1, field: 'brand', value: 'a', operator: 'contains' }],
            }} initialState={{
                preferencePanel: { openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters, open: true },
            }}/>);
        expect(onFilterModelChange.callCount).to.equal(0);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Add filter' }));
        expect(onFilterModelChange.callCount).to.equal(1);
        expect(onFilterModelChange.lastCall.args[1].reason).to.equal('upsertFilterItems');
    });
    it('should publish filterModelChange with the reason whenever the model changes', function () {
        var _a;
        var listener = (0, sinon_1.spy)();
        render(<TestCase initialState={{
                preferencePanel: { openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters, open: true },
            }}/>);
        (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('filterModelChange', listener);
        expect(listener.callCount).to.equal(0);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Add filter' }));
        expect(listener.callCount).to.equal(1);
        expect(listener.lastCall.args[1].reason).to.equal('upsertFilterItems');
    });
    it('should only select visible rows', function () {
        var _a;
        var newModel = {
            items: [
                {
                    field: 'brand',
                    value: 'a',
                    operator: 'startsWith',
                },
            ],
            logicOperator: x_data_grid_pro_1.GridLogicOperator.Or,
        };
        render(<TestCase checkboxSelection filterModel={newModel}/>);
        var checkAllCell = (0, helperFn_1.getColumnHeaderCell)(0).querySelector('input');
        internal_test_utils_1.fireEvent.click(checkAllCell);
        expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rowSelection).to.deep.equal((0, helperFn_1.includeRowSelection)([1]));
    });
    it('should allow to clear filters by passing an empty filter model', function () {
        var newModel = {
            items: [
                {
                    field: 'brand',
                    value: 'a',
                    operator: 'startsWith',
                },
            ],
        };
        var setProps = render(<TestCase filterModel={newModel}/>).setProps;
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
        setProps({ filterModel: { items: [] } });
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
    });
    it('should show the latest expandedRows', function () { return __awaiter(void 0, void 0, void 0, function () {
        var input;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<TestCase initialState={{
                            preferencePanel: {
                                open: true,
                                openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                            },
                        }}/>);
                    input = internal_test_utils_1.screen.getByPlaceholderText('Filter value');
                    internal_test_utils_1.fireEvent.change(input, { target: { value: 'ad' } });
                    return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
                        })];
                case 1:
                    _a.sent();
                    expect((0, x_data_grid_pro_1.gridExpandedSortedRowEntriesSelector)(apiRef).length).to.equal(1);
                    expect((0, x_data_grid_pro_1.gridExpandedSortedRowEntriesSelector)(apiRef)[0].model).to.deep.equal({
                        id: 1,
                        brand: 'Adidas',
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should not scroll the page when a filter is removed from the panel', function () {
        render(<div>
        {/* To simulate a page that needs to be scrolled to reach the grid. */}
        <div style={{ height: '100vh', width: '100vh' }}/>
        <TestCase initialState={{
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                },
                filter: {
                    filterModel: {
                        logicOperator: x_data_grid_pro_1.GridLogicOperator.Or,
                        items: [
                            { id: 1, field: 'brand', value: 'a', operator: 'contains' },
                            { id: 2, field: 'brand', value: 'm', operator: 'contains' },
                        ],
                    },
                },
            }}/>
      </div>);
        (0, helperFn_1.grid)('root').scrollIntoView();
        var initialScrollPosition = window.scrollY;
        expect(initialScrollPosition).not.to.equal(0);
        internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getAllByRole('button', { name: /delete/i })[1]);
        expect(window.scrollY).to.equal(initialScrollPosition);
    });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should not scroll the page when opening the filter panel and the operator=isAnyOf', function () {
        render(<div>
          {/* To simulate a page that needs to be scrolled to reach the grid. */}
          <div style={{ height: '100vh', width: '100vh' }}/>
          <TestCase initialState={{
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                },
                filter: {
                    filterModel: {
                        logicOperator: x_data_grid_pro_1.GridLogicOperator.Or,
                        items: [{ id: 1, field: 'brand', operator: 'isAnyOf' }],
                    },
                },
            }}/>
        </div>);
        (0, helperFn_1.grid)('root').scrollIntoView();
        var initialScrollPosition = window.scrollY;
        expect(initialScrollPosition).not.to.equal(0);
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.hidePreferences(); });
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showPreferences(x_data_grid_pro_1.GridPreferencePanelsValue.filters); });
        expect(window.scrollY).to.equal(initialScrollPosition);
    });
    describe('Server', function () {
        it('should refresh the filter panel when adding filters', function () { return __awaiter(void 0, void 0, void 0, function () {
            function loadServerRows(commodityFilterValue) {
                var serverRows = [
                    { id: '1', commodity: 'rice' },
                    { id: '2', commodity: 'soybeans' },
                    { id: '3', commodity: 'milk' },
                    { id: '4', commodity: 'wheat' },
                    { id: '5', commodity: 'oats' },
                ];
                return new Promise(function (resolve) {
                    if (!commodityFilterValue) {
                        resolve(serverRows);
                        return;
                    }
                    resolve(serverRows.filter(function (row) { return row.commodity.toLowerCase().indexOf(commodityFilterValue) > -1; }));
                });
            }
            function AddServerFilterGrid() {
                var _this = this;
                var _a = React.useState([]), rows = _a[0], setRows = _a[1];
                var _b = React.useState(), filterValue = _b[0], setFilterValue = _b[1];
                var handleFilterChange = React.useCallback(function (newFilterModel) {
                    setFilterValue(newFilterModel.items[0].value);
                }, []);
                React.useEffect(function () {
                    var active = true;
                    (function () { return __awaiter(_this, void 0, void 0, function () {
                        var newRows;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, loadServerRows(filterValue)];
                                case 1:
                                    newRows = _a.sent();
                                    if (!active) {
                                        return [2 /*return*/];
                                    }
                                    setRows(newRows);
                                    return [2 /*return*/];
                            }
                        });
                    }); })();
                    return function () {
                        active = false;
                    };
                }, [filterValue]);
                return (<div style={{ height: 400, width: 400 }}>
            <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} filterMode="server" onFilterModelChange={handleFilterChange} initialState={{
                        preferencePanel: {
                            open: true,
                            openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                        },
                    }}/>
          </div>);
            }
            var columns, addButton, filterForms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        columns = [{ field: 'commodity', width: 150 }];
                        render(<AddServerFilterGrid />);
                        return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return Promise.resolve(); })];
                    case 1:
                        _a.sent(); // Wait for the server to send rows
                        addButton = internal_test_utils_1.screen.getByRole('button', { name: /Add Filter/i });
                        internal_test_utils_1.fireEvent.click(addButton);
                        filterForms = document.querySelectorAll(".MuiDataGrid-filterForm");
                        expect(filterForms).to.have.length(2);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('should display the number of results in the footer', function () {
        var setProps = render(<TestCase />).setProps;
        expect(internal_test_utils_1.screen.getByText('Total Rows: 3')).not.to.equal(null);
        setProps({ filterModel: filterModel });
        expect(internal_test_utils_1.screen.getByText('Total Rows: 2 of 3')).not.to.equal(null);
    });
    describe('control Filter', function () {
        it('should update the filter state when neither the model nor the onChange are set', function () {
            render(<TestCase initialState={{
                    preferencePanel: {
                        open: true,
                        openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                    },
                }}/>);
            var addButton = internal_test_utils_1.screen.getByRole('button', { name: /Add Filter/i });
            internal_test_utils_1.fireEvent.click(addButton);
            var filterForms = document.querySelectorAll(".MuiDataGrid-filterForm");
            expect(filterForms).to.have.length(2);
        });
        it('should not update the filter state when the filterModelProp is set', function () {
            var _a;
            var testFilterModel = { items: [], logicOperator: x_data_grid_pro_1.GridLogicOperator.Or };
            render(<TestCase filterModel={testFilterModel} initialState={{
                    preferencePanel: {
                        open: true,
                        openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                    },
                }}/>);
            var addButton = internal_test_utils_1.screen.getByRole('button', { name: /Add Filter/i });
            internal_test_utils_1.fireEvent.click(addButton);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.filter.filterModel.items).to.have.length(0);
        });
        it('should update the filter state when the model is not set, but the onChange is set', function () {
            var onModelChange = (0, sinon_1.spy)();
            render(<TestCase onFilterModelChange={onModelChange} initialState={{
                    preferencePanel: {
                        open: true,
                        openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                    },
                }}/>);
            expect(onModelChange.callCount).to.equal(0);
            var addButton = internal_test_utils_1.screen.getByRole('button', { name: /Add Filter/i });
            internal_test_utils_1.fireEvent.click(addButton);
            var filterForms = document.querySelectorAll(".MuiDataGrid-filterForm");
            expect(filterForms).to.have.length(2);
            expect(onModelChange.callCount).to.equal(1);
            expect(onModelChange.lastCall.firstArg.items.length).to.deep.equal(2);
            expect(onModelChange.lastCall.firstArg.logicOperator).to.deep.equal(x_data_grid_pro_1.GridLogicOperator.And);
        });
        it('should control filter state when the model and the onChange are set', function () {
            function ControlCase(props) {
                var rows = props.rows, columns = props.columns, others = __rest(props, ["rows", "columns"]);
                var _a = React.useState(x_data_grid_pro_1.getDefaultGridFilterModel), caseFilterModel = _a[0], setFilterModel = _a[1];
                var handleFilterChange = function (newModel) {
                    setFilterModel(newModel);
                };
                return (<div style={{ width: 300, height: 300 }}>
            <x_data_grid_pro_1.DataGridPro autoHeight={skipIf_1.isJSDOM} columns={columns || baselineProps.columns} rows={rows || baselineProps.rows} filterModel={caseFilterModel} onFilterModelChange={handleFilterChange} initialState={{
                        preferencePanel: {
                            open: true,
                            openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                        },
                    }} {...others}/>
          </div>);
            }
            render(<ControlCase />);
            var addButton = internal_test_utils_1.screen.getByRole('button', { name: /Add Filter/i });
            internal_test_utils_1.fireEvent.click(addButton);
            var filterForms = document.querySelectorAll(".MuiDataGrid-filterForm");
            expect(filterForms).to.have.length(2);
        });
    });
    // It's not re-rendering the filter panel correctly
    it.skipIf(skipIf_1.isJSDOM)('should give a stable ID to the filter item used as placeholder', function () {
        var rerender = render(<TestCase showToolbar/>).rerender;
        var filtersButton = internal_test_utils_1.screen.getByRole('button', { name: /Filters/i });
        internal_test_utils_1.fireEvent.click(filtersButton);
        var filterForm = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses.filterForm));
        var oldId = filterForm.dataset.id;
        rerender(<TestCase showToolbar rows={[{ id: 0, brand: 'ADIDAS' }]}/>);
        filterForm = document.querySelector(".".concat(x_data_grid_pro_1.gridClasses.filterForm));
        var newId = filterForm.dataset.id;
        expect(oldId).to.equal(newId);
    });
    describe('Header filters', function () {
        it('should reflect the `filterModel` prop in header filters correctly', function () {
            render(<TestCase filterModel={filterModel} headerFilters/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Puma']);
            var filterCellInput = (0, helperFn_1.getColumnHeaderCell)(0, 1).querySelector('input');
            expect(filterCellInput).to.have.value('a');
        });
        it('should apply filters on type when the focus is on cell', function () { return __awaiter(void 0, void 0, void 0, function () {
            var filterCell, filterCellInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(<TestCase headerFilters/>);
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
                        filterCell = (0, helperFn_1.getColumnHeaderCell)(0, 1);
                        filterCellInput = filterCell.querySelector('input');
                        expect(filterCellInput).not.toHaveFocus();
                        internal_test_utils_1.fireEvent.mouseDown(filterCellInput);
                        expect(filterCellInput).toHaveFocus();
                        internal_test_utils_1.fireEvent.change(filterCellInput, { target: { value: 'ad' } });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas']);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call `onFilterModelChange` when filters are updated', function () { return __awaiter(void 0, void 0, void 0, function () {
            var onFilterModelChange, filterCell, filterCellInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        onFilterModelChange = (0, sinon_1.spy)();
                        render(<TestCase onFilterModelChange={onFilterModelChange} headerFilters/>);
                        filterCell = (0, helperFn_1.getColumnHeaderCell)(0, 1);
                        filterCellInput = filterCell.querySelector('input');
                        internal_test_utils_1.fireEvent.click(filterCell);
                        internal_test_utils_1.fireEvent.change(filterCellInput, { target: { value: 'ad' } });
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                expect(onFilterModelChange.callCount).to.equal(1);
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to change the operator from operator menu', function () {
            var onFilterModelChange = (0, sinon_1.spy)();
            render(<TestCase initialState={{
                    filter: {
                        filterModel: {
                            items: [
                                {
                                    field: 'brand',
                                    operator: 'contains',
                                    value: 'a',
                                },
                            ],
                        },
                    },
                }} onFilterModelChange={onFilterModelChange} headerFilters/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Puma']);
            var filterCell = (0, helperFn_1.getColumnHeaderCell)(0, 1);
            internal_test_utils_1.fireEvent.click(filterCell);
            internal_test_utils_1.fireEvent.click((0, internal_test_utils_1.within)(filterCell).getByLabelText('Operator'));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Equals' }));
            expect(onFilterModelChange.callCount).to.equal(1);
            expect(onFilterModelChange.lastCall.firstArg.items[0].operator).to.equal('equals');
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([]);
        });
        it('should allow to clear the filter from operator menu', function () {
            render(<TestCase initialState={{
                    filter: {
                        filterModel: {
                            items: [
                                {
                                    field: 'brand',
                                    operator: 'contains',
                                    value: 'a',
                                },
                            ],
                        },
                    },
                }} headerFilters/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Puma']);
            var filterCell = (0, helperFn_1.getColumnHeaderCell)(0, 1);
            internal_test_utils_1.fireEvent.click(filterCell);
            internal_test_utils_1.fireEvent.click((0, internal_test_utils_1.within)(filterCell).getByLabelText('Operator'));
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Clear filter' }));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        });
        it('should allow to clear the filter with clear button', function () {
            render(<TestCase initialState={{
                    filter: {
                        filterModel: {
                            items: [
                                {
                                    field: 'brand',
                                    operator: 'contains',
                                    value: 'a',
                                },
                            ],
                        },
                    },
                }} headerFilters slotProps={{
                    headerFilterCell: {
                        showClearIcon: true,
                    },
                }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Adidas', 'Puma']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: 'Clear filter' }));
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Nike', 'Adidas', 'Puma']);
        });
        it('should allow to customize header filter cell using `renderHeaderFilter`', function () {
            render(<TestCase columns={[
                    { field: 'brand', headerName: 'Brand', renderHeaderFilter: function () { return 'Custom Filter Cell'; } },
                ]} headerFilters/>);
            expect((0, helperFn_1.getColumnHeaderCell)(0, 1).textContent).to.equal('Custom Filter Cell');
        });
        it('should allow to customize header filter cell using `filterOperators`', function () {
            render(<TestCase columns={[
                    {
                        field: 'brand',
                        headerName: 'Brand',
                        filterOperators: [
                            {
                                value: 'contains',
                                getApplyFilterFn: function () { return function () { return true; }; },
                                InputComponent: function () { return <div>Custom Input</div>; },
                            },
                        ],
                    },
                ]} headerFilters/>);
            expect((0, helperFn_1.getColumnHeaderCell)(0, 1).textContent).to.equal('Custom Input');
        });
        it('should not cause unexpected behavior when props are explictly set to undefined', function () {
            expect(function () {
                render(<TestCase columns={[
                        {
                            field: 'actions',
                            headerName: 'Actions',
                            type: 'actions',
                            width: 80,
                            filterOperators: undefined,
                            getActions: function () { return [<React.Fragment>action</React.Fragment>]; },
                        },
                    ]} headerFilters/>);
            }).not.toErrorDev();
        });
        // See https://github.com/mui/mui-x/issues/13217
        it('should not throw when custom filter operator is used with an initilaized value', function () {
            expect(function () {
                render(<TestCase columns={[
                        {
                            field: 'brand',
                            headerName: 'Brand',
                            filterOperators: __spreadArray(__spreadArray([], (0, x_data_grid_pro_1.getGridStringOperators)(), true), [
                                {
                                    value: 'looksLike',
                                    label: 'Looks Like',
                                    headerLabel: 'Looks Like',
                                    getApplyFilterFn: function () { return function () { return true; }; },
                                    InputComponent: function () { return <div>Custom Input</div>; },
                                },
                            ], false),
                        },
                    ]} initialState={{
                        filter: {
                            filterModel: {
                                items: [
                                    {
                                        field: 'brand',
                                        operator: 'looksLike',
                                        value: 'a',
                                    },
                                ],
                            },
                        },
                    }} headerFilters/>);
            }).not.toErrorDev();
        });
        it('should work correctly with boolean column type', function () {
            var getRows = function (item) {
                var unmount = render(<TestCase filterModel={{
                        items: [__assign({ field: 'isPublished' }, item)],
                    }} rows={[
                        {
                            id: 0,
                            isPublished: undefined,
                        },
                        {
                            id: 1,
                            isPublished: null,
                        },
                        {
                            id: 2,
                            isPublished: true,
                        },
                        {
                            id: 3,
                            isPublished: false,
                        },
                    ]} columns={[
                        {
                            field: 'isPublished',
                            type: 'boolean',
                            // The boolean cell does not handle the formatted value, so we override it
                            renderCell: function (params) {
                                var value = params.value;
                                if (value === null) {
                                    return 'null';
                                }
                                if (value === undefined) {
                                    return 'undefined';
                                }
                                return value.toString();
                            },
                        },
                    ]} headerFilters/>).unmount;
                var values = (0, helperFn_1.getColumnValues)(0);
                unmount();
                return values;
            };
            var ALL_ROWS = ['undefined', 'null', 'true', 'false'];
            var TRUTHY_ROWS = ['true'];
            var FALSY_ROWS = ['undefined', 'null', 'false'];
            expect(getRows({ operator: 'is', value: 'true' })).to.deep.equal(TRUTHY_ROWS);
            expect(getRows({ operator: 'is', value: true })).to.deep.equal(TRUTHY_ROWS);
            expect(getRows({ operator: 'is', value: 'false' })).to.deep.equal(FALSY_ROWS);
            expect(getRows({ operator: 'is', value: false })).to.deep.equal(FALSY_ROWS);
            expect(getRows({ operator: 'is', value: '' })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'is', value: undefined })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'is', value: null })).to.deep.equal(ALL_ROWS);
            expect(getRows({ operator: 'is', value: 'test' })).to.deep.equal(ALL_ROWS); // Ignores invalid values
        });
        it('should allow temporary invalid values while updating the number filter', function () { return __awaiter(void 0, void 0, void 0, function () {
            var changeSpy, user, filterCell, input;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        changeSpy = (0, sinon_1.spy)();
                        user = render(<TestCase rows={[
                                { id: 1, amount: -10 },
                                { id: 2, amount: 10 },
                                { id: 3, amount: 100 },
                                { id: 4, amount: 1000 },
                            ]} columns={[{ field: 'amount', type: 'number' }]} headerFilters onFilterModelChange={changeSpy}/>).user;
                        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['-10', '10', '100', '1,000']);
                        filterCell = (0, helperFn_1.getColumnHeaderCell)(0, 1);
                        return [4 /*yield*/, user.click((0, internal_test_utils_1.within)(filterCell).getByLabelText('Operator'))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('menuitem', { name: 'Greater than' }))];
                    case 2:
                        _a.sent();
                        input = (0, internal_test_utils_1.within)(filterCell).getByLabelText('Greater than');
                        return [4 /*yield*/, user.click(input)];
                    case 3:
                        _a.sent();
                        expect(input).toHaveFocus();
                        return [4 /*yield*/, user.keyboard('0')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '100', '1,000']); })];
                    case 5:
                        _a.sent();
                        expect(changeSpy.lastCall.args[0].items[0].value).to.equal(0);
                        return [4 /*yield*/, user.keyboard('.')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '100', '1,000']); })];
                    case 7:
                        _a.sent();
                        expect(changeSpy.lastCall.args[0].items[0].value).to.equal(0); // 0.
                        return [4 /*yield*/, user.keyboard('1')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['10', '100', '1,000']); })];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect(changeSpy.lastCall.args[0].items[0].value).to.equal(0.1); })];
                    case 10:
                        _a.sent(); // 0.1
                        return [4 /*yield*/, user.keyboard('e')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['-10', '10', '100', '1,000']); })];
                    case 12:
                        _a.sent();
                        expect(changeSpy.lastCall.args[0].items[0].value).to.equal(undefined); // 0.1e
                        return [4 /*yield*/, user.keyboard('2')];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () { return expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['100', '1,000']); })];
                    case 14:
                        _a.sent();
                        expect(changeSpy.lastCall.args[0].items[0].value).to.equal(10); // 0.1e2
                        return [2 /*return*/];
                }
            });
        }); });
        it('should allow to navigate to the header filter cell when there are no rows', function () { return __awaiter(void 0, void 0, void 0, function () {
            var user, headerCell, filterCell;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = render(<TestCase headerFilters initialState={{
                                filter: {
                                    filterModel: {
                                        items: [
                                            {
                                                field: 'brand',
                                                operator: 'contains',
                                                value: 'abc',
                                            },
                                        ],
                                    },
                                },
                            }}/>).user;
                        headerCell = (0, helperFn_1.getColumnHeaderCell)(0, 0);
                        filterCell = (0, helperFn_1.getColumnHeaderCell)(0, 1);
                        return [4 /*yield*/, user.click(headerCell)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user.keyboard('{ArrowDown}')];
                    case 2:
                        _a.sent();
                        expect(filterCell).toHaveFocus();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Read-only filters', function () {
        var columns = [
            {
                field: 'id',
                type: 'number',
                filterable: false,
            },
            {
                field: 'brand',
            },
        ];
        it('should allow multiple filters for `filterable: false` columns', function () {
            var newModel = {
                items: [
                    {
                        id: 1,
                        field: 'id',
                        value: 0,
                        operator: '>',
                    },
                    {
                        id: 2,
                        field: 'id',
                        operator: 'isNotEmpty',
                    },
                    {
                        id: 3,
                        field: 'brand',
                        value: 'm',
                        operator: 'contains',
                    },
                ],
            };
            render(<TestCase filterModel={newModel} columns={columns}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['2']);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['Puma']);
        });
        it('should allow updating logic operator even from read-only filters', function () {
            var newModel = {
                items: [
                    {
                        id: 1,
                        field: 'id',
                        value: 0,
                        operator: '>',
                    },
                    {
                        id: 2,
                        field: 'id',
                        operator: 'isNotEmpty',
                    },
                ],
            };
            var initialState = {
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                },
            };
            render(<TestCase initialState={initialState} filterModel={newModel} columns={columns}/>);
            var select = internal_test_utils_1.screen.getAllByRole('combobox', { name: 'Logic operator' })[0];
            expect(select).not.to.have.class('Mui-disabled');
        });
        it('should disable `Remove all` button for only read-only filters', function () {
            var newModel = {
                items: [
                    {
                        id: 1,
                        field: 'id',
                        value: 0,
                        operator: '>',
                    },
                ],
            };
            var initialState = {
                preferencePanel: {
                    open: true,
                    openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
                },
            };
            var setProps = render(<TestCase initialState={initialState} columns={columns}/>).setProps;
            expect(internal_test_utils_1.screen.queryByRole('button', { name: /Remove all/i })).not.to.equal(null);
            setProps({ filterModel: newModel });
            expect(internal_test_utils_1.screen.queryByRole('button', { name: /Remove all/i })).to.equal(null);
        });
    });
});
