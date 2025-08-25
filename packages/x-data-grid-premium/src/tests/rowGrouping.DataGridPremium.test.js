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
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var sinon_1 = require("sinon");
var skipIf_1 = require("test/utils/skipIf");
var rows = [
    { id: 0, category1: 'Cat A', category2: 'Cat 1' },
    { id: 1, category1: 'Cat A', category2: 'Cat 2' },
    { id: 2, category1: 'Cat A', category2: 'Cat 2' },
    { id: 3, category1: 'Cat B', category2: 'Cat 2' },
    { id: 4, category1: 'Cat B', category2: 'Cat 1' },
];
var unbalancedRows = [
    { id: 0, category1: 'Cat A' },
    { id: 1, category1: 'Cat A' },
    { id: 2, category1: 'Cat B' },
    { id: 3, category1: 'Cat B' },
    { id: 4, category1: null },
    { id: 5, category1: null },
];
var baselineProps = {
    autoHeight: skipIf_1.isJSDOM,
    disableVirtualization: true,
    rows: rows,
    columns: [
        {
            field: 'id',
            type: 'number',
        },
        {
            field: 'category1',
        },
        {
            field: 'category2',
        },
    ],
};
describe('<DataGridPremium /> - Row grouping', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function Test(props) {
        apiRef = (0, x_data_grid_premium_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_premium_1.DataGridPremium {...baselineProps} apiRef={apiRef} {...props}/>
      </div>);
    }
    describe('Setting grouping criteria', function () {
        describe('initialState: rowGrouping.model', function () {
            it('should allow to initialize the row grouping', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
            });
            it('should not react to initial state updates', function () {
                var setProps = render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} defaultGroupingExpansionDepth={-1}/>).setProps;
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
                setProps({ initialState: { rowGrouping: { model: ['category2'] } } });
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
            });
        });
        describe('prop: rowGroupingModel', function () {
            it('should not call onRowGroupingModelChange on initialisation or on rowGroupingModel prop change', function () {
                var onRowGroupingModelChange = (0, sinon_1.spy)();
                var setProps = render(<Test rowGroupingModel={['category1']} onRowGroupingModelChange={onRowGroupingModelChange}/>).setProps;
                expect(onRowGroupingModelChange.callCount).to.equal(0);
                setProps({ rowGroupingModel: ['category2'] });
                expect(onRowGroupingModelChange.callCount).to.equal(0);
            });
            it('should allow to update the row grouping model from the outside', function () {
                var setProps = render(<Test rowGroupingModel={['category1']} defaultGroupingExpansionDepth={-1}/>).setProps;
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
                setProps({ rowGroupingModel: ['category2'] });
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat 1 (2)', '', '', 'Cat 2 (3)', '', '', '']);
                setProps({ rowGroupingModel: ['category1', 'category2'] });
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    'Cat 1 (1)',
                    '',
                    'Cat 2 (2)',
                    '',
                    '',
                    'Cat B (2)',
                    'Cat 2 (1)',
                    '',
                    'Cat 1 (1)',
                    '',
                ]);
            });
        });
        it('should ignore grouping criteria that do not match any column', function () {
            render(<Test initialState={{ rowGrouping: { model: ['category1', 'category3'] } }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (3)', '', '', '', 'Cat B (2)', '', '']);
        });
        it('should display the value from the `valueOptions` for `singleSelect` column type', function () {
            render(<Test columns={[
                    {
                        field: 'category',
                        type: 'singleSelect',
                        valueOptions: [
                            { value: 'category1', label: 'categoryLabel1' },
                            { value: 'category2', label: 'categoryLabel2' },
                        ],
                    },
                ]} rows={[
                    { id: 1, category: 'category1' },
                    { id: 2, category: 'category1' },
                    { id: 3, category: 'category1' },
                    { id: 4, category: 'category2' },
                    { id: 5, category: 'category2' },
                ]} initialState={{ rowGrouping: { model: ['category'] } }}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['categoryLabel1 (3)', 'categoryLabel2 (2)']);
        });
        it('should display icon on auto-generated row', function () {
            var _a;
            render(<Test initialState={{
                    rowGrouping: {
                        model: ['isFilled'],
                    },
                }} columns={__spreadArray(__spreadArray([], baselineProps.columns, true), [{ field: 'isFilled', type: 'boolean' }], false)} rows={(_a = baselineProps.rows) === null || _a === void 0 ? void 0 : _a.map(function (row) { return (__assign(__assign({}, row), { isFilled: false })); })}/>);
            expect(internal_test_utils_1.screen.getByTestId('CloseIcon')).toBeVisible();
        });
        it('should respect the grouping criteria with colDef.groupable = false', function () {
            render(<Test columns={[
                    {
                        field: 'id',
                        type: 'number',
                    },
                    {
                        field: 'category1',
                    },
                    {
                        field: 'category2',
                        groupable: false,
                    },
                ]} initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                'Cat 1 (1)',
                '',
                'Cat 2 (2)',
                '',
                '',
                'Cat B (2)',
                'Cat 2 (1)',
                '',
                'Cat 1 (1)',
                '',
            ]);
        });
        it('should allow to use several time the same grouping criteria', function () {
            render(<Test initialState={{ rowGrouping: { model: ['category1', 'category1'] } }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'Cat A (3)',
                'Cat A (3)',
                '',
                '',
                '',
                'Cat B (2)',
                'Cat B (2)',
                '',
                '',
            ]);
        });
    });
    describe('colDef: groupingValueGetter & valueGetter', function () {
        it('should use groupingValueGetter to group rows when defined', function () {
            render(<Test columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'category1',
                        groupingValueGetter: function (value) { return "groupingValue ".concat(value); },
                    },
                ]} initialState={{ rowGrouping: { model: ['category1'] } }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'groupingValue Cat A (3)',
                '',
                '',
                '',
                'groupingValue Cat B (2)',
                '',
                '',
            ]);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '0', '1', '2', '', '3', '4']);
        });
        it('should react to groupingValueGetter update', function () {
            render(<Test columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'modulo',
                        groupingValueGetter: function (value, row) { return row.id % 2; },
                    },
                ]} initialState={{ rowGrouping: { model: ['modulo'] } }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0 (3)', '', '', '', '1 (2)', '', '']);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '0', '2', '4', '', '1', '3']);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateColumns([
                    {
                        field: 'modulo',
                        groupingValueGetter: function (value, row) { return row.id % 3; },
                    },
                ]);
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['0 (2)', '', '', '1 (2)', '', '', '2 (1)', '']);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '0', '3', '', '1', '4', '', '2']);
        });
        it('should use valueGetter to group the rows when defined', function () {
            render(<Test columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'category1',
                        valueGetter: function (value, row) { return "value ".concat(row.category1); },
                    },
                ]} initialState={{ rowGrouping: { model: ['category1'] } }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'value Cat A (3)',
                '',
                '',
                '',
                'value Cat B (2)',
                '',
                '',
            ]);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '0', '1', '2', '', '3', '4']);
        });
        it('should still pass the raw row value to the groupingValueGetter callback when valueGetter defined', function () {
            render(<Test initialState={{
                    rowGrouping: { model: ['category1'] },
                }} columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'category1',
                        valueGetter: function (value, row) { return "value ".concat(row.category1); },
                        groupingValueGetter: function (value, row) {
                            return "groupingValue ".concat(row.category1);
                        },
                    },
                ]} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'groupingValue Cat A (3)',
                '',
                '',
                '',
                'groupingValue Cat B (2)',
                '',
                '',
            ]);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '0', '1', '2', '', '3', '4']);
        });
    });
    describe('column menu', function () {
        it('should add a "Group by {field}" menu item on ungrouped columns when coLDef.groupable is not defined', function () {
            var _a;
            render(<Test columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'category1',
                    },
                ]}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('category1'); });
            expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
            var menuItem = internal_test_utils_1.screen.getByRole('menuitem', { name: 'Group by category1' });
            internal_test_utils_1.fireEvent.click(menuItem);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rowGrouping.model).to.deep.equal(['category1']);
        });
        it('should not add a "Group by {field}" menu item on ungrouped columns when coLDef.groupable = false', function () {
            render(<Test columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'category1',
                        groupable: false,
                    },
                ]}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('category1'); });
            expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
            expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: 'Group by category1' })).to.equal(null);
        });
        it('should add a "Stop grouping by {field}" menu item on grouped column', function () {
            var _a;
            render(<Test columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'category1',
                    },
                ]} initialState={{
                    rowGrouping: {
                        model: ['category1'],
                    },
                }}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('category1'); });
            expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
            var menuItem = internal_test_utils_1.screen.getByRole('menuitem', { name: 'Stop grouping by category1' });
            internal_test_utils_1.fireEvent.click(menuItem);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rowGrouping.model).to.deep.equal([]);
        });
        it('should add a "Stop grouping by {field} menu item on each grouping column when prop.rowGroupingColumnMode = "multiple"', function () {
            var _a, _b;
            render(<Test columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'category1',
                    },
                    {
                        field: 'category2',
                    },
                ]} initialState={{
                    rowGrouping: {
                        model: ['category1', 'category2'],
                    },
                }} rowGroupingColumnMode="multiple"/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('__row_group_by_columns_group_category1__'); });
            expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
            var menuItemCategory1 = internal_test_utils_1.screen.getByRole('menuitem', {
                name: 'Stop grouping by category1',
            });
            internal_test_utils_1.fireEvent.click(menuItemCategory1);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rowGrouping.model).to.deep.equal(['category2']);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.hideColumnMenu(); });
            expect(internal_test_utils_1.screen.queryByRole('menu')).to.equal(null);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('__row_group_by_columns_group_category2__'); });
            expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
            var menuItemCategory2 = internal_test_utils_1.screen.getByRole('menuitem', {
                name: 'Stop grouping by category2',
            });
            internal_test_utils_1.fireEvent.click(menuItemCategory2);
            expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.state.rowGrouping.model).to.deep.equal([]);
        });
        it('should add a "Stop grouping {field}" menu item for each grouping criteria on the grouping column when prop.rowGroupingColumnMode = "single"', function () {
            var _a, _b;
            var restoreDisabledConfig = react_transition_group_1.config.disabled;
            // enable `react-transition-group` transitions for this test
            react_transition_group_1.config.disabled = false;
            render(<Test columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'category1',
                    },
                    {
                        field: 'category2',
                    },
                ]} initialState={{
                    rowGrouping: {
                        model: ['category1', 'category2'],
                    },
                }}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('__row_group_by_columns_group__'); });
            expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
            var menuItemCategory1 = internal_test_utils_1.screen.getByRole('menuitem', {
                name: 'Stop grouping by category1',
            });
            internal_test_utils_1.fireEvent.click(menuItemCategory1);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rowGrouping.model).to.deep.equal(['category2']);
            var menuItemCategory2 = internal_test_utils_1.screen.getByRole('menuitem', {
                name: 'Stop grouping by category2',
            });
            internal_test_utils_1.fireEvent.click(menuItemCategory2);
            expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.state.rowGrouping.model).to.deep.equal([]);
            // restore previous config
            react_transition_group_1.config.disabled = restoreDisabledConfig;
        });
        it('should add a "Stop grouping {field}" menu item for each grouping criteria with colDef.groupable = false but it should be disabled', function () {
            render(<Test columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'category1',
                        groupable: false,
                    },
                    {
                        field: 'category2',
                        groupable: false,
                    },
                ]} initialState={{
                    rowGrouping: {
                        model: ['category1', 'category2'],
                    },
                }}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('__row_group_by_columns_group__'); });
            expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
            var menuItemCategory1 = internal_test_utils_1.screen.getByRole('menuitem', {
                name: 'Stop grouping by category1',
            });
            expect(menuItemCategory1).to.have.class('Mui-disabled');
            var menuItemCategory2 = internal_test_utils_1.screen.getByRole('menuitem', {
                name: 'Stop grouping by category2',
            });
            expect(menuItemCategory2).to.have.class('Mui-disabled');
        });
        it('should use the colDef.headerName property for grouping menu item label', function () {
            render(<Test columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'category1',
                        headerName: 'Category 1',
                    },
                ]}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('category1'); });
            expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
            expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: 'Group by Category 1' })).not.to.equal(null);
        });
        it('should use the colDef.headerName property for ungrouping menu item label', function () {
            render(<Test columns={[
                    {
                        field: 'id',
                    },
                    {
                        field: 'category1',
                        headerName: 'Category 1',
                    },
                ]} initialState={{
                    rowGrouping: {
                        model: ['category1'],
                    },
                }}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.showColumnMenu('category1'); });
            expect(internal_test_utils_1.screen.queryByRole('menu')).not.to.equal(null);
            expect(internal_test_utils_1.screen.queryByRole('menuitem', { name: 'Stop grouping by Category 1' })).not.to.equal(null);
        });
    });
    describe('sorting', function () {
        describe('prop: rowGroupingColumnMode = "single"', function () {
            it('should use each grouping criteria for sorting if leafField are not defined', function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]} defaultGroupingExpansionDepth={-1}/>);
                            return [4 /*yield*/, (0, helperFn_1.microtasks)()];
                        case 1:
                            _a.sent();
                            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                                'Cat B (2)',
                                'Cat 2 (1)',
                                '',
                                'Cat 1 (1)',
                                '',
                                'Cat A (3)',
                                'Cat 2 (2)',
                                '',
                                '',
                                'Cat 1 (1)',
                                '',
                            ]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should sort leaves if leaf field is defined', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} groupingColDef={{
                        leafField: 'id',
                        mainGroupingCriteria: 'category2',
                    }} sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat B (2)',
                    'Cat 2 (1)',
                    '3',
                    'Cat 1 (1)',
                    '4',
                    'Cat A (3)',
                    'Cat 2 (2)',
                    '1',
                    '2',
                    'Cat 1 (1)',
                    '0',
                ]);
            });
            it('should use the leaf field for sorting if mainGroupingCriteria is not defined and leaf field is defined', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} groupingColDef={{
                        leafField: 'id',
                    }} sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    'Cat 1 (1)',
                    '0',
                    'Cat 2 (2)',
                    '2',
                    '1',
                    'Cat B (2)',
                    'Cat 2 (1)',
                    '3',
                    'Cat 1 (1)',
                    '4',
                ]);
            });
            it('should use the leaf field for sorting if mainGroupingCriteria is not one of the grouping criteria and leaf field is defined', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} groupingColDef={{
                        leafField: 'id',
                        mainGroupingCriteria: 'category3',
                    }} sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    'Cat 1 (1)',
                    '0',
                    'Cat 2 (2)',
                    '2',
                    '1',
                    'Cat B (2)',
                    'Cat 2 (1)',
                    '3',
                    'Cat 1 (1)',
                    '4',
                ]);
            });
            it('should sort unbalanced grouped by index of the grouping criteria in the model when sorting by a grouping criteria', function () {
                render(<Test rows={unbalancedRows} initialState={{ rowGrouping: { model: ['category1'] } }} sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]} defaultGroupingExpansionDepth={-1} groupingColDef={{ mainGroupingCriteria: 'category1', leafField: 'id' }}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat B (2)',
                    '2',
                    '3',
                    'Cat A (2)',
                    '0',
                    '1',
                    '4',
                    '5',
                ]);
            });
            it('should sort unbalanced grouped by index of the grouping criteria in the model when sorting by leaves', function () {
                render(<Test rows={unbalancedRows} initialState={{ rowGrouping: { model: ['category1'] } }} sortModel={[{ field: '__row_group_by_columns_group__', sort: 'desc' }]} defaultGroupingExpansionDepth={-1} groupingColDef={{ leafField: 'id' }}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (2)',
                    '1',
                    '0',
                    'Cat B (2)',
                    '3',
                    '2',
                    '5',
                    '4',
                ]);
            });
        });
        describe('prop: rowGroupingColumnMode = "multiple"', function () {
            it('should use the column grouping criteria for sorting if mainGroupingCriteria and leafField are not defined', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} rowGroupingColumnMode="multiple" sortModel={[{ field: '__row_group_by_columns_group_category1__', sort: 'desc' }]} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat B (2)', '', '', 'Cat A (3)', '', '', '']);
            });
            it('should use the column grouping criteria for sorting if mainGroupingCriteria matches the column grouping criteria and leaf field is defined', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} rowGroupingColumnMode="multiple" groupingColDef={{
                        leafField: 'id',
                        mainGroupingCriteria: 'category1',
                    }} sortModel={[{ field: '__row_group_by_columns_group_category1__', sort: 'desc' }]} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat B (2)',
                    '3',
                    '4',
                    'Cat A (3)',
                    '0',
                    '1',
                    '2',
                ]);
            });
            it('should use the leaf field for sorting if mainGroupingCriteria is not defined and leaf field is defined', function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} rowGroupingColumnMode="multiple" groupingColDef={{
                        leafField: 'id',
                    }} sortModel={[{ field: '__row_group_by_columns_group_category1__', sort: 'desc' }]} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    '2',
                    '1',
                    '0',
                    'Cat B (2)',
                    '4',
                    '3',
                ]);
            });
            it("should use the leaf field for sorting if mainGroupingCriteria doesn't match the column grouping criteria and leaf field is defined", function () {
                render(<Test initialState={{ rowGrouping: { model: ['category1'] } }} rowGroupingColumnMode="multiple" groupingColDef={{
                        leafField: 'id',
                        mainGroupingCriteria: 'category2',
                    }} sortModel={[{ field: '__row_group_by_columns_group_category1__', sort: 'desc' }]} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                    'Cat A (3)',
                    '2',
                    '1',
                    '0',
                    'Cat B (2)',
                    '4',
                    '3',
                ]);
            });
        });
    });
    describe('filtering', function () {
        describe('prop: rowGroupingColumnMode = "single"', function () {
            it('should use the top level grouping criteria for filtering if mainGroupingCriteria and leafField are not defined', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test initialState={{
                                    rowGrouping: { model: ['category1', 'category2'] },
                                    preferencePanel: { open: true, openedPanelValue: x_data_grid_premium_1.GridPreferencePanelsValue.filters },
                                }} defaultGroupingExpansionDepth={-1} filterDebounceMs={0}/>).user;
                            return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('textbox', { name: 'Value' }), 'Cat A')];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.sleep)(0); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                                        'Cat A (3)',
                                        'Cat 1 (1)',
                                        '',
                                        'Cat 2 (2)',
                                        '',
                                        '',
                                    ]);
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use the column grouping criteria for filtering if mainGroupingCriteria is one of the grouping criteria and leaf field is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test initialState={{
                                    rowGrouping: { model: ['category1', 'category2'] },
                                    preferencePanel: { open: true, openedPanelValue: x_data_grid_premium_1.GridPreferencePanelsValue.filters },
                                }} groupingColDef={{
                                    leafField: 'id',
                                    mainGroupingCriteria: 'category2',
                                }} defaultGroupingExpansionDepth={-1} filterDebounceMs={0}/>).user;
                            return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('textbox', { name: 'Value' }), 'Cat 1')];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.sleep)(0); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                                        'Cat A (1)',
                                        'Cat 1 (1)',
                                        '0',
                                        'Cat B (1)',
                                        'Cat 1 (1)',
                                        '4',
                                    ]);
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use the leaf field for filtering if mainGroupingCriteria is not defined and leaf field is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test initialState={{
                                    rowGrouping: { model: ['category1', 'category2'] },
                                    preferencePanel: { open: true, openedPanelValue: x_data_grid_premium_1.GridPreferencePanelsValue.filters },
                                }} groupingColDef={{
                                    leafField: 'id',
                                }} defaultGroupingExpansionDepth={-1} filterDebounceMs={0}/>).user;
                            internal_test_utils_1.fireEvent.change((0, helperFn_1.getSelectByName)('Operator'), {
                                target: { value: '>' },
                            });
                            return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('spinbutton', { name: 'Value' }), '2')];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.sleep)(0); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                                        'Cat B (2)',
                                        'Cat 2 (1)',
                                        '3',
                                        'Cat 1 (1)',
                                        '4',
                                    ]);
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use the leaf field for filtering if mainGroupingCriteria is not one of the grouping criteria and leaf field is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test initialState={{
                                    rowGrouping: { model: ['category1', 'category2'] },
                                    preferencePanel: { open: true, openedPanelValue: x_data_grid_premium_1.GridPreferencePanelsValue.filters },
                                }} groupingColDef={{
                                    leafField: 'id',
                                    mainGroupingCriteria: 'category3',
                                }} defaultGroupingExpansionDepth={-1} filterDebounceMs={0}/>).user;
                            internal_test_utils_1.fireEvent.change((0, helperFn_1.getSelectByName)('Operator'), {
                                target: { value: '>' },
                            });
                            return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('spinbutton', { name: 'Value' }), '2')];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.sleep)(0); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                                        'Cat B (2)',
                                        'Cat 2 (1)',
                                        '3',
                                        'Cat 1 (1)',
                                        '4',
                                    ]);
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not filter the groups when filtering with an item that is not on the grouping column', function () {
                render(<Test initialState={{
                        rowGrouping: { model: ['category1', 'category2'] },
                        filter: {
                            filterModel: {
                                items: [{ field: 'id', operator: '=', value: 2 }],
                            },
                        },
                    }} defaultGroupingExpansionDepth={-1}/>);
                // "Cat A" & "Cat 2" groups are not tested against the "id" filter item
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (1)', 'Cat 2 (1)', '']);
            });
            it('should apply quick filter without throwing error', function () {
                render(<Test initialState={{
                        rowGrouping: { model: ['category1'] },
                        filter: {
                            filterModel: {
                                items: [],
                                quickFilterValues: ['B'],
                            },
                        },
                    }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '3', '4']);
            });
            it('should let group appears when a leaf rows pass quick filter', function () {
                render(<Test initialState={{
                        rowGrouping: { model: ['category1'] },
                        filter: {
                            filterModel: {
                                items: [],
                                quickFilterValues: ['Cat 1'],
                            },
                        },
                    }} defaultGroupingExpansionDepth={-1}/>);
                // Corresponds to rows id 0 an 4 (respectively "cat A cat 1" and "cat B cat 1")
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '0', '', '4']);
            });
            it('should let group appears when a rows pass quick filter based on both grouping and leaf values', function () {
                render(<Test initialState={{
                        rowGrouping: { model: ['category1'] },
                        filter: {
                            filterModel: {
                                items: [],
                                quickFilterValues: ['Cat A', 'Cat 2'],
                            },
                        },
                    }} defaultGroupingExpansionDepth={-1}/>);
                // Corresponds to rows A.1 and B.1
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '1', '2']);
            });
            it('should show all children when a group pass quick filter', function () {
                render(<Test initialState={{
                        rowGrouping: { model: ['category1'] },
                        filter: {
                            filterModel: {
                                items: [],
                                quickFilterValues: ['Cat A'],
                            },
                        },
                    }} defaultGroupingExpansionDepth={-1}/>);
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '0', '1', '2']);
            });
            it('should let group appears when a leaf rows pass filterModel', function () {
                render(<Test initialState={{
                        rowGrouping: { model: ['category1'] },
                        filter: {
                            filterModel: {
                                items: [
                                    {
                                        field: 'category2',
                                        operator: 'equals',
                                        value: 'Cat 1',
                                    },
                                ],
                            },
                        },
                    }} defaultGroupingExpansionDepth={-1}/>);
                // Corresponds to rows id 0 an 4 (respectively "cat A cat 1" and "cat B cat 1")
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '0', '', '4']);
            });
            it('should manage link operator OR across group and leaf columns', function () {
                render(<Test initialState={{
                        rowGrouping: { model: ['category1'] },
                        filter: {
                            filterModel: {
                                items: [
                                    {
                                        id: 2,
                                        field: 'category2',
                                        operator: 'equals',
                                        value: 'Cat 1',
                                    },
                                    {
                                        id: 1,
                                        field: x_data_grid_premium_1.GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD,
                                        operator: 'equals',
                                        value: 'Cat A',
                                    },
                                ],
                                logicOperator: x_data_grid_premium_1.GridLogicOperator.Or,
                            },
                        },
                    }} defaultGroupingExpansionDepth={-1}/>);
                // Corresponds to rows id 0, 1, 2 because of Cat A, ann id 4 because of Cat 1
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '0', '1', '2', '', '4']);
            });
            it('should keep the correct count of the children and descendants in the filter state', function () {
                var extendedColumns = __spreadArray(__spreadArray([], baselineProps.columns, true), [
                    {
                        field: 'value1',
                    },
                ], false);
                var extendedRows = rows.map(function (row, index) { return (__assign(__assign({}, row), { value1: "Value".concat(index) })); });
                var additionalRows = [
                    { id: 5, category1: 'Cat A', category2: 'Cat 2', value1: 'Value5' },
                    { id: 6, category1: 'Cat A', category2: 'Cat 2', value1: 'Value6' },
                    { id: 7, category1: 'Cat B', category2: 'Cat 1', value1: 'Value7' },
                ];
                render(<Test columns={extendedColumns} rows={__spreadArray(__spreadArray([], extendedRows, true), additionalRows, true)} initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} defaultGroupingExpansionDepth={3} rowGroupingColumnMode="multiple"/>);
                var _a = apiRef.current.state.filter, filteredChildrenCountLookup = _a.filteredChildrenCountLookup, filteredDescendantCountLookup = _a.filteredDescendantCountLookup;
                expect(filteredChildrenCountLookup['auto-generated-row-category1/Cat A']).to.equal(2);
                expect(filteredDescendantCountLookup['auto-generated-row-category1/Cat A']).to.equal(5);
                expect(filteredChildrenCountLookup['auto-generated-row-category1/Cat A-category2/Cat 2']).to.equal(4);
                expect(filteredDescendantCountLookup['auto-generated-row-category1/Cat A-category2/Cat 2']).to.equal(4);
            });
        });
        describe('prop: rowGroupingColumnMode = "multiple"', function () {
            it('should use the column grouping criteria for filtering if mainGroupingCriteria and leafField are not defined', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test initialState={{
                                    rowGrouping: { model: ['category1'] },
                                    preferencePanel: { open: true, openedPanelValue: x_data_grid_premium_1.GridPreferencePanelsValue.filters },
                                }} rowGroupingColumnMode="multiple" defaultGroupingExpansionDepth={-1} filterDebounceMs={0}/>).user;
                            return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('textbox', { name: 'Value' }), 'Cat A')];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.sleep)(0); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (3)', '', '', '']);
                                })];
                        case 3:
                            _a.sent();
                            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', '0', '1', '2']);
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use the column grouping criteria for filtering if mainGroupingCriteria matches the column grouping criteria and leaf field is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test initialState={{
                                    rowGrouping: { model: ['category1'] },
                                    preferencePanel: { open: true, openedPanelValue: x_data_grid_premium_1.GridPreferencePanelsValue.filters },
                                }} rowGroupingColumnMode="multiple" groupingColDef={{
                                    leafField: 'id',
                                    mainGroupingCriteria: 'category1',
                                }} defaultGroupingExpansionDepth={-1} filterDebounceMs={0}/>).user;
                            return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('textbox', { name: 'Value' }), 'Cat A')];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.sleep)(0); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (3)', '0', '1', '2']);
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should use the leaf field for filtering if mainGroupingCriteria is not defined and leaf field is defined', function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test initialState={{
                                    rowGrouping: { model: ['category1'] },
                                    preferencePanel: { open: true, openedPanelValue: x_data_grid_premium_1.GridPreferencePanelsValue.filters },
                                }} rowGroupingColumnMode="multiple" groupingColDef={{
                                    leafField: 'id',
                                }} defaultGroupingExpansionDepth={-1} filterDebounceMs={0}/>).user;
                            internal_test_utils_1.fireEvent.change((0, helperFn_1.getSelectByName)('Operator'), {
                                target: { value: '>' },
                            });
                            return [4 /*yield*/, user.clear(internal_test_utils_1.screen.getByRole('spinbutton', { name: 'Value' }))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('spinbutton', { name: 'Value' }), '2')];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.sleep)(0); })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat B (2)', '3', '4']);
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("should use the leaf field for filtering if mainGroupingCriteria doesn't match the column grouping criteria and leaf field is defined", function () { return __awaiter(void 0, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            user = render(<Test initialState={{
                                    rowGrouping: { model: ['category1'] },
                                    preferencePanel: { open: true, openedPanelValue: x_data_grid_premium_1.GridPreferencePanelsValue.filters },
                                }} rowGroupingColumnMode="multiple" groupingColDef={{
                                    leafField: 'id',
                                    mainGroupingCriteria: 'category2',
                                }} defaultGroupingExpansionDepth={-1} filterDebounceMs={0}/>).user;
                            internal_test_utils_1.fireEvent.change((0, helperFn_1.getSelectByName)('Operator'), {
                                target: { value: '>' },
                            });
                            return [4 /*yield*/, user.clear(internal_test_utils_1.screen.getByRole('spinbutton', { name: 'Value' }))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, user.type(internal_test_utils_1.screen.getByRole('spinbutton', { name: 'Value' }), '2')];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return (0, helperFn_1.sleep)(0); })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, internal_test_utils_1.waitFor)(function () {
                                    expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat B (2)', '3', '4']);
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should not filter the groups when filtering with an item that is not on the grouping column', function () {
                render(<Test initialState={{
                        rowGrouping: { model: ['category1', 'category2'] },
                        filter: {
                            filterModel: {
                                items: [{ field: 'id', operator: '=', value: 2 }],
                            },
                        },
                    }} rowGroupingColumnMode="multiple" defaultGroupingExpansionDepth={-1}/>);
                // "Cat A" & "Cat 2" groups are not tested against the "id" filter item
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (1)', '', '']);
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', 'Cat 2 (1)', '']);
            });
            it('should not filter the groups when filtering with an item that is from another grouping column', function () {
                render(<Test initialState={{
                        rowGrouping: { model: ['category1', 'category2'] },
                        filter: {
                            filterModel: {
                                items: [
                                    {
                                        field: '__row_group_by_columns_group_category1__',
                                        operator: 'equals',
                                        value: 'Cat A',
                                    },
                                ],
                            },
                        },
                    }} rowGroupingColumnMode="multiple" defaultGroupingExpansionDepth={-1}/>);
                // "Cat A" is testing against the "__row_group_by_columns_group_category1__" filter item, but "Cat 1" and "Cat 2" are not
                expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['Cat A (3)', '', '', '', '', '']);
                expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['', 'Cat 1 (1)', '', 'Cat 2 (2)', '', '']);
            });
        });
        it('should not apply filters when the row is expanded', function () {
            var _a;
            render(<Test initialState={{
                    rowGrouping: { model: ['category1'] },
                }}/>);
            var onFilteredRowsSet = (0, sinon_1.spy)();
            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('filteredRowsSet', onFilteredRowsSet);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(0, 0).querySelector('button'));
            expect(onFilteredRowsSet.callCount).to.equal(0);
        });
        it('should not apply filters when the row is collapsed', function () {
            var _a;
            render(<Test initialState={{
                    rowGrouping: { model: ['category1'] },
                }} defaultGroupingExpansionDepth={-1}/>);
            var onFilteredRowsSet = (0, sinon_1.spy)();
            (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.subscribeEvent('filteredRowsSet', onFilteredRowsSet);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(0, 0).querySelector('button'));
            expect(onFilteredRowsSet.callCount).to.equal(0);
        });
    });
    describe('column pinning', function () {
        it('should keep the checkbox selection column position after column is unpinned when groupingColumnMode = "single"', function () {
            var setProps = render(<Test checkboxSelection initialState={{ rowGrouping: { model: ['category1'] } }} defaultGroupingExpansionDepth={-1}/>).setProps;
            var initialColumnOrder = ['', 'category1', 'id', 'category1', 'category2'];
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(initialColumnOrder);
            setProps({ pinnedColumns: { left: ['id'] } });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'id',
                '',
                'category1',
                'category1',
                'category2',
            ]);
            setProps({ pinnedColumns: { left: [] } });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(initialColumnOrder);
        });
        it('should keep the checkbox selection column position after column is unpinned when groupingColumnMode = "multiple"', function () {
            var setProps = render(<Test checkboxSelection initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} rowGroupingColumnMode="multiple" defaultGroupingExpansionDepth={-1}/>).setProps;
            var initialColumnOrder = ['', 'category1', 'category2', 'id', 'category1', 'category2'];
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(initialColumnOrder);
            setProps({
                pinnedColumns: {
                    left: ['__row_group_by_columns_group_category2__', 'id'],
                },
            });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal([
                'category2',
                'id',
                '',
                'category1',
                'category1',
                'category2',
            ]);
            setProps({ pinnedColumns: { left: [] } });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(initialColumnOrder);
        });
    });
    describe('accessibility', function () {
        it('should add necessary treegrid aria attributes to the rows', function () {
            render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }} defaultGroupingExpansionDepth={-1} rowGroupingColumnMode="multiple"/>);
            expect((0, helperFn_1.getRow)(0).getAttribute('aria-level')).to.equal('1'); // Cat A
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-level')).to.equal('2'); // Cat 1
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-posinset')).to.equal('1');
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-setsize')).to.equal('2'); // Cat A has Cat 1 & Cat 2
            expect((0, helperFn_1.getRow)(2).getAttribute('aria-level')).to.equal('3'); // Cat 1 row
            expect((0, helperFn_1.getRow)(3).getAttribute('aria-posinset')).to.equal('2'); // Cat 2
            expect((0, helperFn_1.getRow)(4).getAttribute('aria-posinset')).to.equal('1'); // Cat 2 row
            expect((0, helperFn_1.getRow)(4).getAttribute('aria-setsize')).to.equal('2'); // Cat 2 has 2 rows
        });
    });
    // See https://github.com/mui/mui-x/issues/8626
    it('should properly update the rows when they change', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<Test columns={[{ field: 'id' }, { field: 'group' }, { field: 'username', width: 150 }]} rows={[{ id: 1, group: 'A', username: 'username' }]} rowGroupingModel={['group']} defaultGroupingExpansionDepth={-1}/>);
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, group: 'A', username: 'username 2' }]);
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    expect((0, helperFn_1.getCell)(1, 3).textContent).to.equal('username 2');
                    return [2 /*return*/];
            }
        });
    }); });
    // See https://github.com/mui/mui-x/issues/8580
    it('should not collapse expanded groups after `updateRows`', function () { return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = render(<Test columns={[{ field: 'id' }, { field: 'group' }, { field: 'username', width: 150 }]} rows={[{ id: 1, group: 'A', username: 'username' }]} rowGroupingModel={['group']}/>).user;
                    return [4 /*yield*/, user.click(internal_test_utils_1.screen.getByRole('button', { name: 'see children' }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1, group: 'A', username: 'username 2' }]);
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _a.sent();
                    expect(internal_test_utils_1.screen.getByRole('button', { name: 'hide children' })).toBeVisible();
                    expect((0, helperFn_1.getCell)(1, 3).textContent).to.equal('username 2');
                    return [2 /*return*/];
            }
        });
    }); });
    // See https://github.com/mui/mui-x/issues/8853
    it('should not reorder rows after calling `updateRows`', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<Test columns={[{ field: 'id' }, { field: 'group' }, { field: 'username', width: 150 }]} rows={[
                            { id: 1, group: 'A', username: 'username1' },
                            { id: 2, group: 'A', username: 'username2' },
                        ]} rowGroupingModel={['group']} defaultGroupingExpansionDepth={-1}/>);
                    expect((0, helperFn_1.getColumnValues)(3)).to.deep.equal(['', 'username1', 'username2']);
                    // trigger row update without any changes in row data
                    return [4 /*yield*/, (0, internal_test_utils_1.act)(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 1 }]);
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    // trigger row update without any changes in row data
                    _a.sent();
                    expect((0, helperFn_1.getColumnValues)(3)).to.deep.equal(['', 'username1', 'username2']);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not use the valueFormatter of the main grouping criteria on all grouping criteria', function () {
        render(<Test columns={[
                { field: 'id' },
                {
                    field: 'year',
                    type: 'number',
                    valueFormatter: function (value) { return (typeof value === 'number' ? "".concat(value) : ''); },
                },
                { field: 'company' },
            ]} rows={[{ id: 1, year: 2025, company: 'MUI' }]} rowGroupingModel={['year', 'company']} defaultGroupingExpansionDepth={-1}/>);
        expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['2025 (1)', 'MUI (1)', '']);
    });
});
