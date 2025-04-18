import { ChartPlugin } from '@mui/x-charts/internals';
import { printChart } from './print';
import { ChartPrintExportOptions, UseChartProExportSignature } from './useChartProExport.types';

function waitForAnimationFrame() {
  let resolve: (_: void) => void;

  const promise = new Promise((res) => {
    resolve = res;
  });

  window.requestAnimationFrame(() => {
    resolve();
  });

  return promise;
}

export const useChartProExport: ChartPlugin<UseChartProExportSignature> = ({
  chartRootRef,
  instance,
}) => {
  const exportAsPrint = async (options?: ChartPrintExportOptions) => {
    const chartRoot = chartRootRef.current;

    if (chartRoot) {
      const enableAnimation = instance.disableAnimation();
      try {
        // Wait for animation frame to ensure the animation finished
        await waitForAnimationFrame();
        printChart(chartRoot, options);
      } finally {
        enableAnimation();
      }
    }
  };

  return {
    publicAPI: {
      exportAsPrint,
    },
    instance: {
      exportAsPrint,
    },
  };
};

useChartProExport.params = {};

useChartProExport.getDefaultizedParams = ({ params }) => ({ ...params });

useChartProExport.getInitialState = () => ({ export: {} });
