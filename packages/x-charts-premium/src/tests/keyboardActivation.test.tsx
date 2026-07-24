import { createRenderer } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsSvgLayer } from '@mui/x-charts/ChartsSvgLayer';
import type { ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '../ChartsGeoDataProviderPremium';
import { MapShapePlot } from '../Map/MapShapePlot';

const geoData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'A' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [10, 0],
            [10, 10],
            [0, 10],
            [0, 0],
          ],
        ],
      },
    },
  ],
} as unknown as ExtendedFeatureCollection;

describe('keyboard item activation - premium charts', () => {
  const { render } = createRenderer();

  it('should fire onItemClick with the focused range bar item', async () => {
    const onItemClick = vi.fn();
    const { user } = render(
      <BarChartPremium
        height={100}
        width={100}
        margin={0}
        skipAnimation
        series={[
          {
            type: 'rangeBar',
            id: 'A',
            data: [
              [1, 4],
              [2, 5],
            ],
          },
        ]}
        xAxis={[{ scaleType: 'band', data: ['a', 'b'] }]}
        onItemClick={onItemClick}
        experimentalFeatures={{ keyboardActivation: true }}
      />,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onItemClick.mock.calls.length).to.equal(1);
    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'rangeBar',
      seriesId: 'A',
      dataIndex: 0,
    });
  });

  it('should fire onItemClick with the focused map shape', async () => {
    const onItemClick = vi.fn();
    const { user } = render(
      <ChartsGeoDataProviderPremium
        geoData={geoData}
        projection="naturalEarth1"
        width={400}
        height={400}
        series={[{ type: 'mapShape', id: 's1', data: [{ name: 'A' }] }]}
        experimentalFeatures={{ keyboardActivation: true }}
      >
        <ChartsLayerContainer>
          <ChartsSvgLayer>
            <MapShapePlot onItemClick={onItemClick} />
          </ChartsSvgLayer>
        </ChartsLayerContainer>
      </ChartsGeoDataProviderPremium>,
    );

    await user.keyboard('{Tab}');
    await user.keyboard('[ArrowRight]');
    await user.keyboard('[Enter]');

    expect(onItemClick.mock.calls.length).to.equal(1);
    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'mapShape',
      seriesId: 's1',
      name: 'A',
    });
  });
});
