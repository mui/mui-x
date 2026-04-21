import { styled } from '@mui/material/styles';
import { useRadialLinePlotData } from './useRadialLinePlotData';
import { type RadialLineClasses, useUtilityClasses } from './radialLineClasses';

const RadialAreaPlotRoot = styled('g', {
  name: 'MuiRadialAreaPlot',
  slot: 'Root',
})();

export interface RadialAreaPlotProps {
  classes?: Partial<Pick<RadialLineClasses, 'area' | 'areaPlot'>>;
}

export function RadialAreaPlot(props: RadialAreaPlotProps) {
  const { classes: inClasses } = props;
  const completedData = useRadialLinePlotData();

  const classes = useUtilityClasses({ classes: inClasses });

  return (
    <RadialAreaPlotRoot className={classes.areaPlot}>
      {completedData.map(
        ({ d, seriesId, color, hidden, area }) =>
          area && (
            <path
              key={seriesId}
              data-series={seriesId}
              d={d}
              fill={color}
              stroke="none"
              opacity={hidden ? 0 : 1}
              className={classes.area}
            />
          ),
      )}
    </RadialAreaPlotRoot>
  );
}
