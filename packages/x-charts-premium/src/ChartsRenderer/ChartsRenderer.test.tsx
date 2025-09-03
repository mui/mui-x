import * as React from 'react';
import { spy } from 'sinon';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { ChartsRenderer } from '@mui/x-charts-premium/ChartsRenderer';
import { screen } from '@mui/internal-test-utils';
import { colorPaletteLookup } from './colors';

describe('<ChartsRenderer />', () => {
  const { render } = createRenderer();

  it('should not render anything if the chart type is not supported', () => {
    render(
      <div data-testid="container">
        <ChartsRenderer dimensions={[]} values={[]} chartType="unsupported" configuration={{}} />
      </div>,
    );

    expect(screen.queryByTestId('container')!.querySelector('svg')).to.equal(null);
  });

  it('should render a bar chart if the chart type is supported', () => {
    render(
      <div data-testid="container">
        <ChartsRenderer dimensions={[]} values={[]} chartType="bar" configuration={{}} />
      </div>,
    );

    expect(screen.queryByTestId('container')!.querySelector('svg')).not.to.equal(null);
  });

  it('should pass the rendering to the onRender callback', () => {
    const onRenderSpy = spy();
    render(
      <div data-testid="container">
        <ChartsRenderer
          dimensions={[]}
          values={[]}
          chartType="line"
          configuration={{}}
          onRender={onRenderSpy}
        />
      </div>,
    );

    expect(onRenderSpy.lastCall.firstArg).to.equal('line');
  });

  it('should compute props for the chart', () => {
    const onRenderSpy = spy();
    render(
      <div data-testid="container">
        <ChartsRenderer
          dimensions={[]}
          values={[]}
          chartType="line"
          configuration={{}}
          onRender={onRenderSpy}
        />
      </div>,
    );

    const props = onRenderSpy.lastCall.args[1];
    expect(props.colors).to.equal(colorPaletteLookup.get('rainbowSurgePalette'));
  });

  it('should override the props if the configuration has an updated value', () => {
    const onRenderSpy = spy();
    render(
      <div data-testid="container">
        <ChartsRenderer
          dimensions={[]}
          values={[]}
          chartType="line"
          configuration={{
            colors: 'mangoFusionPalette',
          }}
          onRender={onRenderSpy}
        />
      </div>,
    );

    const props = onRenderSpy.lastCall.args[1];
    expect(props.colors).to.equal(colorPaletteLookup.get('mangoFusionPalette'));
  });

  it('should place dimensions and values to the correct place in the props', () => {
    const onRenderSpy = spy();
    render(
      <div data-testid="container">
        <ChartsRenderer
          dimensions={[{ id: 'dimension', label: 'Dimension', data: ['A'] }]}
          values={[{ id: 'value', label: 'Value', data: [1, 2, 3] }]}
          chartType="line"
          configuration={{}}
          onRender={onRenderSpy}
        />
      </div>,
    );

    const props = onRenderSpy.lastCall.args[1];
    expect(props.series[0].data).to.deep.equal([1, 2, 3]);
  });
});
