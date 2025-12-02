import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { BarChart, barElementClasses } from '@mui/x-charts/BarChart';
import { CHART_SELECTOR } from '../../../../tests/constants';

describe('highlight', () => {
  const { render } = createRenderer();

  it('should have no highlight by default', () => {
    render(
      <BarChart height={100} width={100} skipAnimation series={[{ id: 'A', data: [50, 100] }]} />,
    );

    expect(document.querySelector(`.${barElementClasses.highlighted}`)).to.equal(null);
  });

  it('should set highlight when keyboard move focus', async () => {
    const { user } = render(
      <BarChart
        height={100}
        width={100}
        skipAnimation
        margin={0}
        series={[{ id: 'A', data: [50, 100], highlightScope: { highlight: 'item' } }]}
        enableKeyboardNavigation
      />,
    );

    const svg = document.querySelector<SVGSVGElement>(CHART_SELECTOR)!;
    const firstBar = document.querySelector(
      `[data-series="A"] .${barElementClasses.root}:nth-child(1)`,
    );
    const secondBar = document.querySelector(
      `[data-series="A"] .${barElementClasses.root}:nth-child(2)`,
    );

    expect(firstBar!.getAttribute('data-highlighted')).to.equal(null);

    svg!.focus();
    await user.keyboard('[ArrowRight]');

    expect(firstBar!.getAttribute('data-highlighted')).to.equal('true');
    expect(secondBar!.getAttribute('data-highlighted')).to.equal(null);
  });

  it('should keep focus on the controlled focused even if arrow navigation is used', async () => {
    const { user } = render(
      <BarChart
        height={100}
        width={100}
        skipAnimation
        margin={0}
        series={[{ id: 'A', data: [50, 100], highlightScope: { highlight: 'item' } }]}
        enableKeyboardNavigation
        highlightedItem={{ seriesId: 'A', dataIndex: 1 }}
      />,
    );

    const svg = document.querySelector<SVGSVGElement>(CHART_SELECTOR)!;
    const firstBar = document.querySelector(
      `[data-series="A"] .${barElementClasses.root}:nth-child(1)`,
    );
    const secondBar = document.querySelector(
      `[data-series="A"] .${barElementClasses.root}:nth-child(2)`,
    );

    expect(firstBar!.getAttribute('data-highlighted')).to.equal(null);
    expect(secondBar!.getAttribute('data-highlighted')).to.equal('true');

    svg!.focus();
    await user.keyboard('[ArrowRight]');

    expect(firstBar!.getAttribute('data-highlighted')).to.equal(null);
    expect(secondBar!.getAttribute('data-highlighted')).to.equal('true');
  });
});
