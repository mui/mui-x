'use client';

import { PieArcLabelPlot, type PieArcLabelItemValues } from './PieArcLabelPlot';
import { usePiePlotData } from './PieChart.hooks';

export interface PieLabelPlotProps {
  children: (item: PieArcLabelItemValues, index: number) => React.ReactNode;
}

function PieLabelPlot(props: PieLabelPlotProps) {
  const { children } = props;
  const plotData = usePiePlotData();

  return plotData?.map((seriesData) => {
    const {
      innerRadius,
      outerRadius,
      cornerRadius,
      paddingAngle,
      data,
      availableRadius,
      arcLabelRadius,
      id,
      arcLabel,
      arcLabelMinAngle,
      transform,
    } = seriesData;

    return (
      <PieArcLabelPlot
        key={id}
        transform={transform}
        innerRadius={innerRadius}
        outerRadius={outerRadius ?? availableRadius}
        arcLabelRadius={arcLabelRadius}
        cornerRadius={cornerRadius}
        paddingAngle={paddingAngle}
        id={id}
        data={data}
        arcLabel={arcLabel}
        arcLabelMinAngle={arcLabelMinAngle}
      >
        {children}
      </PieArcLabelPlot>
    );
  });
}

export { PieLabelPlot };
