'use client';
import { useRegisterItemActivation } from '../../internals/useRegisterItemActivation';
import type { SeriesId } from '../../models/seriesType/common';
import type { RadarItemIdentifier } from '../../models/seriesType/radar';
import type { ChartsReactClickEvent } from '../../models/events';

/**
 * Registers <kbd>Enter</kbd>/<kbd>Space</kbd> activation of the focused radar item.
 */
export function useRegisterRadarItemActivation(
  seriesId: SeriesId | undefined,
  onItemClick:
    | ((
        event: ChartsReactClickEvent<SVGElement>,
        radarItemIdentifier: Required<RadarItemIdentifier>,
      ) => void)
    | undefined,
) {
  useRegisterItemActivation(
    { type: 'radar', seriesId },
    onItemClick &&
      ((event, item) =>
        onItemClick(event, {
          type: 'radar',
          seriesId: item.seriesId,
          dataIndex: item.dataIndex,
        })),
  );
}
