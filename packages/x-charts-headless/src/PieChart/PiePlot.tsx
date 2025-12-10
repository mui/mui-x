'use client';

import { type PieArcPlotProps } from '@mui/x-charts';
import { PieArcPlot } from './PieArcPlot';
import { usePiePlotData } from './PieChart.hooks';

export interface PiePlotProps extends Pick<PieArcPlotProps, 'onItemClick'> {}

function PiePlot(props: PiePlotProps) {
  const { onItemClick } = props;
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
      />
    );
  });
}

export { PiePlot };
