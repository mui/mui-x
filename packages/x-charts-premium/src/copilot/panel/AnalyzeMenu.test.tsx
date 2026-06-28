import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { createRenderer, screen, fireEvent, waitFor } from '@mui/internal-test-utils';
import { AnalyzeMenu } from './AnalyzeMenu';
import type { AnalyzeSeries } from './AnalyzePanels';

// A clean linear ramp: mean/median = 30, total = 150, change = +400%.
const ramp: AnalyzeSeries = {
  id: 's1',
  label: 'Revenue',
  data: [10, 20, 30, 40, 50],
};

describe('AnalyzeMenu', () => {
  const { render } = createRenderer();

  it('renders the Analyze trigger and keeps the menu closed initially', () => {
    render(<AnalyzeMenu series={[ramp]} />);
    expect(screen.getByRole('button', { name: 'Analyze' })).not.to.equal(null);
    expect(screen.queryByRole('menu')).to.equal(null);
  });

  it('opens the menu and shows every analysis option', () => {
    render(<AnalyzeMenu series={[ramp]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Analyze' }));
    const items = screen.getAllByRole('menuitem').map((node) => node.textContent);
    expect(items.some((text) => text?.includes('Summary Stats'))).to.equal(true);
    expect(items.some((text) => text?.includes('Correlations'))).to.equal(true);
    expect(items.some((text) => text?.includes('Anomaly Detection'))).to.equal(true);
    expect(items.some((text) => text?.includes('Forecast'))).to.equal(true);
    expect(items.some((text) => text?.includes('Indicators'))).to.equal(true);
  });

  it('selecting "Summary Stats" computes and shows the SummaryStatsPanel content', async () => {
    render(<AnalyzeMenu series={[ramp]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Analyze' }));

    const summaryItem = screen
      .getAllByRole('menuitem')
      .find((node) => node.textContent?.includes('Summary Stats'))!;
    fireEvent.click(summaryItem);

    // The panel renders the series label and known computed stats.
    await waitFor(() => {
      expect(screen.getByText('Revenue')).not.to.equal(null);
    });
    // mean = 30, total = 150, first->last change = +400%.
    expect(screen.getAllByText('30').length).to.be.greaterThan(0);
    expect(screen.getByText('150')).not.to.equal(null);
    expect(screen.getByText('+400%')).not.to.equal(null);
  });

  it('shows an empty state when there are no series to analyze', async () => {
    render(<AnalyzeMenu series={[]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Analyze' }));
    const summaryItem = screen
      .getAllByRole('menuitem')
      .find((node) => node.textContent?.includes('Summary Stats'))!;
    fireEvent.click(summaryItem);

    await waitFor(() => {
      expect(screen.getByText('No series to analyze.')).not.to.equal(null);
    });
  });

  it('renders extra toolbar content next to the Analyze button', () => {
    render(
      <AnalyzeMenu series={[ramp]} toolbarExtra={<button type="button">Copilot</button>} />,
    );
    expect(screen.getByRole('button', { name: 'Copilot' })).not.to.equal(null);
  });
});
