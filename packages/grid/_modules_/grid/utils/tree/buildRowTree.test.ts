import { expect } from 'chai';
import { buildRowTree } from './buildRowTree';

// TODO: Add tests for multi-field grouping
describe('buildRowTree', () => {
  it('should not expand the rows when defaultGroupingExpansionDepth === 0', () => {
    const response = buildRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
        2: {},
      },
      ids: [0, 1, 2],
      rows: [
        { id: 0, path: [{ key: 'A', field: null }] },
        { id: 1, path: [{ key: 'A', field: null }] },
        { id: 2, path: [{ key: 'A', field: null }] },
      ],
      defaultGroupingExpansionDepth: 0,
    });

    expect(
      Object.values(response.tree).map((node) => ({
        id: node.id,
        childrenExpanded: node.childrenExpanded,
      })),
    ).to.deep.equal([
      { id: 0, childrenExpanded: false },
      { id: 1, childrenExpanded: false },
      { id: 2, childrenExpanded: false },
    ]);
  });

  it('should expand the rows up to defaultGroupingExpansionDepth', () => {
    const response = buildRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
        2: {},
      },
      ids: [0, 1, 2],
      rows: [
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
      defaultGroupingExpansionDepth: 2,
    });

    expect(
      Object.values(response.tree).map((node) => ({
        id: node.id,
        childrenExpanded: node.childrenExpanded,
      })),
    ).to.deep.equal([
      { id: 0, childrenExpanded: true },
      { id: 1, childrenExpanded: true },
      { id: 2, childrenExpanded: false },
    ]);
  });

  it('should expanded all the rows when defaultGroupingExpansionDepth === -1', () => {
    const response = buildRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
        2: {},
      },
      ids: [0, 1, 2],
      rows: [
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
    });

    expect(
      Object.values(response.tree).map((node) => ({
        id: node.id,
        childrenExpanded: node.childrenExpanded,
      })),
    ).to.deep.equal([
      { id: 0, childrenExpanded: true },
      { id: 1, childrenExpanded: true },
      { id: 2, childrenExpanded: true },
    ]);
  });

  it('should link parent and children in the tree', () => {
    const response = buildRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
        2: {},
        3: {},
      },
      ids: [0, 1, 2, 3],
      rows: [
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
    });

    expect(
      Object.values(response.tree).map((node) => ({
        id: node.id,
        parent: node.parent,
        children: node.children,
      })),
    ).to.deep.equal([
      { id: 0, parent: null, children: [1] },
      { id: 1, parent: 0, children: [2, 3] },
      { id: 2, parent: 1, children: undefined },
      { id: 3, parent: 1, children: undefined },
    ]);
  });

  it('should calculate the depth of the tree', () => {
    const response = buildRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
        2: {},
        3: {},
      },
      ids: [0, 1, 2, 3],
      rows: [
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
    });

    expect(response.treeDepth).to.equal(3);
  });

  it('should add auto generated row when missing parent', () => {
    const response = buildRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
      },
      ids: [0, 1],
      rows: [
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
    });

    expect(response).to.deep.equal({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
        'auto-generated-row-null/A-null/A': {},
      },
      ids: [0, 1, 'auto-generated-row-null/A-null/A'],
      treeDepth: 3,
      tree: {
        0: {
          children: ['auto-generated-row-null/A-null/A'],
          depth: 0,
          childrenExpanded: false,
          groupingField: null,
          groupingKey: 'A',
          id: 0,
          parent: null,
        },
        'auto-generated-row-null/A-null/A': {
          children: [1],
          depth: 1,
          childrenExpanded: false,
          groupingField: null,
          groupingKey: 'A',
          id: 'auto-generated-row-null/A-null/A',
          isAutoGenerated: true,
          parent: 0,
        },
        1: {
          children: undefined,
          depth: 2,
          childrenExpanded: false,
          groupingField: null,
          groupingKey: 'A',
          id: 1,
          parent: 'auto-generated-row-null/A-null/A',
        },
      },
    });
  });
});
