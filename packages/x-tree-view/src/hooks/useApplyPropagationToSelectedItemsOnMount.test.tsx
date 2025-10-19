import { renderHook } from '@mui/internal-test-utils';
import { useApplyPropagationToSelectedItemsOnMount } from './useApplyPropagationToSelectedItemsOnMount';

describe('useApplyPropagationToDefaultSelectedItems', () => {
  it('should return an empty array when no item is selected (parents and descendants propagation)', () => {
    const { result } = renderHook(() =>
      useApplyPropagationToSelectedItemsOnMount({
        items: [],
        selectedItems: [],
        selectionPropagation: { parents: true, descendants: true },
      }),
    );
    expect(result.current).toEqual([]);
  });

  it('should return an empty array when no item is selected (parents propagation)', () => {
    const { result } = renderHook(() =>
      useApplyPropagationToSelectedItemsOnMount({
        items: [],
        selectedItems: [],
        selectionPropagation: { parents: true, descendants: false },
      }),
    );
    expect(result.current).toEqual([]);
  });

  it('should return an empty array when no item is selected (descendants propagation)', () => {
    const { result } = renderHook(() =>
      useApplyPropagationToSelectedItemsOnMount({
        items: [],
        selectedItems: [],
        selectionPropagation: { parents: false, descendants: true },
      }),
    );
    expect(result.current).toEqual([]);
  });

  it('should select descendants when a parent is selected (descendants propagation)', () => {
    const { result } = renderHook(() =>
      useApplyPropagationToSelectedItemsOnMount({
        items: [
          { id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }, { id: '1.1.2' }] }] },
        ],
        selectedItems: ['1'],
        selectionPropagation: { parents: false, descendants: true },
      }),
    );
    expect(result.current).toEqual(['1', '1.1', '1.1.1', '1.1.2']);
  });

  it('should not select descendants when a parent is selected (no descendants propagation)', () => {
    const { result } = renderHook(() =>
      useApplyPropagationToSelectedItemsOnMount({
        items: [
          { id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }, { id: '1.1.2' }] }] },
        ],
        selectedItems: ['1'],
        selectionPropagation: { parents: false, descendants: false },
      }),
    );
    expect(result.current).toEqual(['1']);
  });

  it('should select parents when all descendants are selected (parents propagation)', () => {
    const { result } = renderHook(() =>
      useApplyPropagationToSelectedItemsOnMount({
        items: [
          { id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }, { id: '1.1.2' }] }] },
        ],
        selectedItems: ['1.1.1', '1.1.2'],
        selectionPropagation: { parents: true, descendants: false },
      }),
    );
    expect(result.current).toEqual(['1', '1.1.1', '1.1.2', '1.1']);
  });

  it('should not select parents when all descendants are selected (no parents propagation)', () => {
    const { result } = renderHook(() =>
      useApplyPropagationToSelectedItemsOnMount({
        items: [
          { id: '1', children: [{ id: '1.1', children: [{ id: '1.1.1' }, { id: '1.1.2' }] }] },
        ],
        selectedItems: ['1.1.1', '1.1.2'],
        selectionPropagation: { parents: false, descendants: true },
      }),
    );
    expect(result.current).toEqual(['1.1.1', '1.1.2']);
  });

  it('should select parents and descendants when all items of a given depth are selected (parents and descendants propagation)', () => {
    const { result } = renderHook(() =>
      useApplyPropagationToSelectedItemsOnMount({
        items: [
          {
            id: '1',
            children: [{ id: '1.1', children: [{ id: '1.1.1' }, { id: '1.1.2' }] }, { id: '1.2' }],
          },
        ],
        selectedItems: ['1.1', '1.2'],
        selectionPropagation: { parents: true, descendants: true },
      }),
    );
    expect(result.current).toEqual(['1', '1.1', '1.2', '1.1.1', '1.1.2']);
  });

  it('should use getItemId when provided', () => {
    const { result } = renderHook(() =>
      useApplyPropagationToSelectedItemsOnMount({
        getItemId: (item) => item.key,
        items: [
          {
            key: '1',
            children: [
              { key: '1.1', children: [{ key: '1.1.1' }, { key: '1.1.2' }] },
              { key: '1.2' },
            ],
          },
        ],
        selectedItems: ['1.1', '1.2'],
        selectionPropagation: { parents: true, descendants: true },
      }),
    );
    expect(result.current).toEqual(['1', '1.1', '1.2', '1.1.1', '1.1.2']);
  });

  it('should use getItemChildren when provided', () => {
    const { result } = renderHook(() =>
      useApplyPropagationToSelectedItemsOnMount({
        getItemChildren: (item) => item.subItems,
        items: [
          {
            id: '1',
            subItems: [{ id: '1.1', subItems: [{ id: '1.1.1' }, { id: '1.1.2' }] }, { id: '1.2' }],
          },
        ],
        selectedItems: ['1.1', '1.2'],
        selectionPropagation: { parents: true, descendants: true },
      }),
    );
    expect(result.current).toEqual(['1', '1.1', '1.2', '1.1.1', '1.1.2']);
  });
});
