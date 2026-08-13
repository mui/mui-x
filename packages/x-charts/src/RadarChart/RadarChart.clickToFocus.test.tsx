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

  /** The focus indicator is a rect centered on the focused point. */
  function getFocusedMarkIndex(container: HTMLElement) {
    const indicator = container.querySelector('[fill="none"][stroke-width="2"]');
    if (!indicator) {
      return null;
    }

    const center = getCenter(indicator);
    return Array.from(container.querySelectorAll<SVGElement>('circle')).findIndex((mark) => {
      const markCenter = getCenter(mark);
      return (
        Math.abs(markCenter.clientX - center.clientX) < 2 &&
        Math.abs(markCenter.clientY - center.clientY) < 2
      );
    });
  }

  it('focuses the clicked mark', async () => {
    const { container, user } = render(<RadarChart {...radarProps} onMarkClick={() => {}} />);

    await user.click(container.querySelectorAll<SVGElement>('circle')[2]);

    // Hidden, but stored: the next key moves on from the clicked mark.
    expect(container.querySelector('[fill="none"][stroke-width="2"]')).to.equal(null);
    await user.keyboard('[ArrowRight]');

    expect(getFocusedMarkIndex(container)).to.equal(3);
  });

  it('focuses the item at the click angle when the click lands outside the area', async () => {
    // The area path only covers the polygon the data draws, so a click between it and the outer
    // edge hits no element. The rotation axis still has an index for that angle.
    const { container, user } = render(<RadarChart {...radarProps} />);

    const marks = Array.from(container.querySelectorAll<SVGElement>('circle')).map(getCenter);
    // The metrics sit at the top, right, bottom and left. The two horizontal ones give the centre,
    // and each metric is scaled on its own, so the radius is read off the marks rather than values.
    const center = { x: (marks[1].clientX + marks[3].clientX) / 2, y: marks[1].clientY };
    const radiusOf = (mark: { clientX: number; clientY: number }) =>
      Math.hypot(mark.clientX - center.x, mark.clientY - center.y);
    const outerRadius = Math.max(...marks.map(radiusOf));

    // Straight down is the `C` angle. Its point is the closest to the centre, so the band between
    // it and the outer edge is on no element.
    const clickRadius = (radiusOf(marks[2]) + outerRadius) / 2;
    await user.pointer([
      {
        keys: '[MouseLeft]',
        target: container.querySelector<SVGElement>('svg')!,
        coords: { clientX: center.x, clientY: center.y + clickRadius },
      },
    ]);
    await user.keyboard('[ArrowRight]');

    expect(getFocusedMarkIndex(container)).to.equal(3);
  });

  it('focuses the mark through the area when no click callback is set', async () => {
    // Marks are pointer transparent without `onMarkClick`, so the click lands on the area,
    // which resolves the index from the click angle.
    const { container, user } = render(<RadarChart {...radarProps} />);

    const marks = container.querySelectorAll<SVGElement>('circle');
    const area = container.querySelector<SVGElement>(`.${radarClasses.seriesArea}`)!;
    await user.pointer([{ keys: '[MouseLeft]', target: area, coords: getCenter(marks[2]) }]);
    await user.keyboard('[ArrowRight]');

    expect(getFocusedMarkIndex(container)).to.equal(3);
  });
});
