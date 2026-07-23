import { isJSDOM } from 'test/utils/skipIf';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { BarChart } from '@mui/x-charts/BarChart';

describe('<ChartsAccessibilityProxy />', () => {
  const { render } = createRenderer();

  const PROXY_SELECTOR = 'div[role="img"][aria-labelledby^="voiceover-"]';

  it('should set aria-hidden="true" on proxy divs before keyboard focus', async () => {
    const { container } = render(
      <BarChart
        height={100}
        width={100}
        skipAnimation
        margin={0}
        series={[{ id: 'A', data: [50, 100] }]}
      />,
    );

    const proxyDivs = container.querySelectorAll<HTMLElement>(PROXY_SELECTOR);
    expect(proxyDivs.length).to.equal(2);

    for (const div of proxyDivs) {
      expect(div.getAttribute('aria-hidden')).to.equal('true');
    }
  });

  it.skipIf(isJSDOM)(
    'should set aria-hidden="false" on the active proxy div after keyboard focus',
    async () => {
      const { container, user } = render(
        <BarChart
          height={100}
          width={100}
          skipAnimation
          margin={0}
          series={[{ id: 'A', data: [50, 100] }]}
        />,
      );

      await user.keyboard('{Tab}');
      await user.keyboard('[ArrowRight]');

      const proxyDivs = container.querySelectorAll<HTMLElement>(PROXY_SELECTOR);

      const ariaHiddenValues = Array.from(proxyDivs).map((div) => div.getAttribute('aria-hidden'));

      // One proxy should be visible (active), one hidden (inactive)
      expect(ariaHiddenValues).to.include('false');
      expect(ariaHiddenValues).to.include('true');
    },
  );
});
