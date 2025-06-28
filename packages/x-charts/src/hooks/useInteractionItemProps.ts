'use client';
import * as React from 'react';
import { SeriesItemIdentifier } from '../models';
import { useChartContext } from '../context/ChartProvider';
import { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { ChartItemIdentifier, ChartSeriesType } from '../models/seriesType/config';
import { ChartInstance } from '../internals/plugins/models';

function onPointerDown(event: React.PointerEvent) {
  if (
    'hasPointerCapture' in event.currentTarget &&
    event.currentTarget.hasPointerCapture(event.pointerId)
  ) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
}

export const useInteractionItemProps = (
  data: SeriesItemIdentifier,
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
    instance.setItemInteraction({
      type: data.type,
      seriesId: data.seriesId,
      dataIndex: data.dataIndex,
    } as SeriesItemIdentifier);
    instance.setHighlight({
      seriesId: data.seriesId,
      dataIndex: data.dataIndex,
    });
  }, [instance, data.type, data.seriesId, data.dataIndex]);

  const onPointerLeave = React.useCallback(() => {
    interactionActive.current = false;
    instance.removeItemInteraction({
      type: data.type,
      seriesId: data.seriesId,
      dataIndex: data.dataIndex,
    } as SeriesItemIdentifier);
    instance.clearHighlight();
  }, [instance, data.type, data.seriesId, data.dataIndex]);

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

export const useInteractionAllItemProps = (data: SeriesItemIdentifier[], skip?: boolean) => {
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
  item: ChartItemIdentifier<ChartSeriesType>,
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
    instance.setHighlight({
      seriesId: item.seriesId,
      dataIndex: item.dataIndex,
    });
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
