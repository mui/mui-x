'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useChartsContext } from '../../context/ChartsProvider/useChartsContext';
import type { UseChartInteractionSignature } from '../../internals/plugins/featurePlugins/useChartInteraction';
import type { SeriesId, SeriesItemIdentifierWithType } from '../../models/seriesType';

/**
 * Reports the radar item under the pointer.
 *
 * The item has to be cleared with the same identifier it was set with. `useInteractionAllItemProps`
 * only knows the series, since `dataIndex` sits on the points rather than on the series entry, so
 * its `onPointerLeave` clears an index-less identifier that never matches the one reported here.
 * The hovered item would then survive the pointer leaving, and be resolved by the next click.
 */
export function useRadarHoveredItem() {
  const { instance } = useChartsContext<[UseChartInteractionSignature]>();
  const reportedRef = React.useRef(new Map<SeriesId, SeriesItemIdentifierWithType<'radar'>>());

  const reportHoveredItem = useEventCallback((seriesId: SeriesId, dataIndex: number) => {
    const item = { type: 'radar', seriesId, dataIndex } as SeriesItemIdentifierWithType<'radar'>;
    reportedRef.current.set(seriesId, item);
    instance.setHoveredItem?.(item);
  });

  const clearHoveredItem = useEventCallback((seriesId: SeriesId) => {
    const item = reportedRef.current.get(seriesId);
    if (item === undefined) {
      return;
    }
    reportedRef.current.delete(seriesId);
    instance.clearHoveredItem?.(item);
  });

  return { reportHoveredItem, clearHoveredItem };
}
