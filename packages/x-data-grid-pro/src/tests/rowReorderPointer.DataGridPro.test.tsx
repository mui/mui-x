import * as React from 'react';
import { act, createRenderer, createEvent, fireEvent, waitFor } from '@mui/internal-test-utils';
import { getCell, getRowsFieldContent, sleep } from 'test/utils/helperFn';
import { DataGridPro, gridClasses, useGridApiRef } from '@mui/x-data-grid-pro';
import type { DataGridProProps, GridApi } from '@mui/x-data-grid-pro';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';
import { getAutoScrollDelta } from '../hooks/features/rowReorder/rowReorderDragUtils';

// Longer than the long press delay of touch input
const LONG_PRESS = 350;

// The drag starts from a timer, outside of the `act` of `fireEvent`
async function waitForLongPress() {
  await act(async () => {
    await sleep(LONG_PRESS);
  });
}

const pointer = (pointerType: string, clientX: number, clientY: number) => ({
  pointerId: 1,
  pointerType,
  isPrimary: true,
  button: 0,
  buttons: 1,
  clientX,
  clientY,
});

function getPointInRow(rowIndex: number, ratioY: number) {
  const rect = getCell(rowIndex, 1).getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height * ratioY };
}

function getHandle(rowIndex: number) {
  return getCell(rowIndex, 0).firstChild as HTMLElement;
}

describe('<DataGridPro /> - Row reorder with pointer events', () => {
  const { render } = createRenderer();

  const rows = [
    { id: 0, brand: 'Nike' },
    { id: 1, brand: 'Adidas' },
    { id: 2, brand: 'Puma' },
  ];
  const columns = [{ field: 'brand' }];

  let apiRef: React.RefObject<GridApi | null>;

  function Test(props: Partial<DataGridProProps>) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGridPro apiRef={apiRef} rows={rows} columns={columns} rowReordering {...props} />
      </div>
    );
  }

  async function startTouchDrag(rowIndex: number) {
    const handle = getHandle(rowIndex);
    const start = getPointInRow(rowIndex, 0.5);
    fireEvent.pointerDown(handle, pointer('touch', start.x, start.y));
    await waitForLongPress();
    return handle;
  }

  describe.skipIf(isJSDOM)('touch', () => {
    it('should reorder a row with a long press and a drag', async () => {
      const onRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={onRowOrderChange} />);
      expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);

      const handle = await startTouchDrag(0);
      expect(apiRef.current!.state.rowReorder.isActive).to.equal(true);

      const target = getPointInRow(2, 0.75);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      expect(apiRef.current!.state.rowReorder.dropTarget).to.deep.equal({
        rowId: 2,
        position: 'below',
      });

      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      await waitFor(() => {
        expect(getRowsFieldContent('brand')).to.deep.equal(['Adidas', 'Puma', 'Nike']);
      });
      expect(onRowOrderChange).toHaveBeenCalledTimes(1);
      expect(onRowOrderChange.mock.calls[0][0]).toMatchObject({
        oldIndex: 0,
        targetIndex: 2,
        oldParent: null,
        newParent: null,
      });
      expect(apiRef.current!.state.rowReorder.isActive).to.equal(false);
    });

    it('should show a drag preview while dragging, and remove it on drop', async () => {
      render(<Test />);

      const handle = await startTouchDrag(0);
      expect(document.querySelector(`.${gridClasses['row--dragging']}`)).not.to.equal(null);

      const target = getPointInRow(1, 0.75);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      expect(document.querySelector(`.${gridClasses['row--dragging']}`)).to.equal(null);
      // Let the reorder finish
      await waitFor(() => {
        expect(getRowsFieldContent('brand')).to.deep.equal(['Adidas', 'Nike', 'Puma']);
      });
    });

    it('should not reorder when the row is dropped outside the grid', async () => {
      const onRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={onRowOrderChange} />);

      const handle = await startTouchDrag(0);
      const target = getPointInRow(2, 0.75);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));

      const rootRect = document.querySelector(`.${gridClasses.root}`)!.getBoundingClientRect();
      fireEvent.pointerMove(handle, pointer('touch', target.x, rootRect.bottom + 50));
      fireEvent.pointerUp(handle, pointer('touch', target.x, rootRect.bottom + 50));

      await act(async () => {
        await sleep(50);
      });
      expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      expect(onRowOrderChange).toHaveBeenCalledTimes(0);
      expect(apiRef.current!.state.rowReorder.isActive).to.equal(false);
    });

    it('should cancel the drag on Escape', async () => {
      const onRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={onRowOrderChange} />);

      const handle = await startTouchDrag(0);
      const target = getPointInRow(2, 0.75);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));

      await act(async () => {
        await sleep(50);
      });
      expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      expect(onRowOrderChange).toHaveBeenCalledTimes(0);
      expect(apiRef.current!.state.rowReorder.isActive).to.equal(false);
      expect(apiRef.current!.state.rowReorder.dropTarget).to.equal(undefined);
    });

    it('should not start a drag on a tap', async () => {
      render(<Test />);
      const handle = getHandle(0);
      const start = getPointInRow(0, 0.5);

      fireEvent.pointerDown(handle, pointer('touch', start.x, start.y));
      fireEvent.pointerUp(handle, pointer('touch', start.x, start.y));
      await waitForLongPress();

      expect(apiRef.current!.state.rowReorder.isActive).to.equal(false);
    });

    it('should not start a drag when row reordering is disabled by sorting', async () => {
      render(<Test initialState={{ sorting: { sortModel: [{ field: 'brand', sort: 'asc' }] } }} />);
      const handle = getHandle(0);
      const start = getPointInRow(0, 0.5);

      fireEvent.pointerDown(handle, pointer('touch', start.x, start.y));
      await waitForLongPress();

      expect(apiRef.current!.state.rowReorder.isActive).to.equal(false);
    });
  });

  describe.skipIf(isJSDOM)('mouse', () => {
    it('should not use pointer events for the mouse', async () => {
      render(<Test />);
      const handle = getHandle(0);
      const start = getPointInRow(0, 0.5);
      const target = getPointInRow(2, 0.75);

      fireEvent.pointerDown(handle, pointer('mouse', start.x, start.y));
      fireEvent.pointerMove(handle, pointer('mouse', target.x, target.y));
      await waitForLongPress();

      expect(apiRef.current!.state.rowReorder.isActive).to.equal(false);
    });
  });

  describe.skipIf(isJSDOM)('native drag and drop', () => {
    it('should block a native drag that starts from a touch press', () => {
      render(<Test />);
      const onRowDragStart = vi.fn();
      apiRef.current!.subscribeEvent('rowDragStart', onRowDragStart);
      const handle = getHandle(0);
      const start = getPointInRow(0, 0.5);

      fireEvent.pointerDown(handle, pointer('touch', start.x, start.y));
      // `fireEvent` returns `false` when the event's default action was prevented
      expect(fireEvent.dragStart(handle)).to.equal(false);
      expect(onRowDragStart).toHaveBeenCalledTimes(0);
    });

    it('should keep the native drag that starts from a mouse press', () => {
      render(<Test />);
      const onRowDragStart = vi.fn();
      apiRef.current!.subscribeEvent('rowDragStart', onRowDragStart);
      const handle = getHandle(0);
      const start = getPointInRow(0, 0.5);

      fireEvent.pointerDown(handle, pointer('mouse', start.x, start.y));
      fireEvent.pointerUp(handle, pointer('mouse', start.x, start.y));
      const dragStartEvent = createEvent.dragStart(handle);
      Object.defineProperty(dragStartEvent, 'dataTransfer', { value: { effectAllowed: 'copy' } });
      fireEvent(handle, dragStartEvent);
      expect(onRowDragStart).toHaveBeenCalledTimes(1);
    });
  });
});

describe('getAutoScrollDelta', () => {
  it('should not scroll away from the edges', () => {
    expect(getAutoScrollDelta(150, 100, 300)).to.equal(0);
  });

  it('should scroll up near the top edge, faster closer to it', () => {
    const slow = getAutoScrollDelta(120, 100, 300);
    const fast = getAutoScrollDelta(101, 100, 300);
    expect(slow).to.be.lessThan(0);
    expect(fast).to.be.lessThan(slow);
  });

  it('should scroll down near the bottom edge, and cap the speed past it', () => {
    expect(getAutoScrollDelta(290, 100, 300)).to.be.greaterThan(0);
    expect(getAutoScrollDelta(400, 100, 300)).to.equal(getAutoScrollDelta(300, 100, 300));
  });
});
