import * as React from 'react';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useSeries } from '../../hooks/useSeries';
import { PolarContext } from './PolarContext';
import { computeValue } from './computeValue';
import { useRadiusExtremumGetter } from '../PluginProvider/useRadiusExtremumGetter';
import { useRotationExtremumGetter } from '../PluginProvider/useRotationExtremumGetter';
import { PolarProviderProps } from './Polar.types';

function PolarProvider(props: PolarProviderProps) {
  const { rotationAxis, radiusAxis, children } = props;

  const formattedSeries = useSeries();
  const drawingArea = useDrawingArea();
  const rotationExtremumGetters = useRotationExtremumGetter();
  const radiusExtremumGetters = useRadiusExtremumGetter();

  const rotationValues = React.useMemo(
    () =>
      computeValue({
        drawingArea,
        formattedSeries,
        axis: rotationAxis,
        extremumGetters: rotationExtremumGetters,
        axisDirection: 'rotation',
      }),
    [drawingArea, formattedSeries, rotationAxis, rotationExtremumGetters],
  );

  const radiusValues = React.useMemo(
    () =>
      computeValue({
        drawingArea,
        formattedSeries,
        axis: radiusAxis,
        extremumGetters: radiusExtremumGetters,
        axisDirection: 'radius',
      }),
    [drawingArea, formattedSeries, radiusAxis, radiusExtremumGetters],
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

  return <PolarContext.Provider value={value}>{children}</PolarContext.Provider>;
}

export { PolarProvider };
