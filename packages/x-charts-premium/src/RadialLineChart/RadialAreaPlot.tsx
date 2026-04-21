import { styled } from '@mui/material/styles';
import { useRadialLinePlotData } from './useRadialLinePlotData';
import { type RadialLineClasses, useUtilityClasses } from './radialLineClasses';
import { RadialArea } from './RadialArea';

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
        ({ seriesId, color, hidden, area, points }) =>
          area && (
            <RadialArea
              key={seriesId}
              seriesId={seriesId}
              color={color}
              hidden={hidden}
              points={points}
              className={classes.area}
            />
          ),
      )}
    </RadialAreaPlotRoot>
  );
}
