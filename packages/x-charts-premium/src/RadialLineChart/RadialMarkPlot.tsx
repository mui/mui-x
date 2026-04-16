import { styled } from '@mui/material/styles';
import { useRadialLinePlotData } from './useRadialLinePlotData';

const RadialLinePlotRoot = styled('g', {
  name: 'MuiRadialLinePlot',
  slot: 'Root',
})();

export interface RadialMarkPlotProps {}

export function RadialMarkPlot() {
  const completedData = useRadialLinePlotData();

  return (
    <RadialLinePlotRoot>
      {completedData.map(({ points, seriesId, color, hidden }) => {
        return (
          <g data-series={seriesId}>
            {points.map(({ x, y, dataIndex }) => (
              <circle key={dataIndex} cx={x} cy={y} r={4} fill={color} opacity={hidden ? 0 : 1} />
            ))}
          </g>
        );
      })}
    </RadialLinePlotRoot>
  );
}
