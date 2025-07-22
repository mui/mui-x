'use client';
import * as React from 'react';
import { quadtree } from '@mui/x-charts-vendor/d3-quadtree';
import { SeriesItemIdentifier } from '../models';
import { useChartContext } from '../context/ChartProvider';
import { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { ChartItemIdentifier, ChartSeriesType } from '../models/seriesType/config';
import { ChartInstance } from '../internals/plugins/models';
import { getSVGPoint } from '../internals/getSVGPoint';
import { SeriesId } from '../models/seriesType/common';

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

export function useInteractionGroupProps(
  seriesId: SeriesId,
  seriesData: readonly { x: number; y: number }[],
  getXPosition: (x: number) => number,
  getYPosition: (y: number) => number,
  markerSize: number,
  skip: boolean,
) {
  const { svgRef, instance } =
    useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();

  const qt = React.useMemo(
    () =>
      skip
        ? null
        : quadtree(
            seriesData as { dataIndex: number; x: number; y: number }[],
            (d) => getXPosition(d.x),
            (d) => getYPosition(d.y),
          ),
    [getXPosition, getYPosition, seriesData, skip],
  );

  return React.useMemo(() => {
    if (skip) {
      return undefined;
    }

    const map = new Map();
    seriesData.forEach((item, i) => map.set(item, i));

    function onPointerLeave() {
      instance.removeItemInteraction();
      instance.clearHighlight();
    }

    function onPointerMove(event: React.PointerEvent<SVGGElement>) {
      const element = svgRef.current;

      if (!element) {
        instance.removeItemInteraction();
        instance.clearHighlight();
        return;
      }

      const svgPoint = getSVGPoint(element, event);
      const point = qt!.find(svgPoint.x, svgPoint.y, markerSize);
      const dataIndex = point === undefined ? undefined : map.get(point);

      if (dataIndex === undefined) {
        instance.removeItemInteraction();
        instance.clearHighlight();
      } else {
        const item = { type: 'scatter' as const, seriesId, dataIndex };
        instance.setItemInteraction(item);
        instance.setHighlight(item);
      }
    }

    return { onPointerMove, onPointerLeave };
  }, [instance, markerSize, qt, seriesData, seriesId, skip, svgRef]);
}
