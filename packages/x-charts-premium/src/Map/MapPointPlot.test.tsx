import * as React from 'react';
import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import type { ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '../ChartsGeoDataProviderPremium';
import { MapPointPlot } from './MapPointPlot';
import type { MapPointValueType } from '../models/seriesType/mapPoint';

const worldGeoData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-180, -85],
            [180, -85],
            [180, 85],
            [-180, 85],
            [-180, -85],
          ],
        ],
      },
    },
  ],
} as unknown as ExtendedFeatureCollection;

const points: MapPointValueType[] = [
  { coordinates: [0, 0], label: 'Center' },
  { coordinates: [90, 45], label: 'NorthEast' },
  { coordinates: [-90, -45], label: 'SouthWest' },
];

describe('<MapPointPlot />', () => {
  const { render } = createRenderer();

  function renderPlot(plotProps: Record<string, unknown> = {}, data: MapPointValueType[] = points) {
    return render(
      <ChartsGeoDataProviderPremium
        geoData={worldGeoData}
        projection="equirectangular"
        width={400}
        height={300}
        series={[{ type: 'mapPoint', data }]}
      >
        <ChartsSurface>
          <MapPointPlot {...plotProps} />
        </ChartsSurface>
      </ChartsGeoDataProviderPremium>,
    );
  }

  it('renders one marker per visible point', async () => {
    const { container } = renderPlot();
    await waitFor(() => {
      expect(container.querySelectorAll('path[data-index]').length).to.equal(3);
    });
  });

  it('renders point labels when showLabels is enabled', async () => {
    renderPlot({ showLabels: true });
    await waitFor(() => {
      expect(screen.queryByText('Center')).not.to.equal(null);
    });
    expect(screen.queryByText('NorthEast')).not.to.equal(null);
  });

  it('applies the per-point color', async () => {
    const { container } = renderPlot({}, [{ coordinates: [0, 0], color: '#ff0000' }]);
    await waitFor(() => {
      const marker = container.querySelector('path[data-index]');
      expect(marker?.getAttribute('fill')).to.equal('#ff0000');
    });
  });

  it('scales marker size from the value through a size axis', async () => {
    const { container } = render(
      <ChartsGeoDataProviderPremium
        geoData={worldGeoData}
        projection="equirectangular"
        width={400}
        height={300}
        zAxis={[{ id: 'size', sizeMap: { type: 'continuous', min: 0, max: 100, size: [20, 400] } }]}
        series={[
          {
            type: 'mapPoint',
            sizeAxisId: 'size',
            data: [
              { coordinates: [-90, 0], value: 10 },
              { coordinates: [90, 0], value: 100 },
            ],
          },
        ]}
      >
        <ChartsSurface>
          <MapPointPlot />
        </ChartsSurface>
      </ChartsGeoDataProviderPremium>,
    );
    await waitFor(() => {
      expect(container.querySelectorAll('path[data-index]').length).to.equal(2);
    });
    const markers = Array.from(container.querySelectorAll('path[data-index]'));
    const small = markers.find((m) => m.getAttribute('data-index') === '0')!;
    const large = markers.find((m) => m.getAttribute('data-index') === '1')!;
    // Larger value -> larger symbol -> different (bigger) path definition.
    expect(small.getAttribute('d')).not.to.equal(large.getAttribute('d'));
  });

  it('collapses nearby points into a cluster marker showing the count', async () => {
    const { container } = renderPlot({ cluster: true }, [
      { coordinates: [0, 0], value: 1 },
      { coordinates: [1, 1], value: 2 },
      { coordinates: [2, 0], value: 3 },
      { coordinates: [160, -70], value: 4 },
    ]);
    await waitFor(() => {
      // Only the far point stays an interactive single marker.
      expect(container.querySelectorAll('path[data-index]').length).to.equal(1);
    });
    // The three close points collapse into a single cluster labeled "3".
    expect(screen.queryByText('3')).not.to.equal(null);
  });

  it('honors the series colorGetter callback', async () => {
    const { container } = render(
      <ChartsGeoDataProviderPremium
        geoData={worldGeoData}
        projection="equirectangular"
        width={400}
        height={300}
        series={[
          {
            type: 'mapPoint',
            data: [{ coordinates: [0, 0] }],
            colorGetter: ({ dataIndex }) => (dataIndex === 0 ? '#00ff00' : '#000000'),
          },
        ]}
      >
        <ChartsSurface>
          <MapPointPlot />
        </ChartsSurface>
      </ChartsGeoDataProviderPremium>,
    );
    await waitFor(() => {
      const marker = container.querySelector('path[data-index]');
      expect(marker?.getAttribute('fill')).to.equal('#00ff00');
    });
  });
});
