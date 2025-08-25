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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
var rows = [
    { id: 0, category: 'Cat A' },
    { id: 1, category: 'Cat A' },
    { id: 2, category: 'Cat A' },
    { id: 3, category: 'Cat B' },
    { id: 4, category: 'Cat B' },
    { id: 5, category: 'Cat B' },
];
var columns = [
    {
        field: 'id',
        type: 'number',
    },
    {
        field: 'idBis',
        type: 'number',
        valueGetter: function (value, row) { return row.id; },
    },
    {
        field: 'category',
    },
];
var FULL_INITIAL_STATE = {
    columns: {
        columnVisibilityModel: { idBis: false },
        orderedFields: ['id', 'category', 'idBis'],
        dimensions: {
            category: {
                width: 75,
                maxWidth: -1,
                minWidth: 50,
                flex: undefined,
            },
        },
    },
    filter: {
        filterModel: {
            items: [{ field: 'id', operator: '>=', value: '0' }],
        },
    },
    pagination: {
        meta: {},
        paginationModel: { page: 1, pageSize: 2 },
        rowCount: 6,
    },
    pinnedColumns: {
        left: ['id'],
    },
    preferencePanel: {
        open: true,
        openedPanelValue: x_data_grid_pro_1.GridPreferencePanelsValue.filters,
        panelId: undefined,
        labelId: undefined,
    },
    sorting: {
        sortModel: [{ field: 'id', sort: 'desc' }],
    },
    density: 'compact',
};
describe('<DataGridPro /> - State persistence', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function TestCase(props) {
        var _a, _b, _c;
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro rows={rows} columns={columns} pagination autoHeight={isJSDOM} apiRef={apiRef} disableVirtualization pageSizeOptions={[100, 2]} {...props} initialState={__assign(__assign({}, props.initialState), { columns: __assign(__assign({}, (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.columns), { columnVisibilityModel: __assign({}, (_c = (_b = props.initialState) === null || _b === void 0 ? void 0 : _b.columns) === null || _c === void 0 ? void 0 : _c.columnVisibilityModel) }) })}/>
      </div>);
    }
    describe('apiRef: exportState', function () {
        it('should export the default values of the models', function () {
            var _a;
            render(<TestCase />);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportState()).to.deep.equal({
                columns: {
                    columnVisibilityModel: {},
                    orderedFields: ['id', 'idBis', 'category'],
                },
                filter: {
                    filterModel: (0, x_data_grid_pro_1.getDefaultGridFilterModel)(),
                },
                pagination: {
                    meta: {},
                    paginationModel: { page: 0, pageSize: 100 },
                    rowCount: 6,
                },
                pinnedColumns: {},
                preferencePanel: {
                    open: false,
                },
                sorting: {
                    sortModel: [],
                },
                density: 'standard',
            });
        });
        it('should not export the default values of the models when using exportOnlyDirtyModels', function () {
            var _a;
            render(<TestCase />);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportState({ exportOnlyDirtyModels: true })).to.deep.equal({
                columns: {
                    orderedFields: ['id', 'idBis', 'category'],
                },
            });
        });
        it('should export the initial values of the models', function () {
            var _a;
            render(<TestCase initialState={FULL_INITIAL_STATE}/>);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportState()).to.deep.equal(FULL_INITIAL_STATE);
        });
        it('should export the controlled values of the models', function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            render(<TestCase filterModel={(_a = FULL_INITIAL_STATE.filter) === null || _a === void 0 ? void 0 : _a.filterModel} sortModel={(_b = FULL_INITIAL_STATE.sorting) === null || _b === void 0 ? void 0 : _b.sortModel} columnVisibilityModel={(_c = FULL_INITIAL_STATE.columns) === null || _c === void 0 ? void 0 : _c.columnVisibilityModel} paginationModel={{
                    page: (_e = (_d = FULL_INITIAL_STATE.pagination) === null || _d === void 0 ? void 0 : _d.paginationModel) === null || _e === void 0 ? void 0 : _e.page,
                    pageSize: (_g = (_f = FULL_INITIAL_STATE.pagination) === null || _f === void 0 ? void 0 : _f.paginationModel) === null || _g === void 0 ? void 0 : _g.pageSize,
                }} paginationMode="server" rowCount={(_h = FULL_INITIAL_STATE.pagination) === null || _h === void 0 ? void 0 : _h.rowCount} pinnedColumns={FULL_INITIAL_STATE.pinnedColumns} density={FULL_INITIAL_STATE.density} 
            // Some portable states don't have a controllable model
            initialState={{
                    columns: {
                        orderedFields: (_j = FULL_INITIAL_STATE.columns) === null || _j === void 0 ? void 0 : _j.orderedFields,
                        dimensions: (_k = FULL_INITIAL_STATE.columns) === null || _k === void 0 ? void 0 : _k.dimensions,
                    },
                    preferencePanel: FULL_INITIAL_STATE.preferencePanel,
                }}/>);
            expect((_l = apiRef.current) === null || _l === void 0 ? void 0 : _l.exportState()).to.deep.equal(FULL_INITIAL_STATE);
        });
        it('should export the controlled values of the models when using exportOnlyDirtyModels', function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            render(<TestCase filterModel={(_a = FULL_INITIAL_STATE.filter) === null || _a === void 0 ? void 0 : _a.filterModel} sortModel={(_b = FULL_INITIAL_STATE.sorting) === null || _b === void 0 ? void 0 : _b.sortModel} columnVisibilityModel={(_c = FULL_INITIAL_STATE.columns) === null || _c === void 0 ? void 0 : _c.columnVisibilityModel} paginationModel={{
                    page: (_e = (_d = FULL_INITIAL_STATE.pagination) === null || _d === void 0 ? void 0 : _d.paginationModel) === null || _e === void 0 ? void 0 : _e.page,
                    pageSize: (_g = (_f = FULL_INITIAL_STATE.pagination) === null || _f === void 0 ? void 0 : _f.paginationModel) === null || _g === void 0 ? void 0 : _g.pageSize,
                }} paginationMode="server" rowCount={(_h = FULL_INITIAL_STATE.pagination) === null || _h === void 0 ? void 0 : _h.rowCount} paginationMeta={(_j = FULL_INITIAL_STATE.pagination) === null || _j === void 0 ? void 0 : _j.meta} pinnedColumns={FULL_INITIAL_STATE.pinnedColumns} density={FULL_INITIAL_STATE.density} 
            // Some portable states don't have a controllable model
            initialState={{
                    columns: {
                        orderedFields: (_k = FULL_INITIAL_STATE.columns) === null || _k === void 0 ? void 0 : _k.orderedFields,
                        dimensions: (_l = FULL_INITIAL_STATE.columns) === null || _l === void 0 ? void 0 : _l.dimensions,
                    },
                    preferencePanel: FULL_INITIAL_STATE.preferencePanel,
                }}/>);
            expect((_m = apiRef.current) === null || _m === void 0 ? void 0 : _m.exportState({ exportOnlyDirtyModels: true })).to.deep.equal(FULL_INITIAL_STATE);
        });
        it('should export the initial values of the models when using exportOnlyUserModels', function () {
            var _a;
            render(<TestCase initialState={FULL_INITIAL_STATE}/>);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportState({ exportOnlyDirtyModels: true })).to.deep.equal(FULL_INITIAL_STATE);
        });
        it('should export the current version of the exportable state', function () {
            var _a;
            render(<TestCase />);
            (0, internal_test_utils_1.act)(function () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setPinnedColumns({ left: ['id'] });
                (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.showPreferences(x_data_grid_pro_1.GridPreferencePanelsValue.filters);
                (_c = apiRef.current) === null || _c === void 0 ? void 0 : _c.setSortModel([{ field: 'id', sort: 'desc' }]);
                (_d = apiRef.current) === null || _d === void 0 ? void 0 : _d.setFilterModel({
                    items: [{ field: 'id', operator: '>=', value: '0' }],
                });
                (_e = apiRef.current) === null || _e === void 0 ? void 0 : _e.setPaginationModel({ page: 1, pageSize: 2 });
                (_f = apiRef.current) === null || _f === void 0 ? void 0 : _f.setColumnIndex('category', 1);
                (_g = apiRef.current) === null || _g === void 0 ? void 0 : _g.setColumnWidth('category', 75);
                (_h = apiRef.current) === null || _h === void 0 ? void 0 : _h.setColumnVisibilityModel({ idBis: false });
                (_j = apiRef.current) === null || _j === void 0 ? void 0 : _j.setDensity('compact');
            });
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.exportState()).to.deep.equal(FULL_INITIAL_STATE);
        });
    });
    describe('apiRef: restoreState', function () {
        it('should restore the whole exportable state', function () {
            render(<TestCase />);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.restoreState(FULL_INITIAL_STATE); });
            // Pinning, pagination, sorting and filtering
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['3', '2']);
            // Preference panel
            expect(internal_test_utils_1.screen.getByRole('button', { name: /Add Filter/i })).not.to.equal(null);
            // Columns visibility
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['id', 'category']);
            // Columns dimensions
            expect((0, helperFn_1.getColumnHeaderCell)(1)).toHaveInlineStyle({ width: '75px' });
        });
        it('should restore partial exportable state', function () {
            render(<TestCase />);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.restoreState({
                    pagination: {
                        paginationModel: { page: 1, pageSize: 2 },
                    },
                });
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['2', '3']);
        });
        it('should restore controlled sub-state', function () {
            function ControlledTest() {
                var _a = React.useState({ page: 0, pageSize: 5 }), paginationModel = _a[0], setPaginationModel = _a[1];
                return (<TestCase paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} pageSizeOptions={[2, 5]}/>);
            }
            render(<ControlledTest />);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.restoreState({
                    pagination: {
                        paginationModel: { page: 1, pageSize: 2 },
                    },
                });
            });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['2', '3']);
        });
    });
});
