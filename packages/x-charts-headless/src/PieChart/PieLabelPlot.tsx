'use client';

import { PieArcLabelPlot } from './PieArcLabelPlot';
import { usePiePlotData } from './PieChart.hooks';

function PieLabelPlot() {
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
      />
    );
  });
}

export { PieLabelPlot };
