'use client';
import { geoPath } from '@mui/x-charts-vendor/d3-geo';
import { useGeoData } from '../hooks/useGeoData';
import { useProjection } from '../hooks/useProjection';
import { useMapShapeSeries } from '../hooks/useMapShapeSeries';
import { useGeoFeatureIndexByName } from '../hooks/useGeoFeatureIndexByName';

export interface MapShapePlotProps {
  className?: string;
  /**
   * Fill color applied to every feature path.
   * @default 'currentColor'
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
  const projection = useProjection();
  const series = useMapShapeSeries();
  const featureIndexByName = useGeoFeatureIndexByName();

  console.log({ geoData, projection, series });
  if (!geoData || !projection || series.length === 0) {
    return null;
  }

  const path = geoPath(projection);

  return (
    <g className={className}>
      {series.map(({ data, id, color: seriesColor }) => (
        <g key={id} data-series={id}>
          {data.map((item, dataIndex) => {
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
              <path
                key={item.name ?? dataIndex}
                d={d}
                fill={fill ?? item.color ?? seriesColor}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
            );
          })}
        </g>
      ))}
    </g>
  );
}
