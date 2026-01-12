'use client';
import type { ChartAnyPluginSignature, ChartInstance, ChartState, ChartPlugin } from '../../models';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { UseChartItemClickSignature } from './useChartItemClick.types';
import type { SeriesItemIdentifier } from '../../../../models/seriesType';

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

  const getItemPosition = (x: number, y: number) => {
    let item: SeriesItemIdentifier<ChartSeriesType> | undefined = undefined;

    for (const getter of Object.values(store.state.series.seriesConfig)) {
      if (getter.getItemAtPosition === undefined) {
        continue;
      }
      item = getter.getItemAtPosition(store.state, instance, { x, y });

      if (item) {
        break;
      }
    }
    return item;
  };

  return {
    instance: {
      handleClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const item = getItemPosition(event.clientX, event.clientY);
        if (item !== undefined) {
          onItemClick(item);
        }
      },
    },
  };
};

useChartItemClick.params = {
  onItemClick: true,
};
