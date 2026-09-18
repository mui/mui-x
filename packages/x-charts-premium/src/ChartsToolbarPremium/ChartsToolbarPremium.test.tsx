import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { vi, describe, it, expect, beforeEach, onTestFinished } from 'vitest';
import { BarChartPremium } from '../BarChartPremium';

describe('<ChartsToolbarPremium />', () => {
  const { render } = createRenderer();

  let downloads: string[];

  beforeEach(() => {
    downloads = [];
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function recordDownload(this: HTMLAnchorElement) {
        downloads.push(this.download);
      });
    // JSDOM does not implement object URLs.
    const createObjectURL = URL.createObjectURL;
    const revokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = () => 'blob:chart-export';
    URL.revokeObjectURL = () => {};
    onTestFinished(() => {
      click.mockRestore();
      URL.createObjectURL = createObjectURL;
      URL.revokeObjectURL = revokeObjectURL;
    });
  });

  const chart = (props = {}) => (
    <BarChartPremium
      showToolbar
      width={300}
      height={200}
      series={[{ label: 'Sales', data: [1, 2] }]}
      xAxis={[{ data: ['A', 'B'] }]}
      {...props}
    />
  );

  it('offers the Excel entry in the export menu', async () => {
    const { user } = render(chart());

    await user.click(screen.getByRole('button', { name: 'Export' }));

    expect(screen.getByRole('menuitem', { name: 'Download as Excel' })).not.to.equal(null);
    expect(screen.getByRole('menuitem', { name: 'Print' })).not.to.equal(null);
  });

  it('downloads an .xlsx when the entry is clicked', async () => {
    const { user } = render(
      chart({ slotProps: { toolbar: { excelExportOptions: { fileName: 'sales' } } } }),
    );

    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('menuitem', { name: 'Download as Excel' }));

    await vi.waitFor(() => expect(downloads).to.deep.equal(['sales.xlsx']));
  });

  it('hides the entry when disableToolbarButton is set', async () => {
    const { user } = render(
      chart({ slotProps: { toolbar: { excelExportOptions: { disableToolbarButton: true } } } }),
    );

    await user.click(screen.getByRole('button', { name: 'Export' }));

    expect(screen.queryByRole('menuitem', { name: 'Download as Excel' })).to.equal(null);
  });
});
