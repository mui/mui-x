import * as React from 'react';

import { ZAxisContextProvider, ZAxisContextProviderProps } from '@mui/x-charts/context';
import { ChartContainer, ChartContainerProps } from '@mui/x-charts/ChartContainer';
import { plugin } from './plugin';

export const HeatmapContainer = React.forwardRef(function HeatmapContainer(
  props: ChartContainerProps & Pick<ZAxisContextProviderProps, 'zAxis'>,
  ref,
) {
  const { children, zAxis, ...other } = props;

  return (
    <ChartContainer plugins={[plugin]} {...other} ref={ref}>
      <ZAxisContextProvider zAxis={zAxis}>{children}</ZAxisContextProvider>
    </ChartContainer>
  );
});
