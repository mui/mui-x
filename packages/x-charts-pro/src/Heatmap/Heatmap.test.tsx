import { act, createRenderer, screen } from '@mui/internal-test-utils';
import { clearLicenseStatusCache, LicenseInfo } from '@mui/x-license';
import { vi } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { Heatmap } from './Heatmap';
import { heatmapClasses } from './heatmapClasses';

describe('<Heatmap /> - License', () => {
  const { render } = createRenderer();

  it('should render watermark when the license is missing', async () => {
    // Clear any previous license status cache to ensure a clean test environment
    // Needed, because we run test with "isolate: false"
    clearLicenseStatusCache();
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
          [0, 3, 7],
          [1, 5, 8],
        ],
      },
    ] as const;

    it('should render default axes when axes are empty arrays and series contain data', () => {
      render(<Heatmap series={series} width={200} height={200} xAxis={[]} yAxis={[]} />);

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
      render(<Heatmap series={series} width={200} height={200} xAxis={[{}]} yAxis={[{}]} />);

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

describe('Heatmap - onItemClick', () => {
  const { render } = createRenderer();

  const config = {
    series: [
      {
        id: '0',
        data: [
          [0, 0, 1],
          [0, 1, 2],
          [0, 2, 3],
          [1, 0, 4],
          [1, 1, 5],
          [1, 2, 6],
        ],
      },
    ],
    xAxis: [{ position: 'none' }],
    yAxis: [{ position: 'none' }],
    width: 300,
    height: 300,
    margin: { top: 0, left: 0, bottom: 0, right: 0 },
  } as const;

  it.skipIf(isJSDOM)('should provide the right context as second argument', async () => {
    // This import doesn't work with JSDOM as it relies on browser APIs
    const { userEvent } = await import('vitest/browser');

    const onItemClick = vi.fn();
    const { container } = render(<Heatmap {...config} onItemClick={onItemClick} />);

    const cells = container.querySelectorAll<HTMLElement>(`.${heatmapClasses.cell}`);

    // The userEvent is not from React Testing Library, it's from Vitest, so we need to wrap it in act
    // I tried using React Testing Library's userEvent, but it didn't work because it doesn't set the clientX/Y properties
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      await userEvent.click(cells[5]);
    });

    expect(onItemClick).toHaveBeenLastCalledWith(expect.anything(), {
      type: 'heatmap',
      seriesId: '0',
      dataIndex: 5,
      xIndex: 1,
      yIndex: 2,
    });
  });
});
