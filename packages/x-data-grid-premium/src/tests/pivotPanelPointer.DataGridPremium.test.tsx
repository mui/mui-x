import * as React from 'react';
import { act, createRenderer, createEvent, fireEvent } from '@mui/internal-test-utils';
import { sleep } from 'test/utils/helperFn';
import { MockedDataTransfer } from 'test/utils/dragAndDrop';
import { DataGridPremium, gridClasses, useGridApiRef } from '@mui/x-data-grid-premium';
import type {
  DataGridPremiumProps,
  GridApi,
  GridColDef,
  GridPivotModel,
} from '@mui/x-data-grid-premium';
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

function getPoint(element: Element, ratioY = 0.5) {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height * ratioY };
}

function getField(field: string) {
  return document.querySelector<HTMLElement>(
    `.${gridClasses.pivotPanelField}[data-field="${field}"]`,
  )!;
}

type Section = 'rows' | 'columns' | 'values' | null;

function getZone(section: Section) {
  return section === null
    ? document.querySelector<HTMLElement>(`.${gridClasses.pivotPanelAvailableFields}`)!
    : document.querySelector<HTMLElement>(
        `.${gridClasses.pivotPanelSection}[data-section="${section}"]`,
      )!;
}

// The placeholder of an empty zone, where no field is under the pointer
function getPlaceholder(section: Section) {
  return getZone(section).querySelector<HTMLElement>(`.${gridClasses.pivotPanelPlaceholder}`)!;
}

function getPreview() {
  return document.querySelector<HTMLElement>(`.${gridClasses['pivotPanelField--dragging']}`);
}

function getPanel() {
  return document.querySelector<HTMLElement>(`.${gridClasses.pivotPanelBody}`)!;
}

const TRANSPARENT = 'rgba(0, 0, 0, 0)';

// The HTML drag and drop handlers read `dataTransfer`
function createDragStartEvent(field: HTMLElement) {
  const event = createEvent.dragStart(field);
  Object.defineProperty(event, 'dataTransfer', { value: new MockedDataTransfer() });
  return event;
}

const rows = [
  { id: 1, brand: 'Nike', size: 'M', year: 2020, price: 10 },
  { id: 2, brand: 'Adidas', size: 'L', year: 2021, price: 20 },
];

const columns: GridColDef[] = [
  { field: 'brand' },
  { field: 'size' },
  { field: 'year', type: 'number' },
  { field: 'price', type: 'number' },
  { field: 'quantity', type: 'number' },
];

const initialModel: GridPivotModel = {
  rows: [{ field: 'brand' }, { field: 'size' }],
  columns: [],
  values: [{ field: 'price', aggFunc: 'sum' }],
};

describe('<DataGridPremium /> - Pivot panel with pointer events', () => {
  const { render } = createRenderer();

  let apiRef: React.RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps> & { model?: GridPivotModel }) {
    const { model = initialModel, ...other } = props;
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 800, height: 500 }}>
        <DataGridPremium
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          showToolbar
          initialState={{ pivoting: { enabled: true, panelOpen: true, model } }}
          {...other}
        />
      </div>
    );
  }

  const getModel = () => apiRef.current!.state.pivoting.model;

  async function startTouchDrag(field: string) {
    const element = getField(field);
    const start = getPoint(element);
    fireEvent.pointerDown(element, pointer('touch', start.x, start.y));
    await waitForLongPress();
    return element;
  }

  describe.skipIf(isJSDOM)('touch', () => {
    it('should add an available field to a section with a long press and a drag', async () => {
      const onPivotModelChange = vi.fn();
      render(<Test onPivotModelChange={onPivotModelChange} />);

      const handle = await startTouchDrag('year');
      expect(getPanel().getAttribute('data-dragging')).to.equal('true');

      const target = getPoint(getPlaceholder('columns'));
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      expect(getZone('columns').getAttribute('data-drag-over')).to.equal('true');

      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      expect(getModel().columns.map((item) => item.field)).to.deep.equal(['year']);
      expect(onPivotModelChange).toHaveBeenCalledTimes(1);
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
    });

    it('should insert the field below the target field', async () => {
      render(<Test />);

      const handle = await startTouchDrag('year');
      const target = getPoint(getField('brand'), 0.75);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      const style = getComputedStyle(getField('brand'));
      expect(style.borderTopColor).to.equal(TRANSPARENT);
      expect(style.borderBottomColor).not.to.equal(TRANSPARENT);

      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      expect(getModel().rows.map((item) => item.field)).to.deep.equal(['brand', 'year', 'size']);
    });

    it('should insert the field above the target field', async () => {
      render(<Test />);

      const handle = await startTouchDrag('year');
      const target = getPoint(getField('size'), 0.25);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      const style = getComputedStyle(getField('size'));
      expect(style.borderTopColor).not.to.equal(TRANSPARENT);
      expect(style.borderBottomColor).to.equal(TRANSPARENT);

      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      expect(getModel().rows.map((item) => item.field)).to.deep.equal(['brand', 'year', 'size']);
    });

    it('should reorder the fields of a section', async () => {
      render(<Test />);

      const handle = await startTouchDrag('size');
      const target = getPoint(getField('brand'), 0.25);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      expect(getModel().rows.map((item) => item.field)).to.deep.equal(['size', 'brand']);
    });

    it('should move a field between sections', async () => {
      render(<Test />);

      const handle = await startTouchDrag('size');
      const target = getPoint(getPlaceholder('columns'));
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      expect(getModel().rows.map((item) => item.field)).to.deep.equal(['brand']);
      expect(getModel().columns.map((item) => item.field)).to.deep.equal(['size']);
    });

    it('should remove a field from the pivot model when dropped on the available fields', async () => {
      render(<Test />);

      const handle = await startTouchDrag('price');
      const target = getPoint(getField('year'), 0.25);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      // The pivot columns are recomputed asynchronously once the values are empty
      await waitForFrames();
      expect(getModel().values).to.deep.equal([]);
      expect(getField('price')).not.to.equal(null);
    });

    it('should not change the model when the field is dropped on its own section', async () => {
      const onPivotModelChange = vi.fn();
      render(<Test onPivotModelChange={onPivotModelChange} />);

      const handle = await startTouchDrag('brand');
      // Over the dragged field itself: no indicator, and the section is highlighted
      const target = getPoint(getField('brand'), 0.75);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      expect(getComputedStyle(getField('brand')).borderBottomColor).to.equal(TRANSPARENT);
      expect(getZone('rows').getAttribute('data-drag-over')).to.equal('true');

      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      expect(onPivotModelChange).not.toHaveBeenCalled();
      expect(getModel()).to.deep.equal(initialModel);
    });

    it('should not change the model when the field is released outside of the panel', async () => {
      const onPivotModelChange = vi.fn();
      render(<Test onPivotModelChange={onPivotModelChange} />);

      const handle = await startTouchDrag('year');
      const panelRect = getPanel().getBoundingClientRect();
      // Over the grid, on the left of the panel
      const outside = { x: panelRect.left - 100, y: panelRect.top + panelRect.height / 2 };
      fireEvent.pointerMove(handle, pointer('touch', outside.x, outside.y));
      // The section the field comes from stays highlighted
      expect(getZone(null).getAttribute('data-drag-over')).to.equal('true');

      fireEvent.pointerUp(handle, pointer('touch', outside.x, outside.y));
      expect(onPivotModelChange).not.toHaveBeenCalled();
      expect(getModel()).to.deep.equal(initialModel);
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
      expect(getPreview()).to.equal(null);
    });

    it('should show a drag preview while dragging, and remove it on release', async () => {
      render(<Test />);

      const handle = await startTouchDrag('year');
      const preview = getPreview()!;
      expect(preview).not.to.equal(null);
      expect(preview.getAttribute('data-field')).to.equal(null);
      expect(preview.getAttribute('aria-hidden')).to.equal('true');

      const target = getPoint(getPlaceholder('columns'));
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      const previewRect = preview.getBoundingClientRect();
      expect(previewRect.top).to.be.lessThan(target.y);
      expect(previewRect.bottom).to.be.greaterThan(target.y);

      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      expect(getPreview()).to.equal(null);
    });

    it('should not start a drag on a tap', async () => {
      const onPivotModelChange = vi.fn();
      render(<Test onPivotModelChange={onPivotModelChange} />);

      const field = getField('year');
      const point = getPoint(field);
      fireEvent.pointerDown(field, pointer('touch', point.x, point.y));
      fireEvent.pointerUp(field, pointer('touch', point.x, point.y));
      await waitForLongPress();
      expect(getPreview()).to.equal(null);
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
      expect(onPivotModelChange).not.toHaveBeenCalled();
    });

    it('should not start a drag when the finger moves before the long press delay', async () => {
      render(<Test />);

      const field = getField('year');
      const point = getPoint(field);
      fireEvent.pointerDown(field, pointer('touch', point.x, point.y));
      // A scroll gesture
      fireEvent.pointerMove(field, pointer('touch', point.x, point.y + 30));
      await waitForLongPress();
      expect(getPreview()).to.equal(null);
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
    });

    it('should not start a drag from a control of the field', async () => {
      render(<Test />);

      const button = getField('brand').querySelector('button')!;
      const point = getPoint(button);
      fireEvent.pointerDown(button, pointer('touch', point.x, point.y));
      await waitForLongPress();
      expect(getPreview()).to.equal(null);
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
    });

    it('should cancel the drag with Escape', async () => {
      const onPivotModelChange = vi.fn();
      render(<Test onPivotModelChange={onPivotModelChange} />);

      const handle = await startTouchDrag('year');
      const target = getPoint(getPlaceholder('columns'));
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      expect(getZone('columns').getAttribute('data-drag-over')).to.equal('true');

      fireEvent.keyDown(document.body, { key: 'Escape' });
      expect(getPreview()).to.equal(null);
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
      expect(getZone('columns').getAttribute('data-drag-over')).to.equal('false');

      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      expect(onPivotModelChange).not.toHaveBeenCalled();
    });

    it('should block the native drag that a long press starts on some browsers', async () => {
      render(<Test />);

      const field = getField('year');
      const point = getPoint(field);
      fireEvent.pointerDown(field, pointer('touch', point.x, point.y));
      const dragStart = createDragStartEvent(field);
      fireEvent(field, dragStart);
      expect(dragStart.defaultPrevented).to.equal(true);
      // The HTML drag and drop handler didn't run
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');

      await waitForLongPress();
      expect(getPreview()).not.to.equal(null);
      fireEvent.pointerUp(field, pointer('touch', point.x, point.y));
    });

    it('should block the native drag of a long press on a control of the field', async () => {
      render(<Test />);

      const field = getField('brand');
      const button = field.querySelector('button')!;
      const point = getPoint(button);
      // The press is on the menu button, which doesn't start a pointer drag either
      fireEvent.pointerDown(button, pointer('touch', point.x, point.y));
      const dragStart = createDragStartEvent(field);
      fireEvent(field, dragStart);
      expect(dragStart.defaultPrevented).to.equal(true);
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
    });

    it('should scroll the available fields when the pointer is close to their bottom edge', async () => {
      const manyColumns: GridColDef[] = Array.from({ length: 40 }, (_, index) => ({
        field: `col${index}`,
      }));
      render(<Test columns={manyColumns} model={{ rows: [], columns: [], values: [] }} />);

      const zone = getZone(null);
      expect(zone.scrollHeight).to.be.greaterThan(zone.clientHeight);

      const handle = await startTouchDrag('col0');
      const zoneRect = zone.getBoundingClientRect();
      // Away from the start, then at the bottom edge
      fireEvent.pointerMove(handle, pointer('touch', zoneRect.left + 20, zoneRect.top + 40));
      fireEvent.pointerMove(handle, pointer('touch', zoneRect.left + 20, zoneRect.bottom - 5));
      await waitForFrames();
      expect(zone.scrollTop).to.be.greaterThan(0);

      fireEvent.pointerUp(handle, pointer('touch', zoneRect.left + 20, zoneRect.bottom - 5));
    });
  });

  describe.skipIf(isJSDOM)('pen', () => {
    it('should start the drag once the pen moves, without a long press', async () => {
      render(<Test />);

      const field = getField('year');
      const point = getPoint(field);
      fireEvent.pointerDown(field, pointer('pen', point.x, point.y));
      fireEvent.pointerMove(field, pointer('pen', point.x, point.y + 10));
      expect(getPreview()).not.to.equal(null);
      expect(getPanel().getAttribute('data-dragging')).to.equal('true');

      const target = getPoint(getPlaceholder('columns'));
      fireEvent.pointerMove(field, pointer('pen', target.x, target.y));
      fireEvent.pointerUp(field, pointer('pen', target.x, target.y));
      expect(getModel().columns.map((item) => item.field)).to.deep.equal(['year']);
      expect(getPreview()).to.equal(null);
    });
  });

  describe.skipIf(isJSDOM)('mouse', () => {
    it('should keep HTML drag and drop for the mouse', async () => {
      render(<Test />);

      const field = getField('year');
      const point = getPoint(field);
      fireEvent.pointerDown(field, pointer('mouse', point.x, point.y));
      fireEvent.pointerMove(field, pointer('mouse', point.x + 20, point.y + 20));
      await waitForFrames();
      expect(getPreview()).to.equal(null);
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
      fireEvent.pointerUp(field, pointer('mouse', point.x + 20, point.y + 20));

      // The native drag of a mouse press isn't blocked: the HTML drag and drop handler runs
      fireEvent.pointerDown(field, pointer('mouse', point.x, point.y));
      const dragStart = createDragStartEvent(field);
      fireEvent(field, dragStart);
      expect(dragStart.defaultPrevented).to.equal(false);
      expect(getPanel().getAttribute('data-dragging')).to.equal('true');
      fireEvent.dragEnd(field);
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
    });
  });
});
