import { type ChartPlugin } from '@mui/x-charts/internals';
import { printChart } from './print';
import { exportImage } from './exportImage';
import { exportSvg } from './exportSvg';
import type {
  ChartSvgExportOptions,
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

export const useChartProExport: ChartPlugin<UseChartProExportSignature> = ({ instance }) => {
  const { chartRootRef, chartsLayerContainerRef } = instance;
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
    const svg = chartsLayerContainerRef.current;

    if (chartRoot && svg) {
      const enableAnimation = instance.disableAnimation();

      try {
        // Wait for animation frame to ensure the animation finished
        await waitForAnimationFrame();
        await exportImage(chartRoot, svg, options);
      } catch (error) {
        console.error('MUI X Charts: Error exporting chart as image:', error);
      } finally {
        enableAnimation();
      }
    }
  };

  const exportAsSvg = async (options?: ChartSvgExportOptions) => {
    const chartRoot = chartRootRef.current;
    const svg = chartsLayerContainerRef.current;

    if (chartRoot && svg) {
      const enableAnimation = instance.disableAnimation();

      try {
        // Wait for animation frame to ensure the animation finished
        await waitForAnimationFrame();
        await exportSvg(chartRoot, svg, options);
      } catch (error) {
        console.error('MUI X Charts: Error exporting chart as SVG:', error);
      } finally {
        enableAnimation();
      }
    }
  };

  return {
    publicAPI: {
      exportAsPrint,
      exportAsImage,
      exportAsSvg,
    },
    instance: {
      exportAsPrint,
      exportAsImage,
      exportAsSvg,
    },
  };
};

useChartProExport.params = {};

useChartProExport.getDefaultizedParams = ({ params }) => ({ ...params });

useChartProExport.getInitialState = () => ({ export: {} });
