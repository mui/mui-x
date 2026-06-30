import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import type { ExtendedFeatureCollection } from '@mui/x-charts-vendor/d3-geo';
import { Unstable_ChartsGeoDataProviderPremium as ChartsGeoDataProviderPremium } from '../ChartsGeoDataProviderPremium';
import { MapShapePlot } from './MapShapePlot';

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
    {
      type: 'Feature',
      properties: { name: 'B' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 0],
            [30, 0],
            [30, 10],
            [20, 10],
            [20, 0],
          ],
        ],
      },
    },
  ],
} as unknown as ExtendedFeatureCollection;

const series = [
  {
    type: 'mapShape' as const,
    id: 's1',
    data: [{ name: 'A' }, { name: 'B' }],
  },
];

function renderMap(props: { onItemClick?: (event: any, identifier: any) => void }) {
  return (
    <ChartsGeoDataProviderPremium
      geoData={geoData}
      projection="naturalEarth1"
      width={400}
      height={400}
      series={series}
    >
      <ChartsSurface>
        <MapShapePlot onItemClick={props.onItemClick} />
      </ChartsSurface>
    </ChartsGeoDataProviderPremium>
  );
}

describe('MapShapePlot - click event', () => {
  const { render } = createRenderer();

  describe('onItemClick', () => {
    it('should add cursor="pointer" to shape elements', () => {
      const { container } = render(renderMap({ onItemClick: () => {} }));
      const shapes = container.querySelectorAll<HTMLElement>('path[data-index]');

      expect(shapes.length).to.equal(2);
      expect(Array.from(shapes).map((shape) => shape.getAttribute('cursor'))).to.deep.equal([
        'pointer',
        'pointer',
      ]);
    });

    it('should provide the right context as second argument', async () => {
      const onItemClick = vi.fn();
      const { container, user } = render(renderMap({ onItemClick }));
      const shapes = container.querySelectorAll<HTMLElement>('path[data-index]');

      await user.click(shapes[0]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'mapShape',
        seriesId: 's1',
        dataIndex: 0,
      });

      await user.click(shapes[1]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'mapShape',
        seriesId: 's1',
        dataIndex: 1,
      });
    });
  });
});
