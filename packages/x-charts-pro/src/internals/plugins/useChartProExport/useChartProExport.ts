import { ChartPlugin } from '@mui/x-charts/internals';
import { printChart } from './print';
import { UseChartProExportSignature } from './useChartProExport.types';

export const useChartProExport: ChartPlugin<UseChartProExportSignature> = ({ svgRef }) => {
  const print = () => {
    const svg = svgRef.current;

    if (svg) {
      printChart(svg, { name: 'Bar Chart.pdf', width: 600, height: 400 });
    }
  };

  return {
    publicAPI: {
      print,
    },
    instance: {
      print,
    },
  };
};

useChartProExport.params = {};

useChartProExport.getDefaultizedParams = ({ params }) => ({ ...params });

useChartProExport.getInitialState = () => ({ export: {} });
