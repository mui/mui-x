import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { vi, describe, it, expect } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { getCenter } from 'test/utils/charts/getCenter';
import { chartsSvgLayerClasses } from '@mui/x-charts/ChartsSvgLayer';
import { RadialBarChart, radialBarClasses } from '@mui/x-charts-premium/RadialBarChart';

// Radial bars are resolved by a container hit test, so the clicks need real coordinates.
describe.skipIf(isJSDOM)('<RadialBarChart /> - onItemClick', () => {
  const { render } = createRenderer();

  it('fires with the clicked item', async () => {
    const onItemClick = vi.fn();
    const { container, user } = render(
      <RadialBarChart
        height={300}
        width={300}
        series={[{ id: 'A', data: [10, 20, 30] }]}
        onItemClick={onItemClick}
      />,
    );

    const bar = container.querySelectorAll<SVGElement>(`.${radialBarClasses.element}`)[1];
    const layerContainer = container.querySelector<HTMLElement>(
      `.${chartsSvgLayerClasses.root}`,
    )!.parentElement!;

    await user.pointer([{ keys: '[MouseLeft]', target: layerContainer, coords: getCenter(bar) }]);

    expect(onItemClick.mock.calls.length).to.equal(1);
    expect(onItemClick.mock.lastCall?.[1]).to.deep.include({ type: 'radialBar', seriesId: 'A' });
  });
});
