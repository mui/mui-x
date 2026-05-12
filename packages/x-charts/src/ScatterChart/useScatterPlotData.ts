import * as React from 'react';
import { type SeriesId } from '../models/seriesType/common';
import { type D3Scale } from '../models/axis';
import { getValueToPositionMapper } from '../hooks';
import { type DefaultizedScatterSeriesType, type ScatterValueType } from '../models';
import { isColumnarScatterData } from './scatterDataAccess';

export function useScatterPlotData(
  series: DefaultizedScatterSeriesType,
  xScale: D3Scale,
  yScale: D3Scale,
  isPointInside: (x: number, y: number) => boolean,
) {
  return React.useMemo(() => {
    const getXPosition = getValueToPositionMapper(xScale);
    const getYPosition = getValueToPositionMapper(yScale);

    const temp: (ScatterValueType & {
      dataIndex: number;
      seriesId: SeriesId;
      type: 'scatter';
    })[] = [];

    const data = series.data;

    if (isColumnarScatterData(data)) {
      const xs = data.x;
      const ys = data.y;
      const ids = data.ids;
      const length = data.length;
      for (let i = 0; i < length; i += 1) {
        const x = getXPosition(xs[i]);
        const y = getYPosition(ys[i]);

        if (isPointInside(x, y)) {
          temp.push({
            x,
            y,
            id: ids === undefined ? undefined : ids[i],
            seriesId: series.id,
            type: 'scatter',
            dataIndex: i,
          });
        }
      }
      return temp;
    }

    for (let i = 0; i < data.length; i += 1) {
      const scatterPoint = data[i];

      const x = getXPosition(scatterPoint.x);
      const y = getYPosition(scatterPoint.y);

      const isInRange = isPointInside(x, y);

      if (isInRange) {
        temp.push({
          x,
          y,
          id: scatterPoint.id,
          seriesId: series.id,
          type: 'scatter',
          dataIndex: i,
        });
      }
    }

    return temp;
  }, [xScale, yScale, series.data, series.id, isPointInside]);
}
