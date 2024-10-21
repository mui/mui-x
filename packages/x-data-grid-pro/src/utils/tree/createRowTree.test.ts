import { expect } from 'chai';
import { GRID_ROOT_GROUP_ID, GridGroupNode, GridRowTreeConfig } from '@mui/x-data-grid';
import { createRowTree } from './createRowTree';

const getGroupExpansion = (tree: GridRowTreeConfig) =>
  Object.values(tree)
    .sort((a, b) => a.depth - b.depth)
    .map((node) => ({
      id: node.id,
      childrenExpanded: node.type === 'group' ? node.childrenExpanded : undefined,
    }));

describe('createRowTree', () => {
  describe('group expansion', () => {
    it('should not expand the groups when defaultGroupingExpansionDepth === 0', () => {
      const response = createRowTree({
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
        { id: GRID_ROOT_GROUP_ID, childrenExpanded: true },
        { id: 0, childrenExpanded: false },
        { id: 1, childrenExpanded: undefined },
      ]);
    });

    it('should expand the groups up to defaultGroupingExpansionDepth', () => {
      const response = createRowTree({
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
        { id: GRID_ROOT_GROUP_ID, childrenExpanded: true },
        { id: 0, childrenExpanded: true },
        { id: 1, childrenExpanded: false },
        { id: 2, childrenExpanded: undefined },
      ]);
    });

    it('should expand the auto-generated groups up to defaultGroupingExpansionDepth', () => {
      const response = createRowTree({
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
        { id: GRID_ROOT_GROUP_ID, childrenExpanded: true },
        { id: 'auto-generated-row-null/A', childrenExpanded: true },
        { id: 'auto-generated-row-null/A-null/A', childrenExpanded: false },
        { id: 2, childrenExpanded: undefined },
      ]);
    });

    it('should expand all the groups when defaultGroupingExpansionDepth === -1', () => {
      const response = createRowTree({
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
        { id: GRID_ROOT_GROUP_ID, childrenExpanded: true },
        { id: 0, childrenExpanded: true },
        { id: 1, childrenExpanded: true },
        { id: 2, childrenExpanded: undefined },
      ]);
    });
  });

  describe('tree - parent and children', () => {
    it('should link parent and children in the tree', () => {
      const response = createRowTree({
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

      expect((response.tree[GRID_ROOT_GROUP_ID] as GridGroupNode).children).includes(0);
      expect(response.tree[0].parent).to.equal(GRID_ROOT_GROUP_ID);
      expect((response.tree[0] as GridGroupNode).children).includes(1);
      expect(response.tree[1].parent).to.equal(0);
    });

    it('should add auto generated row when missing parent', () => {
      const response = createRowTree({
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

      expect((response.tree[0] as GridGroupNode).children).to.includes(
        'auto-generated-row-null/A-null/A',
      );
      expect(response.tree['auto-generated-row-null/A-null/A'].parent).to.equal(0);
      expect(response.tree[1].parent).to.equal('auto-generated-row-null/A-null/A');
    });

    it('should allow to have a non-auto-generated group as children of an auto-generated-group', () => {
      const response = createRowTree({
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
      expect((response.tree['auto-generated-row-null/A'] as GridGroupNode).children).to.includes(0);
      expect(response.tree[1].parent).to.equal(0);
      expect((response.tree[0] as GridGroupNode).children).to.includes(1);
    });

    it('should allow to have two rows with the same field at various depth', () => {
      const response = createRowTree({
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
      expect(
        (response.tree['auto-generated-row-F1/V1-F2/V2'] as GridGroupNode).children,
      ).to.includes(0);

      expect(response.tree[1].parent).to.equal('auto-generated-row-F2/V2');
      expect((response.tree['auto-generated-row-F2/V2'] as GridGroupNode).children).to.includes(1);
    });

    it('should be able to create a children before its non-auto-generated parent group', () => {
      const response = createRowTree({
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

      expect((response.tree[GRID_ROOT_GROUP_ID] as GridGroupNode).children).includes(0);
      expect(response.tree[0].parent).to.equal(GRID_ROOT_GROUP_ID);
      expect((response.tree[0] as GridGroupNode).children).includes(1);
      expect(response.tree[1].parent).to.equal(0);
    });
  });

  describe('tree depth', () => {
    it('should track the node count at each depth of the tree', () => {
      const response = createRowTree({
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
