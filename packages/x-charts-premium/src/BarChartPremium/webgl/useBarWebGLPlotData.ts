import * as React from 'react';
import { type ChartDrawingArea } from '@mui/x-charts/hooks';
import {
  type BorderRadiusSide,
  type ProcessedBarSeriesData,
  selectorChartsHighlightStateCallback,
  useStore,
} from '@mui/x-charts/internals';
import { parseColor } from '../../utils/webgl/parseColor';

export interface BarWebGLPlotData {
  centers: Float32Array;
  halfSizes: Float32Array;
  colors: Float32Array;
  saturations: Float32Array;
  cornerRadii: Float32Array;
  count: number;
}

function getCornerRadii(
  radius: number,
  side: BorderRadiusSide | undefined,
  target: Float32Array,
  offset: number,
) {
  // CSS order: top-left, top-right, bottom-right, bottom-left.
  let tl = 0;
  let tr = 0;
  let br = 0;
  let bl = 0;

  if (radius > 0) {
    switch (side) {
      case 'top':
        tl = radius;
        tr = radius;
        break;
      case 'bottom':
        br = radius;
        bl = radius;
        break;
      case 'left':
        tl = radius;
        bl = radius;
        break;
      case 'right':
        tr = radius;
        br = radius;
        break;
      default:
        break;
    }
  }

  target[offset] = tl;
  target[offset + 1] = tr;
  target[offset + 2] = br;
  target[offset + 3] = bl;
}

export function useBarWebGLPlotData(
  drawingArea: ChartDrawingArea,
  completedData: ProcessedBarSeriesData[],
  borderRadius: number,
): BarWebGLPlotData {
  const store = useStore();
  const getHighlightState = store.use(selectorChartsHighlightStateCallback);

  return React.useMemo(() => {
    let maxCount = 0;
    for (const processed of completedData) {
      maxCount += processed.data.length;
    }

    const centers = new Float32Array(maxCount * 2);
    const halfSizes = new Float32Array(maxCount * 2);
    const colors = new Float32Array(maxCount * 4);
    const saturations = new Float32Array(maxCount);
    const cornerRadii = new Float32Array(maxCount * 4);

    let cursor = 0;

    for (const processed of completedData) {
      const { seriesId, data } = processed;

      for (let i = 0; i < data.length; i += 1) {
        const bar = data[i];

        if (bar.hidden || bar.value == null || bar.width <= 0 || bar.height <= 0) {
          continue;
        }

        const halfW = bar.width / 2;
        const halfH = bar.height / 2;

        centers[cursor * 2] = bar.x + halfW - drawingArea.left;
        centers[cursor * 2 + 1] = bar.y + halfH - drawingArea.top;

        halfSizes[cursor * 2] = halfW;
        halfSizes[cursor * 2 + 1] = halfH;

        const rgba = parseColor(bar.color);
        colors[cursor * 4] = rgba[0];
        colors[cursor * 4 + 1] = rgba[1];
        colors[cursor * 4 + 2] = rgba[2];
        colors[cursor * 4 + 3] = rgba[3];

        const highlightState = getHighlightState({
          type: 'bar',
          seriesId,
          dataIndex: bar.dataIndex,
        });
        if (highlightState === 'highlighted') {
          saturations[cursor] = 0.2;
        } else if (highlightState === 'faded') {
          saturations[cursor] = -0.2;
        }

        const effectiveRadius = Math.min(borderRadius, halfW, halfH);
        getCornerRadii(effectiveRadius, bar.borderRadiusSide, cornerRadii, cursor * 4);

        cursor += 1;
      }
    }

    return { centers, halfSizes, colors, saturations, cornerRadii, count: cursor };
  }, [borderRadius, completedData, drawingArea.left, drawingArea.top, getHighlightState]);
}
