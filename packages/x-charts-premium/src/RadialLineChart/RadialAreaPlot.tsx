import { styled } from '@mui/material/styles';
import { selectorChartPolarCenter, useChartsContext } from '@mui/x-charts/internals';
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

  const { store } = useChartsContext();
  const { cx, cy } = store.use(selectorChartPolarCenter);

  const classes = useUtilityClasses({ classes: inClasses });

  return (
    <RadialAreaPlotRoot className={classes.areaPlot} transform={`translate(${cx} ${cy})`}>
      {completedData.map(
        ({ seriesId, color, hidden, area, curve, points }) =>
          area && (
            <RadialArea
              key={seriesId}
              seriesId={seriesId}
              color={color}
              hidden={hidden}
              curve={curve}
              points={points}
              className={classes.area}
            />
          ),
      )}
    </RadialAreaPlotRoot>
  );
}
