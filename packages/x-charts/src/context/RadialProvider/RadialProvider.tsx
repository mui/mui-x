import * as React from 'react';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useSeries } from '../../hooks/useSeries';
import { RadialContext } from './RadialContext';
import { computeValue } from './computeValue';
import { useXExtremumGetter } from '../PluginProvider/useXExtremumGetter';
import { useYExtremumGetter } from '../PluginProvider';
import { RadialProviderProps } from './Radial.types';

function RadialProvider(props: RadialProviderProps) {
  const { rotationAxis, radiusAxis, children } = props;

  const formattedSeries = useSeries();
  const drawingArea = useDrawingArea();
  const xExtremumGetters = useXExtremumGetter();
  const yExtremumGetters = useYExtremumGetter();

  const rotationValues = React.useMemo(
    () =>
      computeValue({
        drawingArea,
        formattedSeries,
        axis: rotationAxis,
        extremumGetters: xExtremumGetters,
        axisDirection: 'rotation',
      }),
    [drawingArea, formattedSeries, rotationAxis, xExtremumGetters],
  );

  const radiusValues = React.useMemo(
    () =>
      computeValue({
        drawingArea,
        formattedSeries,
        axis: radiusAxis,
        extremumGetters: yExtremumGetters,
        axisDirection: 'radius',
      }),
    [drawingArea, formattedSeries, radiusAxis, yExtremumGetters],
  );

  const value = React.useMemo(
    () => ({
      isInitialized: true,
      data: {
        rotationAxis: rotationValues.axis,
        radiusAxis: radiusValues.axis,
        rotationAxisIds: rotationValues.axisIds,
        radiusAxisIds: radiusValues.axisIds,
      },
    }),
    [rotationValues, radiusValues],
  );

  return <RadialContext.Provider value={value}>{children}</RadialContext.Provider>;
}

export { RadialProvider };
