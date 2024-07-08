import * as React from 'react';
import { AxisConfig, ScaleName, ChartsXAxisProps, ChartsYAxisProps } from '@mui/x-charts';
import { cartesianProviderUtils } from '@mui/x-charts/internals';
import { ZoomContext, ZoomState } from './ZoomContext';
import { defaultizeZoom } from './defaultizeZoom';
import { ZoomData } from './Zoom.types';

const { defaultizeAxis } = cartesianProviderUtils;

type ZoomProviderProps = {
  children: React.ReactNode;
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis?: Partial<Pick<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id' | 'zoom'>>[];
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis?: Partial<Pick<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id' | 'zoom'>>[];
};

export function ZoomProvider({ children, xAxis: inXAxis, yAxis: inYAxis }: ZoomProviderProps) {
  const [isInteracting, setIsInteracting] = React.useState<boolean>(false);

  const options = React.useMemo(
    () =>
      [
        ...(defaultizeZoom(defaultizeAxis(inXAxis, 'x'), 'x') ?? []),
        ...(defaultizeZoom(defaultizeAxis(inYAxis, 'y'), 'y') ?? []),
      ].reduce(
        (acc, v) => {
          acc[v.axisId] = v;
          return acc;
        },
        {} as ZoomState['options'],
      ),
    [inXAxis, inYAxis],
  );

  const [zoomData, setZoomData] = React.useState<ZoomData[]>(
    Object.values(options).map((v) => ({ axisId: v.axisId, min: v.min, max: v.max })),
  );

  const value = React.useMemo(
    () => ({
      isInitialized: true,
      data: {
        isZoomEnabled: zoomData.length > 0,
        isPanEnabled: isPanEnabled(options),
        options,
        zoomData,
        setZoomData,
        isInteracting,
        setIsInteracting,
      },
    }),
    [zoomData, setZoomData, isInteracting, setIsInteracting, options],
  );

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
}

function isPanEnabled(options: Record<any, { panning?: boolean }>): boolean {
  return Object.values(options).some((v) => v.panning) || false;
}
