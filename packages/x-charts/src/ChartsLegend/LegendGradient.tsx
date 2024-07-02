import * as React from 'react';
import { ScaleSequential } from 'd3-scale';
import ChartsContinuousGradient from '../internals/components/ChartsAxesGradients/ChartsContinuousGradient';
import { ContinuousScaleName } from '../models/axis';
import { ChartsLegendProps } from './ChartsLegend';
import { useDrawingArea } from '../hooks';
import { getScale } from '../internals/getScale';
import { ContinuousColorConfig } from '../models/colorMapping';

interface LegendGradientProps extends Pick<ChartsLegendProps, 'position' | 'direction'> {
  colorScale: ScaleSequential<string, string | null>;
  colorMap: ContinuousColorConfig<number | Date>;
  /**
   * A unique identifier for the gradient.
   */
  id: string;
  /**
   * The scale used to display gradient colors.
   * @default 'linear
   */
  scaleType?: ContinuousScaleName;
}

export function LegendGradient(props: LegendGradientProps) {
  const { colorScale, colorMap, id, scaleType = 'linear', direction } = props;
  const { width, height } = useDrawingArea();

  const size = direction === 'column' ? width / 2 : height / 2;
  const isReversed = direction === 'column';

  if (!colorScale || !colorMap) {
    return null;
  }
  const scale = getScale(
    scaleType,
    [colorMap.min, colorMap.max],
    isReversed ? [size, 0] : [0, size],
  );
  return (
    <React.Fragment>
      <ChartsContinuousGradient
        isReversed={isReversed}
        gradientId={id}
        size={size}
        direction={direction === 'row' ? 'x' : 'y'}
        scale={scale}
        colorScale={colorScale}
        colorMap={colorMap}
      />
      <rect
        x={0}
        y={0}
        {...(direction === 'row' ? { width: size, height: 5 } : { width: 5, height: size })}
        fill={`url(#${id})`}
      />
    </React.Fragment>
  );
}
