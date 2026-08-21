'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useChartsContext } from '../../context/ChartsProvider/useChartsContext';
import type { UseChartInteractionSignature } from '../../internals/plugins/featurePlugins/useChartInteraction';
import type { SeriesId } from '../../models/seriesType';

interface RadarPointerProps {
  onPointerMove?: (event: React.PointerEvent<any>) => void;
  onPointerDown?: (event: React.PointerEvent<any>) => void;
  onPointerLeave?: (event: React.PointerEvent<any>) => void;
}

/**
 * Pointer props reporting the radar item under the pointer.
 *
 * The item is cleared with the identifier it was set with: `clearHoveredItem` ignores one that
 * does not match, and `useInteractionAllItemProps` only knows the series, so its `onPointerLeave`
 * can not clear the per-point item reported here.
 *
 * The returned props chain `base`, so the handlers a caller already has keep running.
 */
export function useRadarHoveredItem() {
  const { instance } = useChartsContext<[UseChartInteractionSignature]>();
  const reportedRef = React.useRef(new Map<SeriesId, number>());

  const report = useEventCallback((seriesId: SeriesId, dataIndex: number) => {
    reportedRef.current.set(seriesId, dataIndex);
    instance.setHoveredItem?.({ type: 'radar', seriesId, dataIndex });
  });

  // An explicit `dataIndex` only clears the item it reported, whatever order the events arrive in.
  const clear = useEventCallback((seriesId: SeriesId, dataIndex?: number) => {
    const reported = reportedRef.current.get(seriesId);
    if (reported === undefined || (dataIndex !== undefined && reported !== dataIndex)) {
      return;
    }
    reportedRef.current.delete(seriesId);
    instance.clearHoveredItem?.({ type: 'radar', seriesId, dataIndex: reported });
  });

  // The area only knows its series, so the index comes from the angle.
  const getAreaPointerProps = (
    seriesId: SeriesId,
    getDataIndex: (event: React.PointerEvent<any>) => number,
    base?: RadarPointerProps,
  ): RadarPointerProps => ({
    // Bound to `pointerdown` too, since a touch tap may never produce a `pointermove`.
    onPointerMove: (event) => {
      base?.onPointerMove?.(event);
      report(seriesId, getDataIndex(event));
    },
    onPointerDown: (event) => {
      base?.onPointerDown?.(event);
      report(seriesId, getDataIndex(event));
    },
    onPointerLeave: (event) => {
      base?.onPointerLeave?.(event);
      clear(seriesId);
    },
  });

  // Clickable marks hide the area underneath, so they report their own index.
  const getMarkPointerProps = (
    seriesId: SeriesId,
    dataIndex: number,
    base?: RadarPointerProps,
  ): RadarPointerProps => ({
    onPointerMove: (event) => {
      base?.onPointerMove?.(event);
      report(seriesId, dataIndex);
    },
    onPointerDown: (event) => {
      base?.onPointerDown?.(event);
      report(seriesId, dataIndex);
    },
    onPointerLeave: (event) => {
      base?.onPointerLeave?.(event);
      clear(seriesId, dataIndex);
    },
  });

  return { getAreaPointerProps, getMarkPointerProps };
}
