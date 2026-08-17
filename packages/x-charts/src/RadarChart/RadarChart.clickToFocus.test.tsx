import { isJSDOM } from 'test/utils/skipIf';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { getCenter } from 'test/utils/charts/getCenter';
import { RadarChart, radarClasses } from '@mui/x-charts/RadarChart';

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

  it('focuses the mark through the area when no click callback is set', async () => {
    const { container, user } = render(<RadarChart {...radarProps} />);

    const marks = getMarks(container);
    await clickAt(container, user, getCenter(marks[2]));
    await user.keyboard('[ArrowRight]');

    expect(getFocusedMarkIndex(container)).to.equal(3);
  });
});
