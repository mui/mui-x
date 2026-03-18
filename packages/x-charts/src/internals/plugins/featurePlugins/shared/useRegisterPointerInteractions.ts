'use client';
import * as React from 'react';
import { useChartsLayerContainerRef } from '../../../../hooks';
import { type UseChartTooltipSignature } from '../../featurePlugins/useChartTooltip';
import { type SeriesItemIdentifierWithType } from '../../../../models/seriesType';
import { type ChartSeriesType } from '../../../../models/seriesType/config';
import { type UseChartInteractionSignature } from '../useChartInteraction';
import { type UseChartHighlightSignature } from '../useChartHighlight';
import { useStore } from '../../../store/useStore';
import { useChartContext } from '../../../../context/ChartProvider';
import { getChartPoint } from '../../../getChartPoint';

/**
 * Hook that registers pointer interaction handlers on the chart container.
 * It iterates through all series configs' `getItemAtPosition` to find which
 * item is at the pointer position and updates highlight/tooltip state accordingly.
 */
export function useRegisterPointerInteractions() {
  const { instance } =
    useChartContext<
      [
        UseChartInteractionSignature,
        UseChartHighlightSignature<ChartSeriesType>,
        UseChartTooltipSignature,
      ]
    >();
  const chartsLayerContainerRef = useChartsLayerContainerRef();
  const store = useStore();

  const interactionActive = React.useRef(false);
  const lastItemRef = React.useRef<SeriesItemIdentifierWithType<ChartSeriesType> | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const element = chartsLayerContainerRef.current;

    if (!element) {
      return undefined;
    }

    const hasGetItemAtPosition = Object.values(store.state.seriesConfig.config).some(
      (config) => config.getItemAtPosition != null,
    );

    if (!hasGetItemAtPosition) {
      return undefined;
    }

    function onPointerEnter() {
      interactionActive.current = true;
    }

    function reset() {
      const lastItem = lastItemRef.current;

      if (lastItem) {
        lastItemRef.current = undefined;
        instance.removeTooltipItem(lastItem);
        instance.clearHighlight();
      }
    }

    function onPointerLeave() {
      interactionActive.current = false;
      reset();
    }

    const onPointerMove = function onPointerMove(event: PointerEvent) {
      const svgPoint = getChartPoint(element, event);

      if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
        reset();
        return;
      }

      let item: SeriesItemIdentifierWithType<ChartSeriesType> | undefined;

      for (const seriesType of Object.keys(store.state.seriesConfig.config)) {
        // @ts-ignore The type inference for store.state does not support generic yet
        item = store.state.seriesConfig.config[seriesType].getItemAtPosition?.(store.state, {
          x: svgPoint.x,
          y: svgPoint.y,
        });

        if (item) {
          break;
        }
      }

      if (item) {
        instance.setLastUpdateSource('pointer');
        instance.setTooltipItem(item);
        instance.setHighlight(item);
        lastItemRef.current = item;
      } else {
        reset();
      }
    };

    element.addEventListener('pointerleave', onPointerLeave);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerenter', onPointerEnter);

    return () => {
      element.removeEventListener('pointerenter', onPointerEnter);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerleave', onPointerLeave);

      /* Clean up state if this item is unmounted while active. */
      if (interactionActive.current) {
        onPointerLeave();
      }
    };
  }, [instance, store, chartsLayerContainerRef]);
}
