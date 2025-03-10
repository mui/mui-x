'use client';
import * as React from 'react';
import { SeriesItemIdentifier } from '../models';
import { useChartContext } from '../context/ChartProvider';
import { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';

const onPointerDown = (event: React.PointerEvent) => {
  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
};

export const useInteractionItemProps = (skip?: boolean) => {
  const { instance } =
    useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();
  const dataRef = React.useRef<SeriesItemIdentifier | null>(null);

  const onPointerEnter = React.useCallback(() => {
    if (!dataRef.current) {
      return;
    }
    instance.setItemInteraction(dataRef.current);
    instance.setHighlight({
      seriesId: dataRef.current.seriesId,
      dataIndex: dataRef.current.dataIndex,
    });
  }, [instance]);

  const onPointerLeave = React.useCallback(() => {
    if (!dataRef.current) {
      return;
    }
    instance.removeItemInteraction(dataRef.current);
    instance.clearHighlight();
  }, [instance]);

  const getInteractionItemProps = React.useMemo(() => {
    if (skip) {
      return () => ({});
    }
    return (data: SeriesItemIdentifier) => {
      dataRef.current = data;
      return {
        onPointerEnter,
        onPointerLeave,
        onPointerDown,
      };
    };
  }, [skip, onPointerEnter, onPointerLeave]);

  return getInteractionItemProps;
};
