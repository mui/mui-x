import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { RefObject } from '@mui/x-internals/types';
import { act, createRenderer, fireEvent, waitFor } from '@mui/internal-test-utils';
import { getCell, sleep } from 'test/utils/helperFn';
import { DataGridPremium, gridClasses, useGridApiRef } from '@mui/x-data-grid-premium';
import { formulaFeature } from '@mui/x-data-grid-premium/formula';
import type {
  DataGridPremiumProps,
  GridApi,
  GridCellSelectionModel,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid-premium';
import { isJSDOM } from 'test/utils/skipIf';
import { vi, describe, it, expect } from 'vitest';
import { setCaretOffset } from '../components/formulaEditorCaret';

// Longer than the long press delay of touch input
const LONG_PRESS = 350;

// The drag starts from a timer, outside of the `act` of `fireEvent`
async function waitForLongPress() {
  await act(async () => {
    await sleep(LONG_PRESS);
  });
}

// Lets the drag run for a few animation frames
async function waitForFrames(duration = 100) {
  await act(async () => {
    await sleep(duration);
  });
}

// A drag release suppresses the next click for 100ms, on the document. It also reaches the next test.
async function waitForClickSuppressionEnd() {
  await waitForFrames(150);
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

type Point = { x: number; y: number };

function getCenter(element: Element): Point {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function getHandleCell() {
  return document.querySelector<HTMLElement>(`.${gridClasses['cell--withFillHandle']}`);
}

// Inside of the handle, which is in the inline-end bottom corner of the cell
function getCorner(cell: Element, isRtl = false): Point {
  const rect = cell.getBoundingClientRect();
  return { x: isRtl ? rect.left + 3 : rect.right - 3, y: rect.bottom - 3 };
}

function getScroller() {
  return document.querySelector<HTMLElement>(`.${gridClasses.virtualScroller}`)!;
}

function getRoot() {
  return document.querySelector<HTMLElement>(`.${gridClasses.root}`)!;
}

const PREVIEW_CLASSES = [
  'cell--fillPreview',
  'cell--fillPreviewTop',
  'cell--fillPreviewBottom',
  'cell--fillPreviewLeft',
  'cell--fillPreviewRight',
] as const;

// The preview classes of every cell that has one, to compare the touch and mouse paths
function getPreviewSnapshot() {
  return Array.from(document.querySelectorAll(`.${gridClasses['cell--fillPreview']}`))
    .map((cell) => {
      const rowId = cell.closest('[data-id]')!.getAttribute('data-id');
      const field = cell.getAttribute('data-field');
      const classes = PREVIEW_CLASSES.filter((name) => cell.classList.contains(gridClasses[name]));
      return `${rowId}/${field}: ${classes.join(' ')}`;
    })
    .sort();
}

function hasPreview() {
  return document.querySelector(`.${gridClasses['cell--fillPreview']}`) !== null;
}

function isUserSelectionDisabled() {
  return getRoot().classList.contains(gridClasses['root--disableUserSelection']);
}

// A press of the pointer at `point`, on the element under it
function pressAt(pointerType: string, point: Point) {
  const target = document.elementFromPoint(point.x, point.y)!;
  fireEvent.pointerDown(target, pointer(pointerType, point.x, point.y));
  return target;
}

// The events a browser fires for a tap: the pointer events, then the compatibility mouse events and the click
function tapAt(pointerType: string, point: Point) {
  const target = pressAt(pointerType, point);
  const init = { clientX: point.x, clientY: point.y };
  fireEvent.pointerUp(target, { ...pointer(pointerType, point.x, point.y), buttons: 0 });
  fireEvent.mouseDown(target, init);
  fireEvent.mouseUp(target, init);
  fireEvent.click(target, init);
}

async function startTouchFill(point: Point = getCorner(getHandleCell()!)) {
  const target = pressAt('touch', point);
  await waitForLongPress();
  return target;
}

// Once the drag starts, the root captures the pointer. The pressed cell can unmount during auto-scroll.
const getEventTarget = (target: Element) => (target.isConnected ? target : getRoot());

async function moveTo(target: Element, point: Point, pointerType = 'touch') {
  fireEvent.pointerMove(getEventTarget(target), pointer(pointerType, point.x, point.y));
  await waitForFrames();
  return point;
}

function release(target: Element, point: Point, pointerType = 'touch') {
  fireEvent.pointerUp(getEventTarget(target), {
    ...pointer(pointerType, point.x, point.y),
    buttons: 0,
  });
}

async function touchFill(to: Element, from?: Point) {
  const target = await startTouchFill(from);
  const point = await moveTo(target, getCenter(to));
  release(target, point);
}

// The mouse path of `useGridCellSelection`, like the mouse drag tests of the cell selection
async function startMouseFill(to: Element) {
  const handle = getHandleCell()!;
  const corner = getCorner(handle);
  fireEvent.pointerDown(handle, pointer('mouse', corner.x, corner.y));
  fireEvent.mouseDown(handle, { clientX: corner.x, clientY: corner.y });
  const point = getCenter(to);
  act(() => {
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: point.x, clientY: point.y, bubbles: true }),
    );
  });
  await waitForFrames();
}

function endMouseFill() {
  act(() => {
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  });
}

const columns: GridColDef[] = [
  { field: 'name', editable: true, width: 100 },
  { field: 'city', editable: true, width: 100 },
  { field: 'category', editable: true, width: 100 },
  { field: 'readOnly', width: 100 },
];

const rows = [
  { id: 0, name: 'Alice', city: 'Paris', category: 'A', readOnly: 'x' },
  { id: 1, name: 'Bob', city: 'London', category: 'B', readOnly: 'y' },
  { id: 2, name: 'Charlie', city: 'Rome', category: 'C', readOnly: 'z' },
  { id: 3, name: '', city: '', category: '', readOnly: 'w' },
  { id: 4, name: '', city: '', category: '', readOnly: 'v' },
  { id: 5, name: '', city: '', category: '', readOnly: 'u' },
];

const manyColumns: GridColDef[] = Array.from({ length: 8 }, (_, index) => ({
  field: `c${index}`,
  editable: true,
  width: 100,
}));

const manyRows = Array.from({ length: 30 }, (_, rowIndex) => {
  const row: Record<string, string | number> = { id: rowIndex };
  manyColumns.forEach((column) => {
    row[column.field] = `${rowIndex}-${column.field}`;
  });
  return row;
});

describe.skipIf(isJSDOM)('<DataGridPremium /> - Fill handle with pointer events', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function Test(
    props: Partial<DataGridPremiumProps> & { width?: number; height?: number; rtl?: boolean },
  ) {
    const { width = 500, height = 400, rtl = false, ...other } = props;
    apiRef = useGridApiRef();
    const grid = (
      <div style={{ width, height }}>
        <DataGridPremium
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          rowSelection={false}
          cellSelection
          cellSelectionFillHandle
          disableVirtualization
          hideFooter
          {...other}
        />
      </div>
    );
    if (!rtl) {
      return grid;
    }
    return (
      <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
        <div dir="rtl">{grid}</div>
      </ThemeProvider>
    );
  }

  const getValue = (id: GridRowId, field: string) => apiRef.current!.getRow(id)[field];

  async function selectCells(model: GridCellSelectionModel) {
    act(() => {
      apiRef.current!.setCellSelectionModel(model);
    });
    await waitFor(() => {
      expect(getHandleCell()).not.to.equal(null);
    });
  }

  describe('fill directions', () => {
    it('should fill down from one cell with a long press and a drag', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });

      await touchFill(getCell(2, 0));

      await waitFor(() => {
        expect(getCell(2, 0).textContent).to.equal('Alice');
      });
      expect(getCell(1, 0).textContent).to.equal('Alice');
      expect(processRowUpdate).toHaveBeenCalledTimes(2);
      expect(apiRef.current!.getCellSelectionModel()).to.deep.equal({
        0: { name: true },
        1: { name: true },
        2: { name: true },
      });
    });

    it('should fill up', async () => {
      render(<Test />);
      await selectCells({ 2: { name: true } });

      await touchFill(getCell(0, 0));

      await waitFor(() => {
        expect(getValue(0, 'name')).to.equal('Charlie');
      });
      expect(getValue(1, 'name')).to.equal('Charlie');
    });

    it('should fill right', async () => {
      render(<Test />);
      await selectCells({ 0: { name: true } });

      await touchFill(getCell(0, 2));

      await waitFor(() => {
        expect(getValue(0, 'category')).to.equal('Alice');
      });
      expect(getValue(0, 'city')).to.equal('Alice');
      expect(getValue(1, 'name')).to.equal('Bob');
    });

    it('should fill left', async () => {
      render(<Test />);
      await selectCells({ 0: { category: true } });

      await touchFill(getCell(0, 0));

      await waitFor(() => {
        expect(getValue(0, 'name')).to.equal('A');
      });
      expect(getValue(0, 'city')).to.equal('A');
    });

    it('should fill down from a multi-cell selection, cycling the source values', async () => {
      render(<Test />);
      await selectCells({ 0: { name: true, city: true }, 1: { name: true, city: true } });
      expect(getHandleCell()).to.equal(getCell(1, 1));

      await touchFill(getCell(5, 1));

      await waitFor(() => {
        expect(getValue(5, 'city')).to.equal('London');
      });
      expect(getValue(2, 'name')).to.equal('Alice');
      expect(getValue(3, 'name')).to.equal('Bob');
      expect(getValue(4, 'name')).to.equal('Alice');
      expect(getValue(2, 'city')).to.equal('Paris');
      expect(getValue(3, 'city')).to.equal('London');
      // Only the source columns are filled
      expect(getValue(2, 'category')).to.equal('C');
    });

    it('should fill right from a multi-cell selection', async () => {
      render(<Test />);
      await selectCells({ 0: { name: true }, 1: { name: true } });

      await touchFill(getCell(1, 2));

      await waitFor(() => {
        expect(getValue(1, 'category')).to.equal('Bob');
      });
      expect(getValue(0, 'city')).to.equal('Alice');
      expect(getValue(0, 'category')).to.equal('Alice');
      expect(getValue(1, 'city')).to.equal('Bob');
    });
  });

  describe('starting a fill', () => {
    it('should start a fill from the part of the touch hit area outside of the cell', async () => {
      render(<Test />);
      await selectCells({ 0: { name: true } });
      const rect = getHandleCell()!.getBoundingClientRect();
      // Over the next row and column, 12px from the corner on both axes
      const outside = { x: rect.right + 12, y: rect.bottom + 12 };
      expect(getCell(1, 1).contains(document.elementFromPoint(outside.x, outside.y))).to.equal(
        true,
      );

      await touchFill(getCell(2, 0), outside);

      await waitFor(() => {
        expect(getValue(2, 'name')).to.equal('Alice');
      });
    });

    it('should not start a fill from a press just outside of the touch hit area', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });
      const rect = getHandleCell()!.getBoundingClientRect();

      const target = await startTouchFill({ x: rect.right + 20, y: rect.bottom + 20 });
      const point = await moveTo(target, getCenter(getCell(2, 0)));
      expect(hasPreview()).to.equal(false);
      release(target, point);

      await waitForFrames();
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
      expect(getValue(1, 'name')).to.equal('Bob');
    });

    it('should not start a fill from a swipe that starts on another cell', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });

      const start = getCenter(getCell(1, 1));
      const target = pressAt('touch', start);
      // Moves before the long press: the browser scrolls
      await moveTo(target, { x: start.x, y: start.y + 40 });
      await waitForLongPress();
      const point = await moveTo(target, getCenter(getCell(3, 0)));
      expect(hasPreview()).to.equal(false);
      release(target, point);

      await waitForFrames();
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
    });

    it('should not start a fill when the press moves before the long press', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });

      const corner = getCorner(getHandleCell()!);
      const target = pressAt('touch', corner);
      await moveTo(target, { x: corner.x, y: corner.y + 30 });
      await waitForLongPress();
      const point = await moveTo(target, getCenter(getCell(2, 0)));
      expect(hasPreview()).to.equal(false);
      release(target, point);

      await waitForFrames();
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
    });

    // The handle cell is rendered, and its corner is in the touch hit area, but another part of the grid covers it
    async function expectNoFillFromHiddenHandle(coveringSelector: string, to: Element) {
      const corner = getCorner(getHandleCell()!);
      expect(document.elementFromPoint(corner.x, corner.y)!.closest(coveringSelector)).not.to.equal(
        null,
      );

      const target = await startTouchFill(corner);
      expect(isUserSelectionDisabled()).to.equal(false);
      const point = await moveTo(target, getCenter(to));
      expect(hasPreview()).to.equal(false);
      release(target, point);

      await waitForFrames();
    }

    it('should not start a fill from a press on the footer over a hidden handle', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} hideFooter={false} />);
      // The bottom of the last row is behind the footer
      await selectCells({ 5: { name: true } });

      await expectNoFillFromHiddenHandle(`.${gridClasses.footerContainer}`, getCell(3, 0));
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
    });

    it('should not start a fill from a press on the column headers over a hidden handle', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} height={200} />);
      await selectCells({ 1: { name: true } });
      const headersHeight = document
        .querySelector(`.${gridClasses.columnHeaders}`)!
        .getBoundingClientRect().height;
      const rowHeight = getCell(1, 0).getBoundingClientRect().height;
      // The bottom of the row is halfway up the headers
      await act(async () => {
        apiRef.current!.scroll({ top: 2 * rowHeight + headersHeight / 2 });
      });
      await waitForFrames();

      await expectNoFillFromHiddenHandle(`.${gridClasses.columnHeaders}`, getCell(3, 0));
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
    });

    it('should show the same preview as the mouse for the same positions', async () => {
      const selection = { 0: { name: true, city: true }, 1: { name: true, city: true } };
      const targets = [
        () => getCell(4, 0),
        () => getCell(1, 3),
        () => getCell(0, 3),
        () => getCell(3, 1),
      ];

      const mouseSnapshots: string[][] = [];
      const { unmount } = render(<Test />);
      for (const getTarget of targets) {
        // eslint-disable-next-line no-await-in-loop
        await selectCells(selection);
        // eslint-disable-next-line no-await-in-loop
        await startMouseFill(getTarget());
        mouseSnapshots.push(getPreviewSnapshot());
        // Ends the drag without a fill, back over the source
        act(() => {
          const source = getCenter(getCell(0, 0));
          document.dispatchEvent(
            new MouseEvent('mousemove', { clientX: source.x, clientY: source.y, bubbles: true }),
          );
        });
        // eslint-disable-next-line no-await-in-loop
        await waitForFrames();
        endMouseFill();
      }
      unmount();

      render(<Test />);
      for (let i = 0; i < targets.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await selectCells(selection);
        // eslint-disable-next-line no-await-in-loop
        const target = await startTouchFill();
        // eslint-disable-next-line no-await-in-loop
        await moveTo(target, getCenter(targets[i]()));
        expect(getPreviewSnapshot()).to.deep.equal(mouseSnapshots[i]);
        expect(mouseSnapshots[i].length).to.be.greaterThan(0);
        fireEvent.keyDown(document.body, { key: 'Escape' });
        release(target, getCenter(targets[i]()));
      }
    });
  });

  describe('auto-scroll', () => {
    function TestManyCells(
      props: Partial<DataGridPremiumProps> & { width?: number; height?: number; rtl?: boolean },
    ) {
      return (
        <Test
          rows={manyRows}
          columns={manyColumns}
          width={300}
          height={300}
          disableVirtualization={false}
          {...props}
        />
      );
    }

    // The edges of the scrollable cells, inside of the scrollbars
    function getCellsBounds() {
      const rect = getScroller().getBoundingClientRect();
      const { scrollbarSize, hasScrollX, hasScrollY } = apiRef.current!.state.dimensions;
      return {
        right: rect.right - (hasScrollY ? scrollbarSize : 0),
        bottom: rect.bottom - (hasScrollX ? scrollbarSize : 0),
        left: rect.left,
      };
    }

    it('should scroll down near the bottom edge, and fill the rows that scrolled under a still finger', async () => {
      render(<TestManyCells />);
      await selectCells({ 0: { c0: true } });

      const target = await startTouchFill();
      const corner = getCorner(getHandleCell()!);
      const point = await moveTo(target, { x: corner.x, y: getCellsBounds().bottom - 10 });
      // The finger holds still while the grid scrolls
      await waitForFrames(400);
      expect(getScroller().scrollTop).to.be.greaterThan(200);
      // Rendered by the virtualization during the drag
      const lastPreviewRow = Math.max(
        ...Array.from(document.querySelectorAll(`.${gridClasses['cell--fillPreview']}`)).map(
          (cell) => Number(cell.closest('[data-id]')!.getAttribute('data-id')),
        ),
      );
      expect(lastPreviewRow).to.be.greaterThan(6);
      release(target, point);

      await waitFor(() => {
        expect(getValue(lastPreviewRow, 'c0')).to.equal('0-c0');
      });
      expect(getValue(6, 'c0')).to.equal('0-c0');
      expect(getValue(lastPreviewRow + 2, 'c0')).to.equal(`${lastPreviewRow + 2}-c0`);
    });

    it('should scroll right near the right edge', async () => {
      render(<TestManyCells />);
      await selectCells({ 0: { c0: true } });

      const target = await startTouchFill();
      const corner = getCorner(getHandleCell()!);
      const point = await moveTo(target, { x: getCellsBounds().right - 10, y: corner.y - 20 });
      await waitForFrames(400);
      expect(getScroller().scrollLeft).to.be.greaterThan(100);
      expect(getScroller().scrollTop).to.equal(0);
      release(target, point);

      await waitFor(() => {
        expect(getValue(0, 'c4')).to.equal('0-c0');
      });
      expect(getValue(1, 'c1')).to.equal('1-c1');
    });

    it('should only scroll once the finger moved 10px away from the long press', async () => {
      // The handle of the first row is in the bottom scroll zone
      render(<TestManyCells height={56 + 52 + 30} />);
      await selectCells({ 0: { c0: true } });
      const corner = getCorner(getHandleCell()!);
      const { bottom } = getCellsBounds();
      expect(corner.y).to.be.greaterThan(bottom - 24);

      const target = await startTouchFill(corner);
      await moveTo(target, { x: corner.x, y: corner.y + 5 });
      await waitForFrames(200);
      expect(getScroller().scrollTop).to.equal(0);

      const point = await moveTo(target, { x: corner.x, y: corner.y + 11 });
      await waitForFrames(200);
      expect(getScroller().scrollTop).to.be.greaterThan(0);
      release(target, point);
      // The last scroll updates the rendered rows
      await waitForFrames();
    });

    it('should scroll above the bottom pinned rows', async () => {
      const pinned = { ...manyRows[0], id: 'pinned', c0: 'pinned' };
      render(<TestManyCells height={400} pinnedRows={{ bottom: [pinned] }} />);
      await selectCells({ 0: { c0: true } });
      const pinnedTop = document.querySelector(`[data-id="pinned"]`)!.getBoundingClientRect().top;
      expect(getCellsBounds().bottom - pinnedTop).to.be.greaterThan(24);

      const target = await startTouchFill();
      const corner = getCorner(getHandleCell()!);
      await moveTo(target, { x: corner.x, y: pinnedTop - 10 });
      await waitForFrames(300);
      expect(getScroller().scrollTop).to.be.greaterThan(0);

      // Over the pinned row, which is not a target: the fill keeps its last target
      const overPinned = await moveTo(target, { x: corner.x, y: pinnedTop + 20 });
      await waitForFrames(200);
      expect(
        document.querySelector(`[data-id="pinned"] .${gridClasses['cell--fillPreview']}`),
      ).to.equal(null);
      release(target, overPinned);
      await waitFor(() => {
        expect(getValue(1, 'c0')).to.equal('0-c0');
      });
      expect(getValue('pinned', 'c0')).to.equal('pinned');
    });

    it('should scroll before the right pinned columns', async () => {
      render(<TestManyCells width={500} pinnedColumns={{ right: ['c7'] }} />);
      await selectCells({ 0: { c0: true } });
      const pinnedLeft = apiRef.current!.getCellElement(0, 'c7')!.getBoundingClientRect().left;

      const target = await startTouchFill();
      const corner = getCorner(getHandleCell()!);
      const point = await moveTo(target, { x: pinnedLeft - 10, y: corner.y - 20 });
      await waitForFrames(300);
      expect(getScroller().scrollLeft).to.be.greaterThan(0);
      release(target, point);
      await waitForFrames();
    });

    it('should scroll toward the end in RTL, and keep the horizontal position while scrolling down', async () => {
      render(<TestManyCells rtl />);
      act(() => {
        apiRef.current!.scroll({ left: 100 });
      });
      await waitFor(() => {
        expect(getScroller().scrollLeft).to.equal(-100);
      });
      await selectCells({ 0: { c2: true } });

      const target = await startTouchFill(getCorner(getHandleCell()!, true));
      const corner = getCorner(getHandleCell()!, true);
      await moveTo(target, { x: corner.x, y: getCellsBounds().bottom - 10 });
      await waitForFrames(300);
      expect(getScroller().scrollTop).to.be.greaterThan(0);
      expect(getScroller().scrollLeft).to.equal(-100);

      // The end of the columns is on the left. The vertical scrollbar is on the left too.
      const scrollerRect = getScroller().getBoundingClientRect();
      const { scrollbarSize } = apiRef.current!.state.dimensions;
      const point = await moveTo(target, {
        x: scrollerRect.left + scrollbarSize + 10,
        y: getCenter(getHandleCell() ?? getScroller()).y,
      });
      await waitForFrames(300);
      expect(getScroller().scrollLeft).to.be.lessThan(-150);
      release(target, point);
      await waitForFrames();
    });
  });

  describe('ending a fill', () => {
    it('should fill to the last target when released outside of the grid', async () => {
      render(<Test />);
      await selectCells({ 0: { name: true } });

      const target = await startTouchFill();
      await moveTo(target, getCenter(getCell(2, 0)));
      const rootRect = getRoot().getBoundingClientRect();
      const outside = await moveTo(target, { x: rootRect.left + 50, y: rootRect.bottom + 100 });
      release(target, outside);

      await waitFor(() => {
        expect(getValue(2, 'name')).to.equal('Alice');
      });
      expect(getValue(3, 'name')).to.equal('');
    });

    it('should cancel with Escape', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });

      const target = await startTouchFill();
      const point = await moveTo(target, getCenter(getCell(2, 0)));
      expect(hasPreview()).to.equal(true);
      expect(isUserSelectionDisabled()).to.equal(true);

      fireEvent.keyDown(document.body, { key: 'Escape' });
      expect(hasPreview()).to.equal(false);
      expect(isUserSelectionDisabled()).to.equal(false);
      release(target, point);

      await waitForFrames();
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
    });

    it('should cancel on pointercancel', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });

      const target = await startTouchFill();
      const point = await moveTo(target, getCenter(getCell(2, 0)));
      fireEvent.pointerCancel(target, pointer('touch', point.x, point.y));
      expect(hasPreview()).to.equal(false);
      expect(isUserSelectionDisabled()).to.equal(false);
      release(target, point);

      await waitForFrames();
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
    });

    it('should cancel when the root loses the pointer capture', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });

      const target = await startTouchFill();
      const point = await moveTo(target, getCenter(getCell(2, 0)));
      fireEvent.lostPointerCapture(getRoot(), pointer('touch', point.x, point.y));
      expect(hasPreview()).to.equal(false);
      release(target, point);

      await waitForFrames();
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
    });

    it('should not fill when the grid unmounts during the drag', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      const { unmount } = render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });

      const target = await startTouchFill();
      const point = await moveTo(target, getCenter(getCell(2, 0)));
      unmount();
      await waitForFrames();
      fireEvent.pointerUp(document.body, { ...pointer('touch', point.x, point.y), buttons: 0 });

      await waitForFrames();
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
    });

    it('should cancel when `cellSelectionFillHandle` is turned off during the drag', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      const { setProps } = render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });

      const target = await startTouchFill();
      const point = await moveTo(target, getCenter(getCell(2, 0)));
      expect(hasPreview()).to.equal(true);
      setProps({ cellSelectionFillHandle: false });
      await waitForFrames();
      expect(hasPreview()).to.equal(false);
      expect(isUserSelectionDisabled()).to.equal(false);
      release(target, point);

      await waitForFrames();
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
    });

    it('should clear the preview and report the error when `processRowUpdate` throws', async () => {
      const onProcessRowUpdateError = vi.fn();
      render(
        <Test
          processRowUpdate={() => {
            throw new Error('Update failed');
          }}
          onProcessRowUpdateError={onProcessRowUpdateError}
        />,
      );
      await selectCells({ 0: { name: true } });

      await touchFill(getCell(2, 0));

      await waitFor(() => {
        expect(onProcessRowUpdateError).toHaveBeenCalledTimes(2);
      });
      expect(onProcessRowUpdateError.mock.calls[0][0].message).to.equal('Update failed');
      expect(hasPreview()).to.equal(false);
      expect(isUserSelectionDisabled()).to.equal(false);
      expect(getValue(1, 'name')).to.equal('Bob');
    });
  });

  describe('clicks', () => {
    it('should keep a multi-cell selection after a tap on the handle', async () => {
      await waitForClickSuppressionEnd();
      render(<Test />);
      const selection = { 0: { name: true, city: true }, 1: { name: true, city: true } };
      await selectCells(selection);

      tapAt('touch', getCorner(getHandleCell()!));
      await waitForFrames();
      expect(apiRef.current!.getCellSelectionModel()).to.deep.equal(selection);

      // A tap anywhere else on the cell selects it, like a click
      const handleCell = getHandleCell()!;
      const rect = handleCell.getBoundingClientRect();
      tapAt('touch', { x: rect.left + 5, y: rect.top + 5 });
      await waitForFrames();
      expect(apiRef.current!.getCellSelectionModel()).to.deep.equal({ 1: { city: true } });
    });

    it('should not click the cell after a drag', async () => {
      render(<Test />);
      await selectCells({ 0: { name: true } });

      const target = await startTouchFill();
      const point = await moveTo(target, getCenter(getCell(2, 0)));
      release(target, point);
      fireEvent.click(getCell(2, 0), { clientX: point.x, clientY: point.y });

      await waitFor(() => {
        expect(getValue(2, 'name')).to.equal('Alice');
      });
      expect(apiRef.current!.getCellSelectionModel()).to.deep.equal({
        0: { name: true },
        1: { name: true },
        2: { name: true },
      });
    });
  });

  describe('when the fill is not allowed', () => {
    it('should not start from a non-editable cell, which has no handle', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      act(() => {
        apiRef.current!.setCellSelectionModel({ 0: { readOnly: true } });
      });
      await waitForFrames();
      expect(getHandleCell()).to.equal(null);

      const target = await startTouchFill(getCorner(getCell(0, 3)));
      const point = await moveTo(target, getCenter(getCell(2, 3)));
      release(target, point);

      await waitForFrames();
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
    });

    it('should not update the non-editable columns of the source', async () => {
      render(<Test />);
      await selectCells({ 0: { category: true, readOnly: true } });

      await touchFill(getCell(2, 3));

      await waitFor(() => {
        expect(getValue(2, 'category')).to.equal('A');
      });
      expect(getValue(1, 'readOnly')).to.equal('y');
      expect(getValue(2, 'readOnly')).to.equal('z');
    });

    it('should not start from a cell in edit mode', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });
      act(() => {
        apiRef.current!.startCellEditMode({ id: 0, field: 'name' });
      });
      await waitFor(() => {
        expect(apiRef.current!.getCellMode(0, 'name')).to.equal('edit');
      });

      const target = await startTouchFill(getCorner(getCell(0, 0)));
      const point = await moveTo(target, getCenter(getCell(2, 0)));
      expect(hasPreview()).to.equal(false);
      release(target, point);

      await waitForFrames();
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
    });
  });

  describe('formulas', () => {
    const formulaColumns: GridColDef[] = [
      { field: 'price', type: 'number', editable: true, width: 100 },
      { field: 'qty', type: 'number', editable: true, width: 100 },
      { field: 'total', editable: true, allowFormulas: true, width: 100 },
    ];
    const PRODUCT_FORMULA = '=REF(COLUMN("price"), ROW("r0")) * REF(COLUMN("qty"), ROW("r0"))';
    const formulaRows = [
      { id: 'r0', price: 2, qty: 3, total: PRODUCT_FORMULA },
      { id: 'r1', price: 4, qty: 5, total: '' },
      { id: 'r2', price: 6, qty: 7, total: '' },
    ];

    it('should fill a formula with its references adjusted for each row', async () => {
      render(
        <Test
          featureDependencies={{ formula: formulaFeature }}
          columns={formulaColumns}
          rows={formulaRows}
        />,
      );
      await waitFor(() => {
        expect(getCell(0, 2).textContent).to.equal('6');
      });
      await selectCells({ r0: { total: true } });

      await touchFill(getCell(2, 2));

      await waitFor(() => {
        expect(getCell(2, 2).textContent).to.equal('42');
      });
      expect(getCell(1, 2).textContent).to.equal('20');
      expect(getValue('r1', 'total')).to.contain('ROW("r1")');
      expect(getValue('r0', 'total')).to.equal(PRODUCT_FORMULA);
    });

    describe('reference picking', () => {
      const getEditable = () =>
        document.querySelector<HTMLElement>('.MuiDataGrid-formulaEditorSurface [contenteditable]');

      // A formula is edited in r0, and the selection ends on the price of r1, which shows the handle
      async function startPicking() {
        const utils = render(
          <Test
            featureDependencies={{ formula: formulaFeature }}
            formulaReferencePicking
            columns={formulaColumns}
            rows={formulaRows}
          />,
        );
        await utils.user.dblClick(getCell(0, 2));
        await waitFor(() => {
          expect(getEditable()).not.to.equal(null);
        });
        const editable = getEditable()!;
        editable.textContent = '=';
        fireEvent.input(editable);
        act(() => setCaretOffset(editable, 1));
        fireEvent.keyUp(editable, { key: '=' });
        await selectCells({ r1: { price: true } });
      }

      it('should pick the cell of a tap in the touch hit area outside of the handle cell', async () => {
        await waitForClickSuppressionEnd();
        await startPicking();
        const rect = getHandleCell()!.getBoundingClientRect();

        tapAt('touch', { x: rect.right + 10, y: rect.bottom - 5 });

        await waitFor(() => {
          expect(getEditable()!.textContent).to.equal('=REF(COLUMN("qty"), ROW("r1"))');
        });
        expect(apiRef.current!.getCellMode('r0', 'total')).to.equal('edit');
      });

      it('should not pick the cell of a tap on the handle, like a mouse click', async () => {
        await startPicking();
        const corner = getCorner(getHandleCell()!);

        const target = pressAt('touch', corner);
        fireEvent.pointerUp(target, { ...pointer('touch', corner.x, corner.y), buttons: 0 });
        fireEvent.mouseDown(target, { clientX: corner.x, clientY: corner.y });

        expect(getEditable()!.textContent).to.equal('=');
        expect(isUserSelectionDisabled()).to.equal(false);
      });
    });
  });

  describe('pen', () => {
    it('should fill without a long press', async () => {
      render(<Test />);
      await selectCells({ 0: { name: true } });
      const corner = getCorner(getHandleCell()!);

      const target = pressAt('pen', corner);
      await moveTo(target, { x: corner.x, y: corner.y + 6 }, 'pen');
      const point = await moveTo(target, getCenter(getCell(2, 0)), 'pen');
      release(target, point, 'pen');

      await waitFor(() => {
        expect(getValue(2, 'name')).to.equal('Alice');
      });
    });

    it('should not also run the mouse path with the compatibility mouse events', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      const { user } = render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });
      const corner = getCorner(getHandleCell()!);
      const point = getCenter(getCell(2, 0));

      const target = pressAt('pen', corner);
      fireEvent.mouseDown(target, { clientX: corner.x, clientY: corner.y });
      fireEvent.pointerMove(target, pointer('pen', corner.x, corner.y + 6));
      fireEvent.pointerMove(target, pointer('pen', point.x, point.y));
      act(() => {
        document.dispatchEvent(
          new MouseEvent('mousemove', { clientX: point.x, clientY: point.y, bubbles: true }),
        );
      });
      await waitForFrames();
      release(target, point, 'pen');
      act(() => {
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      });

      await waitFor(() => {
        expect(getValue(2, 'name')).to.equal('Alice');
      });
      expect(processRowUpdate).toHaveBeenCalledTimes(2);

      // The next click selects its cell: no click guard was left behind
      await waitForClickSuppressionEnd();
      await user.click(getCell(4, 1));
      expect(apiRef.current!.getCellSelectionModel()).to.deep.equal({ 4: { city: true } });
    });

    it('should not start from the part of the touch hit area outside of the cell', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });
      const rect = getHandleCell()!.getBoundingClientRect();

      const target = pressAt('pen', { x: rect.right + 8, y: rect.bottom + 8 });
      await moveTo(target, { x: rect.right + 8, y: rect.bottom + 20 }, 'pen');
      const point = await moveTo(target, getCenter(getCell(3, 0)), 'pen');
      expect(hasPreview()).to.equal(false);
      release(target, point, 'pen');

      await waitForFrames();
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
    });
  });

  describe('mouse', () => {
    it('should keep the mouse path after a touch press, and not start a pointer drag', async () => {
      await waitForClickSuppressionEnd();
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(<Test processRowUpdate={processRowUpdate} />);
      await selectCells({ 0: { name: true } });
      tapAt('touch', getCenter(getCell(4, 2)));
      await selectCells({ 0: { name: true } });

      await startMouseFill(getCell(2, 0));
      // Longer than a long press: the pointer path must not start for a mouse
      await waitForLongPress();
      endMouseFill();

      await waitFor(() => {
        expect(getValue(2, 'name')).to.equal('Alice');
      });
      expect(processRowUpdate).toHaveBeenCalledTimes(2);
    });
  });

  describe('nested grids', () => {
    it('should not use a cell of a grid in a detail panel as a target', async () => {
      const processRowUpdate = vi.fn((newRow) => newRow);
      render(
        <Test
          height={600}
          processRowUpdate={processRowUpdate}
          getDetailPanelHeight={() => 150}
          detailPanelExpandedRowIds={new Set<GridRowId>([0])}
          getDetailPanelContent={({ row }) =>
            row.id === 0 ? (
              <div style={{ height: 150 }}>
                <DataGridPremium
                  rows={[
                    { id: 3, name: 'Nested' },
                    { id: 4, name: 'Nested' },
                  ]}
                  columns={[{ field: 'name', editable: true }]}
                  hideFooter
                />
              </div>
            ) : null
          }
        />,
      );
      await selectCells({ 0: { name: true } });
      const nestedCell = document.querySelector(
        `.${gridClasses.detailPanel} [data-id="4"] [data-field="name"]`,
      )!;
      expect(nestedCell).not.to.equal(null);

      const target = await startTouchFill();
      const point = await moveTo(target, getCenter(nestedCell));
      expect(hasPreview()).to.equal(false);
      release(target, point);

      await waitForFrames();
      expect(processRowUpdate).toHaveBeenCalledTimes(0);
      expect(getValue(4, 'name')).to.equal('');
    });
  });
});
