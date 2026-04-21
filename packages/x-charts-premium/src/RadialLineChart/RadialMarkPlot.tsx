import { styled } from '@mui/material/styles';
import { useRadialLinePlotData } from './useRadialLinePlotData';
import { type RadialLineClasses, useUtilityClasses } from './radialLineClasses';

const RadialMarkPlotRoot = styled('g', {
  name: 'MuiRadialMarkPlot',
  slot: 'Root',
})();

export interface RadialMarkPlotProps {
  classes?: Partial<Pick<RadialLineClasses, 'mark' | 'markPlot'>>;
}

export function RadialMarkPlot(props: RadialMarkPlotProps) {
  const { classes: inClasses } = props;
  const completedData = useRadialLinePlotData();

  const classes = useUtilityClasses({ classes: inClasses });

  return (
    <RadialMarkPlotRoot className={classes.markPlot}>
      {completedData.map(({ points, seriesId, color, hidden }) => {
        return (
          <g data-series={seriesId}>
            {points.map(({ x, y, dataIndex }) => (
              <circle
                key={dataIndex}
                cx={x}
                cy={y}
                r={4}
                fill={color}
                opacity={hidden ? 0 : 1}
                className={classes.mark}
              />
            ))}
          </g>
        );
      })}
    </RadialMarkPlotRoot>
  );
}
