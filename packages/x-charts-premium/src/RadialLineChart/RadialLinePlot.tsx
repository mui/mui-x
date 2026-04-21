import { styled } from '@mui/material/styles';
import { selectorChartPolarCenter, useChartsContext } from '@mui/x-charts/internals';
import { useRadialLinePlotData } from './useRadialLinePlotData';
import { type RadialLineClasses, useUtilityClasses } from './radialLineClasses';
import { RadialLine } from './RadialLine';

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

  const { store } = useChartsContext();
  const { cx, cy } = store.use(selectorChartPolarCenter);

  const classes = useUtilityClasses({ classes: inClasses });

  return (
    <RadialLinePlotRoot className={classes.linePlot} transform={`translate(${cx} ${cy})`}>
      {completedData.map(({ points, seriesId, color, hidden, curve }) => (
        <RadialLine
          key={seriesId}
          seriesId={seriesId}
          color={color}
          hidden={hidden}
          points={points}
          curve={curve}
          className={classes.line}
        />
      ))}
    </RadialLinePlotRoot>
  );
}
