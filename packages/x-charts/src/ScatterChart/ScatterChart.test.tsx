import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils/createRenderer';
import { describeConformance } from 'test/utils/describeConformance';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { expect } from 'chai';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';

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
        'themeDefaultProps',
      ],
    }),
  );

  const config = {
    dataset: [
      { id: 1, x: 0, y: 10 },
      { id: 2, x: 10, y: 10 },
      { id: 3, x: 10, y: 0 },
      { id: 4, x: 0, y: 0 },
      { id: 5, x: 5, y: 5 },
    ],
    margin: 0,
    xAxis: [{ position: 'none' }],
    yAxis: [{ position: 'none' }],
    width: 100,
    height: 100,
  } as const;

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  testSkipIf(isJSDOM)('should show the tooltip without errors in default config', async () => {
    const { user } = render(
      <div
        style={{
          margin: -8, // Removes the body default margins
          width: 100,
          height: 100,
        }}
      >
        <ScatterChart {...config} series={[{ id: 's1', data: config.dataset }]} />
      </div>,
    );
    const svg = document.querySelector<HTMLElement>('svg')!;
    await user.pointer([
      // Set tooltip position voronoi value
      { target: svg, coords: { clientX: 10, clientY: 10 } },
    ]);

    let cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
    expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', '', '(0, 10)']);

    await user.pointer([
      // Set tooltip position voronoi value
      { target: svg, coords: { clientX: 40, clientY: 60 } },
    ]);

    cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
    expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', '', '(5, 5)']);
  });

  testSkipIf(isJSDOM)('should show the tooltip without errors with voronoi disabled', async () => {
    const { user } = render(
      <div
        style={{
          margin: -8, // Removes the body default margins
          width: 100,
          height: 100,
        }}
      >
        <ScatterChart {...config} disableVoronoi series={[{ id: 's1', data: config.dataset }]} />
      </div>,
    );
    const marks = document.querySelectorAll<HTMLElement>('circle');

    await user.pointer([
      // Only to set the tooltip position
      { target: marks[0] },
    ]);

    let cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
    expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', '', '(0, 10)']);

    await user.pointer([
      // Only to set the tooltip position
      { target: marks[4] },
    ]);
    cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
    expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', '', '(5, 5)']);
  });

  testSkipIf(isJSDOM)('should support dataset with missing values', async () => {
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
