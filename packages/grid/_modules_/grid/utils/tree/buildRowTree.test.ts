import { expect } from 'chai';
import { buildRowTree } from './buildRowTree';

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

  it('should allow to have two rows with the same field at various depth', () => {
    const response = buildRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
      },
      ids: [0, 1],
      rows: [
        {
          id: 0,
          path: [
            { key: 'value-1-1', field: 'field1' },
            { key: 'value-2-1', field: 'field2' },
            { key: 'value-leaf-1', field: null },
          ],
        },
        {
          id: 1,
          path: [
            { key: 'value-2-1', field: 'field2' },
            { key: 'value-leaf-1', field: null },
          ],
        },
      ],
      defaultGroupingExpansionDepth: -1,
    });

    // The tree structure:
    // "value-1-1"
    //     "value-2-1"
    //         "value-leaf-1"
    // "value-2-1"
    //    "value-leaf-1"
    expect(response.tree).to.deep.equal({
      '0': {
        id: 0,
        childrenExpanded: true,
        parent: 'auto-generated-row-field1/value-1-1-field2/value-2-1',
        groupingKey: 'value-leaf-1',
        groupingField: null,
        depth: 2,
        children: undefined,
      },
      '1': {
        id: 1,
        childrenExpanded: true,
        parent: 'auto-generated-row-field2/value-2-1',
        groupingKey: 'value-leaf-1',
        groupingField: null,
        depth: 1,
        children: undefined,
      },
      'auto-generated-row-field1/value-1-1': {
        id: 'auto-generated-row-field1/value-1-1',
        isAutoGenerated: true,
        childrenExpanded: true,
        parent: null,
        groupingKey: 'value-1-1',
        groupingField: 'field1',
        depth: 0,
        children: ['auto-generated-row-field1/value-1-1-field2/value-2-1'],
      },
      'auto-generated-row-field1/value-1-1-field2/value-2-1': {
        id: 'auto-generated-row-field1/value-1-1-field2/value-2-1',
        isAutoGenerated: true,
        childrenExpanded: true,
        parent: 'auto-generated-row-field1/value-1-1',
        groupingKey: 'value-2-1',
        groupingField: 'field2',
        depth: 1,
        children: [0],
      },
      'auto-generated-row-field2/value-2-1': {
        id: 'auto-generated-row-field2/value-2-1',
        isAutoGenerated: true,
        childrenExpanded: true,
        parent: null,
        groupingKey: 'value-2-1',
        groupingField: 'field2',
        depth: 0,
        children: [1],
      },
    });
  });
});
