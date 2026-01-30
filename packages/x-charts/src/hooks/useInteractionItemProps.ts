'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { type SeriesItemIdentifierWithData } from '../models';
import { useChartContext } from '../context/ChartProvider';
import type { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import type { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { SeriesItemIdentifier } from '../models/seriesType';
import type { ChartInstance } from '../internals/plugins/models';
import type { UseChartTooltipSignature } from '../internals/plugins/featurePlugins/useChartTooltip';

function onPointerDown(event: React.PointerEvent) {
  if (
    'hasPointerCapture' in event.currentTarget &&
    event.currentTarget.hasPointerCapture(event.pointerId)
  ) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
}

export const useInteractionItemProps = <ChartSeries extends ChartSeriesType>(
  data: SeriesItemIdentifierWithData<ChartSeries>,
  skip?: boolean,
): {
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onPointerDown?: (event: React.PointerEvent) => void;
} => {
  const { instance } =
    useChartContext<
      [
        UseChartInteractionSignature,
        UseChartHighlightSignature<ChartSeries>,
        UseChartTooltipSignature,
      ]
    >();
  const interactionActive = React.useRef(false);
  const onPointerEnter = useEventCallback(() => {
    interactionActive.current = true;
    instance.setLastUpdateSource('pointer');
    instance.setTooltipItem(data);
    instance.setHighlight(data);
  });

  const onPointerLeave = useEventCallback(() => {
    interactionActive.current = false;
    instance.removeTooltipItem(data);
    instance.clearHighlight();
  });

  React.useEffect(() => {
    return () => {
      /* Clean up state if this item is unmounted while active. */
      if (interactionActive.current) {
        onPointerLeave();
      }
    };
  }, [onPointerLeave]);

  return React.useMemo(
    () =>
      skip
        ? {}
        : {
            onPointerEnter,
            onPointerLeave,
            onPointerDown,
          },
    [skip, onPointerEnter, onPointerLeave],
  );
};

export function getInteractionItemProps<SeriesType extends ChartSeriesType>(
  instance: ChartInstance<
    [UseChartInteractionSignature, UseChartHighlightSignature<SeriesType>, UseChartTooltipSignature]
  >,
  item: SeriesItemIdentifier<SeriesType>,
): {
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onPointerDown?: (event: React.PointerEvent) => void;
} {
  function onPointerEnter() {
    if (!item) {
      return;
    }
    instance.setLastUpdateSource('pointer');
    instance.setTooltipItem(item);
    instance.setHighlight(item);
  }

  function onPointerLeave() {
    if (!item) {
      return;
    }
    instance.removeTooltipItem(item);
    instance.clearHighlight();
  }

  return {
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
  };
}
