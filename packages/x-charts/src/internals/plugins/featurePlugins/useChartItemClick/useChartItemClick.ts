'use client';
import * as React from 'react';
import type { ChartPlugin } from '../../models';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { UseChartItemClickSignature } from './useChartItemClick.types';
import type { SeriesItemIdentifierWithType } from '../../../../models/seriesType';
import { getChartPoint } from '../../../getChartPoint';
import type { ChartsActivationEvent } from '../../../../models/events';

export const useChartItemClick: ChartPlugin<UseChartItemClickSignature<any>> = ({
  params,
  store,
  instance,
}) => {
  const { onItemClick } = params;

  React.useEffect(() => {
    if (!onItemClick || !instance.registerItemActivationHandler) {
      return undefined;
    }

    return instance.registerItemActivationHandler({}, (event, item) => {
      const seriesTypeConfig = store.state.seriesConfig.config[item.type];
      // @ts-ignore The type inference for store.state does not support generic yet
      const itemWithData = seriesTypeConfig?.getItemWithData?.(store.state, item);

      // The callback only describes the pointer event unless the user augments the types.
      onItemClick(
        event as unknown as ChartsActivationEvent<HTMLDivElement>,
        (itemWithData ?? item) as SeriesItemIdentifierWithType<ChartSeriesType>,
      );
    });
  }, [instance, onItemClick, store]);

  if (!onItemClick) {
    return { instance: {} };
  }

  const getItemPosition = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const svgPoint = getChartPoint(event?.currentTarget, event);

    if (!instance.isPointInside(svgPoint.x, svgPoint.y)) {
      return undefined;
    }

    let item: SeriesItemIdentifierWithType<ChartSeriesType> | undefined = undefined;

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
      handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
