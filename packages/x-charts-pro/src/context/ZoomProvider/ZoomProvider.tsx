import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import { ZoomContext, ZoomState } from './ZoomContext';
import { defaultizeZoom } from './defaultizeZoom';
import { AxisConfigForZoom, ZoomData, ZoomProps } from './Zoom.types';

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
} & ZoomProps;

export function ZoomProvider({ children, xAxis, yAxis, zoom, onZoomChange }: ZoomProviderProps) {
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

  const [zoomData, setZoomData] = useControlled<ZoomData[]>({
    controlled: zoom,
    default: Object.values(options).map(({ axisId, minStart: start, maxEnd: end }) => ({
      axisId,
      start,
      end,
    })),
    name: 'ZoomProvider',
    state: 'zoom',
  });

  const value = React.useMemo(
    () => ({
      isInitialized: true,
      data: {
        isZoomEnabled: zoomData.length > 0,
        isPanEnabled: isPanEnabled(options),
        options,
        zoomData,
        setZoomData: (newZoomData: ZoomData[]) => {
          setZoomData(newZoomData);
          onZoomChange?.(newZoomData);
        },
        isInteracting,
        setIsInteracting,
      },
    }),
    [zoomData, setZoomData, isInteracting, setIsInteracting, options, onZoomChange],
  );

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
}

function isPanEnabled(options: Record<any, { panning?: boolean }>): boolean {
  return Object.values(options).some((v) => v.panning) || false;
}
