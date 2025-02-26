import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { LicenseInfo } from '@mui/x-license';
import { sharedLicenseStatuses } from '@mui/x-license/useLicenseVerifier/useLicenseVerifier';
import { Heatmap } from './Heatmap';

describe('<Heatmap /> - License', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    Object.keys(sharedLicenseStatuses).forEach((key) => {
      delete sharedLicenseStatuses[key];
    });
  });

  it('should render watermark when the license is missing', async () => {
    LicenseInfo.setLicenseKey('');

    expect(() =>
      render(<Heatmap series={[]} width={100} height={100} xAxis={[]} yAxis={[]} />),
    ).toErrorDev(['MUI X: Missing license key.']);

    expect(await screen.findAllByText('MUI X Missing license key')).not.to.equal(null);
  });

  it('should render "No data to display" when axes are empty arrays', () => {
    render(<Heatmap series={[]} width={100} height={100} xAxis={[]} yAxis={[]} />);

    expect(screen.getByText('No data to display')).toBeVisible();
  });

  describe('axis defaults', () => {
    const series = [
      {
        data: [
          [-1, 3, 7],
          [1, 5, 8],
        ],
      },
    ] as const;

    it('should render default axes when axes are empty arrays and series contain data', () => {
      render(<Heatmap series={series} width={100} height={100} xAxis={[]} yAxis={[]} />);

      const xAxisTickLabels = screen.getAllByTestId('ChartsXAxisTickLabel');
      expect(xAxisTickLabels.map((t) => t.textContent)).to.deep.equal(['0', '1']);

      const yAxisTickLabels = screen.getAllByTestId('ChartsYAxisTickLabel');
      expect(yAxisTickLabels.map((t) => t.textContent)).to.deep.equal([
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
      ]);
    });

    it('should render default axes when axes are an array of an empty object and series contain data', () => {
      render(<Heatmap series={series} width={100} height={100} xAxis={[{}]} yAxis={[{}]} />);

      const xAxisTickLabels = screen.getAllByTestId('ChartsXAxisTickLabel');
      expect(xAxisTickLabels.map((t) => t.textContent)).to.deep.equal(['0', '1']);

      const yAxisTickLabels = screen.getAllByTestId('ChartsYAxisTickLabel');
      expect(yAxisTickLabels.map((t) => t.textContent)).to.deep.equal([
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
      ]);
    });
  });
});
