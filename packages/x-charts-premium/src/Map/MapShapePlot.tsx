'use client';
import { useGeoData } from '../hooks/useGeoData';
import { useGeoPath } from '../hooks/useGeoPath';
import { useMapShapeSeries } from '../hooks/useMapShapeSeries';
import { useGeoFeatureIndexByName } from '../hooks/useGeoFeatureIndexByName';
import { MapShape } from './MapShape';

export interface MapShapePlotProps {
  className?: string;
  /**
   * Fill color applied to every feature path. Overrides item and series colors.
   */
  fill?: string;
  /**
   * Stroke color applied to every feature path.
   * @default 'none'
   */
  stroke?: string;
  /**
   * Stroke width applied to every feature path.
   * @default 1
   */
  strokeWidth?: number;
}

/**
 * Renders series mapShape items.
 */
export function MapShapePlot(props: MapShapePlotProps) {
  const { className, fill, stroke = 'none', strokeWidth = 1 } = props;
  const geoData = useGeoData();
  const path = useGeoPath();
  const series = useMapShapeSeries();
  const featureIndexByName = useGeoFeatureIndexByName();

  if (!geoData || !path || series.length === 0) {
    return null;
  }

  return (
    <g className={className}>
      {series.map(({ data, id, color: seriesColor, hidden }) => {
        if (hidden) {
          return null;
        }
        return (
          <g key={id} data-series={id}>
            {data.map((item, dataIndex) => {
              if (item.hidden) {
                return null;
              }
              const featureIndex = featureIndexByName.get(item.name);
              if (featureIndex === undefined) {
                return null;
              }
              const feature = geoData.features[featureIndex];
              const d = path(feature);
              if (!d) {
                return null;
              }
              return (
                <MapShape
                  key={item.name ?? dataIndex}
                  seriesId={id}
                  dataIndex={dataIndex}
                  d={d}
                  color={fill ?? item.color ?? seriesColor}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
