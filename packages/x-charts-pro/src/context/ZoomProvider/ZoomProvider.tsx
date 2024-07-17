import * as React from 'react';
import { ZoomContext, ZoomState } from './ZoomContext';
import { defaultizeZoom } from './defaultizeZoom';
import { AxisConfigForZoom, ZoomData } from './Zoom.types';

type ZoomProviderProps = {
  children: React.ReactNode;
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis?: AxisConfigForZoom[];
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis?: AxisConfigForZoom[];
};

export function ZoomProvider({ children, xAxis, yAxis }: ZoomProviderProps) {
  const [isInteracting, setIsInteracting] = React.useState<boolean>(false);

  const options = React.useMemo(
    () =>
      [...defaultizeZoom(xAxis, 'x'), ...defaultizeZoom(yAxis, 'y')].reduce(
        (acc, v) => {
          acc[v.axisId] = v;
          return acc;
        },
        {} as ZoomState['options'],
      ),
    [xAxis, yAxis],
  );

  const [zoomData, setZoomData] = React.useState<ZoomData[]>(() =>
    Object.values(options).map(({ axisId, minStart: start, maxEnd: end }) => ({
      axisId,
      start,
      end,
    })),
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
