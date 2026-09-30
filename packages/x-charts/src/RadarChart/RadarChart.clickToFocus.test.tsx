import { isJSDOM } from 'test/utils/skipIf';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { getCenter } from 'test/utils/charts/getCenter';
import { RadarChart, radarClasses } from '@mui/x-charts/RadarChart';
import { describe, it, expect } from 'vitest';

// The radar area covers the plot, so the clicks need real coordinates.
describe.skipIf(isJSDOM)('<RadarChart /> - click to focus', () => {
  const { render } = createRenderer();

  const radarProps = {
    height: 300,
    width: 300,
    radar: { metrics: ['A', 'B', 'C', 'D'] },
    series: [{ id: 'radar', data: [10, 20, 30, 40] }],
  };

  /** The grid draws circles too, so the marks have to be read by their own class. */
  function getMarks(container: HTMLElement) {
    return Array.from(container.querySelectorAll<SVGElement>(`.${radarClasses.seriesMark}`));
  }

  /** The focus indicator is a rect centered on the focused point. */
  function getFocusedMarkIndex(container: HTMLElement) {
    const indicator = container.querySelector('[fill="none"][stroke-width="2"]');
    if (!indicator) {
      return null;
    }

    const center = getCenter(indicator);
    return getMarks(container).findIndex((mark) => {
      const markCenter = getCenter(mark);
      return (
        Math.abs(markCenter.clientX - center.clientX) < 2 &&
        Math.abs(markCenter.clientY - center.clientY) < 2
      );
    });
  }

  /**
   * The click is resolved from the rotation axis, whose pointer coordinate the gesture manager
   * writes on move, so the pointer has to travel to the target before pressing.
   */
  async function clickAt(container: HTMLElement, user: any, coords: any) {
    const surface = container.querySelector<SVGElement>('svg')!;
    await user.pointer([{ target: surface, coords }]);
    await user.pointer([{ keys: '[MouseLeft]', target: surface, coords }]);
  }

  it('focuses the clicked mark', async () => {
    const { container, user } = render(<RadarChart {...radarProps} onMarkClick={() => {}} />);

    const marks = getMarks(container);
    await clickAt(container, user, getCenter(marks[2]));

    // Hidden, but stored: the next key moves on from the clicked mark.
    expect(container.querySelector('[fill="none"][stroke-width="2"]')).to.equal(null);
    await user.keyboard('[ArrowRight]');

    expect(getFocusedMarkIndex(container)).to.equal(3);
  });

  it('keeps the series a clicked mark belongs to', async () => {
    // Clickable marks cover the area, so without them reporting their series the click would fall
    // back to the first one.
    const { container, user } = render(
      <RadarChart
        height={300}
        width={300}
        radar={{ metrics: ['A', 'B', 'C', 'D'] }}
        series={[
          { id: 'first', data: [10, 20, 30, 40] },
          { id: 'second', data: [40, 30, 20, 10] },
        ]}
        onMarkClick={() => {}}
      />,
    );

    const secondMarks = Array.from(
      container.querySelectorAll<SVGElement>(`[data-series="second"] .${radarClasses.seriesMark}`),
    );
    const target = secondMarks[2];
    await user.pointer([{ target, coords: getCenter(target) }]);
    await user.pointer([{ keys: '[MouseLeft]', target, coords: getCenter(target) }]);
    await user.keyboard('[ArrowRight]');

    // The key moved on to the next mark of the same series, not of the first one.
    const indicator = getCenter(container.querySelector('[fill="none"][stroke-width="2"]')!);
    const expected = getCenter(secondMarks[3]);
    expect(Math.abs(indicator.clientX - expected.clientX)).to.be.lessThan(2);
    expect(Math.abs(indicator.clientY - expected.clientY)).to.be.lessThan(2);
  });

  it('focuses the mark through the area when no click callback is set', async () => {
    const { container, user } = render(<RadarChart {...radarProps} />);

    const marks = getMarks(container);
    await clickAt(container, user, getCenter(marks[2]));
    await user.keyboard('[ArrowRight]');

    expect(getFocusedMarkIndex(container)).to.equal(3);
  });
});
