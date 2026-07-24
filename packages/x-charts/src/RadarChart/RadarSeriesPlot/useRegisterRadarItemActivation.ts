'use client';
import { useRegisterItemActivation } from '../../internals/useRegisterItemActivation';
import type { SeriesId } from '../../models/seriesType/common';
import type { RadarItemIdentifier } from '../../models/seriesType/radar';

/**
 * Priorities matching the pointer hit-testing order: marks sit above areas.
 * The topmost callback a pointer would reach is the one keyboard activation fires.
 */
export const RADAR_ACTIVATION_PRIORITY = { mark: 2, area: 1 };

/**
 * Registers <kbd>Enter</kbd>/<kbd>Space</kbd> activation of the focused radar item.
 */
export function useRegisterRadarItemActivation(
  seriesId: SeriesId | undefined,
  onItemClick:
    | ((
        event: React.MouseEvent<SVGElement, MouseEvent>,
        radarItemIdentifier: Required<RadarItemIdentifier>,
      ) => void)
    | undefined,
  priority: number,
) {
  useRegisterItemActivation(
    { type: 'radar', seriesId, priority },
    onItemClick &&
      ((event, item) =>
        onItemClick(event, {
          type: 'radar',
          seriesId: item.seriesId,
          dataIndex: item.dataIndex,
        })),
  );
}
