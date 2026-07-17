import { itemsSelectors } from './selectors';
import { TREE_VIEW_ROOT_PARENT_ID } from './utils';
import type { MinimalTreeViewState } from '../../MinimalTreeViewStore';

/**
 * Builds a partial state exposing only the two lookups `itemIndex` reads.
 * A partial cast is the correct shape here — the selector never touches the
 * rest of the store.
 */
const buildState = (
  itemMetaLookup: Record<string, { id: string; parentId: string | null }>,
  itemChildrenIndexesLookup: Record<string, Record<string, number>>,
): MinimalTreeViewState<any, any> => ({ itemMetaLookup, itemChildrenIndexesLookup }) as any;

describe('itemsSelectors.itemIndex', () => {
  it('returns the index of the item within its parent', () => {
    const parentId = 'parent';
    const state = buildState(
      {
        a: { id: 'a', parentId },
        b: { id: 'b', parentId },
        c: { id: 'c', parentId },
      },
      { [parentId]: { a: 0, b: 1, c: 2 } },
    );

    expect(itemsSelectors.itemIndex(state, 'b')).to.equal(1);
  });

  it('returns -1 when the item has no meta', () => {
    const state = buildState({}, { [TREE_VIEW_ROOT_PARENT_ID]: {} });

    expect(itemsSelectors.itemIndex(state, 'unknown')).to.equal(-1);
  });

  // Regression test: `itemMetaLookup` and `itemChildrenIndexesLookup` are
  // populated in separate store updates during item registration, so there is a
  // transient window where an item's meta is present while its parent's
  // children-index bucket is still absent. `itemIndex` used to dereference the
  // missing bucket and throw `Cannot read properties of undefined`.
  it('returns -1 instead of throwing when the parent index bucket is missing', () => {
    const parentId = 'parent';
    const state = buildState(
      // Meta is present (so the `itemMeta == null` guard passes)...
      { child: { id: 'child', parentId } },
      // ...but the parent's index bucket has not been written yet.
      {},
    );

    expect(() => itemsSelectors.itemIndex(state, 'child')).not.to.throw();
    expect(itemsSelectors.itemIndex(state, 'child')).to.equal(-1);
  });
});
