import { ChartPlugin } from '@mui/x-charts/internals';
import { printChart } from './print';
import { ChartPrintExportOptions, UseChartProExportSignature } from './useChartProExport.types';

export const useChartProExport: ChartPlugin<UseChartProExportSignature> = ({ svgRef }) => {
  const print = (options?: ChartPrintExportOptions) => {
    const svg = svgRef.current;

    if (svg) {
      printChart(svg, options);
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
