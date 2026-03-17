import { spy } from 'sinon';
import { isJSDOM } from 'test/utils/skipIf';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { BarChart, barClasses } from '@mui/x-charts/BarChart';

describe('highlight', () => {
  const { render } = createRenderer();

  it('should have no highlight by default', () => {
    render(
      <BarChart height={100} width={100} skipAnimation series={[{ id: 'A', data: [50, 100] }]} />,
    );

    expect(document.querySelector(`[data-highlighted]`)).to.equal(null);
  });

  it.skipIf(isJSDOM)('should set highlight when keyboard move focus', async () => {
    const { container, user } = render(
      <BarChart
        height={100}
        width={100}
        skipAnimation
        margin={0}
        series={[{ id: 'A', data: [50, 100], highlightScope: { highlight: 'item' } }]}
      />,
    );

    const firstBar = container.querySelector(
      `[data-series="A"] .${barClasses.element}:nth-child(1)`,
    );
    const secondBar = container.querySelector(
      `[data-series="A"] .${barClasses.element}:nth-child(2)`,
    );

    expect(firstBar!.getAttribute('data-highlighted')).to.equal(null);

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');

    expect(firstBar!.getAttribute('data-highlighted')).to.equal('true');
    expect(secondBar!.getAttribute('data-highlighted')).to.equal(null);
  });

  it.skipIf(isJSDOM)(
    'should keep highlight on the controlled focused even if arrow navigation is used',
    async () => {
      const { container, user } = render(
        <BarChart
          height={100}
          width={100}
          skipAnimation
          margin={0}
          series={[{ id: 'A', data: [50, 100], highlightScope: { highlight: 'item' } }]}
          highlightedItem={{ seriesId: 'A', dataIndex: 1 }}
        />,
      );

      const firstBar = container.querySelector(
        `[data-series="A"] .${barClasses.element}:nth-child(1)`,
      );
      const secondBar = container.querySelector(
        `[data-series="A"] .${barClasses.element}:nth-child(2)`,
      );

      expect(firstBar!.getAttribute('data-highlighted')).to.equal(null);
      expect(secondBar!.getAttribute('data-highlighted')).to.equal('true');

      await user.keyboard('{Tab}');
      await user.keyboard('[ArrowRight]');

      expect(firstBar!.getAttribute('data-highlighted')).to.equal(null);
      expect(secondBar!.getAttribute('data-highlighted')).to.equal('true');
    },
  );

  it.skipIf(isJSDOM)('should support highlight without series `type` provided', async () => {
    const { container, user } = render(
      <BarChart
        height={100}
        width={100}
        skipAnimation
        margin={0}
        series={[{ id: 'A', data: [50, 100], highlightScope: { highlight: 'item' } }]}
        highlightedItem={{ seriesId: 'A', dataIndex: 1 }}
      />,
    );

    const firstBar = container.querySelector(
      `[data-series="A"] .${barClasses.element}:nth-child(1)`,
    );
    const secondBar = container.querySelector(
      `[data-series="A"] .${barClasses.element}:nth-child(2)`,
    );

    expect(firstBar!.getAttribute('data-highlighted')).to.equal(null);
    expect(secondBar!.getAttribute('data-highlighted')).to.equal('true');

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');

    expect(firstBar!.getAttribute('data-highlighted')).to.equal(null);
    expect(secondBar!.getAttribute('data-highlighted')).to.equal('true');
  });

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  it.skipIf(isJSDOM)('should call onHighlightChange when leaving the highlightedItem', async () => {
    const handleHighlight = spy();
    const { container, user } = render(
      <BarChart
        height={400}
        width={400}
        series={[
          { id: 'id-a', data: [5, 10], highlightScope: { highlight: 'item', fade: 'global' } },
          { id: 'id-b', data: [1, 2] },
        ]}
        xAxis={[{ data: ['A', 'B'] }]}
        hideLegend
        skipAnimation
        highlightedItem={{ seriesId: 'id-a', dataIndex: 0 }}
        onHighlightChange={handleHighlight}
      />,
    );

    const bars = container.querySelectorAll(`.${barClasses.element}`);

    await user.pointer({ target: bars[0] });

    expect(handleHighlight.callCount).to.equal(0);

    // Moving pointer on another rect triggers the exit (null) and the entrance (new identifier)
    await user.pointer({ target: bars[3] });
    expect(handleHighlight.callCount).to.equal(2);
    expect(handleHighlight.firstCall.args[0]).to.deep.equal(null);
    expect(handleHighlight.lastCall.args[0]).to.deep.equal({
      type: 'bar',
      seriesId: 'id-b',
      dataIndex: 1,
    });

    // Moving pointer back only triggers the exist since the controlled value was not modified
    await user.pointer({ target: bars[0] });

    expect(handleHighlight.lastCall.args[0]).to.deep.equal(null);
    expect(handleHighlight.callCount).to.equal(3);
  });
});
