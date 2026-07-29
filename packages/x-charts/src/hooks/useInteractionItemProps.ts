'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useChartsContext } from '../context/ChartsProvider';
import type { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import type { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { FocusedItemIdentifier, SeriesItemIdentifierWithType } from '../models/seriesType';
import type { ChartInstance } from '../internals/plugins/models';
import type { UseChartTooltipSignature } from '../internals/plugins/featurePlugins/useChartTooltip';
import type { UseChartKeyboardNavigationSignature } from '../internals/plugins/featurePlugins/useChartKeyboardNavigation';

type InteractionItemSignatures<SeriesType extends ChartSeriesType> = [
  UseChartInteractionSignature,
  UseChartHighlightSignature<SeriesType>,
  UseChartTooltipSignature,
  UseChartKeyboardNavigationSignature,
];

export interface InteractionItemOptions {
  /**
   * Click handler of the consumer, called after the item took the keyboard focus.
   * @param {React.MouseEvent} event The click event.
   */
  onClick?: (event: React.MouseEvent<any>) => void;
}

export interface InteractionItemProps {
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onPointerDown?: (event: React.PointerEvent) => void;
  onClick?: (event: React.MouseEvent<any>) => void;
}

function onPointerDown(event: React.PointerEvent) {
  if (
    'hasPointerCapture' in event.currentTarget &&
    event.currentTarget.hasPointerCapture(event.pointerId)
  ) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
}

export const useInteractionItemProps = <SeriesType extends ChartSeriesType>(
  data: SeriesItemIdentifierWithType<SeriesType>,
  options?: InteractionItemOptions,
): InteractionItemProps => {
  const { instance } = useChartsContext<InteractionItemSignatures<SeriesType>>();
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

  const onClick = useEventCallback((event: React.MouseEvent<any>) => {
    instance.focusItem?.(data as unknown as FocusedItemIdentifier<SeriesType>);
    options?.onClick?.(event);
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
    () => ({
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onClick,
    }),
    [onPointerEnter, onPointerLeave, onClick],
  );
};

export function getInteractionItemProps<SeriesType extends ChartSeriesType>(
  instance: ChartInstance<InteractionItemSignatures<SeriesType>>,
  item: SeriesItemIdentifierWithType<SeriesType>,
  options?: InteractionItemOptions,
): InteractionItemProps {
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

  function onClick(event: React.MouseEvent<any>) {
    if (item) {
      instance.focusItem?.(item as unknown as FocusedItemIdentifier<SeriesType>);
    }
    options?.onClick?.(event);
  }

  return {
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
    onClick,
  };
}
