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

export const useInteractionItemProps = (data: SeriesItemIdentifier, skip?: boolean) => {
  const { instance } =
    useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();

  const onPointerEnter = React.useCallback(() => {
    if (!data) {
      return;
    }
    instance.setItemInteraction(data);
    instance.setHighlight({
      seriesId: data.seriesId,
      dataIndex: data.dataIndex,
    });
  }, [instance, data]);

  const onPointerLeave = React.useCallback(() => {
    if (!data) {
      return;
    }
    instance.removeItemInteraction(data);
    instance.clearHighlight();
  }, [instance, data]);

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
      if (skip) {
        return {};
      }

      const onPointerEnter = () => {
        if (!item) {
          return;
        }
        instance.setItemInteraction(item);
        instance.setHighlight({
          seriesId: item.seriesId,
          dataIndex: item.dataIndex,
        });
      };

      const onPointerLeave = () => {
        if (!item) {
          return;
        }
        instance.removeItemInteraction(item);
        instance.clearHighlight();
      };

      return {
        onPointerEnter,
        onPointerLeave,
        onPointerDown,
      };
    });
  }, [data, instance, skip]);

  return results;
};
