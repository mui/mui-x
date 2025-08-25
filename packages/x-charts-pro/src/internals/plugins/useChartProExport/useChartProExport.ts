import { ChartPlugin } from '@mui/x-charts/internals';
import { printChart } from './print';
import { exportImage } from './exportImage';
import { exportSvg } from './exportSvg';
import {
  ChartImageExportOptions,
  ChartPrintExportOptions,
  UseChartProExportSignature,
} from './useChartProExport.types';

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
      } catch (error) {
        console.error('MUI X Charts: Error exporting chart as print:', error);
      } finally {
        enableAnimation();
      }
    }
  };

  const exportAsImage = async (options?: ChartImageExportOptions) => {
    const chartRoot = chartRootRef.current;

    if (chartRoot) {
      const enableAnimation = instance.disableAnimation();

      try {
        // Wait for animation frame to ensure the animation finished
        await waitForAnimationFrame();
        
        // Check if it's SVG export
        if (options?.type === 'image/svg+xml') {
          await exportSvg(chartRoot, options);
        } else {
          await exportImage(chartRoot, options);
        }
      } catch (error) {
        console.error('MUI X Charts: Error exporting chart as image:', error);
      } finally {
        enableAnimation();
      }
    }
  };

  return {
    publicAPI: {
      exportAsPrint,
      exportAsImage,
    },
    instance: {
      exportAsPrint,
      exportAsImage,
    },
  };
};

useChartProExport.params = {};

useChartProExport.getDefaultizedParams = ({ params }) => ({ ...params });

useChartProExport.getInitialState = () => ({ export: {} });
