'use client';
import type { ChartPlugin } from '../../models';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { UseChartItemClickSignature } from './useChartItemClick.types';
import type { SeriesItemIdentifier } from '../../../../models/seriesType';
import { getChartPoint } from '../../../getChartPoint';

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
    const svgPoint = getChartPoint(event?.currentTarget, event);

    if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
      return undefined;
    }

    let item: SeriesItemIdentifier<ChartSeriesType> | undefined = undefined;

    for (const seriesType of Object.keys(store.state.seriesConfig.config)) {
      // @ts-ignore The type inference for store.state does not support generic yet
      item = store.state.seriesConfig.config[seriesType].getItemAtPosition?.(store.state, {
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
