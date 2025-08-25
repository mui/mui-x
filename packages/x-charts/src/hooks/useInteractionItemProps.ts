'use client';
import * as React from 'react';
import { SeriesItemIdentifierWithData } from '../models';
import { useChartContext } from '../context/ChartProvider';
import { UseChartHighlightSignature } from '../plugins/featurePlugins/useChartHighlight';
import { UseChartInteractionSignature } from '../plugins/featurePlugins/useChartInteraction';
import { ChartSeriesType, type ChartItemIdentifierWithData } from '../models/seriesType/config';
import { ChartInstance } from '../plugins/models';

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

  const onPointerEnter = React.useCallback(() => {
    interactionActive.current = true;
    instance.setItemInteraction(data);
    instance.setHighlight(data);
  }, [instance, data]);

  const onPointerLeave = React.useCallback(() => {
    interactionActive.current = false;
    instance.removeItemInteraction(data);
    instance.clearHighlight();
  }, [instance, data]);

  React.useEffect(() => {
    return () => {
      /* Clean up state if this item is unmounted while active. */
      if (interactionActive.current) {
        onPointerLeave();
      }
    };
  }, [onPointerLeave]);

  if (skip) {
    return {};
  }

  return {
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
  };
};

export const useInteractionAllItemProps = (
  data: SeriesItemIdentifierWithData[],
  skip?: boolean,
) => {
  const { instance } =
    useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();

  const results = React.useMemo(() => {
    return data.map((item) => {
      return skip ? {} : getInteractionItemProps(instance, item);
    });
  }, [data, instance, skip]);

  return results;
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
    instance.setItemInteraction(item);
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
