import * as React from 'react';
import { spy } from 'sinon';
import { createRenderer } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { useChartCartesianAxis } from './useChartCartesianAxis';
import { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { useChartInteraction, UseChartInteractionSignature } from '../useChartInteraction';

describe('useChartCartesianAxis - axis highlight', () => {
  const { render } = createRenderer();

  // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
  it.skipIf(isJSDOM)('should call onHighlightedAxisChange when crossing any value', async () => {
    const onHighlightedAxisChange = spy();
    const { user } = render(
      <ChartDataProvider<'bar', [UseChartCartesianAxisSignature, UseChartInteractionSignature]>
        plugins={[useChartCartesianAxis, useChartInteraction]}
        xAxis={[{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }]}
        yAxis={[{ id: 'y-axis', min: 0, max: 1, data: [0, 0.5], position: 'none' }]}
        width={100}
        height={100}
        margin={0}
        onHighlightedAxisChange={onHighlightedAxisChange}
      >
        <ChartsSurface />
      </ChartDataProvider>,
    );

    const svg = document.querySelector<HTMLElement>('svg')!;

    await user.pointer([
      {
        keys: '[TouchA>]',
        target: svg,
        coords: { clientX: 75, clientY: 60 },
      },
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

    expect(onHighlightedAxisChange.callCount).to.equal(4);

    expect(onHighlightedAxisChange.getCall(0).firstArg).to.deep.equal([
      { axisId: 'x-axis', dataIndex: 1 },
      { axisId: 'y-axis', dataIndex: 1 },
    ]);

    expect(onHighlightedAxisChange.getCall(1).firstArg).to.deep.equal([
      { axisId: 'x-axis', dataIndex: 0 },
      { axisId: 'y-axis', dataIndex: 1 },
    ]);

    expect(onHighlightedAxisChange.getCall(2).firstArg).to.deep.equal([
      { axisId: 'x-axis', dataIndex: 0 },
      { axisId: 'y-axis', dataIndex: 0 },
    ]);

    expect(onHighlightedAxisChange.getCall(3).firstArg).to.deep.equal([]);
  });

  it.skipIf(isJSDOM)('should call onHighlightedAxisChange when axis got modified', async () => {
    const onHighlightedAxisChange = spy();
    const { user, setProps } = render(
      <ChartDataProvider<'bar', [UseChartCartesianAxisSignature, UseChartInteractionSignature]>
        plugins={[useChartCartesianAxis, useChartInteraction]}
        xAxis={[{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }]}
        yAxis={[{ position: 'none' }]}
        width={100}
        height={100}
        margin={0}
        onHighlightedAxisChange={onHighlightedAxisChange}
      >
        <ChartsSurface />
      </ChartDataProvider>,
    );

    const svg = document.querySelector<HTMLElement>('svg')!;

    await user.pointer([{ keys: '[TouchA>]', target: svg, coords: { clientX: 45, clientY: 60 } }]);

    expect(onHighlightedAxisChange.callCount).to.equal(1);
    expect(onHighlightedAxisChange.lastCall.firstArg).to.deep.equal([
      { axisId: 'x-axis', dataIndex: 0 },
    ]);

    setProps({
      xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B', 'C'], position: 'none' }],
    });

    expect(onHighlightedAxisChange.callCount).to.equal(2);
    expect(onHighlightedAxisChange.lastCall.firstArg).to.deep.equal([
      { axisId: 'x-axis', dataIndex: 1 },
    ]);
  });

  it.skipIf(isJSDOM)(
    'should not call onHighlightedAxisChange when axis got modified but highlighted item stay the same',
    async () => {
      const onHighlightedAxisChange = spy();
      const { user, setProps } = render(
        <ChartDataProvider<'bar', [UseChartCartesianAxisSignature, UseChartInteractionSignature]>
          plugins={[useChartCartesianAxis, useChartInteraction]}
          xAxis={[{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }]}
          yAxis={[{ position: 'none' }]}
          width={100}
          height={100}
          margin={0}
          onHighlightedAxisChange={onHighlightedAxisChange}
        >
          <ChartsSurface />
        </ChartDataProvider>,
      );

      const svg = document.querySelector<HTMLElement>('svg')!;

      await user.pointer([
        { keys: '[TouchA>]', target: svg, coords: { clientX: 10, clientY: 60 } },
      ]);

      expect(onHighlightedAxisChange.callCount).to.equal(1);
      expect(onHighlightedAxisChange.lastCall.firstArg).to.deep.equal([
        { axisId: 'x-axis', dataIndex: 0 },
      ]);

      setProps({
        xAxis: [{ id: 'x-axis', scaleType: 'band', data: ['A', 'B', 'C'], position: 'none' }],
      });

      expect(onHighlightedAxisChange.callCount).to.equal(1);
    },
  );

  it.skipIf(isJSDOM)(
    'should can onHighlightedAxisChange when highlighted axis got removed',
    async () => {
      const onHighlightedAxisChange = spy();
      const { user, setProps } = render(
        <ChartDataProvider<'bar', [UseChartCartesianAxisSignature, UseChartInteractionSignature]>
          plugins={[useChartCartesianAxis, useChartInteraction]}
          xAxis={[{ id: 'x-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }]}
          yAxis={[{ position: 'none' }]}
          width={100}
          height={100}
          margin={0}
          onHighlightedAxisChange={onHighlightedAxisChange}
        >
          <ChartsSurface />
        </ChartDataProvider>,
      );

      const svg = document.querySelector<HTMLElement>('svg')!;

      await user.pointer([
        { keys: '[TouchA>]', target: svg, coords: { clientX: 10, clientY: 60 } },
      ]);

      expect(onHighlightedAxisChange.callCount).to.equal(1);
      expect(onHighlightedAxisChange.lastCall.firstArg).to.deep.equal([
        { axisId: 'x-axis', dataIndex: 0 },
      ]);

      setProps({
        xAxis: [{ id: 'new-axis', scaleType: 'band', data: ['A', 'B'], position: 'none' }],
      });

      expect(onHighlightedAxisChange.callCount).to.equal(2);
      expect(onHighlightedAxisChange.lastCall.firstArg).to.deep.equal([
        { axisId: 'new-axis', dataIndex: 0 },
      ]);
    },
  );
});
