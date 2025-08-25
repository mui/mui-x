"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var sinon_1 = require("sinon");
var skipIf_1 = require("test/utils/skipIf");
describe('<DataGridPro /> - Lazy loader', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var baselineProps = {
        rows: [
            {
                id: 1,
                first: 'Mike',
            },
            {
                id: 2,
                first: 'Jack',
            },
            {
                id: 3,
                first: 'Jim',
            },
        ],
        columns: [{ field: 'id' }, { field: 'first' }],
    };
    var apiRef;
    function TestLazyLoader(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 300 }}>
        <x_data_grid_pro_1.DataGridPro apiRef={apiRef} {...baselineProps} {...props} sortingMode="server" filterMode="server" rowsLoadingMode="server" paginationMode="server"/>
      </div>);
    }
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should not call onFetchRows if the viewport is fully loaded', function () {
        var handleFetchRows = (0, sinon_1.spy)();
        var rows = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }];
        render(<TestLazyLoader onFetchRows={handleFetchRows} rowCount={50} rows={rows}/>);
        expect(handleFetchRows.callCount).to.equal(0);
    });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should call onFetchRows when sorting is applied', function () {
        var handleFetchRows = (0, sinon_1.spy)();
        render(<TestLazyLoader onFetchRows={handleFetchRows} rowCount={50}/>);
        expect(handleFetchRows.callCount).to.equal(1);
        // Should be 1. When tested in the browser it's called only 2 time
        internal_test_utils_1.fireEvent.click((0, helperFn_1.getColumnHeaderCell)(0));
        expect(handleFetchRows.callCount).to.equal(2);
    });
    // Needs layout
    it.skipIf(skipIf_1.isJSDOM)('should render skeleton cell if rowCount is bigger than the number of rows', function () {
        render(<TestLazyLoader rowCount={10}/>);
        // The 4th row should be a skeleton one
        expect((0, helperFn_1.getRow)(3).dataset.id).to.equal('auto-generated-skeleton-row-root-0');
    });
    it('should update all rows accordingly when `apiRef.current.unstable_replaceRows` is called', function () {
        var _a, _b;
        render(<TestLazyLoader rowCount={6}/>);
        var newRows = [
            { id: 4, name: 'John' },
            { id: 5, name: 'Mac' },
        ];
        var initialAllRows = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getRowNode(x_data_grid_pro_1.GRID_ROOT_GROUP_ID).children;
        expect(initialAllRows.slice(3, 6)).to.deep.equal([
            'auto-generated-skeleton-row-root-0',
            'auto-generated-skeleton-row-root-1',
            'auto-generated-skeleton-row-root-2',
        ]);
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.unstable_replaceRows(4, newRows); });
        var updatedAllRows = (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getRowNode(x_data_grid_pro_1.GRID_ROOT_GROUP_ID).children;
        expect(updatedAllRows.slice(4, 6)).to.deep.equal([4, 5]);
    });
    // See https://github.com/mui/mui-x/issues/6857
    it('should update the row when `apiRef.current.updateRows` is called on lazy-loaded rows', function () {
        render(<TestLazyLoader rowCount={5} autoHeight={skipIf_1.isJSDOM}/>);
        var newRows = [
            { id: 4, first: 'John' },
            { id: 5, first: 'Mac' },
        ];
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.unstable_replaceRows(3, newRows); });
        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['Mike', 'Jack', 'Jim', 'John', 'Mac']);
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ id: 4, first: 'John updated' }]); });
        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['Mike', 'Jack', 'Jim', 'John updated', 'Mac']);
    });
    it('should update all rows accordingly when `apiRef.current.unstable_replaceRows` is called and props.getRowId is defined', function () {
        var _a, _b, _c, _d;
        render(<TestLazyLoader rowCount={6} getRowId={function (row) { return row.clientId; }} rows={[
                {
                    clientId: 1,
                    first: 'Mike',
                },
                {
                    clientId: 2,
                    first: 'Jack',
                },
                {
                    clientId: 3,
                    first: 'Jim',
                },
            ]} columns={[{ field: 'clientId' }]}/>);
        var newRows = [
            { clientId: 4, name: 'John' },
            { clientId: 5, name: 'Mac' },
        ];
        var initialAllRows = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getRowNode(x_data_grid_pro_1.GRID_ROOT_GROUP_ID).children;
        expect(initialAllRows.slice(3, 6)).to.deep.equal([
            'auto-generated-skeleton-row-root-0',
            'auto-generated-skeleton-row-root-1',
            'auto-generated-skeleton-row-root-2',
        ]);
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.unstable_replaceRows(4, newRows); });
        var updatedAllRows = (_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getRowNode(x_data_grid_pro_1.GRID_ROOT_GROUP_ID).children;
        expect(updatedAllRows.slice(4, 6)).to.deep.equal([4, 5]);
        expect((_c = apiRef.current) === null || _c === void 0 ? void 0 : _c.getRowNode(4)).not.to.equal(null);
        expect((_d = apiRef.current) === null || _d === void 0 ? void 0 : _d.getRowNode(5)).not.to.equal(null);
    });
    it('should update rows when `apiRef.current.updateRows` with data reversed', function () {
        render(<TestLazyLoader rowCount={5} autoHeight={skipIf_1.isJSDOM}/>);
        var newRows = [
            {
                id: 3,
                first: 'Jim',
            },
            {
                id: 2,
                first: 'Jack',
            },
            {
                id: 1,
                first: 'Mike',
            },
        ];
        (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.unstable_replaceRows(0, newRows); });
        expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['Jim', 'Jack', 'Mike']);
    });
});
