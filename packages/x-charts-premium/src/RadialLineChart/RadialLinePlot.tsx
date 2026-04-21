import { styled } from '@mui/material/styles';
import { useRadialLinePlotData } from './useRadialLinePlotData';
import { type RadialLineClasses, useUtilityClasses } from './radialLineClasses';

const RadialLinePlotRoot = styled('g', {
  name: 'MuiRadialLinePlot',
  slot: 'Root',
})();

export interface RadialLinePlotProps {
  classes?: Partial<Pick<RadialLineClasses, 'line' | 'linePlot'>>;
}

export function RadialLinePlot(props: RadialLinePlotProps) {
  const { classes: inClasses } = props;
  const completedData = useRadialLinePlotData();

  const classes = useUtilityClasses({ classes: inClasses });

  return (
    <RadialLinePlotRoot className={classes.linePlot}>
      {completedData.map(({ d, seriesId, color, hidden }) => (
        <path
          key={seriesId}
          data-series={seriesId}
          d={d}
          stroke={color}
          fill="none"
          opacity={hidden ? 0 : 1}
          className={classes.line}
        />
      ))}
    </RadialLinePlotRoot>
  );
}
