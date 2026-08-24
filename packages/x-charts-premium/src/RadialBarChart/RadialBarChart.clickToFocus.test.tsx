import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { isJSDOM } from 'test/utils/skipIf';
import { getCenter } from 'test/utils/charts/getCenter';
import { chartsSvgLayerClasses } from '@mui/x-charts/ChartsSvgLayer';
import { RadialBarChart, radialBarClasses } from '@mui/x-charts-premium/RadialBarChart';

// Radial bars are resolved by a container hit test, so the clicks need real coordinates.
describe.skipIf(isJSDOM)('<RadialBarChart /> - click to focus', () => {
  const { render } = createRenderer();

  it('makes the clicked bar the item keyboard navigation resumes from', async () => {
    const { container, user } = render(
      <RadialBarChart height={300} width={300} series={[{ id: 'A', data: [10, 20, 30] }]} />,
    );

    const bar = container.querySelectorAll<SVGElement>(`.${radialBarClasses.element}`)[1];
    const layerContainer = container.querySelector<HTMLElement>(
      `.${chartsSvgLayerClasses.root}`,
    )!.parentElement!;

    await user.pointer([{ keys: '[MouseLeft]', target: layerContainer, coords: getCenter(bar) }]);

    // Hidden until a key is pressed, but the chart took the focus.
    expect(container.querySelector('[fill="none"][stroke-width="2"]')).to.equal(null);
    expect(container.contains(document.activeElement)).to.equal(true);
  });
});
