import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

describe('<ScatterChart />', () => {
  const { render } = createRenderer();

  describeConformance(
    <ScatterChart
      height={100}
      width={100}
      series={[
        {
          data: [
            { id: 'A', x: 100, y: 10 },
            { id: 'B', x: 200, y: 20 },
          ],
        },
      ]}
    />,
    () => ({
      classes: {} as any,
      inheritComponent: 'svg',
      render,
      muiName: 'MuiScatterChart',
      testComponentPropWith: 'div',
      refInstanceof: window.SVGSVGElement,
      skip: [
        'componentProp',
        'componentsProp',
        'slotPropsProp',
        'slotPropsCallback',
        'slotsProp',
        'themeStyleOverrides',
        'themeVariants',
        'themeCustomPalette',
      ],
    }),
  );

  const isJSDOM = /jsdom/.test(window.navigator.userAgent);

  const config = {
    dataset: [
      { id: 1, x: 0, y: 10 },
      { id: 2, x: 10, y: 10 },
      { id: 3, x: 10, y: 0 },
      { id: 4, x: 0, y: 0 },
      { id: 5, x: 5, y: 5 },
    ],
    margin: { top: 0, left: 0, bottom: 0, right: 0 },
    width: 100,
    height: 100,
  };

  it('should support dataset with missing values', async function test() {
    if (isJSDOM) {
      this.skip();
    }

    // x from 500 to 600
    // y from 100 to 200
    const dataset = [
      {
        version: 'data-0',
        a1: 500,
        a2: 100,
      },
      {
        version: 'data-1',
        a1: 600,
        a2: 200,
      },
      {
        version: 'data-2',
        // Item with missing x-values
        // a1: 500,
        a2: 200,
      },
      {
        version: 'data-2',
        // Item with missing y-values
        a1: 500,
        // a2: 200,
      },
    ];

    render(
      <ScatterChart
        dataset={dataset}
        series={[{ datasetKeys: { id: 'version', x: 'a1', y: 'a2' }, label: 'Series A' }]}
        width={500}
        height={300}
      />,
    );

    const labelX = await screen.findByText('100');
    expect(labelX).toBeVisible();

    const labelY = await screen.findByText('600');
    expect(labelY).toBeVisible();
  });
});
