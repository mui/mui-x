import { vi } from 'vitest';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSvgSurface } from '@mui/x-charts/ChartsSvgSurface';
import { ChartsAxisHighlight, chartsAxisHighlightClasses } from '@mui/x-charts/ChartsAxisHighlight';
import { useChartCartesianAxis } from './useChartCartesianAxis';
import { type UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { useChartInteraction, type UseChartInteractionSignature } from '../useChartInteraction';

// can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
describe.skipIf(isJSDOM)('useChartCartesianAxis - axis highlight', () => {
  const { render } = createRenderer();

  it('should call onHighlightedAxisChange when crossing any value', async () => {
    const onHighlightedAxisChange = vi.fn();
    const { user, container } = render(
      <ChartDataProvider<'bar', [UseChartInteractionSignature, UseChartCartesianAxisSignature]>
        plugins={[useChartInteraction, useChartCartesianAxis]}
        xAxis={[{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }]}
        yAxis={[{ id: 'y-axis', min: 0, max: 1, data: [0, 0.5], position: 'none' }]}
        width={100}
        height={100}
        margin={0}
        onHighlightedAxisChange={onHighlightedAxisChange}
      >
        <ChartsSvgSurface />
      </ChartDataProvider>,
    );

    const svg = container.querySelector('svg')!;

    await user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 75, clientY: 60 } }]);

    await waitFor(() => expect(onHighlightedAxisChange.mock.calls.length).to.equal(1));

    await user.pointer([
      {
        pointerName: 'TouchA',
        target: svg,
        coords: { clientX: 25, clientY: 70 }, // x-axis : B -> A
      },
      {
        pointerName: 'TouchA',
        target: svg,
        coords: { clientX: 25, clientY: 90 }, // y-axis : 0.5 -> 0
      },
      {
        keys: '[/TouchA]',
      },
    ]);

    expect(onHighlightedAxisChange.mock.calls.length).to.equal(4);

    expect(onHighlightedAxisChange.mock.calls[0][0]).to.deep.equal([
      { axisId: 'x-axis', dataIndex: 1 },
      { axisId: 'y-axis', dataIndex: 1 },
    ]);

    expect(onHighlightedAxisChange.mock.calls[1][0]).to.deep.equal([
      { axisId: 'x-axis', dataIndex: 0 },
      { axisId: 'y-axis', dataIndex: 1 },
    ]);

    expect(onHighlightedAxisChange.mock.calls[2][0]).to.deep.equal([
      { axisId: 'x-axis', dataIndex: 0 },
      { axisId: 'y-axis', dataIndex: 0 },
    ]);

    expect(onHighlightedAxisChange.mock.calls[3][0]).to.deep.equal([]);
  });

  it('should call onHighlightedAxisChange when axis got modified', async () => {
    const onHighlightedAxisChange = vi.fn();
    const { user, setProps, container } = render(
      <ChartDataProvider<'bar', [UseChartInteractionSignature, UseChartCartesianAxisSignature]>
        plugins={[useChartInteraction, useChartCartesianAxis]}
        xAxis={[{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }]}
        yAxis={[{ position: 'none' }]}
        width={100}
        height={100}
        margin={0}
        onHighlightedAxisChange={onHighlightedAxisChange}
      >
        <ChartsSvgSurface />
      </ChartDataProvider>,
    );

    const svg = container.querySelector('svg')!;

    await user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 45, clientY: 60 } }]);

    await waitFor(() => expect(onHighlightedAxisChange.mock.calls.length).to.equal(1));
    expect(onHighlightedAxisChange.mock.lastCall?.[0]).to.deep.equal([
      { axisId: 'x-axis', dataIndex: 0 },
    ]);

    setProps({
      xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B', 'C'], position: 'none' }],
    });

    expect(onHighlightedAxisChange.mock.calls.length).to.equal(2);
    expect(onHighlightedAxisChange.mock.lastCall?.[0]).to.deep.equal([
      { axisId: 'x-axis', dataIndex: 1 },
    ]);
  });

  it('should not call onHighlightedAxisChange when axis got modified but highlighted item stay the same', async () => {
    const onHighlightedAxisChange = vi.fn();
    const { user, setProps, container } = render(
      <ChartDataProvider<'bar', [UseChartInteractionSignature, UseChartCartesianAxisSignature]>
        plugins={[useChartInteraction, useChartCartesianAxis]}
        xAxis={[{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }]}
        yAxis={[{ position: 'none' }]}
        width={100}
        height={100}
        margin={0}
        onHighlightedAxisChange={onHighlightedAxisChange}
      >
        <ChartsSvgSurface />
      </ChartDataProvider>,
    );

    const svg = container.querySelector('svg')!;

    await user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 10, clientY: 60 } }]);

    await waitFor(() => expect(onHighlightedAxisChange.mock.calls.length).to.equal(1));
    expect(onHighlightedAxisChange.mock.lastCall?.[0]).to.deep.equal([
      { axisId: 'x-axis', dataIndex: 0 },
    ]);

    setProps({
      xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B', 'C'], position: 'none' }],
    });

    expect(onHighlightedAxisChange.mock.calls.length).to.equal(1);
  });

  it('should call onHighlightedAxisChange when highlighted axis got removed', async () => {
    const onHighlightedAxisChange = vi.fn();
    const { user, setProps, container } = render(
      <ChartDataProvider<'bar', [UseChartInteractionSignature, UseChartCartesianAxisSignature]>
        plugins={[useChartInteraction, useChartCartesianAxis]}
        xAxis={[{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }]}
        yAxis={[{ position: 'none' }]}
        width={100}
        height={100}
        margin={0}
        onHighlightedAxisChange={onHighlightedAxisChange}
      >
        <ChartsSvgSurface />
      </ChartDataProvider>,
    );

    const svg = container.querySelector('svg')!;

    await user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 10, clientY: 60 } }]);

    await waitFor(() => expect(onHighlightedAxisChange.mock.calls.length).to.equal(1));
    expect(onHighlightedAxisChange.mock.lastCall?.[0]).to.deep.equal([
      { axisId: 'x-axis', dataIndex: 0 },
    ]);

    setProps({
      xAxis: [{ id: 'new-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }],
    });

    expect(onHighlightedAxisChange.mock.calls.length).to.equal(2);
    expect(onHighlightedAxisChange.mock.lastCall?.[0]).to.deep.equal([
      { axisId: 'new-axis', dataIndex: 0 },
    ]);
  });

  it('should allow to highlight axes without data', async () => {
    const { user, container } = render(
      <ChartDataProvider<'bar', [UseChartInteractionSignature, UseChartCartesianAxisSignature]>
        plugins={[useChartInteraction, useChartCartesianAxis]}
        xAxis={[{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }]}
        yAxis={[{ position: 'none', min: 0, max: 100 }]}
        width={100}
        height={100}
        margin={0}
      >
        <ChartsSvgSurface>
          <ChartsAxisHighlight y="line" />
        </ChartsSvgSurface>
      </ChartDataProvider>,
    );

    const svg = container.querySelector('svg')!;

    await user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 10, clientY: 60 } }]);
    await waitFor(() => {
      const highlight = svg.getElementsByClassName(chartsAxisHighlightClasses.root);
      expect(highlight.length).to.equal(1);
    });
  });

  it('should allow to highlight axes with data', async () => {
    const { user, container } = render(
      <ChartDataProvider<'bar', [UseChartInteractionSignature, UseChartCartesianAxisSignature]>
        plugins={[useChartInteraction, useChartCartesianAxis]}
        xAxis={[{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }]}
        yAxis={[{ position: 'none', min: 0, max: 100 }]}
        width={100}
        height={100}
        margin={0}
      >
        <ChartsSvgSurface>
          <ChartsAxisHighlight x="line" />
        </ChartsSvgSurface>
      </ChartDataProvider>,
    );

    const svg = container.querySelector('svg')!;

    await user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 10, clientY: 60 } }]);
    await waitFor(() => {
      const highlight = svg.getElementsByClassName(chartsAxisHighlightClasses.root);
      expect(highlight.length).to.equal(1);
    });
  });
});
