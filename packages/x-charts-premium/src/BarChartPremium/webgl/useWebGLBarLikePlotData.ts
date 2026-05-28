'use client';
import * as React from 'react';
import { type ChartDrawingArea } from '@mui/x-charts/hooks';
import {
  type BorderRadiusSide,
  selectorChartsHighlightStateCallback,
  useStore,
} from '@mui/x-charts/internals';
import { type SeriesId } from '@mui/x-charts/models';
import { parseColor } from '../../utils/webgl/parseColor';

export interface WebGLBarLikeItem {
  x: number;
  y: number;
  width: number;
  height: number;
  // Only checked against null to decide whether to draw the bar.
  value: unknown;
  hidden: boolean;
  color: string;
  dataIndex: number;
  // Only relevant for the standard bar series (stacked bars round only the
  // outer corners). Range bars don't have a side and rely on the
  // `fullRoundedCorners` option below.
  borderRadiusSide?: BorderRadiusSide;
}

export interface WebGLBarLikeSeries<T extends WebGLBarLikeItem> {
  seriesId: SeriesId;
  data: readonly T[];
  // Drives whether the band axis is x (vertical layout) or y (horizontal). The
  // dense-mode aggregation below uses this to fold bars along the band axis.
  layout?: 'vertical' | 'horizontal';
}

export interface WebGLBarLikePlotData {
  centers: Float32Array;
  halfSizes: Float32Array;
  // Uint8 [0, 255]; uploaded as UNSIGNED_BYTE with normalized=true so the
  // shader reads back vec4 in [0, 1]. Matches the convention adopted by the
  // scatter / candlestick / heatmap WebGL programs.
  colors: Uint8Array;
  cornerRadii: Float32Array;
  count: number;
}

const EMPTY_FLOAT32 = new Float32Array(0);
const EMPTY_UINT8 = new Uint8Array(0);
const EMPTY_DATA: WebGLBarLikePlotData = {
  centers: EMPTY_FLOAT32,
  halfSizes: EMPTY_FLOAT32,
  colors: EMPTY_UINT8,
  cornerRadii: EMPTY_FLOAT32,
  count: 0,
};

interface ArrayPool {
  centers: Float32Array;
  halfSizes: Float32Array;
  colors: Uint8Array;
  cornerRadii: Float32Array;
}

function ensureCapacity(pool: ArrayPool | null, maxCount: number): ArrayPool {
  if (pool !== null && pool.colors.length >= maxCount * 4) {
    return pool;
  }
  return {
    centers: new Float32Array(maxCount * 2),
    halfSizes: new Float32Array(maxCount * 2),
    colors: new Uint8Array(maxCount * 4),
    cornerRadii: new Float32Array(maxCount * 4),
  };
}

// Mirrors SVG highlight styling: highlighted -> CSS `brightness(120%)`,
// faded -> opacity 0.3. Baking these into the per-bar color array means we
// don't need a separate per-instance attribute on the GPU side.
const HIGHLIGHTED_BRIGHTNESS = 1.2;
const FADED_OPACITY = 0.3;
// Band pitch (in CSS pixels) at which we switch from per-bar rendering to a
// min/max envelope per pixel column. The visible moire kicks in before
// adjacent bars fully overlap, because pixel-grid phase drift starts losing
// bars as soon as their width approaches one pixel. Cutting over at two
// pixels covers the transition.
const DENSE_MODE_PITCH_PX = 1;

function setCornerRadii(
  radius: number,
  side: BorderRadiusSide | undefined,
  fullRounded: boolean,
  target: Float32Array,
  offset: number,
) {
  // CSS order: top-left, top-right, bottom-right, bottom-left.
  let tl = 0;
  let tr = 0;
  let br = 0;
  let bl = 0;

  if (radius > 0) {
    if (fullRounded) {
      tl = radius;
      tr = radius;
      br = radius;
      bl = radius;
    } else if (side === 'top') {
      tl = radius;
      tr = radius;
    } else if (side === 'bottom') {
      br = radius;
      bl = radius;
    } else if (side === 'left') {
      tl = radius;
      bl = radius;
    } else if (side === 'right') {
      tr = radius;
      br = radius;
    }
  }

  target[offset] = tl;
  target[offset + 1] = tr;
  target[offset + 2] = br;
  target[offset + 3] = bl;
}

export interface UseWebGLBarLikePlotDataOptions {
  /**
   * Series identifier passed to the highlight selector. Allows the shared
   * implementation to be used for both `'bar'` and `'rangeBar'` series.
   */
  highlightType: 'bar' | 'rangeBar';
  /**
   * When true, the border radius is applied to all four corners regardless of
   * the per-item `borderRadiusSide` value. Range bars use this since they
   * aren't stacked.
   */
  fullRoundedCorners?: boolean;
}

export function useWebGLBarLikePlotData<T extends WebGLBarLikeItem>(
  drawingArea: ChartDrawingArea,
  completedData: readonly WebGLBarLikeSeries<T>[],
  borderRadius: number,
  options: UseWebGLBarLikePlotDataOptions,
): WebGLBarLikePlotData {
  const store = useStore();
  const getHighlightState = store.use(selectorChartsHighlightStateCallback);
  const poolRef = React.useRef<ArrayPool | null>(null);

  const { highlightType, fullRoundedCorners = false } = options;

  return React.useMemo(() => {
    let maxCount = 0;
    for (let s = 0; s < completedData.length; s += 1) {
      maxCount += completedData[s].data.length;
    }

    if (maxCount === 0) {
      return EMPTY_DATA;
    }

    const pool = ensureCapacity(poolRef.current, maxCount);
    poolRef.current = pool;

    // Hoist invariants out of the hot loop.
    const { centers, halfSizes, colors, cornerRadii } = pool;
    const drawingAreaLeft = drawingArea.left;
    const drawingAreaTop = drawingArea.top;

    let cursor = 0;

    for (let s = 0; s < completedData.length; s += 1) {
      const processed = completedData[s];
      const seriesId = processed.seriesId;
      const data = processed.data;
      const dataLength = data.length;
      // In horizontal layout the band direction is y; otherwise it's x.
      const bandIsY = processed.layout === 'horizontal';

      // Find the first visible bar to size up the series. Bars in a band
      // series share the same band pitch, so peeking at one is enough.
      let probe: T | null = null;
      for (let i = 0; i < dataLength; i += 1) {
        const candidate = data[i];
        if (
          !candidate.hidden &&
          candidate.value != null &&
          candidate.width > 0 &&
          candidate.height > 0
        ) {
          probe = candidate;
          break;
        }
      }
      if (probe === null) {
        continue;
      }

      const bandPitch = bandIsY ? probe.height : probe.width;
      // When the band pitch drops below a couple of pixels, adjacent bars
      // compete for the same pixel column. Per-bar rasterization produces
      // moire patterns (the rasterizer drops bars whose quad falls between
      // two pixel centers) and we can't show meaningful per-bar highlights
      // at that density anyway. Collapse the series into a min/max envelope
      // instead -- one rect per pixel column spanning the union of every
      // bar that lands in that column, like an area chart.
      if (bandPitch < DENSE_MODE_PITCH_PX) {
        // Series-level highlight: dense mode loses individual dataIndex
        // resolution, so query once with the probe and apply the result to
        // every emitted column.
        const seriesHighlight = getHighlightState({
          type: highlightType,
          seriesId,
          dataIndex: probe.dataIndex,
        });
        const rgba = parseColor(probe.color);
        let r = rgba[0];
        let g = rgba[1];
        let b = rgba[2];
        let a = rgba[3];
        if (seriesHighlight === 'highlighted') {
          r = Math.min(255, r * HIGHLIGHTED_BRIGHTNESS);
          g = Math.min(255, g * HIGHLIGHTED_BRIGHTNESS);
          b = Math.min(255, b * HIGHLIGHTED_BRIGHTNESS);
        } else if (seriesHighlight === 'faded') {
          a *= FADED_OPACITY;
        }

        // Aggregate each bar into every pixel column its band-axis range
        // overlaps. Bucketing on the center column alone leaves gaps when a
        // bar straddles two columns -- the column the center misses ends up
        // empty even though the bar physically covers it. The Map exists
        // only to dedupe columns; the actual data lives in parallel arrays
        // indexed by slot so emission can iterate a plain numeric range
        // without re-entering the Map.
        const columnSlot = new Map<number, number>();
        const slotCols: number[] = [];
        const slotLow: number[] = [];
        const slotHigh: number[] = [];
        for (let i = 0; i < dataLength; i += 1) {
          const bar = data[i];
          if (bar.hidden || bar.value == null || bar.width <= 0 || bar.height <= 0) {
            continue;
          }
          const bandLo = bandIsY ? bar.y - drawingAreaTop : bar.x - drawingAreaLeft;
          const bandHi = bandLo + (bandIsY ? bar.height : bar.width);
          const lo = bandIsY ? bar.x : bar.y;
          const hi = bandIsY ? bar.x + bar.width : bar.y + bar.height;
          const startCol = Math.floor(bandLo);
          // Subtract a hair so bars whose band-axis high lands exactly on a
          // column boundary don't claim the next (empty) column.
          const endCol = Math.floor(bandHi - 1e-6);
          for (let col = startCol; col <= endCol; col += 1) {
            const slot = columnSlot.get(col);
            if (slot === undefined) {
              columnSlot.set(col, slotCols.length);
              slotCols.push(col);
              slotLow.push(lo);
              slotHigh.push(hi);
            } else {
              if (lo < slotLow[slot]) {
                slotLow[slot] = lo;
              }
              if (hi > slotHigh[slot]) {
                slotHigh[slot] = hi;
              }
            }
          }
        }

        for (let k = 0; k < slotCols.length; k += 1) {
          const col = slotCols[k];
          const lo = slotLow[k];
          const hi = slotHigh[k];
          const valueCenter = (lo + hi) * 0.5;
          const valueHalf = (hi - lo) * 0.5;

          const c2 = cursor * 2;
          if (bandIsY) {
            centers[c2] = valueCenter - drawingAreaLeft;
            centers[c2 + 1] = col + 0.5;
            halfSizes[c2] = valueHalf;
            halfSizes[c2 + 1] = 0.5;
          } else {
            centers[c2] = col + 0.5;
            centers[c2 + 1] = valueCenter - drawingAreaTop;
            halfSizes[c2] = 0.5;
            halfSizes[c2 + 1] = valueHalf;
          }

          const c4 = cursor * 4;
          colors[c4] = r;
          colors[c4 + 1] = g;
          colors[c4 + 2] = b;
          colors[c4 + 3] = a;

          // Adjacent columns share edges in dense mode; rounded corners
          // would only show at series start/end, not worth the bookkeeping.
          cornerRadii[c4] = 0;
          cornerRadii[c4 + 1] = 0;
          cornerRadii[c4 + 2] = 0;
          cornerRadii[c4 + 3] = 0;

          cursor += 1;
        }

        continue;
      }

      for (let i = 0; i < dataLength; i += 1) {
        const bar = data[i];

        if (bar.hidden) {
          continue;
        }
        const value = bar.value;
        if (value == null) {
          continue;
        }
        const w = bar.width;
        const h = bar.height;
        if (w <= 0 || h <= 0) {
          continue;
        }

        const halfW = w * 0.5;
        const halfH = h * 0.5;

        const c2 = cursor * 2;
        centers[c2] = bar.x + halfW - drawingAreaLeft;
        centers[c2 + 1] = bar.y + halfH - drawingAreaTop;
        halfSizes[c2] = halfW;
        halfSizes[c2 + 1] = halfH;

        const rgba = parseColor(bar.color);
        const c4 = cursor * 4;
        let r = rgba[0];
        let g = rgba[1];
        let b = rgba[2];
        let a = rgba[3];

        const highlightState = getHighlightState({
          type: highlightType,
          seriesId,
          dataIndex: bar.dataIndex,
        });
        if (highlightState === 'highlighted') {
          r = Math.min(255, r * HIGHLIGHTED_BRIGHTNESS);
          g = Math.min(255, g * HIGHLIGHTED_BRIGHTNESS);
          b = Math.min(255, b * HIGHLIGHTED_BRIGHTNESS);
        } else if (highlightState === 'faded') {
          a *= FADED_OPACITY;
        }
        colors[c4] = r;
        colors[c4 + 1] = g;
        colors[c4 + 2] = b;
        colors[c4 + 3] = a;

        const effectiveRadius = Math.min(borderRadius, halfW, halfH);
        setCornerRadii(effectiveRadius, bar.borderRadiusSide, fullRoundedCorners, cornerRadii, c4);

        cursor += 1;
      }
    }

    if (cursor === 0) {
      return EMPTY_DATA;
    }

    // Return fresh subarray views over the pooled buffers. New view refs each call
    // (so React memoisation is correct and consumers can detect a change), but no
    // new bytes allocated on the JS heap. The GPU upload short-circuits via the
    // `lastUploaded === data` ref check on the program side when we hand the
    // exact same view back across renders -- it won't fire here since each call
    // produces a new view, but the contents have changed anyway in that case.
    return {
      centers: new Float32Array(centers.buffer, centers.byteOffset, cursor * 2),
      halfSizes: new Float32Array(halfSizes.buffer, halfSizes.byteOffset, cursor * 2),
      colors: new Uint8Array(colors.buffer, colors.byteOffset, cursor * 4),
      cornerRadii: new Float32Array(cornerRadii.buffer, cornerRadii.byteOffset, cursor * 4),
      count: cursor,
    };
  }, [
    borderRadius,
    completedData,
    drawingArea.left,
    drawingArea.top,
    getHighlightState,
    highlightType,
    fullRoundedCorners,
  ]);
}
