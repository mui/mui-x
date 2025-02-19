'use client';
import * as React from 'react';
import { SeriesItemIdentifier } from '../models';
import { useChartContext } from '../context/ChartProvider';
import { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';

export const useInteractionItemProps = (skip?: boolean) => {
  const { instance } =
    useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();

  if (skip) {
    return () => ({});
  }
  const getInteractionItemProps = (data: SeriesItemIdentifier) => {
    const onPointerDown = (event: React.PointerEvent) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    };
    const onPointerEnter = () => {
      instance.setItemInteraction(data);
      instance.setHighlight({
        seriesId: data.seriesId,
        dataIndex: data.dataIndex,
      });
    };
    const onPointerLeave = (event: React.PointerEvent) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      instance.removeItemInteraction(data);
      instance.clearHighlight();
    };
    return {
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
    };
  };
  return getInteractionItemProps;
};
