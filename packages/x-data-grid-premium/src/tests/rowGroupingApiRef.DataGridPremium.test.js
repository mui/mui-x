"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var internal_test_utils_1 = require("@mui/internal-test-utils");
var x_data_grid_premium_1 = require("@mui/x-data-grid-premium");
var skipIf_1 = require("test/utils/skipIf");
var rows = [
    { id: 0, category1: 'Cat A', category2: 'Cat 1' },
    { id: 1, category1: 'Cat A', category2: 'Cat 2' },
    { id: 2, category1: 'Cat A', category2: 'Cat 2' },
    { id: 3, category1: 'Cat B', category2: 'Cat 2' },
    { id: 4, category1: 'Cat B', category2: 'Cat 1' },
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
    describe('apiRef: addRowGroupingCriteria', function () {
        it('should add grouping criteria to model', function () {
            var _a;
            render(<Test initialState={{ rowGrouping: { model: ['category1'] } }}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.addRowGroupingCriteria('category2'); });
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rowGrouping.model).to.deep.equal(['category1', 'category2']);
        });
        it('should add grouping criteria to model at the right position', function () {
            var _a;
            render(<Test initialState={{ rowGrouping: { model: ['category1'] } }}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.addRowGroupingCriteria('category2', 0); });
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rowGrouping.model).to.deep.equal(['category2', 'category1']);
        });
    });
    describe('apiRef: removeRowGroupingCriteria', function () {
        it('should remove field from model', function () {
            var _a;
            render(<Test initialState={{ rowGrouping: { model: ['category1'] } }}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.removeRowGroupingCriteria('category1'); });
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rowGrouping.model).to.deep.equal([]);
        });
    });
    describe('apiRef: setRowGroupingCriteriaIndex', function () {
        it('should change the grouping criteria order', function () {
            var _a;
            render(<Test initialState={{ rowGrouping: { model: ['category1', 'category2'] } }}/>);
            (0, internal_test_utils_1.act)(function () { var _a; return (_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.setRowGroupingCriteriaIndex('category1', 1); });
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.state.rowGrouping.model).to.deep.equal(['category2', 'category1']);
        });
    });
    describe('apiRef: getRowGroupChildren', function () {
        it('should return the rows in group of depth 0 of length 1 from tree of depth 1', function () {
            var _a, _b, _c, _d;
            render(<Test initialState={{
                    rowGrouping: { model: ['category1'] },
                    sorting: {
                        sortModel: [{ field: 'id', sort: 'desc' }],
                    },
                    filter: {
                        filterModel: {
                            items: [{ field: 'id', operator: '>=', value: '1' }],
                        },
                    },
                }}/>);
            var groupId = (0, x_data_grid_premium_1.getGroupRowIdFromPath)([{ field: 'category1', key: 'Cat A' }]);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getRowGroupChildren({ groupId: groupId })).to.deep.equal([0, 1, 2]);
            expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getRowGroupChildren({ groupId: groupId, applySorting: true })).to.deep.equal([
                2, 1, 0,
            ]);
            expect((_c = apiRef.current) === null || _c === void 0 ? void 0 : _c.getRowGroupChildren({ groupId: groupId, applyFiltering: true })).to.deep.equal([
                1, 2,
            ]);
            expect((_d = apiRef.current) === null || _d === void 0 ? void 0 : _d.getRowGroupChildren({
                groupId: groupId,
                applySorting: true,
                applyFiltering: true,
            })).to.deep.equal([2, 1]);
        });
        it('should return the rows in group of depth 0 from tree of depth 2', function () {
            var _a, _b, _c, _d, _e, _f;
            render(<Test initialState={{
                    rowGrouping: { model: ['category1', 'category2'] },
                    sorting: {
                        sortModel: [{ field: 'id', sort: 'desc' }],
                    },
                    filter: {
                        filterModel: {
                            items: [{ field: 'id', operator: '>=', value: '1' }],
                        },
                    },
                }}/>);
            var groupId = (0, x_data_grid_premium_1.getGroupRowIdFromPath)([{ field: 'category1', key: 'Cat A' }]);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getRowGroupChildren({ groupId: groupId })).to.deep.equal([0, 1, 2]);
            expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getRowGroupChildren({ groupId: groupId, applySorting: true })).to.deep.equal([
                0, 2, 1,
            ]);
            expect((_c = apiRef.current) === null || _c === void 0 ? void 0 : _c.getRowGroupChildren({ groupId: groupId, applyFiltering: true })).to.deep.equal([
                1, 2,
            ]);
            expect((_d = apiRef.current) === null || _d === void 0 ? void 0 : _d.getRowGroupChildren({
                groupId: groupId,
                applySorting: true,
                applyFiltering: true,
            })).to.deep.equal([2, 1]);
            expect((_e = apiRef.current) === null || _e === void 0 ? void 0 : _e.getRowGroupChildren({
                groupId: groupId,
                skipAutoGeneratedRows: false,
            })).to.deep.equal([
                'auto-generated-row-category1/Cat A-category2/Cat 1',
                0,
                'auto-generated-row-category1/Cat A-category2/Cat 2',
                1,
                2,
            ]);
            expect((_f = apiRef.current) === null || _f === void 0 ? void 0 : _f.getRowGroupChildren({
                groupId: groupId,
                skipAutoGeneratedRows: false,
                applySorting: true,
                applyFiltering: true,
            })).to.deep.equal(['auto-generated-row-category1/Cat A-category2/Cat 2', 2, 1]);
        });
        it('should return the rows in group of depth 1 from tree of depth 2', function () {
            var _a, _b, _c;
            render(<Test initialState={{
                    rowGrouping: { model: ['category1', 'category2'] },
                    sorting: {
                        sortModel: [{ field: 'id', sort: 'desc' }],
                    },
                    filter: {
                        filterModel: {
                            items: [{ field: 'id', operator: '>=', value: '2' }],
                        },
                    },
                }}/>);
            var groupId = (0, x_data_grid_premium_1.getGroupRowIdFromPath)([
                { field: 'category1', key: 'Cat A' },
                { field: 'category2', key: 'Cat 2' },
            ]);
            expect((_a = apiRef.current) === null || _a === void 0 ? void 0 : _a.getRowGroupChildren({ groupId: groupId })).to.deep.equal([1, 2]);
            expect((_b = apiRef.current) === null || _b === void 0 ? void 0 : _b.getRowGroupChildren({ groupId: groupId, applySorting: true })).to.deep.equal([
                2, 1,
            ]);
            expect((_c = apiRef.current) === null || _c === void 0 ? void 0 : _c.getRowGroupChildren({ groupId: groupId, applyFiltering: true })).to.deep.equal([
                2,
            ]);
        });
    });
});
