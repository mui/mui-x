import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ChartProvider } from '../context/ChartProvider';

describe('<ChartsLayerContainer />', () => {
  const { render } = createRenderer();

  it('should warn when ChartsSurface is used inside ChartsLayerContainer', () => {
    expect(() =>
      render(
        <ChartProvider pluginParams={{ width: 100, height: 100, series: [] }}>
          <ChartsLayerContainer>
            <ChartsSurface />
          </ChartsLayerContainer>
        </ChartProvider>,
      ),
    ).toErrorDev(
      'MUI X Charts: ChartsSurface should not be used inside ChartsLayerContainer. Render a ChartsSvgLayer instead.',
    );
  });

  it('should set aria-label from title prop', () => {
    render(
      <ChartProvider pluginParams={{ width: 100, height: 100, series: [] }}>
        <ChartsLayerContainer title="My Chart Title" />
      </ChartProvider>,
    );

    expect(screen.getByLabelText('My Chart Title')).to.not.equal(null);
  });

  it('should set aria-describedby from desc prop', () => {
    render(
      <ChartProvider pluginParams={{ width: 100, height: 100, series: [] }}>
        <ChartsLayerContainer title="Chart" desc="A detailed chart description" />
      </ChartProvider>,
    );

    const container = screen.getByLabelText('Chart');
    const descId = container.getAttribute('aria-describedby');
    expect(descId).to.not.equal(null);

    const descElement = document.getElementById(descId!);
    expect(descElement).to.not.equal(null);
    expect(descElement!.textContent).to.equal('A detailed chart description');
  });
});
