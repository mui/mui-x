"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var x_data_grid_1 = require("@mui/x-data-grid");
var createRowTree_1 = require("./createRowTree");
var getGroupExpansion = function (tree) {
    return Object.values(tree)
        .sort(function (a, b) { return a.depth - b.depth; })
        .map(function (node) { return ({
        id: node.id,
        childrenExpanded: node.type === 'group' ? node.childrenExpanded : undefined,
    }); });
};
describe('createRowTree', function () {
    describe('group expansion', function () {
        it('should not expand the groups when defaultGroupingExpansionDepth === 0', function () {
            var response = (0, createRowTree_1.createRowTree)({
                groupingName: '',
                nodes: [
                    { id: 0, path: [{ key: 'A', field: null }] },
                    {
                        id: 1,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                ],
                defaultGroupingExpansionDepth: 0,
                previousTree: null,
            });
            expect(getGroupExpansion(response.tree)).to.deep.equal([
                { id: x_data_grid_1.GRID_ROOT_GROUP_ID, childrenExpanded: true },
                { id: 0, childrenExpanded: false },
                { id: 1, childrenExpanded: undefined },
            ]);
        });
        it('should expand the groups up to defaultGroupingExpansionDepth', function () {
            var response = (0, createRowTree_1.createRowTree)({
                groupingName: '',
                nodes: [
                    { id: 0, path: [{ key: 'A', field: null }] },
                    {
                        id: 1,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                    {
                        id: 2,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                ],
                defaultGroupingExpansionDepth: 1,
                previousTree: null,
            });
            expect(getGroupExpansion(response.tree)).to.deep.equal([
                { id: x_data_grid_1.GRID_ROOT_GROUP_ID, childrenExpanded: true },
                { id: 0, childrenExpanded: true },
                { id: 1, childrenExpanded: false },
                { id: 2, childrenExpanded: undefined },
            ]);
        });
        it('should expand the auto-generated groups up to defaultGroupingExpansionDepth', function () {
            var response = (0, createRowTree_1.createRowTree)({
                groupingName: '',
                nodes: [
                    {
                        id: 2,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                ],
                defaultGroupingExpansionDepth: 1,
                previousTree: null,
            });
            expect(getGroupExpansion(response.tree)).to.deep.equal([
                { id: x_data_grid_1.GRID_ROOT_GROUP_ID, childrenExpanded: true },
                { id: 'auto-generated-row-null/A', childrenExpanded: true },
                { id: 'auto-generated-row-null/A-null/A', childrenExpanded: false },
                { id: 2, childrenExpanded: undefined },
            ]);
        });
        it('should expand all the groups when defaultGroupingExpansionDepth === -1', function () {
            var response = (0, createRowTree_1.createRowTree)({
                groupingName: '',
                nodes: [
                    { id: 0, path: [{ key: 'A', field: null }] },
                    {
                        id: 1,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                    {
                        id: 2,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                ],
                defaultGroupingExpansionDepth: -1,
                previousTree: null,
            });
            expect(getGroupExpansion(response.tree)).to.deep.equal([
                { id: x_data_grid_1.GRID_ROOT_GROUP_ID, childrenExpanded: true },
                { id: 0, childrenExpanded: true },
                { id: 1, childrenExpanded: true },
                { id: 2, childrenExpanded: undefined },
            ]);
        });
    });
    describe('tree - parent and children', function () {
        it('should link parent and children in the tree', function () {
            var response = (0, createRowTree_1.createRowTree)({
                groupingName: '',
                nodes: [
                    { id: 0, path: [{ key: 'A', field: null }] },
                    {
                        id: 1,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                ],
                defaultGroupingExpansionDepth: 0,
                previousTree: null,
            });
            expect(response.tree[x_data_grid_1.GRID_ROOT_GROUP_ID].children).includes(0);
            expect(response.tree[0].parent).to.equal(x_data_grid_1.GRID_ROOT_GROUP_ID);
            expect(response.tree[0].children).includes(1);
            expect(response.tree[1].parent).to.equal(0);
        });
        it('should add auto generated row when missing parent', function () {
            var response = (0, createRowTree_1.createRowTree)({
                groupingName: '',
                nodes: [
                    { id: 0, path: [{ key: 'A', field: null }] },
                    {
                        id: 1,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                ],
                defaultGroupingExpansionDepth: 0,
                previousTree: null,
            });
            expect(response.tree[0].children).to.includes('auto-generated-row-null/A-null/A');
            expect(response.tree['auto-generated-row-null/A-null/A'].parent).to.equal(0);
            expect(response.tree[1].parent).to.equal('auto-generated-row-null/A-null/A');
        });
        it('should allow to have a non-auto-generated group as children of an auto-generated-group', function () {
            var response = (0, createRowTree_1.createRowTree)({
                groupingName: '',
                nodes: [
                    {
                        id: 0,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                    {
                        id: 1,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                ],
                defaultGroupingExpansionDepth: 0,
                previousTree: null,
            });
            expect(response.tree[0].parent).to.equal('auto-generated-row-null/A');
            expect(response.tree['auto-generated-row-null/A'].children).to.includes(0);
            expect(response.tree[1].parent).to.equal(0);
            expect(response.tree[0].children).to.includes(1);
        });
        it('should allow to have two rows with the same field at various depth', function () {
            var response = (0, createRowTree_1.createRowTree)({
                groupingName: '',
                nodes: [
                    {
                        id: 0,
                        path: [
                            { key: 'V1', field: 'F1' },
                            { key: 'V2', field: 'F2' },
                            { key: 'LEAF', field: null },
                        ],
                    },
                    {
                        id: 1,
                        path: [
                            { key: 'V2', field: 'F2' },
                            { key: 'LEAF', field: null },
                        ],
                    },
                ],
                defaultGroupingExpansionDepth: -1,
                previousTree: null,
            });
            // The tree created looks like this:
            // "V1"
            //     "V2"
            //         "LEAF"
            // "V2"
            //    "LEAF"
            expect(response.tree[0].parent).to.equal('auto-generated-row-F1/V1-F2/V2');
            expect(response.tree['auto-generated-row-F1/V1-F2/V2'].children).to.includes(0);
            expect(response.tree[1].parent).to.equal('auto-generated-row-F2/V2');
            expect(response.tree['auto-generated-row-F2/V2'].children).to.includes(1);
        });
        it('should be able to create a children before its non-auto-generated parent group', function () {
            var response = (0, createRowTree_1.createRowTree)({
                groupingName: '',
                nodes: [
                    {
                        id: 1,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                    { id: 0, path: [{ key: 'A', field: null }] },
                ],
                defaultGroupingExpansionDepth: 0,
                previousTree: null,
            });
            expect(response.tree[x_data_grid_1.GRID_ROOT_GROUP_ID].children).includes(0);
            expect(response.tree[0].parent).to.equal(x_data_grid_1.GRID_ROOT_GROUP_ID);
            expect(response.tree[0].children).includes(1);
            expect(response.tree[1].parent).to.equal(0);
        });
    });
    describe('tree depth', function () {
        it('should track the node count at each depth of the tree', function () {
            var response = (0, createRowTree_1.createRowTree)({
                groupingName: '',
                nodes: [
                    { id: 0, path: [{ key: 'A', field: null }] },
                    {
                        id: 1,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                    {
                        id: 2,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                        ],
                    },
                    {
                        id: 3,
                        path: [
                            { key: 'A', field: null },
                            { key: 'A', field: null },
                            { key: 'B', field: null },
                        ],
                    },
                ],
                defaultGroupingExpansionDepth: 0,
                previousTree: null,
            });
            expect(response.treeDepths).to.deep.equal({ 0: 1, 1: 1, 2: 2 });
        });
    });
});
