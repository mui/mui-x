import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import { Initializable } from '@mui/x-charts/internals';
import { ZoomContext } from './ZoomContext';
import { defaultizeZoom } from './defaultizeZoom';
import { ZoomData, ZoomProviderProps, ZoomState } from './Zoom.types';

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
    default: [],
    name: 'ZoomProvider',
    state: 'zoom',
  });

  const setZoomDataCallback = React.useCallback(
    (newZoomData: Parameters<ZoomState['setZoomData']>[0]) => {
      setZoomData(newZoomData);
      onZoomChange?.(newZoomData);
    },
    [setZoomData, onZoomChange],
  );

  const value = React.useMemo(
    () =>
      ({
        isInitialized: true,
        data: {
          isZoomEnabled: Object.keys(options).length > 0,
          isPanEnabled: isPanEnabled(options),
          options,
          zoomData,
          setZoomData: setZoomDataCallback,
          isInteracting,
          setIsInteracting,
        },
      }) satisfies Initializable<ZoomState>,
    [zoomData, isInteracting, setIsInteracting, options, setZoomDataCallback],
  );

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
}

function isPanEnabled(options: Record<any, { panning?: boolean }>): boolean {
  return Object.values(options).some((v) => v.panning) || false;
}
