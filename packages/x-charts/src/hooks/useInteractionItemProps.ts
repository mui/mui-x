'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { type SeriesItemIdentifierWithData } from '../models';
import { useChartContext } from '../context/ChartProvider';
import { type UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { type UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import {
  type ChartSeriesType,
  type ChartItemIdentifierWithData,
} from '../models/seriesType/config';
import { type ChartInstance } from '../internals/plugins/models';

function onPointerDown(event: React.PointerEvent) {
  if (
    'hasPointerCapture' in event.currentTarget &&
    event.currentTarget.hasPointerCapture(event.pointerId)
  ) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
}

export const useInteractionItemProps = (
  data: SeriesItemIdentifierWithData,
  skip?: boolean,
): {
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onPointerDown?: (event: React.PointerEvent) => void;
} => {
  const { instance } =
    useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();
  const interactionActive = React.useRef(false);
  const onPointerEnter = useEventCallback(() => {
    interactionActive.current = true;
    instance.setItemInteraction(data, { interaction: 'pointer' });
    instance.setHighlight(data);
  });

  const onPointerLeave = useEventCallback(() => {
    interactionActive.current = false;
    instance.removeItemInteraction(data);
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

export function getInteractionItemProps(
  instance: ChartInstance<[UseChartInteractionSignature, UseChartHighlightSignature]>,
  item: ChartItemIdentifierWithData<ChartSeriesType>,
): {
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onPointerDown?: (event: React.PointerEvent) => void;
} {
  function onPointerEnter() {
    if (!item) {
      return;
    }
    instance.setItemInteraction(item, { interaction: 'pointer' });
    instance.setHighlight(item);
  }

  function onPointerLeave() {
    if (!item) {
      return;
    }
    instance.removeItemInteraction(item);
    instance.clearHighlight();
  }

  return {
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
  };
}
