import { expect } from 'chai';
import { GRID_ROOT_GROUP_ID } from '@mui/x-data-grid';
import { createRowTree } from './createRowTree';

describe('createRowTree', () => {
  it('should not expand the rows when defaultGroupingExpansionDepth === 0', () => {
    const response = createRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
        2: {},
      },
      idToIdLookup: { 0: 0, 1: 1, 2: 2 },
      ids: [0, 1, 2],
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
            { key: 'B', field: null },
          ],
        },
      ],
      defaultGroupingExpansionDepth: 0,
    });

    expect(
      Object.values(response.tree).map((node) => ({
        id: node.id,
        childrenExpanded: node.type === 'group' ? node.childrenExpanded : undefined,
      })),
    ).to.deep.equal([
      { id: 0, childrenExpanded: false },
      { id: 1, childrenExpanded: undefined },
      { id: 2, childrenExpanded: undefined },
      { id: GRID_ROOT_GROUP_ID, childrenExpanded: true },
    ]);
  });

  it('should expand the rows up to defaultGroupingExpansionDepth', () => {
    const response = createRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
        2: {},
      },
      idToIdLookup: { 0: 0, 1: 1, 2: 2 },
      ids: [0, 1, 2],
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
    });

    expect(
      Object.values(response.tree).map((node) => ({
        id: node.id,
        childrenExpanded: node.type === 'group' ? node.childrenExpanded : undefined,
      })),
    ).to.deep.equal([
      { id: 0, childrenExpanded: true },
      { id: 1, childrenExpanded: false },
      { id: 2, childrenExpanded: undefined },
      { id: GRID_ROOT_GROUP_ID, childrenExpanded: true },
    ]);
  });

  it('should expanded all the rows when defaultGroupingExpansionDepth === -1', () => {
    const response = createRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
        2: {},
      },
      idToIdLookup: { 0: 0, 1: 1, 2: 2 },
      ids: [0, 1, 2],
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
    });

    expect(
      Object.values(response.tree).map((node) => ({
        id: node.id,
        childrenExpanded: node.type === 'group' ? node.childrenExpanded : undefined,
      })),
    ).to.deep.equal([
      { id: 0, childrenExpanded: true },
      { id: 1, childrenExpanded: true },
      { id: 2, childrenExpanded: undefined },
      { id: GRID_ROOT_GROUP_ID, childrenExpanded: true },
    ]);
  });

  it('should link parent and children in the tree', () => {
    const response = createRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
        2: {},
        3: {},
      },
      idToIdLookup: { 0: 0, 1: 1, 2: 2 },
      ids: [0, 1, 2, 3],
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
    });

    expect(
      Object.values(response.tree).map((node) => ({
        id: node.id,
        parent: node.parent,
        children: node.type === 'group' ? node.children : undefined,
      })),
    ).to.deep.equal([
      { id: 0, parent: GRID_ROOT_GROUP_ID, children: [1] },
      { id: 1, parent: 0, children: [2, 3] },
      { id: 2, parent: 1, children: undefined },
      { id: 3, parent: 1, children: undefined },
      { id: GRID_ROOT_GROUP_ID, parent: null, children: [0] },
    ]);
  });

  it('should calculate the depth of the tree', () => {
    const response = createRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
        2: {},
        3: {},
      },
      idToIdLookup: { 0: 0, 1: 1, 2: 2 },
      ids: [0, 1, 2, 3],
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
    });

    expect(response.treeDepth).to.equal(3);
  });

  it('should add auto generated row when missing parent', () => {
    const response = createRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
      },
      idToIdLookup: { 0: 0, 1: 1 },
      ids: [0, 1],
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
    });

    expect(response).to.deep.equal({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
        'auto-generated-row-null/A-null/A': {},
      },
      idToIdLookup: { 0: 0, 1: 1 },
      ids: [0, 1, 'auto-generated-row-null/A-null/A'],
      treeDepth: 3,
      tree: {
        [GRID_ROOT_GROUP_ID]: {
          type: 'group',
          id: GRID_ROOT_GROUP_ID,
          depth: -1,
          groupingField: null,
          groupingKey: null,
          isAutoGenerated: true,
          children: [0],
          parent: null,
          childrenExpanded: true,
        },
        0: {
          type: 'group',
          children: ['auto-generated-row-null/A-null/A'],
          depth: 0,
          childrenExpanded: false,
          groupingField: null,
          groupingKey: 'A',
          id: 0,
          parent: GRID_ROOT_GROUP_ID,
          isAutoGenerated: false,
        },
        'auto-generated-row-null/A-null/A': {
          type: 'group',
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
          type: 'leaf',
          depth: 2,
          id: 1,
          parent: 'auto-generated-row-null/A-null/A',
          groupingKey: 'A',
        },
      },
    });
  });

  it('should allow to have two rows with the same field at various depth', () => {
    const response = createRowTree({
      groupingName: '',
      idRowsLookup: {
        0: {},
        1: {},
      },
      idToIdLookup: { 0: 0, 1: 1, 2: 2 },
      ids: [0, 1],
      nodes: [
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
      [GRID_ROOT_GROUP_ID]: {
        type: 'group',
        id: GRID_ROOT_GROUP_ID,
        depth: -1,
        groupingField: null,
        groupingKey: null,
        isAutoGenerated: true,
        children: ['auto-generated-row-field1/value-1-1', 'auto-generated-row-field2/value-2-1'],
        parent: null,
        childrenExpanded: true,
      },
      '0': {
        id: 0,
        parent: 'auto-generated-row-field1/value-1-1-field2/value-2-1',
        depth: 2,
        type: 'leaf',
        groupingKey: 'value-leaf-1',
      },
      '1': {
        id: 1,
        parent: 'auto-generated-row-field2/value-2-1',
        depth: 1,
        type: 'leaf',
        groupingKey: 'value-leaf-1',
      },
      'auto-generated-row-field1/value-1-1': {
        id: 'auto-generated-row-field1/value-1-1',
        isAutoGenerated: true,
        childrenExpanded: true,
        parent: GRID_ROOT_GROUP_ID,
        groupingKey: 'value-1-1',
        groupingField: 'field1',
        depth: 0,
        children: ['auto-generated-row-field1/value-1-1-field2/value-2-1'],
        type: 'group',
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
        type: 'group',
      },
      'auto-generated-row-field2/value-2-1': {
        id: 'auto-generated-row-field2/value-2-1',
        isAutoGenerated: true,
        childrenExpanded: true,
        parent: GRID_ROOT_GROUP_ID,
        groupingKey: 'value-2-1',
        groupingField: 'field2',
        depth: 0,
        children: [1],
        type: 'group',
      },
    });
  });
});
