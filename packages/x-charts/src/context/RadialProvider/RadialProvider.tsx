import * as React from 'react';
import { useDrawingArea } from '../../hooks/useDrawingArea';
import { useSeries } from '../../hooks/useSeries';
import { RadialContext } from './RadialContext';
import { computeValue } from './computeValue';
import { useRadiusExtremumGetter } from '../PluginProvider/useRadiusExtremumGetter';
import { useRotationExtremumGetter } from '../PluginProvider/useRotationExtremumGetter';
import { RadialProviderProps } from './Radial.types';

function RadialProvider(props: RadialProviderProps) {
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

  return <RadialContext.Provider value={value}>{children}</RadialContext.Provider>;
}

export { RadialProvider };
