import * as React from 'react';
import PropTypes from 'prop-types';
import useControlled from '@mui/utils/useControlled';
import { Initializable } from '@mui/x-charts/internals';
import { ZoomContext } from './ZoomContext';
import { defaultizeZoom } from './defaultizeZoom';
import { ZoomData, ZoomProviderProps, ZoomState } from './Zoom.types';

function ZoomProvider({ children, xAxis, yAxis, zoom, onZoomChange }: ZoomProviderProps) {
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

ZoomProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * Callback fired when the zoom has changed.
   *
   * @param {ZoomData[]} zoomData Updated zoom data.
   */
  onZoomChange: PropTypes.func,
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      zoom: PropTypes.oneOfType([
        PropTypes.shape({
          maxEnd: PropTypes.number,
          maxSpan: PropTypes.number,
          minSpan: PropTypes.number,
          minStart: PropTypes.number,
          panning: PropTypes.bool,
          step: PropTypes.number,
        }),
        PropTypes.bool,
      ]),
    }),
  ),
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      zoom: PropTypes.oneOfType([
        PropTypes.shape({
          maxEnd: PropTypes.number,
          maxSpan: PropTypes.number,
          minSpan: PropTypes.number,
          minStart: PropTypes.number,
          panning: PropTypes.bool,
          step: PropTypes.number,
        }),
        PropTypes.bool,
      ]),
    }),
  ),
  /**
   * The zoom data of type [[ZoomData]] which lists the zoom data related to each axis.
   */
  zoom: PropTypes.arrayOf(
    PropTypes.shape({
      axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      end: PropTypes.number.isRequired,
      start: PropTypes.number.isRequired,
    }),
  ),
} as any;

export { ZoomProvider };

function isPanEnabled(options: Record<any, { panning?: boolean }>): boolean {
  return Object.values(options).some((v) => v.panning) || false;
}
