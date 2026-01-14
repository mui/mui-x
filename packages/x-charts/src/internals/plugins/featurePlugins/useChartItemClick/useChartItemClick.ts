'use client';
import type { ChartAnyPluginSignature, ChartInstance, ChartState, ChartPlugin } from '../../models';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { UseChartItemClickSignature } from './useChartItemClick.types';
import type { SeriesItemIdentifier } from '../../../../models/seriesType';
import { getSVGPoint } from '../../../../internals/getSVGPoint';

export type GetItemAtPosition = <
  TSeriesType extends ChartSeriesType,
  RequiredPluginsSignatures extends readonly ChartAnyPluginSignature[] = [],
  OptionalPluginsSignatures extends readonly ChartAnyPluginSignature[] = [],
>(
  state: ChartState<RequiredPluginsSignatures, OptionalPluginsSignatures>,
  instance: ChartInstance<RequiredPluginsSignatures, OptionalPluginsSignatures>,
  point: { x: number; y: number },
) => SeriesItemIdentifier<TSeriesType> | undefined;

export const useChartItemClick: ChartPlugin<UseChartItemClickSignature> = ({
  params,
  store,
  instance,
}) => {
  const { onItemClick } = params;

  if (!onItemClick) {
    return { instance: {} };
  }

  const getItemPosition = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    let item: SeriesItemIdentifier<ChartSeriesType> | undefined = undefined;

    for (const seriesConfig of Object.values(store.state.series.seriesConfig)) {
      if (seriesConfig.getItemAtPosition === undefined) {
        continue;
      }

      const svgPoint = getSVGPoint(event?.currentTarget, event);
      item = seriesConfig.getItemAtPosition(store.state, instance, {
        x: svgPoint.x,
        y: svgPoint.y,
      });

      if (item) {
        return item;
      }
    }
    return item;
  };

  return {
    instance: {
      handleClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const item = getItemPosition(event);
        if (item !== undefined) {
          onItemClick(event, item);
        }
      },
    },
  };
};

useChartItemClick.params = {
  onItemClick: true,
};
