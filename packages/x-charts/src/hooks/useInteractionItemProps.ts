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

export const useInteractionItemProps = <SeriesType extends ChartSeriesType>(
  data: SeriesItemIdentifierWithData<SeriesType>,
  skip?: boolean,
): {
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onPointerDown?: (event: React.PointerEvent) => void;
} => {
  const { instance } =
    useChartContext<
      [UseChartInteractionSignature, UseChartHighlightSignature, UseChartTooltipSignature]
    >();
  const interactionActive = React.useRef(false);
  const onPointerEnter = useEventCallback(() => {
    interactionActive.current = true;
    instance.setLastUpdateSource('pointer');
    instance.setTooltipItem(data);
    // TODO: uniformize sankey and other types to get a single plugin
    instance.setHighlight(
      // @ts-ignore
      data.type === 'sankey' ? data : { seriesId: data.seriesId, dataIndex: data.dataIndex },
    );
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

export function getInteractionItemProps(
  instance: ChartInstance<
    [UseChartInteractionSignature, UseChartHighlightSignature, UseChartTooltipSignature]
  >,
  item: SeriesItemIdentifier<ChartSeriesType>,
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
    instance.setHighlight(
      // @ts-ignore
      item.type === 'sankey' ? item : { seriesId: item.seriesId, dataIndex: item.dataIndex },
    );
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
