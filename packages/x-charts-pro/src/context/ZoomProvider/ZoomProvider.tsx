import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import { Initializable } from '@mui/x-charts/internals';
import { ZoomContext } from './ZoomContext';
import { defaultizeZoom } from './defaultizeZoom';
import { ZoomData, ZoomProviderProps, ZoomState } from './Zoom.types';
import { initializeZoomData } from './initializeZoomData';

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

  // Default zoom data is initialized only once when uncontrolled. If the user changes the options
  // after the initial render, the zoom data will not be updated until the next zoom interaction.
  // This is required to avoid warnings about controlled/uncontrolled components.
  const defaultZoomData = React.useRef<ZoomData[]>(initializeZoomData(options));

  const [zoomData, setZoomData] = useControlled<ZoomData[]>({
    controlled: zoom,
    default: defaultZoomData.current,
    name: 'ZoomProvider',
    state: 'zoom',
  });

  const setZoomDataCallback = React.useCallback<ZoomState['setZoomData']>(
    (newZoomData) => {
      setZoomData(newZoomData);
      onZoomChange?.(newZoomData);
    },
    [setZoomData, onZoomChange],
  );

  const value = React.useMemo<Initializable<ZoomState>>(
    () => ({
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
    }),
    [zoomData, isInteracting, setIsInteracting, options, setZoomDataCallback],
  );

  return <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>;
}

function isPanEnabled(options: Record<any, { panning?: boolean }>): boolean {
  return Object.values(options).some((v) => v.panning) || false;
}
