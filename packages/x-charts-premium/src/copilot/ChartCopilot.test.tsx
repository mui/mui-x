import { describe, it, expect } from 'vitest';
import { createRenderer, screen, within } from '@mui/internal-test-utils';
import { ChartCopilot } from './ChartCopilot';
import type { ChartCopilotDataset } from './resolveForRenderer';
import type { ChartCopilotState } from './chartState';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COFFEE = [120, 132, 101, 134, 190, 230, 210, 182, 191, 234, 290, 330];

const DATASET: ChartCopilotDataset = {
  id: 'beverage',
  columns: [
    { field: 'month', headerName: 'Month', type: 'string' },
    { field: 'coffee', headerName: 'Coffee', type: 'number' },
  ],
  rows: MONTHS.map((month, index) => ({ id: index, month, coffee: COFFEE[index] })),
};

// A line chart with a computed overlay and a reference-line annotation — exercises
// the resolve → onRender composition end to end.
const STATE: ChartCopilotState = {
  type: 'line',
  dimensions: [{ field: 'month' }],
  values: [{ field: 'coffee' }],
  configuration: {},
  label: 'Coffee over time',
  overlays: { sma: { id: 'sma', kind: 'sma', target: 'coffee', period: 3 } },
  annotations: { target: { id: 'target', kind: 'refLine', axis: 'y', value: 200, text: 'Target' } },
};

describe('<ChartCopilot /> (integration)', () => {
  const { render } = createRenderer();

  it('renders the chart with overlays + annotations without crashing', () => {
    render(
      <div data-testid="container">
        <ChartCopilot dataset={DATASET} defaultState={STATE} height={300} />
      </div>,
    );
    // The chart SVG renders; reaching here means the overlay computation and the
    // annotation onRender composition did not throw.
    expect(screen.getByTestId('container').querySelector('svg')).not.to.equal(null);
  });

  it('renders the accessible data table mirroring the resolved series', () => {
    render(
      <div data-testid="container">
        <ChartCopilot dataset={DATASET} defaultState={STATE} height={300} />
      </div>,
    );
    const table = screen.getByRole('table');
    expect(within(table).getByText('Coffee over time')).not.to.equal(null);
    // One row per month + the header row.
    expect(within(table).getAllByRole('row')).to.have.length(MONTHS.length + 1);
    // The July coffee cell is the real value (COFFEE[6]).
    const julRow = within(table).getByRole('row', { name: /Jul 210/ });
    expect(julRow).not.to.equal(null);
  });

  it('shows the client-computed answer banner headline', () => {
    render(
      <div data-testid="container">
        <ChartCopilot dataset={DATASET} defaultState={STATE} height={300} />
      </div>,
    );
    // Coffee total 2344 -> "2.3K"; change Jan 120 -> Dec 330 is +175%.
    expect(screen.getByText('2.3K')).not.to.equal(null);
    expect(screen.getByText(/175\.0%/)).not.to.equal(null);
  });
});
