import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { act, createRenderer, createEvent, fireEvent, waitFor } from '@mui/internal-test-utils';
import { getCell, getRowsFieldContent, sleep } from 'test/utils/helperFn';
import { DataGridPro, gridClasses, useGridApiRef } from '@mui/x-data-grid-pro';
import type { DataGridProProps, GridApi } from '@mui/x-data-grid-pro';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';
import { commitRowReorder } from '../hooks/features/rowReorder/rowReorderDragUtils';

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

// Lets the drag run for a few animation frames
async function waitForFrames(duration = 150) {
  await act(async () => {
    await sleep(duration);
  });
}

function getScroller() {
  return document.querySelector<HTMLElement>(`.${gridClasses.virtualScroller}`)!;
}

// The handle closest to `clientY`, among the rendered rows
function getHandleAt(clientY: number) {
  const handles = Array.from(
    document.querySelectorAll<HTMLElement>(`.${gridClasses['rowReorderCell--draggable']}`),
  );
  const getDistance = (handle: HTMLElement) => {
    const rect = handle.getBoundingClientRect();
    return Math.abs(rect.top + rect.height / 2 - clientY);
  };
  return handles.reduce((closest, handle) =>
    getDistance(handle) < getDistance(closest) ? handle : closest,
  );
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

    it('should cancel the drop when the row is released over the column headers', async () => {
      const onRowOrderChange = vi.fn();
      render(<Test onRowOrderChange={onRowOrderChange} />);

      const handle = await startTouchDrag(0);
      const target = getPointInRow(2, 0.75);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      expect(apiRef.current!.state.rowReorder.dropTarget?.rowId).to.equal(2);

      const headerRect = document
        .querySelector(`.${gridClasses.columnHeader}`)!
        .getBoundingClientRect();
      const headerY = headerRect.top + headerRect.height / 2;
      fireEvent.pointerMove(handle, pointer('touch', target.x, headerY));
      fireEvent.pointerUp(handle, pointer('touch', target.x, headerY));

      await waitForFrames(50);
      expect(getRowsFieldContent('brand')).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      expect(onRowOrderChange).toHaveBeenCalledTimes(0);
      expect(apiRef.current!.state.rowReorder.isActive).to.equal(false);
    });

    it('should drop inside a collapsed group that expands under a pointer holding still', async () => {
      const treeRows = [
        { id: 'alpha', path: ['Alpha'] },
        { id: 'bravo', path: ['Bravo'] },
        { id: 'group', path: ['Group'] },
        { id: 'child', path: ['Group', 'Child'] },
      ];
      render(
        <Test
          rows={treeRows}
          columns={[{ field: 'id' }]}
          treeData
          getTreeDataPath={(row) => row.path}
          setTreeDataPath={(path, row) => ({ ...row, path })}
        />,
      );

      const handle = await startTouchDrag(0);
      const overBravo = getPointInRow(1, 0.9);
      fireEvent.pointerMove(handle, pointer('touch', overBravo.x, overBravo.y));
      expect(apiRef.current!.state.rowReorder.dropTarget).to.deep.equal({
        rowId: 'bravo',
        position: 'below',
      });

      // The pointer stops over the middle of the collapsed group, and doesn't move again
      const overGroup = getPointInRow(2, 0.5);
      fireEvent.pointerMove(handle, pointer('touch', overGroup.x, overGroup.y));
      await waitForFrames(700);
      expect(apiRef.current!.state.rowReorder.dropTarget).to.deep.equal({
        rowId: 'group',
        position: 'inside',
      });

      fireEvent.pointerUp(handle, pointer('touch', overGroup.x, overGroup.y));
      await waitFor(() => {
        expect(apiRef.current!.getRowNode('alpha')!.parent).to.equal('group');
      });
    });

    it('should not auto-scroll before the pointer moves when the drag starts in an edge zone', async () => {
      const manyRows = Array.from({ length: 30 }, (_, id) => ({ id, brand: `Brand ${id}` }));
      render(<Test rows={manyRows} density="compact" />);
      const scroller = getScroller();
      await act(async () => {
        scroller.scrollTop = 200;
      });
      // Let the rows at the new scroll position render
      await waitForFrames(50);

      // A compact row is smaller than the edge zone: a press in its middle is inside the zone
      const bottomY = scroller.getBoundingClientRect().bottom - 10;
      const handle = getHandleAt(bottomY);
      const handleRect = handle.getBoundingClientRect();
      const x = handleRect.left + handleRect.width / 2;
      fireEvent.pointerDown(handle, pointer('touch', x, bottomY));
      await waitForLongPress();
      expect(apiRef.current!.state.rowReorder.isActive).to.equal(true);
      await waitForFrames();
      expect(scroller.scrollTop).to.equal(200);

      // Moving toward the edge starts the auto-scroll
      fireEvent.pointerMove(handle, pointer('touch', x - 12, bottomY + 6));
      await waitForFrames();
      expect(scroller.scrollTop).to.be.greaterThan(200);
      fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    });

    it('should auto-scroll at the edge of the scrollable rows, below the pinned rows', async () => {
      const manyRows = Array.from({ length: 30 }, (_, id) => ({ id, brand: `Brand ${id}` }));
      render(
        <Test
          rows={manyRows}
          height={400}
          pinnedRows={{
            top: [
              { id: 'pinned-0', brand: 'Pinned 0' },
              { id: 'pinned-1', brand: 'Pinned 1' },
            ],
          }}
        />,
      );
      const scroller = getScroller();
      await act(async () => {
        scroller.scrollTop = 300;
      });
      await waitForFrames(50);

      const scrollerRect = scroller.getBoundingClientRect();
      const handle = getHandleAt(scrollerRect.top + scrollerRect.height / 2);
      const handleRect = handle.getBoundingClientRect();
      const x = handleRect.left + handleRect.width / 2;
      fireEvent.pointerDown(handle, pointer('touch', x, handleRect.top + handleRect.height / 2));
      await waitForLongPress();

      const pinnedBottom = document
        .querySelector(`.${gridClasses['pinnedRows--top']}`)!
        .getBoundingClientRect().bottom;
      fireEvent.pointerMove(handle, pointer('touch', x, pinnedBottom + 5));
      await waitForFrames();
      expect(scroller.scrollTop).to.be.lessThan(300);
      fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    });

    it('should keep the horizontal scroll position in RTL while auto-scrolling', async () => {
      const manyColumns = Array.from({ length: 8 }, (_, index) => ({
        field: `col${index}`,
        width: 100,
      }));
      const manyRows = Array.from({ length: 30 }, (_, id) => ({ id }));
      render(
        <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
          <div dir="rtl">
            <Test
              rows={manyRows}
              columns={manyColumns}
              initialState={{ pinnedColumns: { left: ['__reorder__'] } }}
            />
          </div>
        </ThemeProvider>,
      );
      const scroller = getScroller();
      await act(async () => {
        scroller.scrollLeft = -200;
      });
      expect(scroller.scrollLeft).to.equal(-200);

      const handle = getHandle(0);
      const handleRect = handle.getBoundingClientRect();
      const x = handleRect.left + handleRect.width / 2;
      fireEvent.pointerDown(handle, pointer('touch', x, handleRect.top + handleRect.height / 2));
      await waitForLongPress();

      const dimensions = apiRef.current!.state.dimensions;
      const rowsBottom = scroller.getBoundingClientRect().bottom - dimensions.scrollbarSize;
      fireEvent.pointerMove(handle, pointer('touch', x, rowsBottom - 5));
      await waitForFrames();
      expect(scroller.scrollTop).to.be.greaterThan(0);
      expect(scroller.scrollLeft).to.equal(-200);
      fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    });
  });

  describe.skipIf(isJSDOM)('pen', () => {
    it('should enable text selection again after a drag', async () => {
      render(<Test />);
      const root = document.querySelector(`.${gridClasses.root}`)!;
      const handle = getHandle(0);
      const start = getPointInRow(0, 0.5);
      const target = getPointInRow(2, 0.75);

      // A pen press also fires the compatibility mouse events
      fireEvent.pointerDown(handle, pointer('pen', start.x, start.y));
      fireEvent.mouseDown(handle);
      expect(root).to.have.class(gridClasses['root--disableUserSelection']);

      fireEvent.pointerMove(handle, pointer('pen', target.x, target.y));
      expect(apiRef.current!.state.rowReorder.isActive).to.equal(true);

      // The root captured the pointer: `mouseup` doesn't reach the handle
      fireEvent.pointerUp(root, pointer('pen', target.x, target.y));
      fireEvent.mouseUp(root);
      await waitFor(() => {
        expect(getRowsFieldContent('brand')).to.deep.equal(['Adidas', 'Puma', 'Nike']);
      });
      expect(root).not.to.have.class(gridClasses['root--disableUserSelection']);
    });
  });

  describe.skipIf(isJSDOM)('commitRowReorder', () => {
    it('should reject with the error of a rowOrderChange listener', async () => {
      render(<Test />);
      apiRef.current!.subscribeEvent('rowOrderChange', () => {
        throw new Error('Boom');
      });

      // Caught inside `act`: a rejected `act` drops the updates it queued
      let error: unknown;
      await act(async () => {
        try {
          await commitRowReorder(
            apiRef as any,
            0,
            { rowId: 2, position: 'below' },
            (move) => move(),
            () => {},
          );
        } catch (caught) {
          error = caught;
        }
      });
      expect((error as Error)?.message).to.equal('Boom');
      // The row moved before the listener ran
      await waitFor(() => {
        expect(getRowsFieldContent('brand')).to.deep.equal(['Adidas', 'Puma', 'Nike']);
      });
    });

    it('should resolve without publishing rowOrderChange when the move fails', async () => {
      render(<Test />);
      const onRowOrderChange = vi.fn();
      apiRef.current!.subscribeEvent('rowOrderChange', onRowOrderChange);

      await act(() =>
        commitRowReorder(
          apiRef as any,
          'missing',
          { rowId: 2, position: 'below' },
          (move) => move(),
          () => {},
        ),
      );
      expect(onRowOrderChange).toHaveBeenCalledTimes(0);
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
