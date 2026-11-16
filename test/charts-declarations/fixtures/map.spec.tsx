import { GeoDataPlot, MapShapePlot } from '@mui/x-charts-premium/Map';

// The Map entry must load the Premium series augmentation on its own.
export const plots = (
  <g>
    <GeoDataPlot />
    <MapShapePlot />
  </g>
);
