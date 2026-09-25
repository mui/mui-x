import * as React from 'react';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import { describeConformance } from 'test/utils/charts/describeConformance';
import { isJSDOM } from 'test/utils/skipIf';
import { getCenter } from 'test/utils/charts/getCenter';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { lineClasses } from '@mui/x-charts/LineChart';
import { chartsTooltipClasses } from '@mui/x-charts/ChartsTooltip';
import { vi, describe, it, expect } from 'vitest';
import { useStore } from '../internals/store/useStore';
import { selectorChartsInteractionPointer } from '../internals/plugins/featurePlugins/useChartInteraction';
import type { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';

const data = [1, 4, 2, 5, 3];

function PointerListener({ onChange }: { onChange: (pointer: unknown) => void }) {
  const store = useStore<[UseChartInteractionSignature]>();
  const pointer = store.use(selectorChartsInteractionPointer);

  React.useEffect(() => {
    onChange(pointer);
  }, [onChange, pointer]);

  return null;
}

describe('<SparkLineChart />', () => {
  const { render } = createRenderer();

  describeConformance(<SparkLineChart height={100} width={100} data={[100, 200]} />, () => ({
    classes: {} as any,
    inheritComponent: 'div',
    render,
    muiName: 'MuiSparkLineChart',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLDivElement,
  }));

  describe.skipIf(isJSDOM)('axis listener', () => {
    it('should not track the pointer when neither the tooltip nor the highlight is shown', async () => {
      const onPointerChange = vi.fn();
      const { user, container, setProps } = render(
        <SparkLineChart data={data} width={100} height={100}>
          <PointerListener onChange={onPointerChange} />
        </SparkLineChart>,
      );
      const svg = container.querySelector('svg')!;
      const center = getCenter(svg);

      await user.pointer({ target: svg, coords: center });

      expect(onPointerChange.mock.lastCall?.[0]).to.equal(null);

      setProps({ showTooltip: true });
      await user.pointer({ target: svg, coords: { ...center, clientX: center.clientX + 10 } });

      await waitFor(() => expect(onPointerChange.mock.lastCall?.[0]).not.to.equal(null));
    });

    it('should let disableAxisListener override the computed default', async () => {
      const onPointerChange = vi.fn();
      const { user, container, setProps } = render(
        <SparkLineChart data={data} width={100} height={100} disableAxisListener={false}>
          <PointerListener onChange={onPointerChange} />
        </SparkLineChart>,
      );
      const svg = container.querySelector('svg')!;
      const center = getCenter(svg);

      await user.pointer({ target: svg, coords: center });

      await waitFor(() => expect(onPointerChange.mock.lastCall?.[0]).not.to.equal(null));

      await user.pointer({ target: document.body, coords: { clientX: 0, clientY: 0 } });
      setProps({ disableAxisListener: true, showTooltip: true });
      await user.pointer({ target: svg, coords: { ...center, clientX: center.clientX + 10 } });

      expect(onPointerChange.mock.lastCall?.[0]).to.equal(null);
    });

    it('should show the axis tooltip with showTooltip', async () => {
      const { user, container } = render(
        <SparkLineChart data={data} width={100} height={100} showTooltip />,
      );
      const svg = container.querySelector('svg')!;

      await user.pointer({ target: svg, coords: getCenter(svg) });

      await waitFor(() =>
        expect(document.querySelector(`.${chartsTooltipClasses.valueCell}`)?.textContent).to.equal(
          '2',
        ),
      );
    });

    it('should show the axis tooltip with showTooltip when the axis highlight is disabled', async () => {
      const { user, container } = render(
        <SparkLineChart
          data={data}
          width={100}
          height={100}
          showTooltip
          axisHighlight={{ x: 'none', y: 'none' }}
        />,
      );
      const svg = container.querySelector('svg')!;

      await user.pointer({ target: svg, coords: getCenter(svg) });

      await waitFor(() =>
        expect(document.querySelector(`.${chartsTooltipClasses.valueCell}`)?.textContent).to.equal(
          '2',
        ),
      );
    });

    it('should show the line highlight with showHighlight', async () => {
      const { user, container } = render(
        <SparkLineChart data={data} width={100} height={100} showHighlight />,
      );
      const svg = container.querySelector('svg')!;

      await user.pointer({ target: svg, coords: getCenter(svg) });

      await waitFor(() =>
        expect(container.querySelectorAll(`.${lineClasses.highlight}`)).to.have.length(1),
      );
    });
  });
});
