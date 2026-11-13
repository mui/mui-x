import { describe, it, expect } from 'vitest';
import type { GridStateCommunity } from '../../../models/gridStateCommunity';
import type { GridRowSelectionModel } from '../../../models/gridRowSelectionModel';
import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import {
  gridRetainedRowSelectionLookupSelector,
  gridRowSelectionTreeSelector,
} from './gridRowSelectionRetention';
import type { GridRowSelectionRetention, GridRowSelectionTree } from './gridRowSelectionRetention';

function createApiRef(
  retainedRows: GridRowSelectionRetention,
  rowSelection: GridRowSelectionModel = { type: 'include', ids: new Set() },
  tree: GridRowSelectionTree = {
    [GRID_ROOT_GROUP_ID]: { type: 'group' as const, parent: null, children: ['G'] },
    G: { type: 'group', parent: GRID_ROOT_GROUP_ID, children: [] },
  },
) {
  return {
    current: {
      state: {
        rows: { tree },
        rowSelectionRetention: retainedRows,
        rowSelection,
      } as GridStateCommunity,
    },
  };
}

describe('row selection retention selectors', () => {
  it('should reuse the live tree when no rows are retained', () => {
    const apiRef = createApiRef(new Map());

    expect(gridRowSelectionTreeSelector(apiRef)).to.equal(apiRef.current.state.rows.tree);
    expect(gridRetainedRowSelectionLookupSelector(apiRef).size).to.equal(0);
  });

  it('should attach unloaded descendants without overwriting or mutating live rows', () => {
    const tree: GridRowSelectionTree = {
      [GRID_ROOT_GROUP_ID]: { type: 'group' as const, parent: null, children: ['G', 'H'] },
      G: { type: 'group', parent: GRID_ROOT_GROUP_ID, children: [] },
      H: { type: 'group', parent: GRID_ROOT_GROUP_ID, children: ['A'] },
      A: { type: 'leaf', parent: 'H' },
    };
    const retained: GridRowSelectionRetention = new Map([
      ['P', { type: 'group', parent: 'G', isSelectable: true }],
      ['A', { type: 'leaf', parent: 'P', isSelectable: false }],
      ['B', { type: 'leaf', parent: 'P', isSelectable: true }],
    ]);
    Object.values(tree).forEach((node) => {
      if (node.type === 'group') {
        Object.freeze(node.children);
      }
      Object.freeze(node);
    });
    Object.freeze(tree);
    retained.forEach(Object.freeze);
    const originalRetained = new Map(retained);
    const apiRef = createApiRef(retained, undefined, tree);

    const result = gridRowSelectionTreeSelector(apiRef);

    expect(result.G).to.deep.equal({
      type: 'group',
      parent: GRID_ROOT_GROUP_ID,
      children: ['P'],
    });
    expect(result.P).to.include({ type: 'group', parent: 'G' });
    expect(result.P).to.have.property('children').that.deep.equals(['B']);
    expect(result.A).to.equal(tree.A);
    expect(result.H).to.equal(tree.H);
    expect(tree.G).to.have.property('children').that.deep.equals([]);
    expect(tree).not.to.have.property('P');
    expect(retained).to.deep.equal(originalRetained);
    expect(retained.get('P')).not.to.have.property('children');
  });

  it('should recalculate ancestor states from the current include or exclude model', () => {
    const apiRef = createApiRef(
      new Map([
        ['P', { type: 'group', parent: 'G', isSelectable: true }],
        ['A', { type: 'leaf', parent: 'P', isSelectable: true }],
        ['B', { type: 'leaf', parent: 'P', isSelectable: true }],
      ]),
      { type: 'include', ids: new Set(['A']) },
    );
    const firstLookup = gridRetainedRowSelectionLookupSelector(apiRef);
    expect(firstLookup.get('P')).to.deep.equal({ selected: true, unselected: true });
    expect(firstLookup.get('G')).to.deep.equal({ selected: true, unselected: true });
    expect(gridRetainedRowSelectionLookupSelector(apiRef)).to.equal(firstLookup);

    const cases: Array<{
      model: GridRowSelectionModel;
      expected: { selected: boolean; unselected: boolean };
    }> = [
      {
        model: { type: 'include', ids: new Set() },
        expected: { selected: false, unselected: true },
      },
      {
        model: { type: 'include', ids: new Set(['P', 'A', 'B']) },
        expected: { selected: true, unselected: false },
      },
      {
        model: { type: 'exclude', ids: new Set() },
        expected: { selected: true, unselected: false },
      },
      {
        model: { type: 'exclude', ids: new Set(['B']) },
        expected: { selected: true, unselected: true },
      },
    ];
    cases.forEach(({ model, expected }) => {
      apiRef.current.state = { ...apiRef.current.state, rowSelection: model };
      const lookup = gridRetainedRowSelectionLookupSelector(apiRef);
      expect(lookup.get('P')).to.deep.equal(expected);
      expect(lookup.get('G')).to.deep.equal(expected);
      expect(lookup.get(GRID_ROOT_GROUP_ID)).to.deep.equal(expected);
    });
  });

  it('should ignore the selection of retained non-selectable rows', () => {
    const apiRef = createApiRef(
      new Map([
        ['A', { type: 'leaf', parent: 'G', isSelectable: false }],
        ['B', { type: 'leaf', parent: 'G', isSelectable: true }],
      ]),
      { type: 'include', ids: new Set(['A']) },
    );

    expect(gridRetainedRowSelectionLookupSelector(apiRef).get('G')).to.deep.equal({
      selected: false,
      unselected: true,
    });
    apiRef.current.state = {
      ...apiRef.current.state,
      rowSelection: { type: 'include', ids: new Set(['B']) },
    };
    expect(gridRetainedRowSelectionLookupSelector(apiRef).get('G')).to.deep.equal({
      selected: true,
      unselected: false,
    });
  });

  it('should not count retained descendants disconnected from the current tree', () => {
    const apiRef = createApiRef(
      new Map([
        ['P', { type: 'group', parent: 'missing', isSelectable: true }],
        ['A', { type: 'leaf', parent: 'P', isSelectable: true }],
      ]),
      { type: 'include', ids: new Set(['A']) },
    );

    const lookup = gridRetainedRowSelectionLookupSelector(apiRef);
    expect(lookup.get('G')).to.deep.equal({ selected: false, unselected: false });
    expect(lookup.has('P')).to.equal(false);
    expect(lookup.has('A')).to.equal(false);
  });
});
