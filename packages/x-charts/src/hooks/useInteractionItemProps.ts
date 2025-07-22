'use client';
import * as React from 'react';
import { SeriesItemIdentifier } from '../models';
import { useChartContext } from '../context/ChartProvider';
import { UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';
import { ChartItemIdentifier, ChartSeriesType } from '../models/seriesType/config';
import { ChartInstance } from '../internals/plugins/models';
import { getSVGPoint, SeriesId } from '../internals';

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

interface Point {
  x: number;
  y: number;
}

class SpatialGrid {
  private grid = new Map<string, Point[]>();

  private dataIndex = new Map<string, number>();

  private cellSize: number;

  constructor(points: Point[], cellSize = 50) {
    this.cellSize = cellSize;
    this.buildGrid(points);
  }

  private buildGrid(points: Point[]) {
    points.forEach((point, i) => {
      const key = this.getGridKey(point.x, point.y);
      if (!this.grid.has(key)) {
        this.grid.set(key, []);
        this.dataIndex.set(key, i);
      }
      this.grid.get(key)!.push(point);
    });
  }

  private getGridKey(x: number, y: number): string {
    return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
  }

  findNearestPoint(x: number, y: number, threshold = 10): number | undefined {
    // Check only nearby cells
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);

    // Check 3x3 grid around the point
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = -1; dy <= 1; dy += 1) {
        const key = `${cellX + dx},${cellY + dy}`;
        const cellPoints = this.grid.get(key);

        if (cellPoints) {
          for (const point of cellPoints) {
            const distSq = (point.x - x) ** 2 + (point.y - y) ** 2;
            if (distSq <= threshold ** 2) {
              return this.dataIndex.get(key);
            }
          }
        }
      }
    }

    return undefined;
  }
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

  const grid = React.useMemo(
    () =>
      new SpatialGrid(
        skip
          ? []
          : seriesData.map((point) => ({
              x: getXPosition(point.x),
              y: getYPosition(point.y),
            })),
        markerSize,
      ),
    [getXPosition, getYPosition, markerSize, seriesData, skip],
  );

  return React.useMemo(() => {
    if (skip) {
      return undefined;
    }

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

      const point = getSVGPoint(element, event);
      const dataIndex = grid.findNearestPoint(point.x, point.y);
      console.log('Nearest point:', dataIndex);

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
  }, [grid, instance, seriesId, skip, svgRef]);
}
