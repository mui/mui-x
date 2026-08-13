'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useChartsContext } from '../../context/ChartsProvider/useChartsContext';
import type { UseChartInteractionSignature } from '../../internals/plugins/featurePlugins/useChartInteraction';
import type { SeriesId, SeriesItemIdentifierWithType } from '../../models/seriesType';

/**
 * Reports the radar item under the pointer, and clears it with the identifier it was set with.
 *
 * `clearHoveredItem` ignores an identifier that does not match the stored one, and
 * `useInteractionAllItemProps` only knows the series, so its `onPointerLeave` can not clear the
 * per-point item reported here.
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
