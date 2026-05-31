import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import {
  SummaryStatsPanel,
  CorrelationsPanel,
  AnomaliesPanel,
  ForecastPanel,
  IndicatorsPanel,
  type AnalyzeSeries,
} from './index';

// A clean linear ramp: mean/median = 30, total = 150, change = +400%.
const ramp: AnalyzeSeries = {
  id: 's1',
  label: 'Revenue',
  data: [10, 20, 30, 40, 50],
};

// A perfectly correlated pair (r = 1) and an inverse one (r = -1).
const doubled: AnalyzeSeries = { id: 's2', label: 'Profit', data: [2, 4, 6, 8, 10] };
const inverse: AnalyzeSeries = { id: 's3', label: 'Cost', data: [50, 40, 30, 20, 10] };

// A flat baseline with one violent spike at index 5.
const spiky: AnalyzeSeries = {
  id: 's4',
  label: 'Traffic',
  data: [10, 11, 10, 12, 11, 200, 12, 11],
};

describe('Analyze panels', () => {
  const { render } = createRenderer();

  it('SummaryStatsPanel shows the series label, change badge, and a known mean', async () => {
    render(<SummaryStatsPanel series={[ramp]} />);
    await waitFor(() => {
      expect(screen.getByText('Revenue')).not.to.equal(null);
    });
    // mean = 30 and median = 30 both render the value "30".
    expect(screen.getAllByText('30').length).to.be.greaterThan(0);
    // first->last change = +400%
    expect(screen.getByText('+400%')).not.to.equal(null);
    // total = 150
    expect(screen.getByText('150')).not.to.equal(null);
  });

  it('CorrelationsPanel labels a perfectly positive pair STRONG POSITIVE', async () => {
    render(<CorrelationsPanel series={[ramp, doubled]} />);
    await waitFor(() => {
      expect(screen.getByText('STRONG POSITIVE')).not.to.equal(null);
    });
    // r = 1
    expect(screen.getByText('1')).not.to.equal(null);
  });

  it('CorrelationsPanel labels a perfectly inverse pair STRONG NEGATIVE', async () => {
    render(<CorrelationsPanel series={[ramp, inverse]} />);
    await waitFor(() => {
      expect(screen.getByText('STRONG NEGATIVE')).not.to.equal(null);
    });
  });

  it('AnomaliesPanel reports the detected anomaly count', async () => {
    render(<AnomaliesPanel series={[spiky]} />);
    // The spike up (and the drop back) are both flagged: 2 anomalies.
    await waitFor(() => {
      expect(screen.getByText('2 anomalies detected')).not.to.equal(null);
    });
    expect(screen.getByText('Traffic')).not.to.equal(null);
  });

  it('AnomaliesPanel shows an empty count when nothing is flagged', async () => {
    render(<AnomaliesPanel series={[ramp]} />);
    await waitFor(() => {
      expect(screen.getByText('0 anomalies detected')).not.to.equal(null);
    });
  });

  it('ForecastPanel shows a strong linear fit for a clean ramp', async () => {
    render(<ForecastPanel series={[ramp]} steps={3} />);
    await waitFor(() => {
      expect(screen.getByText('LINEAR TREND')).not.to.equal(null);
    });
    // A perfect line has R^2 = 1 and a strong fit.
    expect(screen.getByText('strong fit')).not.to.equal(null);
    expect(screen.getByText(/3 steps/)).not.to.equal(null);
  });

  it('IndicatorsPanel renders the picker and previews the default SMA line', async () => {
    render(<IndicatorsPanel series={[ramp]} />);
    await waitFor(() => {
      expect(screen.getByText('Simple moving average')).not.to.equal(null);
    });
    // SMA produces a single output line.
    expect(screen.getByText('1 line')).not.to.equal(null);
  });
});
