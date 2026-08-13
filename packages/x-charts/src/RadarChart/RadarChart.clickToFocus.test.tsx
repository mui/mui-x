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

  describe('click outside the area', () => {
    // A small polygon inside a fixed scale leaves a wide band that is on no element, so a click
    // at any angle reaches the rotation axis fallback.
    const gapProps = {
      height: 300,
      width: 300,
      radar: { metrics: ['A', 'B', 'C', 'D'], max: 100 },
      series: [{ id: 'radar', data: [10, 10, 10, 10] }],
    };

    /** A point in the band outside the polygon, `degrees` clockwise from the top. */
    function pointAtAngle(container: HTMLElement, degrees: number) {
      const marks = Array.from(container.querySelectorAll<SVGElement>('circle')).map(getCenter);
      // The first metric and the one half way round face each other, so they straddle the centre.
      const opposite = marks[marks.length / 2];
      const center = {
        x: (marks[0].clientX + opposite.clientX) / 2,
        y: (marks[0].clientY + opposite.clientY) / 2,
      };
      // Every metric holds the same value, so one mark gives the radius the polygon sits at, and
      // the outer edge is ten times further out. Half way between the two is on no element.
      const markRadius = Math.hypot(marks[0].clientX - center.x, marks[0].clientY - center.y);
      const radius = (markRadius + markRadius * 10) / 2;
      const radians = (degrees * Math.PI) / 180;

      return {
        clientX: center.x + radius * Math.sin(radians),
        clientY: center.y - radius * Math.cos(radians),
      };
    }

    // The metrics sit at 0, 90, 180 and 270 degrees. Each wedge between two of them splits in
    // half, so the click takes the metric whose axis it is closest to.
    [
      { degrees: 0, focused: 0 },
      { degrees: 30, focused: 0 },
      { degrees: 60, focused: 1 },
      { degrees: 90, focused: 1 },
      { degrees: 200, focused: 2 },
      { degrees: 250, focused: 3 },
    ].forEach(({ degrees, focused }) => {
      it(`focuses the metric closest to a click at ${degrees} degrees`, async () => {
        const { container, user } = render(<RadarChart {...gapProps} />);

        await user.pointer([
          {
            keys: '[MouseLeft]',
            target: container.querySelector<SVGElement>('svg')!,
            coords: pointAtAngle(container, degrees),
          },
        ]);
        await user.keyboard('[ArrowRight]');

        // The click stores the item without revealing it, so the arrow lands on the next one.
        expect(getFocusedMarkIndex(container)).to.equal((focused + 1) % 4);
      });
    });

    // Six metrics put the axes 60 degrees apart, so each wedge splits at 30.
    [
      { degrees: 25, focused: 0 },
      { degrees: 35, focused: 1 },
      { degrees: 85, focused: 1 },
      { degrees: 95, focused: 2 },
      { degrees: 355, focused: 0 },
    ].forEach(({ degrees, focused }) => {
      it(`focuses the metric closest to a click at ${degrees} degrees with six metrics`, async () => {
        const { container, user } = render(
          <RadarChart
            height={300}
            width={300}
            radar={{ metrics: ['A', 'B', 'C', 'D', 'E', 'F'], max: 100 }}
            series={[{ id: 'radar', data: [10, 10, 10, 10, 10, 10] }]}
          />,
        );

        await user.pointer([
          {
            keys: '[MouseLeft]',
            target: container.querySelector<SVGElement>('svg')!,
            coords: pointAtAngle(container, degrees),
          },
        ]);
        await user.keyboard('[ArrowRight]');

        expect(getFocusedMarkIndex(container)).to.equal((focused + 1) % 6);
      });
    });
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
