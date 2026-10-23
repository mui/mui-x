import * as React from 'react';
import type { RefObject, GridChartsConfigurationOptions } from '@mui/x-internals/types';
import { act, createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { sleep } from 'test/utils/helperFn';
import {
  DataGridPremium,
  GridChartsIcon,
  GridChartsIntegrationContextProvider,
  GridChartsPanel,
  GridChartsRendererProxy,
  GridSidebarValue,
  getDataGridUtilityClass,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import type {
  DataGridPremiumProps,
  GridApiPremium,
  GridInitialState,
  GridValidRowModel,
} from '@mui/x-data-grid-premium';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

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

const fieldClass = getDataGridUtilityClass('chartsPanelDataField');
const previewClass = getDataGridUtilityClass('chartsPanelDataField--dragging');
const sectionClass = getDataGridUtilityClass('chartsPanelDataSection');
const panelClass = getDataGridUtilityClass('chartsPanelDataBody');

function getField(field: string) {
  return document.querySelector<HTMLElement>(`.${fieldClass}[data-field="${field}"]`)!;
}

function getSection(section: 'dimensions' | 'values') {
  return document.querySelector<HTMLElement>(`.${sectionClass}[data-section="${section}"]`)!;
}

function getPreview() {
  return document.querySelector<HTMLElement>(`.${previewClass}`);
}

function getPanel() {
  return document.querySelector<HTMLElement>(`.${panelClass}`)!;
}

const rows: GridValidRowModel[] = [
  { id: 0, category1: 'CatA', category2: 'Cat1', amount: 100, count: 1 },
  { id: 1, category1: 'CatA', category2: 'Cat2', amount: 200, count: 2 },
  { id: 2, category1: 'CatB', category2: 'Cat2', amount: 300, count: 3 },
];

const baselineProps: DataGridPremiumProps = {
  rows,
  columns: [
    { field: 'id', type: 'number' },
    { field: 'category1' },
    { field: 'category2' },
    { field: 'amount', type: 'number' },
    { field: 'count', type: 'number' },
  ],
};

const configurationOptions: GridChartsConfigurationOptions = {
  type1: {
    label: 'Type 1',
    icon: GridChartsIcon,
    dimensionsLabel: 'Categories',
    valuesLabel: 'Series',
    customization: [],
  },
  limited: {
    label: 'Limited',
    icon: GridChartsIcon,
    dimensionsLabel: 'Categories',
    valuesLabel: 'Series',
    maxDimensions: 1,
    maxValues: 1,
    customization: [],
  },
};

describe('<DataGridPremium /> - Charts panel with pointer events', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApiPremium | null>;

  // Registers the chart in the integration context, like a chart renderer would
  function NullRenderer() {
    return null;
  }

  function Test(props: Partial<DataGridPremiumProps> & { chartType?: string }) {
    const { chartType = 'type1', ...other } = props;
    apiRef = useGridApiRef();
    const initialState: GridInitialState = {
      sidebar: { open: true, value: GridSidebarValue.Charts },
      chartsIntegration: {
        charts: {
          test: { chartType, dimensions: ['category1'], values: ['amount'] },
        },
      },
    };
    return (
      <GridChartsIntegrationContextProvider>
        <div style={{ width: 800, height: 500 }}>
          <DataGridPremium
            {...baselineProps}
            apiRef={apiRef}
            chartsIntegration
            showToolbar
            slots={{ chartsPanel: GridChartsPanel }}
            slotProps={{ chartsPanel: { schema: configurationOptions } }}
            initialState={initialState}
            {...other}
          />
        </div>
        <GridChartsRendererProxy id="test" renderer={NullRenderer} />
      </GridChartsIntegrationContextProvider>
    );
  }

  const getChart = () => apiRef.current!.state.chartsIntegration.charts.test;
  const getDimensions = () => getChart().dimensions.map((item) => item.field);
  const getValues = () => getChart().values.map((item) => item.field);

  async function renderWithFieldsTab(
    props: Partial<DataGridPremiumProps> & { chartType?: string },
  ) {
    const { user } = render(<Test {...props} />);
    await user.click(screen.getAllByRole('tab')[1]);
    expect(getPanel()).not.to.equal(null);
  }

  async function startTouchDrag(field: string) {
    const element = getField(field);
    const start = getPoint(element);
    fireEvent.pointerDown(element, pointer('touch', start.x, start.y));
    await waitForLongPress();
    return element;
  }

  describe.skipIf(isJSDOM)('touch', () => {
    it('should add an available field to a section with a long press and a drag', async () => {
      await renderWithFieldsTab({});
      expect(getDimensions()).to.deep.equal(['category1']);

      const handle = await startTouchDrag('category2');
      expect(getPanel().getAttribute('data-dragging')).to.equal('true');
      expect(getPreview()).not.to.equal(null);

      const target = getPoint(getField('category1'), 0.25);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      expect(getSection('dimensions').getAttribute('data-drag-over')).to.equal('true');

      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      await waitForFrames();
      expect(getDimensions()).to.deep.equal(['category2', 'category1']);
      expect(getPreview()).to.equal(null);
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
    });

    it('should move a field between sections', async () => {
      await renderWithFieldsTab({});

      const handle = await startTouchDrag('count');
      const target = getPoint(getField('amount'), 0.75);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      await waitForFrames();
      expect(getValues()).to.deep.equal(['amount', 'count']);

      const handle2 = await startTouchDrag('count');
      const target2 = getPoint(getField('category1'), 0.75);
      fireEvent.pointerMove(handle2, pointer('touch', target2.x, target2.y));
      fireEvent.pointerUp(handle2, pointer('touch', target2.x, target2.y));
      await waitForFrames();
      expect(getValues()).to.deep.equal(['amount']);
      expect(getDimensions()).to.deep.equal(['category1', 'count']);
    });

    it('should not highlight a section the field is blocked from', async () => {
      // One dimension at most: the dimensions section is full
      await renderWithFieldsTab({ chartType: 'limited' });

      const handle = await startTouchDrag('category2');
      const target = getPoint(getField('category1'), 0.75);
      fireEvent.pointerMove(handle, pointer('touch', target.x, target.y));
      await waitForFrames();
      expect(getSection('dimensions').getAttribute('data-drag-over')).to.equal('false');

      fireEvent.pointerUp(handle, pointer('touch', target.x, target.y));
      await waitForFrames();
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
    });

    it('should not start a drag from a field blocked from every section', async () => {
      // Both sections are full: the available fields can't be dragged
      await renderWithFieldsTab({ chartType: 'limited' });

      const field = getField('category2');
      expect(field.getAttribute('draggable')).to.equal('false');
      const point = getPoint(field);
      fireEvent.pointerDown(field, pointer('touch', point.x, point.y));
      await waitForLongPress();
      expect(getPreview()).to.equal(null);
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
    });
  });

  describe.skipIf(isJSDOM)('mouse', () => {
    it('should keep HTML drag and drop for the mouse', async () => {
      await renderWithFieldsTab({});

      const field = getField('category2');
      const point = getPoint(field);
      fireEvent.pointerDown(field, pointer('mouse', point.x, point.y));
      fireEvent.pointerMove(field, pointer('mouse', point.x + 20, point.y + 20));
      await waitForFrames();
      expect(getPreview()).to.equal(null);
      expect(getPanel().getAttribute('data-dragging')).to.equal('false');
      fireEvent.pointerUp(field, pointer('mouse', point.x + 20, point.y + 20));
    });
  });
});
