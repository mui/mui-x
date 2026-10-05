import * as React from 'react';
import { act, createRenderer, createEvent, fireEvent, waitFor } from '@mui/internal-test-utils';
import { getCell, getRowsFieldContent, sleep } from 'test/utils/helperFn';
import { DataGridPro, gridClasses, useGridApiRef } from '@mui/x-data-grid-pro';
import type { DataGridProProps, GridApi } from '@mui/x-data-grid-pro';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';

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

  function Test(props: Partial<DataGridProProps> & { height?: number }) {
    const { height = 300, ...other } = props;
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 300, height }}>
        <DataGridPro apiRef={apiRef} rows={rows} columns={columns} rowReordering {...other} />
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

    it('should end the gesture when reordering got disabled during the long press', async () => {
      render(<Test />);
      const handle = getHandle(0);
      const start = getPointInRow(0, 0.5);

      fireEvent.pointerDown(handle, pointer('touch', start.x, start.y));
      await act(async () => {
        apiRef.current!.setSortModel([{ field: 'brand', sort: 'asc' }]);
      });
      await waitForLongPress();
      expect(apiRef.current!.state.rowReorder.isActive).to.equal(false);
      expect(document.querySelector(`.${gridClasses['row--dragging']}`)).to.equal(null);
      fireEvent.pointerUp(handle, pointer('touch', start.x, start.y));

      // The refused gesture didn't keep a session that would ignore the next press
      await act(async () => {
        apiRef.current!.setSortModel([]);
      });
      await startTouchDrag(0);
      expect(apiRef.current!.state.rowReorder.isActive).to.equal(true);
    });

    it('should not use the rows of a nested grid as drop targets', async () => {
      render(
        <Test
          height={600}
          getDetailPanelHeight={() => 100}
          // Mimics a nested grid that reuses the row ids of the parent grid
          getDetailPanelContent={({ row }) =>
            row.id === 2 ? (
              <div className={gridClasses.root}>
                <div className={gridClasses.row} data-id="0" style={{ height: 80 }}>
                  Nested row
                </div>
              </div>
            ) : null
          }
          initialState={{ detailPanel: { expandedRowIds: new Set([2]) } }}
        />,
      );
      const getRow = (id: number) =>
        document.querySelector<HTMLElement>(`.${gridClasses.row}[data-id="${id}"]`)!;
      const getPoint = (element: Element, ratioY: number) => {
        const rect = element.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height * ratioY };
      };

      const handle = getRow(1).querySelector<HTMLElement>(
        `.${gridClasses['rowReorderCell--draggable']}`,
      )!;
      const start = getPoint(getRow(1), 0.5);
      fireEvent.pointerDown(handle, pointer('touch', start.x, start.y));
      await waitForLongPress();

      const target = getPoint(getRow(2), 0.75);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      expect(apiRef.current!.state.rowReorder.dropTarget).to.deep.equal({
        rowId: 2,
        position: 'below',
      });

      const nestedRow = document.querySelector(`.${gridClasses.detailPanel} .${gridClasses.row}`)!;
      const nested = getPoint(nestedRow, 0.25);
      fireEvent.pointerMove(handle, pointer('touch', nested.x, nested.y));
      expect(apiRef.current!.state.rowReorder.dropTarget).to.deep.equal({
        rowId: 2,
        position: 'below',
      });
      fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    });

    it('should find the row under the scroll areas of HTML drag and drop', async () => {
      const manyRows = Array.from({ length: 30 }, (_, id) => ({ id, brand: `Brand ${id}` }));
      render(<Test rows={manyRows} />);

      const handle = await startTouchDrag(0);
      const scroller = document.querySelector(`.${gridClasses.virtualScroller}`)!;
      const scrollerRect = scroller.getBoundingClientRect();
      const point = { x: scrollerRect.left + 50, y: scrollerRect.bottom - 10 };
      // The scroll area shows while a row is dragged, over the bottom of the rows
      expect(
        document.elementFromPoint(point.x, point.y)!.closest(`.${gridClasses.scrollArea}`),
      ).not.to.equal(null);
      const rowUnder = document
        .elementsFromPoint(point.x, point.y)
        .find((element) => !element.closest(`.${gridClasses.scrollArea}`))!
        .closest(`.${gridClasses.row}`)!;

      fireEvent.pointerMove(handle, pointer('touch', point.x, point.y));
      expect(apiRef.current!.state.rowReorder.dropTarget?.rowId).to.equal(
        Number(rowUnder.getAttribute('data-id')),
      );
      fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
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
