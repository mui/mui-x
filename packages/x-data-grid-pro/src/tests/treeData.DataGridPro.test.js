"use strict";
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
var internal_test_utils_1 = require("@mui/internal-test-utils");
var helperFn_1 = require("test/utils/helperFn");
var fireUserEvent_1 = require("test/utils/fireUserEvent");
var React = require("react");
var sinon_1 = require("sinon");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var isJSDOM = /jsdom/.test(window.navigator.userAgent);
var rowsWithoutGap = [
    { name: 'A' },
    { name: 'A.A' },
    { name: 'A.B' },
    { name: 'B' },
    { name: 'B.A' },
    { name: 'B.B' },
    { name: 'B.B.A' },
    { name: 'B.B.A.A' },
    { name: 'C' },
];
var rowsWithGap = [
    { name: 'A' },
    { name: 'A.B' },
    { name: 'A.A' },
    { name: 'B.A' },
    { name: 'B.B' },
];
var baselineProps = {
    autoHeight: isJSDOM,
    rows: rowsWithoutGap,
    columns: [
        {
            field: 'name',
            width: 200,
        },
    ],
    treeData: true,
    getTreeDataPath: function (row) { return row.name.split('.'); },
    getRowId: function (row) { return row.name; },
};
describe('<DataGridPro /> - Tree data', function () {
    var render = (0, internal_test_utils_1.createRenderer)().render;
    var apiRef;
    function Test(props) {
        apiRef = (0, x_data_grid_pro_1.useGridApiRef)();
        return (<div style={{ width: 300, height: 800 }}>
        <x_data_grid_pro_1.DataGridPro {...baselineProps} apiRef={apiRef} {...props} disableVirtualization/>
      </div>);
    }
    describe('prop: treeData', function () {
        it('should support tree data toggling', function () {
            var setProps = render(<Test treeData={false}/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['name']);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'A',
                'A.A',
                'A.B',
                'B',
                'B.A',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'C',
            ]);
            setProps({ treeData: true });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['Group', 'name']);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'B', 'C']);
            setProps({ treeData: false });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['name']);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'A',
                'A.A',
                'A.B',
                'B',
                'B.A',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'C',
            ]);
        });
        it('should support enabling treeData after apiRef.current.updateRows has modified the rows', function () {
            var setProps = render(<Test treeData={false} defaultGroupingExpansionDepth={-1}/>).setProps;
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['name']);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'A',
                'A.A',
                'A.B',
                'B',
                'B.A',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'C',
            ]);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ name: 'A.A', _action: 'delete' }]); });
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'A',
                'A.B',
                'B',
                'B.A',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'C',
            ]);
            setProps({ treeData: true });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['Group', 'name']);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'A',
                'A.B',
                'B',
                'B.A',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'C',
            ]);
        });
        it('should support new dataset', function () {
            var setProps = render(<Test />).setProps;
            setProps({
                rows: [
                    { nameBis: '1' },
                    { nameBis: '1.1' },
                    { nameBis: '1.2' },
                    { nameBis: '2' },
                    { nameBis: '2.1' },
                ],
                columns: [
                    {
                        field: 'nameBis',
                        width: 200,
                    },
                ],
                getTreeDataPath: function (row) { return row.nameBis.split('.'); },
                getRowId: function (row) { return row.nameBis; },
            });
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['Group', 'nameBis']);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['1', '2']);
        });
        it('should keep children expansion when changing some of the rows', function () {
            render(<Test disableVirtualization rows={[{ name: 'A' }, { name: 'A.A' }]}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A']);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowChildrenExpansion('A', true); });
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'A.A']);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ name: 'B' }]); });
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'A.A', 'B']);
        });
    });
    describe('prop: getTreeDataPath', function () {
        it('should allow to transform path', function () {
            render(<Test getTreeDataPath={function (row) { return __spreadArray([], row.name.split('.').reverse(), true); }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'A',
                'A.A',
                '',
                'B.B.A.A',
                'B.A',
                'B.B.A',
                'B',
                'A.B',
                'B.B',
                'C',
            ]);
        });
        it('should support new getTreeDataPath', function () {
            var setProps = render(<Test defaultGroupingExpansionDepth={-1}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'A',
                'A.A',
                'A.B',
                'B',
                'B.A',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'C',
            ]);
            setProps({
                getTreeDataPath: function (row) { return __spreadArray([], row.name.split('.').reverse(), true); },
            });
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'A',
                'A.A',
                '',
                'B.B.A.A',
                'B.A',
                'B.B.A',
                'B',
                'A.B',
                'B.B',
                'C',
            ]);
        });
    });
    describe('prop: defaultGroupingExpansionDepth', function () {
        it('should not expand any row if defaultGroupingExpansionDepth = 0', function () {
            render(<Test defaultGroupingExpansionDepth={0}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'B', 'C']);
        });
        it('should expand all top level rows if defaultGroupingExpansionDepth = 1', function () {
            render(<Test defaultGroupingExpansionDepth={1}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'B.A', 'B.B', 'C']);
        });
        it('should expand all rows up to depth of 2 if defaultGroupingExpansionDepth = 2', function () {
            render(<Test defaultGroupingExpansionDepth={2}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'A',
                'A.A',
                'A.B',
                'B',
                'B.A',
                'B.B',
                'B.B.A',
                'C',
            ]);
        });
        it('should expand all rows if defaultGroupingExpansionDepth = -1', function () {
            render(<Test defaultGroupingExpansionDepth={2}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'A',
                'A.A',
                'A.B',
                'B',
                'B.A',
                'B.B',
                'B.B.A',
                'C',
            ]);
        });
        it('should not re-apply default expansion on rerender after expansion manually toggled', function () {
            var setProps = render(<Test />).setProps;
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'B', 'C']);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowChildrenExpansion('B', true); });
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'B', 'B.A', 'B.B', 'C']);
            setProps({ sortModel: [{ field: 'name', sort: 'desc' }] });
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['C', 'B', 'B.B', 'B.A', 'A']);
        });
    });
    describe('prop: isGroupExpandedByDefault', function () {
        it('should expand groups according to isGroupExpandedByDefault when defined', function () {
            var _a;
            var isGroupExpandedByDefault = (0, sinon_1.spy)(function (node) { return node.id === 'A'; });
            render(<Test isGroupExpandedByDefault={isGroupExpandedByDefault}/>);
            expect(isGroupExpandedByDefault.callCount).to.equal(internal_test_utils_1.reactMajor >= 19 ? 4 : 8); // Should not be called on leaves
            var _b = (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rows.tree.A, childrenExpanded = _b.childrenExpanded, children = _b.children, childrenFromPath = _b.childrenFromPath, node = __rest(_b, ["childrenExpanded", "children", "childrenFromPath"]);
            var callForNodeA = isGroupExpandedByDefault
                .getCalls()
                .find(function (call) { return call.firstArg.id === node.id; });
            expect(callForNodeA.firstArg).to.deep.includes(node);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
        });
        it('should have priority over defaultGroupingExpansionDepth when both defined', function () {
            var isGroupExpandedByDefault = function (node) { return node.id === 'A'; };
            render(<Test isGroupExpandedByDefault={isGroupExpandedByDefault} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
        });
    });
    describe('prop: groupingColDef', function () {
        it('should set the custom headerName', function () {
            render(<Test groupingColDef={{ headerName: 'Custom header name' }}/>);
            expect((0, helperFn_1.getColumnHeadersTextContent)()).to.deep.equal(['Custom header name', 'name']);
        });
        it('should render descendant count when hideDescendantCount = false', function () {
            render(<Test groupingColDef={{ hideDescendantCount: false }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                'A (2)',
                'A',
                'B',
                'B (4)',
                'A',
                'B (2)',
                'A (1)',
                'A',
                'C',
            ]);
        });
        it('should not render descendant count when hideDescendantCount = true', function () {
            render(<Test groupingColDef={{ hideDescendantCount: true }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['A', 'A', 'B', 'B', 'A', 'B', 'A', 'A', 'C']);
        });
        // https://github.com/mui/mui-x/issues/9344
        it('should support valueFormatter', function () {
            render(<Test groupingColDef={{ valueFormatter: function (value) { return "> ".concat(value); } }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal([
                '> A (2)',
                '> A',
                '> B',
                '> B (4)',
                '> A',
                '> B (2)',
                '> A (1)',
                '> A',
                '> C',
            ]);
        });
    });
    describe('row grouping column', function () {
        it('should add a grouping column', function () {
            render(<Test />);
            var columnsHeader = (0, helperFn_1.getColumnHeadersTextContent)();
            expect(columnsHeader).to.deep.equal(['Group', 'name']);
        });
        it('should render a toggling icon only when a row has children', function () {
            render(<Test rows={[{ name: 'A' }, { name: 'A.C' }, { name: 'B' }, { name: 'B.A' }]} filterModel={{
                    logicOperator: x_data_grid_pro_1.GridLogicOperator.Or,
                    items: [
                        { field: 'name', operator: 'endsWith', value: 'A', id: 0 },
                        { field: 'name', operator: 'endsWith', value: 'B', id: 1 },
                    ],
                }}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'B']);
            // No children after filtering
            expect((0, helperFn_1.getCell)(0, 0).querySelectorAll('button')).to.have.length(0);
            // Some children after filtering
            expect((0, helperFn_1.getCell)(1, 0).querySelectorAll('button')).to.have.length(1);
        });
        it('should toggle expansion when clicking on grouping column icon', function () {
            render(<Test />);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'B', 'C']);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(0, 0).querySelector('button'));
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(0, 0).querySelector('button'));
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'B', 'C']);
        });
        it('should toggle expansion when pressing Space while focusing grouping column', function () {
            render(<Test />);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'B', 'C']);
            fireUserEvent_1.fireUserEvent.mousePress((0, helperFn_1.getCell)(0, 0));
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'B', 'C']);
            internal_test_utils_1.fireEvent.keyDown((0, helperFn_1.getCell)(0, 0), { key: ' ' });
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B', 'C']);
            internal_test_utils_1.fireEvent.keyDown((0, helperFn_1.getCell)(0, 0), { key: ' ' });
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'B', 'C']);
        });
        it('should add auto generated rows if some parents do not exist', function () {
            render(<Test rows={rowsWithGap} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'A.B', 'A.A', '', 'B.A', 'B.B']);
        });
        it('should keep the grouping column width between generations', function () {
            render(<Test groupingColDef={{ width: 200 }}/>);
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '200px' });
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateColumns([{ field: x_data_grid_pro_1.GRID_TREE_DATA_GROUPING_FIELD, width: 100 }]); });
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '100px' });
            (0, internal_test_utils_1.act)(function () {
                var _a;
                return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateColumns([
                    {
                        field: 'name',
                        headerName: 'New name',
                    },
                ]);
            });
            expect((0, helperFn_1.getColumnHeaderCell)(0)).toHaveInlineStyle({ width: '100px' });
        });
    });
    describe('pagination', function () {
        function PaginatedTest(_a) {
            var initialModel = _a.initialModel;
            var _b = React.useState(initialModel), paginationModel = _b[0], setPaginationModel = _b[1];
            return (<Test pagination paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} pageSizeOptions={[paginationModel.pageSize]}/>);
        }
        it('should respect the pageSize for the top level rows when toggling children expansion', function () {
            render(<PaginatedTest initialModel={{ pageSize: 2, page: 0 }}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'B']);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(0, 0).querySelector('button'));
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'A.A', 'A.B', 'B']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['C']);
        });
        it('should keep the row expansion when switching page', function () {
            render(<PaginatedTest initialModel={{ pageSize: 1, page: 0 }}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A']);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(0, 0).querySelector('button'));
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'A.A', 'A.B']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['B']);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(3, 0).querySelector('button'));
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['B', 'B.A', 'B.B']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /previous page/i }));
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A', 'A.A', 'A.B']);
            internal_test_utils_1.fireEvent.click((0, helperFn_1.getCell)(0, 0).querySelector('button'));
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A']);
            internal_test_utils_1.fireEvent.click(internal_test_utils_1.screen.getByRole('button', { name: /next page/i }));
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['B', 'B.A', 'B.B']);
        });
    });
    describe('filter', function () {
        it('should not show a node if none of its children match the filters and it does not match the filters', function () {
            render(<Test rows={[{ name: 'B' }, { name: 'B.B' }]} filterModel={{ items: [{ field: 'name', value: 'A', operator: 'endsWith' }] }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([]);
        });
        it('should show a node if some of its children match the filters even if it does not match the filters', function () {
            render(<Test rows={[{ name: 'B' }, { name: 'B.A' }, { name: 'B.B' }]} filterModel={{ items: [{ field: 'name', value: 'A', operator: 'endsWith' }] }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['B', 'B.A']);
        });
        it('should show a node if none of its children match the filters but it does match the filters', function () {
            render(<Test rows={[{ name: 'A' }, { name: 'A.B' }]} filterModel={{ items: [{ field: 'name', value: 'A', operator: 'endsWith' }] }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['A']);
        });
        it('should not filter the children if props.disableChildrenFiltering = true', function () {
            render(<Test rows={[{ name: 'B' }, { name: 'B.A' }, { name: 'B.B' }]} filterModel={{ items: [{ field: 'name', value: 'B', operator: 'endsWith' }] }} disableChildrenFiltering defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['B', 'B.A', 'B.B']);
        });
        it('should allow to toggle props.disableChildrenFiltering', function () {
            var setProps = render(<Test rows={[{ name: 'B' }, { name: 'B.A' }, { name: 'B.B' }]} filterModel={{ items: [{ field: 'name', value: 'B', operator: 'endsWith' }] }} defaultGroupingExpansionDepth={-1}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['B', 'B.B']);
            setProps({ disableChildrenFiltering: true });
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['B', 'B.A', 'B.B']);
            setProps({ disableChildrenFiltering: false });
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['B', 'B.B']);
        });
        it('should throw an error when using filterMode="server" and treeData', function () {
            expect(function () {
                render(<Test filterMode="server"/>);
            }).toErrorDev('MUI X: The `filterMode="server"` prop is not available when the `treeData` is enabled.');
        });
        it('should set the filtered descendant count on matching nodes even if the children are collapsed', function () {
            render(<Test filterModel={{ items: [{ field: 'name', value: 'A', operator: 'endsWith' }] }}/>);
            // A has A.A but not A.B
            // B has B.A (match filter), B.B (has matching children), B.B.A (match filters), B.B.A.A (match filters)
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['A (1)', 'B (4)']);
        });
        it('should apply quick filter without throwing error', function () {
            render(<Test initialState={{
                    filter: {
                        filterModel: {
                            items: [],
                            quickFilterValues: ['A', 'B'],
                        },
                    },
                }}/>);
            // A has A.A but not A.B
            // B has B.A (match filter), B.B (has matching children), B.B.A (match filters), B.B.A.A (match filters)
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['A (1)', 'B (4)']);
        });
        it('should remove generated rows when they and their children do not pass quick filter', function () {
            render(<Test rows={[
                    { name: 'A.B' },
                    { name: 'A.C' },
                    { name: 'B.C' },
                    { name: 'B.D' },
                    { name: 'D.A' },
                ]} filterModel={{ items: [], quickFilterValues: ['D'] }} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(0)).to.deep.equal(['B (1)', 'D', 'D (1)', 'A']);
        });
        it('should keep the correct count of the children and descendants in the filter state', function () {
            var _a, _b;
            render(<Test rows={[
                    { name: 'A' },
                    { name: 'A.A' },
                    { name: 'A.B' },
                    { name: 'A.B.A' },
                    { name: 'A.B.B' },
                    { name: 'A.C' },
                    { name: 'B' },
                    { name: 'B.A' },
                    { name: 'B.B' },
                    { name: 'B.C' },
                    { name: 'C' },
                ]} filterModel={{ items: [], quickFilterValues: ['A'] }} defaultGroupingExpansionDepth={3}/>);
            var _c = apiRef.current.state.filter, filteredChildrenCountLookup = _c.filteredChildrenCountLookup, filteredDescendantCountLookup = _c.filteredDescendantCountLookup;
            expect(filteredChildrenCountLookup.A).to.equal(3);
            expect(filteredDescendantCountLookup.A).to.equal(5);
            expect(filteredChildrenCountLookup.B).to.equal(1);
            expect(filteredDescendantCountLookup.B).to.equal(1);
            expect(filteredChildrenCountLookup.C).to.equal(undefined);
            expect(filteredDescendantCountLookup.C).to.equal(undefined);
            (0, internal_test_utils_1.act)(function () {
                var _a;
                (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.updateRows([{ name: 'A.D' }]);
            });
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.filter.filteredChildrenCountLookup.A).to.equal(4);
            expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.state.filter.filteredDescendantCountLookup.A).to.equal(6);
        });
    });
    describe('sorting', function () {
        it('should respect the prop order for a given depth when no sortModel provided', function () {
            render(<Test rows={[{ name: 'D' }, { name: 'A.B' }, { name: 'A' }, { name: 'A.A' }]} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal(['D', 'A', 'A.B', 'A.A']);
        });
        it('should apply the sortModel on every depth of the tree if props.disableChildrenSorting = false', function () {
            render(<Test sortModel={[{ field: 'name', sort: 'desc' }]} defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'C',
                'B',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'B.A',
                'A',
                'A.B',
                'A.A',
            ]);
        });
        it('should only apply the sortModel on top level rows if props.disableChildrenSorting = true', function () {
            render(<Test sortModel={[{ field: 'name', sort: 'desc' }]} disableChildrenSorting defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'C',
                'B',
                'B.A',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'A',
                'A.A',
                'A.B',
            ]);
        });
        it('should allow to toggle props.disableChildrenSorting', function () {
            var setProps = render(<Test sortModel={[{ field: 'name', sort: 'desc' }]} defaultGroupingExpansionDepth={-1}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'C',
                'B',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'B.A',
                'A',
                'A.B',
                'A.A',
            ]);
            setProps({ disableChildrenSorting: true });
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'C',
                'B',
                'B.A',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'A',
                'A.A',
                'A.B',
            ]);
            setProps({ disableChildrenSorting: false });
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'C',
                'B',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'B.A',
                'A',
                'A.B',
                'A.A',
            ]);
        });
        it('should update the order server side', function () {
            var setProps = render(<Test sortingMode="server" defaultGroupingExpansionDepth={-1}/>).setProps;
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'A',
                'A.A',
                'A.B',
                'B',
                'B.A',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'C',
            ]);
            setProps({
                rows: [
                    { name: 'C' },
                    { name: 'B' },
                    { name: 'B.B' },
                    { name: 'B.B.A' },
                    { name: 'B.B.A.A' },
                    { name: 'B.A' },
                    { name: 'A' },
                    { name: 'A.B' },
                    { name: 'A.A' },
                ],
            });
            expect((0, helperFn_1.getColumnValues)(1)).to.deep.equal([
                'C',
                'B',
                'B.B',
                'B.B.A',
                'B.B.A.A',
                'B.A',
                'A',
                'A.B',
                'A.A',
            ]);
        });
    });
    describe('accessibility', function () {
        it('should add necessary treegrid aria attributes to the rows', function () {
            render(<Test defaultGroupingExpansionDepth={-1}/>);
            expect((0, helperFn_1.getRow)(0).getAttribute('aria-level')).to.equal('1'); // A
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-level')).to.equal('2'); // A.A
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-posinset')).to.equal('1');
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-setsize')).to.equal('2');
            expect((0, helperFn_1.getRow)(2).getAttribute('aria-level')).to.equal('2'); // A.B
            expect((0, helperFn_1.getRow)(4).getAttribute('aria-posinset')).to.equal('1'); // B.A
        });
        it('should adjust treegrid aria attributes after filtering', function () {
            render(<Test defaultGroupingExpansionDepth={-1} initialState={{
                    filter: {
                        filterModel: {
                            items: [],
                            quickFilterValues: ['B'],
                        },
                    },
                }}/>);
            expect((0, helperFn_1.getRow)(0).getAttribute('aria-level')).to.equal('1'); // A
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-level')).to.equal('2'); // A.B
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-posinset')).to.equal('1');
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-setsize')).to.equal('1'); // A.A is filtered out, set size is now 1
            expect((0, helperFn_1.getRow)(2).getAttribute('aria-level')).to.equal('1'); // B
            expect((0, helperFn_1.getRow)(3).getAttribute('aria-posinset')).to.equal('1'); // B.A
            expect((0, helperFn_1.getRow)(3).getAttribute('aria-setsize')).to.equal('2'); // B.A & B.B
        });
        it('should not add the set specific aria attributes to pinned rows', function () {
            render(<Test defaultGroupingExpansionDepth={-1} pinnedRows={{
                    top: [
                        {
                            name: 'Pin',
                        },
                    ],
                }}/>);
            expect((0, helperFn_1.getRow)(0).getAttribute('aria-rowindex')).to.equal('2'); // header row is 1
            expect((0, helperFn_1.getRow)(0).getAttribute('aria-level')).to.equal(null);
            expect((0, helperFn_1.getRow)(0).getAttribute('aria-posinset')).to.equal(null);
            expect((0, helperFn_1.getRow)(0).getAttribute('aria-setsize')).to.equal(null);
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-rowindex')).to.equal('3');
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-level')).to.equal('1'); // A
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-posinset')).to.equal('1');
            expect((0, helperFn_1.getRow)(1).getAttribute('aria-setsize')).to.equal('3'); // A, B, C
        });
    });
    describe('regressions', function () {
        // See https://github.com/mui/mui-x/issues/9402
        it('should not fail with checkboxSelection', function () {
            var initialRows = rowsWithoutGap;
            var setProps = render(<Test checkboxSelection rows={initialRows}/>).setProps;
            var newRows = __spreadArray([], initialRows, true);
            newRows.splice(7, 1);
            setProps({
                rows: newRows,
            });
        });
    });
});
