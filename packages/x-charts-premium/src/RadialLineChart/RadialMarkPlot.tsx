import { styled } from '@mui/material/styles';
import { useRadialLinePlotData } from './useRadialLinePlotData';
import { type RadialLineClasses, useUtilityClasses } from './radialLineClasses';
import { useItemHighlightStateGetter } from '../hooks';

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

  const getHighlightState = useItemHighlightStateGetter();

  const classes = useUtilityClasses({ classes: inClasses });

  return (
    <RadialMarkPlotRoot className={classes.markPlot}>
      {completedData.map(({ points, seriesId, color, hidden }) => {
        const highlightState = getHighlightState({ type: 'radialLine', seriesId });
        const isHighlighted = highlightState === 'highlighted';
        const isFaded = highlightState === 'faded';

        const fadedOpacity = isFaded ? 0.3 : 1;

        return (
          <g data-series={seriesId} key={seriesId}>
            {points.map(({ x, y, dataIndex }) => (
              <circle
                key={dataIndex}
                cx={x}
                cy={y}
                r={4}
                fill={color}
                data-highlighted={isHighlighted || undefined}
                data-faded={isFaded || undefined}
                filter={isHighlighted ? 'brightness(120%)' : undefined}
                opacity={hidden ? 0 : fadedOpacity}
                className={classes.mark}
              />
            ))}
          </g>
        );
      })}
    </RadialMarkPlotRoot>
  );
}
