import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { isJSDOM } from 'test/utils/skipIf';
import { ChartProvider } from '../context/ChartProvider';

describe('<ChartsLayerContainer />', () => {
  const { render } = createRenderer();

  it.skipIf(!isJSDOM)(
    'should warn when ChartsSurface is used inside ChartsLayerContainer',
    () => {
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
    },
  );
});
