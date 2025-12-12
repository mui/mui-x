'use client';

import { type PieArcPlotProps } from '@mui/x-charts';
import { PieArcPlot, type PieArcItemValues } from './PieArcPlot';
import { usePiePlotData } from './PieChart.hooks';

export interface PiePlotProps extends Pick<PieArcPlotProps, 'onItemClick'> {
  children: (item: PieArcItemValues, index: number) => React.ReactNode;
}

function PiePlot(props: PiePlotProps) {
  const { onItemClick, children } = props;
  const plotData = usePiePlotData();

  return plotData?.map((seriesData) => {
    const {
      innerRadius,
      outerRadius,
      cornerRadius,
      paddingAngle,
      data,
      highlighted,
      faded,
      id,
      transform,
    } = seriesData;

    return (
      <PieArcPlot
        key={id}
        transform={transform}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        cornerRadius={cornerRadius}
        paddingAngle={paddingAngle}
        id={id}
        data={data}
        highlighted={highlighted}
        faded={faded}
        onItemClick={onItemClick}
      >
        {children}
      </PieArcPlot>
    );
  });
}

export { PiePlot };
