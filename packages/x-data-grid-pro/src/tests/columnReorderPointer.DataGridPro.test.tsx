import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { act, createRenderer, createEvent, fireEvent } from '@mui/internal-test-utils';
import { sleep } from 'test/utils/helperFn';
import { DataGridPro, gridClasses, useGridApiRef } from '@mui/x-data-grid-pro';
import type { DataGridProProps, GridApi, GridColDef } from '@mui/x-data-grid-pro';
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

// Lets the drag run for a few animation frames
async function waitForFrames(duration = 150) {
  await act(async () => {
    await sleep(duration);
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

function getCenter(element: Element) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

// The draggable container of a header is the drag handle
function getHandle(header: Element) {
  return header.querySelector<HTMLElement>(`.${gridClasses.columnHeaderDraggableContainer}`)!;
}

function getHeaderByField(field: string) {
  return document.querySelector<HTMLElement>(
    `.${gridClasses.columnHeader}[data-field="${field}"]`,
  )!;
}

function getScroller() {
  return document.querySelector<HTMLElement>(`.${gridClasses.virtualScroller}`)!;
}

// The HTML drag and drop handlers read `dataTransfer`
function createDragStartEvent(handle: HTMLElement) {
  const event = createEvent.dragStart(handle);
  Object.defineProperty(event, 'dataTransfer', { value: { effectAllowed: 'move' } });
  return event;
}

const columns: GridColDef[] = [
  { field: 'brand', width: 100 },
  { field: 'year', width: 100 },
  { field: 'price', width: 100 },
];
const rows = [
  { id: 0, brand: 'Nike', year: 1964, price: 10 },
  { id: 1, brand: 'Adidas', year: 1949, price: 20 },
];

const manyColumns: GridColDef[] = Array.from({ length: 10 }, (_, index) => ({
  field: `col${index}`,
  width: 100,
}));

describe('<DataGridPro /> - Column reorder with pointer events', () => {
  const { render } = createRenderer();

  let apiRef: React.RefObject<GridApi | null>;

  function Test(props: Partial<DataGridProProps> & { width?: number }) {
    const { width = 400, ...other } = props;
    apiRef = useGridApiRef();
    return (
      <div style={{ width, height: 300 }}>
        <DataGridPro apiRef={apiRef} rows={rows} columns={columns} {...other} />
      </div>
    );
  }

  const getOrderedFields = () => apiRef.current!.state.columns.orderedFields;
  const getDragCol = () => apiRef.current!.state.columnReorder.dragCol;

  async function startTouchDrag(field: string) {
    const handle = getHandle(getHeaderByField(field));
    const start = getCenter(handle);
    fireEvent.pointerDown(handle, pointer('touch', start.x, start.y));
    await waitForLongPress();
    return { handle, start };
  }

  function moveTo(handle: HTMLElement, element: Element) {
    const point = getCenter(element);
    fireEvent.pointerMove(handle, pointer('touch', point.x, point.y));
    return point;
  }

  describe.skipIf(isJSDOM)('touch', () => {
    it('should reorder a column to the right with a long press and a drag', async () => {
      const onColumnOrderChange = vi.fn();
      render(<Test onColumnOrderChange={onColumnOrderChange} />);
      expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);

      const { handle } = await startTouchDrag('brand');
      expect(getDragCol()).to.equal('brand');

      moveTo(handle, getHeaderByField('year'));
      expect(getOrderedFields()).to.deep.equal(['year', 'brand', 'price']);
      const point = moveTo(handle, getHeaderByField('price'));
      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);

      fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);
      expect(getDragCol()).to.equal('');
      expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
      expect(onColumnOrderChange.mock.calls[0][0]).toMatchObject({ oldIndex: 0, targetIndex: 2 });
      expect(onColumnOrderChange.mock.calls[0][0].column.field).to.equal('brand');
    });

    it('should reorder a column to the left', async () => {
      render(<Test />);

      const { handle } = await startTouchDrag('price');
      const point = moveTo(handle, getHeaderByField('brand'));
      expect(getOrderedFields()).to.deep.equal(['price', 'brand', 'year']);
      fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
      expect(getOrderedFields()).to.deep.equal(['price', 'brand', 'year']);
    });

    it('should reorder when the column is dragged over the cells', async () => {
      render(<Test />);

      const { handle } = await startTouchDrag('brand');
      const cell = document.querySelector(`.${gridClasses.cell}[data-field="price"]`)!;
      const point = moveTo(handle, cell);
      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);
      fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);
      expect(getDragCol()).to.equal('');
    });

    it('should mark the dragged header as moving and show a preview, until the drop', async () => {
      render(<Test />);

      const { handle } = await startTouchDrag('brand');
      await waitForFrames(50);
      expect(getHeaderByField('brand')).to.have.class(gridClasses['columnHeader--moving']);
      const preview = document.querySelector(`.${gridClasses['columnHeader--dragging']}`);
      expect(preview).not.to.equal(null);
      // The preview is a copy without the identity of the header
      expect(preview!.hasAttribute('data-field')).to.equal(false);
      expect(preview!.getAttribute('aria-hidden')).to.equal('true');

      const point = moveTo(handle, getHeaderByField('year'));
      fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
      await waitForFrames(50);
      expect(document.querySelector(`.${gridClasses['columnHeader--dragging']}`)).to.equal(null);
      expect(getHeaderByField('brand')).not.to.have.class(gridClasses['columnHeader--moving']);
    });

    it('should disable text selection in the grid during the drag', async () => {
      render(<Test />);
      const root = document.querySelector(`.${gridClasses.root}`)!;

      const { handle } = await startTouchDrag('brand');
      // The finger moves over selectable text, like the column group headers
      expect(root).to.have.class(gridClasses['root--disableUserSelection']);
      const point = moveTo(handle, getHeaderByField('year'));
      fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
      expect(root).not.to.have.class(gridClasses['root--disableUserSelection']);
    });

    it('should support custom classes for the preview', async () => {
      render(<Test classes={{ 'columnHeader--dragging': 'my-dragging custom-class' }} />);

      const { handle } = await startTouchDrag('brand');
      expect(document.querySelector('.my-dragging.custom-class')).not.to.equal(null);
      const point = moveTo(handle, getHeaderByField('year'));
      fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
      expect(document.querySelector('.my-dragging.custom-class')).to.equal(null);
      expect(getOrderedFields()).to.deep.equal(['year', 'brand', 'price']);
    });

    it('should not start a drag on a tap, and a tap should still sort', async () => {
      render(<Test />);
      const onColumnHeaderClick = vi.fn();
      apiRef.current!.subscribeEvent('columnHeaderClick', onColumnHeaderClick);
      const header = getHeaderByField('brand');
      const handle = getHandle(header);
      const start = getCenter(handle);

      fireEvent.pointerDown(handle, pointer('touch', start.x, start.y));
      fireEvent.pointerUp(handle, pointer('touch', start.x, start.y));
      // Let any click suppression from a previous drag expire before the tap's click
      await waitForFrames(150);
      // The browser fires a click after the tap
      fireEvent.click(header);
      await waitForLongPress();

      expect(getDragCol()).to.equal('');
      expect(onColumnHeaderClick).toHaveBeenCalledTimes(1);
      expect(apiRef.current!.state.sorting.sortModel).to.deep.equal([
        { field: 'brand', sort: 'asc' },
      ]);
    });

    it('should not sort or reorder when a long press is released without moving', async () => {
      render(<Test />);
      const onColumnHeaderClick = vi.fn();
      const onColumnOrderChange = vi.fn();
      apiRef.current!.subscribeEvent('columnHeaderClick', onColumnHeaderClick);
      apiRef.current!.subscribeEvent('columnOrderChange', onColumnOrderChange);
      const header = getHeaderByField('brand');

      const { handle, start } = await startTouchDrag('brand');
      expect(getDragCol()).to.equal('brand');
      fireEvent.pointerUp(handle, pointer('touch', start.x, start.y));
      // The browser fires a click after a release that didn't move
      fireEvent.click(header);

      expect(onColumnHeaderClick).toHaveBeenCalledTimes(0);
      expect(apiRef.current!.state.sorting.sortModel).to.deep.equal([]);
      expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);
      expect(getDragCol()).to.equal('');
      // The column didn't move, so no reorder event fires
      expect(onColumnOrderChange).toHaveBeenCalledTimes(0);
    });

    it('should not reorder when dragged over other columns and back to the origin', async () => {
      const onColumnOrderChange = vi.fn();
      render(<Test onColumnOrderChange={onColumnOrderChange} />);

      const { handle } = await startTouchDrag('brand');
      moveTo(handle, getHeaderByField('year'));
      expect(getOrderedFields()).to.deep.equal(['year', 'brand', 'price']);
      // "year" is now the leftmost header: moving back over it returns brand to the origin
      const point = moveTo(handle, getHeaderByField('year'));
      expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);
      fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));

      expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);
      expect(onColumnOrderChange).toHaveBeenCalledTimes(0);
      expect(getDragCol()).to.equal('');
    });

    it('should not start a drag from the column menu button', async () => {
      render(<Test />);
      const header = getHeaderByField('brand');
      const button = header.querySelector<HTMLElement>(`.${gridClasses.menuIconButton}`)!;
      const start = getCenter(getHandle(header));

      fireEvent.pointerDown(button, pointer('touch', start.x, start.y));
      await waitForLongPress();

      expect(getDragCol()).to.equal('');
      expect(document.querySelector(`.${gridClasses['columnHeader--dragging']}`)).to.equal(null);
    });

    it('should not start a drag when column reordering is disabled', async () => {
      render(<Test disableColumnReorder />);
      const header = getHeaderByField('brand');
      const handle = getHandle(header);
      expect(handle.getAttribute('draggable')).to.equal('false');
      const start = getCenter(handle);

      fireEvent.pointerDown(handle, pointer('touch', start.x, start.y));
      await waitForLongPress();
      expect(getDragCol()).to.equal('');
    });

    it('should not start a drag on a column with disableReorder', async () => {
      render(<Test columns={[{ ...columns[0], disableReorder: true }, columns[1], columns[2]]} />);
      const handle = getHandle(getHeaderByField('brand'));
      const start = getCenter(handle);

      fireEvent.pointerDown(handle, pointer('touch', start.x, start.y));
      await waitForLongPress();
      expect(getDragCol()).to.equal('');
    });

    it('should end the gesture when reordering got disabled during the long press', async () => {
      const { setProps } = render(<Test />);
      const handle = getHandle(getHeaderByField('brand'));
      const start = getCenter(handle);

      fireEvent.pointerDown(handle, pointer('touch', start.x, start.y));
      setProps({ disableColumnReorder: true });
      await waitForLongPress();
      expect(getDragCol()).to.equal('');
      expect(document.querySelector(`.${gridClasses['columnHeader--dragging']}`)).to.equal(null);
      fireEvent.pointerUp(handle, pointer('touch', start.x, start.y));

      // The refused gesture didn't keep a session that would ignore the next press
      setProps({ disableColumnReorder: false });
      await startTouchDrag('brand');
      expect(getDragCol()).to.equal('brand');
    });

    it('should clear the state without an event when reordering got disabled during the drag', async () => {
      const onColumnOrderChange = vi.fn();
      const { setProps } = render(<Test onColumnOrderChange={onColumnOrderChange} />);

      const { handle } = await startTouchDrag('brand');
      const point = moveTo(handle, getHeaderByField('year'));
      expect(getOrderedFields()).to.deep.equal(['year', 'brand', 'price']);

      setProps({ disableColumnReorder: true });
      fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));

      // Like HTML drag and drop: the column stays where it is, nothing is published
      expect(getDragCol()).to.equal('');
      expect(onColumnOrderChange).toHaveBeenCalledTimes(0);
      expect(getOrderedFields()).to.deep.equal(['year', 'brand', 'price']);
      expect(document.querySelector(`.${gridClasses['columnHeader--dragging']}`)).to.equal(null);
    });

    it('should restore the origin when the column is released outside the grid', async () => {
      const onColumnOrderChange = vi.fn();
      render(<Test onColumnOrderChange={onColumnOrderChange} />);

      const { handle } = await startTouchDrag('brand');
      moveTo(handle, getHeaderByField('price'));
      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);

      const rootRect = document.querySelector(`.${gridClasses.root}`)!.getBoundingClientRect();
      fireEvent.pointerMove(handle, pointer('touch', rootRect.right + 50, rootRect.top));
      fireEvent.pointerUp(handle, pointer('touch', rootRect.right + 50, rootRect.top));

      expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);
      expect(onColumnOrderChange).toHaveBeenCalledTimes(0);
      expect(getDragCol()).to.equal('');
    });

    it('should keep the position when the column is released over the footer', async () => {
      const onColumnOrderChange = vi.fn();
      render(<Test onColumnOrderChange={onColumnOrderChange} />);

      const { handle } = await startTouchDrag('brand');
      moveTo(handle, getHeaderByField('price'));
      const point = moveTo(handle, document.querySelector(`.${gridClasses.footerContainer}`)!);
      fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));

      // Unlike HTML drag and drop, a release anywhere in the grid is a drop
      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);
      expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
      expect(getDragCol()).to.equal('');
    });

    it('should keep the position when the column is released over a column group header', async () => {
      const onColumnOrderChange = vi.fn();
      render(
        <Test
          columnGroupingModel={[
            {
              groupId: 'group',
              freeReordering: true,
              children: [{ field: 'year' }, { field: 'price' }],
            },
          ]}
          onColumnOrderChange={onColumnOrderChange}
        />,
      );

      const { handle } = await startTouchDrag('brand');
      moveTo(handle, getHeaderByField('price'));
      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);
      const point = moveTo(
        handle,
        document.querySelector(`.${gridClasses['columnHeader--filledGroup']}`)!,
      );
      // The group header isn't a target: the order doesn't change while over it
      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);
      fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));

      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);
      expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
    });

    it('should keep the position when released outside with keepColumnPositionIfDraggedOutside', async () => {
      const onColumnOrderChange = vi.fn();
      render(<Test keepColumnPositionIfDraggedOutside onColumnOrderChange={onColumnOrderChange} />);

      const { handle } = await startTouchDrag('brand');
      moveTo(handle, getHeaderByField('price'));
      const rootRect = document.querySelector(`.${gridClasses.root}`)!.getBoundingClientRect();
      fireEvent.pointerMove(handle, pointer('touch', rootRect.right + 50, rootRect.top));
      fireEvent.pointerUp(handle, pointer('touch', rootRect.right + 50, rootRect.top));

      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);
      expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
    });

    it('should restore the origin on Escape', async () => {
      const onColumnOrderChange = vi.fn();
      render(<Test onColumnOrderChange={onColumnOrderChange} />);

      const { handle } = await startTouchDrag('brand');
      const point = moveTo(handle, getHeaderByField('price'));
      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);

      fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
      expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);
      expect(getDragCol()).to.equal('');
      expect(document.querySelector(`.${gridClasses['columnHeader--dragging']}`)).to.equal(null);

      // The release after the cancel does nothing
      fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
      expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);
      expect(onColumnOrderChange).toHaveBeenCalledTimes(0);
    });

    it('should surface a columnOrderChange listener error and still clear the state', async () => {
      render(<Test />);
      apiRef.current!.subscribeEvent('columnOrderChange', () => {
        throw new Error('Boom');
      });
      // The release runs the publish synchronously: the listener error reaches the browser as uncaught
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const onError = vi.fn((event: ErrorEvent) => event.preventDefault());
      window.addEventListener('error', onError);

      try {
        const { handle } = await startTouchDrag('brand');
        const point = moveTo(handle, getHeaderByField('year'));
        fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
      } finally {
        window.removeEventListener('error', onError);
        consoleError.mockRestore();
      }

      expect(onError).toHaveBeenCalled();
      // The column moved and the drag state is cleared, even though the listener threw
      expect(getOrderedFields()).to.deep.equal(['year', 'brand', 'price']);
      expect(getDragCol()).to.equal('');
      expect(document.querySelector(`.${gridClasses['columnHeader--dragging']}`)).to.equal(null);
    });

    describe('column rules', () => {
      it('should not drag left of the first column when it has disableReorder', async () => {
        render(
          <Test columns={[{ ...columns[0], disableReorder: true }, columns[1], columns[2]]} />,
        );

        const { handle } = await startTouchDrag('price');
        moveTo(handle, getHeaderByField('year'));
        expect(getOrderedFields()).to.deep.equal(['brand', 'price', 'year']);
        const point = moveTo(handle, getHeaderByField('brand'));
        expect(getOrderedFields()).to.deep.equal(['brand', 'price', 'year']);
        fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
        expect(getOrderedFields()).to.deep.equal(['brand', 'price', 'year']);
      });

      it('should move over a hidden column', async () => {
        render(<Test initialState={{ columns: { columnVisibilityModel: { year: false } } }} />);
        expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);

        const { handle } = await startTouchDrag('brand');
        const point = moveTo(handle, getHeaderByField('price'));
        fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));

        expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);
        expect(apiRef.current!.getVisibleColumns().map((column) => column.field)).to.deep.equal([
          'price',
          'brand',
        ]);
      });

      it('should not split a column group, unless the group allows free reordering', async () => {
        const columnGroupingModel = [
          { groupId: 'group', children: [{ field: 'brand' }, { field: 'year' }] },
        ];
        const { setProps } = render(<Test columnGroupingModel={columnGroupingModel} />);

        let { handle } = await startTouchDrag('price');
        // Between the two columns of the group: forbidden
        let point = moveTo(handle, getHeaderByField('year'));
        expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);
        // Before the group: allowed
        point = moveTo(handle, getHeaderByField('brand'));
        expect(getOrderedFields()).to.deep.equal(['price', 'brand', 'year']);
        fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));

        setProps({
          columnGroupingModel: [{ ...columnGroupingModel[0], freeReordering: true }],
        });
        await act(() => apiRef.current!.setColumnIndex('price', 2));
        expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);

        ({ handle } = await startTouchDrag('price'));
        point = moveTo(handle, getHeaderByField('year'));
        expect(getOrderedFields()).to.deep.equal(['brand', 'price', 'year']);
        fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
      });

      it('should not move a column into the pinned columns, and accept the drop there', async () => {
        const onColumnOrderChange = vi.fn();
        render(
          <Test
            initialState={{ pinnedColumns: { left: ['brand'] } }}
            onColumnOrderChange={onColumnOrderChange}
          />,
        );

        const { handle } = await startTouchDrag('price');
        moveTo(handle, getHeaderByField('year'));
        expect(getOrderedFields()).to.deep.equal(['brand', 'price', 'year']);
        const point = moveTo(handle, getHeaderByField('brand'));
        expect(getOrderedFields()).to.deep.equal(['brand', 'price', 'year']);
        fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));

        // A pinned header is part of the grid: the release is a drop, not a cancel
        expect(getOrderedFields()).to.deep.equal(['brand', 'price', 'year']);
        expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
      });

      it('should not use the headers of a nested grid as targets', async () => {
        render(
          <Test
            getDetailPanelHeight={() => 100}
            // Mimics a nested grid that reuses the fields of the parent grid
            getDetailPanelContent={({ row }) =>
              row.id === 1 ? (
                <div className={gridClasses.root}>
                  <div
                    className={gridClasses.columnHeader}
                    data-field="price"
                    style={{ height: 80 }}
                  >
                    Nested header
                  </div>
                </div>
              ) : null
            }
            initialState={{ detailPanel: { expandedRowIds: new Set([1]) } }}
          />,
        );

        // The detail panel adds its toggle column in front
        const movedOrder = ['__detail_panel_toggle__', 'year', 'brand', 'price'];
        const { handle } = await startTouchDrag('brand');
        moveTo(handle, getHeaderByField('year'));
        expect(getOrderedFields()).to.deep.equal(movedOrder);
        const nestedHeader = document.querySelector(
          `.${gridClasses.detailPanel} .${gridClasses.columnHeader}`,
        )!;
        const point = moveTo(handle, nestedHeader);
        // The nested header with the same field didn't become a target
        expect(getOrderedFields()).to.deep.equal(movedOrder);
        // The detail panel is inside this grid: the release keeps the position
        fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
        expect(getOrderedFields()).to.deep.equal(movedOrder);
        expect(getDragCol()).to.equal('');
      });

      it('should only use the headers and cells as targets, not other elements with data-field', async () => {
        const onColumnOrderChange = vi.fn();
        // Like the field chips of the pivot panel, which render inside the grid root
        function ToolbarWithField() {
          return (
            <div data-field="price" style={{ height: 40 }}>
              Not a column
            </div>
          );
        }
        render(
          <Test
            showToolbar
            slots={{ toolbar: ToolbarWithField }}
            onColumnOrderChange={onColumnOrderChange}
          />,
        );

        const { handle } = await startTouchDrag('brand');
        const point = moveTo(handle, document.querySelector('[data-field="price"]')!);
        expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);
        expect(getDragCol()).to.equal('brand');
        fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
        expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);
        expect(onColumnOrderChange).toHaveBeenCalledTimes(0);
        expect(getDragCol()).to.equal('');
      });

      it('should resolve an element with its own data-field inside a header to that header', async () => {
        render(
          <Test
            columns={[
              {
                ...columns[0],
                renderHeader: () => (
                  <span>
                    Brand <span data-field="price">tag</span>
                  </span>
                ),
              },
              columns[1],
              columns[2],
            ]}
          />,
        );

        const { handle } = await startTouchDrag('year');
        const tag = getHeaderByField('brand').querySelector('[data-field="price"]')!;
        const point = moveTo(handle, tag);
        // Over the brand header, not the price column the tag names
        expect(getOrderedFields()).to.deep.equal(['year', 'brand', 'price']);
        fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
        expect(getOrderedFields()).to.deep.equal(['year', 'brand', 'price']);
      });
    });

    describe('auto-scroll', () => {
      it('should scroll at the right edge, only after the pointer moved', async () => {
        render(<Test columns={manyColumns} />);
        const scroller = getScroller();
        const scrollerRect = scroller.getBoundingClientRect();
        const headerRect = getHeaderByField('col0').getBoundingClientRect();
        const y = headerRect.top + headerRect.height / 2;

        // A press inside the edge zone, on the header that's there
        const x = scrollerRect.right - 10;
        const handle = document
          .elementFromPoint(x, y)!
          .closest<HTMLElement>(`.${gridClasses.columnHeaderDraggableContainer}`)!;
        fireEvent.pointerDown(handle, pointer('touch', x, y));
        await waitForLongPress();
        expect(getDragCol()).not.to.equal('');
        await waitForFrames();
        expect(scroller.scrollLeft).to.equal(0);

        fireEvent.pointerMove(handle, pointer('touch', x + 5, y + 12));
        await waitForFrames();
        expect(scroller.scrollLeft).to.be.greaterThan(0);
        fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
      });

      it('should move the column with the auto-scroll and drop it where the scroll ends', async () => {
        const onColumnOrderChange = vi.fn();
        render(<Test columns={manyColumns} onColumnOrderChange={onColumnOrderChange} />);
        const scroller = getScroller();
        const scrollerRect = scroller.getBoundingClientRect();

        const { handle, start } = await startTouchDrag('col1');
        // The move alone puts col1 over the header at the edge, col3
        const x = scrollerRect.right - 10;
        fireEvent.pointerMove(handle, pointer('touch', x, start.y));
        expect(getOrderedFields().indexOf('col1')).to.equal(3);
        // Holding still, the columns scroll under the finger and col1 keeps following it
        await waitForFrames(300);
        expect(scroller.scrollLeft).to.be.greaterThan(0);
        const indexWhileScrolling = getOrderedFields().indexOf('col1');
        expect(indexWhileScrolling).to.be.greaterThan(3);

        fireEvent.pointerUp(handle, pointer('touch', x, start.y));
        expect(getOrderedFields().indexOf('col1')).to.equal(indexWhileScrolling);
        expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
        expect(onColumnOrderChange.mock.calls[0][0]).toMatchObject({
          oldIndex: 1,
          targetIndex: indexWhileScrolling,
        });
      });

      it('should scroll at the edge of the scrollable columns, next to the pinned columns', async () => {
        render(<Test columns={manyColumns} initialState={{ pinnedColumns: { left: ['col0'] } }} />);
        const scroller = getScroller();
        await act(async () => {
          scroller.scrollLeft = 300;
        });
        await waitForFrames(50);

        const { handle, start } = await startTouchDrag('col5');
        const pinnedRight = getHeaderByField('col0').getBoundingClientRect().right;

        // The edge zone starts next to the pinned column, not at the scroller edge under it
        fireEvent.pointerMove(handle, pointer('touch', pinnedRight + 5, start.y));
        await waitForFrames();
        expect(scroller.scrollLeft).to.be.lessThan(300);
        fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
      });
    });

    describe('RTL', () => {
      function RtlTest(props: Partial<DataGridProProps> & { width?: number }) {
        return (
          <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
            <div dir="rtl">
              <Test {...props} />
            </div>
          </ThemeProvider>
        );
      }

      it('should reorder in both directions', async () => {
        render(<RtlTest />);
        // The first column is on the right
        expect(getHeaderByField('brand').getBoundingClientRect().left).to.be.greaterThan(
          getHeaderByField('year').getBoundingClientRect().left,
        );

        let { handle } = await startTouchDrag('brand');
        let point = moveTo(handle, getHeaderByField('price'));
        expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);
        fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));

        ({ handle } = await startTouchDrag('brand'));
        point = moveTo(handle, getHeaderByField('year'));
        expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);
        fireEvent.pointerUp(handle, pointer('touch', point.x, point.y));
      });

      it('should auto-scroll toward the hidden columns', async () => {
        render(<RtlTest columns={manyColumns} />);
        const scroller = getScroller();
        expect(scroller.scrollLeft).to.equal(0);
        const scrollerRect = scroller.getBoundingClientRect();

        const { handle, start } = await startTouchDrag('col0');
        // The hidden columns are on the left in RTL, where `scrollLeft` is negative
        fireEvent.pointerMove(handle, pointer('touch', scrollerRect.left + 5, start.y));
        await waitForFrames();
        expect(scroller.scrollLeft).to.be.lessThan(0);
        fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
      });

      it('should place the edge zone next to the pinned column, which sits on the right in RTL', async () => {
        render(
          <RtlTest columns={manyColumns} initialState={{ pinnedColumns: { left: ['col0'] } }} />,
        );
        const scroller = getScroller();
        await act(async () => {
          scroller.scrollLeft = -300;
        });
        await waitForFrames(50);

        // In RTL the left-pinned column renders on the right edge; the scrollable zone ends to its left
        const pinnedLeft = getHeaderByField('col0').getBoundingClientRect().left;
        const { handle, start } = await startTouchDrag('col5');
        fireEvent.pointerMove(handle, pointer('touch', pinnedLeft - 5, start.y));
        await waitForFrames();
        // Moving toward the first columns brings `scrollLeft` back toward 0
        expect(scroller.scrollLeft).to.be.greaterThan(-300);
        fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
      });
    });
  });

  describe.skipIf(isJSDOM)('pen', () => {
    it('should reorder a column with a pen, like touch', async () => {
      const onColumnOrderChange = vi.fn();
      render(<Test onColumnOrderChange={onColumnOrderChange} />);
      const handle = getHandle(getHeaderByField('brand'));
      const start = getCenter(handle);

      // A pen starts the drag after it moves past the distance threshold, not on a long press.
      // The first move only starts the drag; a second, distinct move does the reorder.
      fireEvent.pointerDown(handle, pointer('pen', start.x, start.y));
      const overYear = getCenter(getHeaderByField('year'));
      fireEvent.pointerMove(handle, pointer('pen', overYear.x, overYear.y));
      expect(getDragCol()).to.equal('brand');

      const point = getCenter(getHeaderByField('price'));
      fireEvent.pointerMove(handle, pointer('pen', point.x, point.y));
      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);
      fireEvent.pointerUp(handle, pointer('pen', point.x, point.y));

      expect(getOrderedFields()).to.deep.equal(['year', 'price', 'brand']);
      expect(getDragCol()).to.equal('');
      expect(onColumnOrderChange).toHaveBeenCalledTimes(1);
    });
  });

  describe.skipIf(isJSDOM)('mouse', () => {
    it('should not use pointer events for the mouse', async () => {
      render(<Test />);
      const handle = getHandle(getHeaderByField('brand'));
      const start = getCenter(handle);
      const target = getCenter(getHeaderByField('price'));

      fireEvent.pointerDown(handle, pointer('mouse', start.x, start.y));
      fireEvent.pointerMove(handle, pointer('mouse', target.x, target.y));
      await waitForLongPress();

      expect(getDragCol()).to.equal('');
      expect(getOrderedFields()).to.deep.equal(['brand', 'year', 'price']);
    });
  });

  describe.skipIf(isJSDOM)('native drag and drop', () => {
    it('should block a native drag that starts from a touch press', () => {
      render(<Test />);
      const onColumnHeaderDragStart = vi.fn();
      apiRef.current!.subscribeEvent('columnHeaderDragStart', onColumnHeaderDragStart);
      const handle = getHandle(getHeaderByField('brand'));
      const start = getCenter(handle);

      fireEvent.pointerDown(handle, pointer('touch', start.x, start.y));
      // `fireEvent` returns `false` when the event's default action was prevented
      expect(fireEvent.dragStart(handle)).to.equal(false);
      expect(onColumnHeaderDragStart).toHaveBeenCalledTimes(0);
    });

    it('should keep the native drag that starts from a mouse press', () => {
      render(<Test />);
      const onColumnHeaderDragStart = vi.fn();
      apiRef.current!.subscribeEvent('columnHeaderDragStart', onColumnHeaderDragStart);
      const handle = getHandle(getHeaderByField('brand'));
      const start = getCenter(handle);

      fireEvent.pointerDown(handle, pointer('mouse', start.x, start.y));
      fireEvent.pointerUp(handle, pointer('mouse', start.x, start.y));
      fireEvent(handle, createDragStartEvent(handle));
      expect(onColumnHeaderDragStart).toHaveBeenCalledTimes(1);
      expect(getDragCol()).to.equal('brand');
    });
  });
});
