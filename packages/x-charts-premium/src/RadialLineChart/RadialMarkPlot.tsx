import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from '@mui/x-charts-vendor/d3-shape';
import { styled } from '@mui/material/styles';
import { getSymbol } from '@mui/x-charts/internals';
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
      {completedData.map(({ points, seriesId, color, hidden, showMark, shape }) => {
        if (!showMark) {
          return null;
        }
        const path = shape === 'circle' ? null : d3Symbol(d3SymbolsFill[getSymbol(shape)])()!;

        return (
          <g data-series={seriesId} key={seriesId}>
            {points.map(({ x, y, dataIndex }) =>
              shape === 'circle' ? (
                <circle
                  key={dataIndex}
                  cx={x}
                  cy={y}
                  r={4}
                  fill={color}
                  opacity={hidden ? 0 : 1}
                  className={classes.mark}
                />
              ) : (
                <path
                  key={dataIndex}
                  d={path!}
                  transform={`translate(${x}, ${y})`}
                  fill={color}
                  opacity={hidden ? 0 : 1}
                  className={classes.mark}
                />
              ),
            )}
          </g>
        );
      })}
    </RadialMarkPlotRoot>
  );
}
