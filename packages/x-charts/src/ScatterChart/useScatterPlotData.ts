import * as React from 'react';
import { type SeriesId } from '../models/seriesType/common';
import { type D3Scale } from '../models/axis';
import { getValueToPositionMapper } from '../hooks';
import { type DefaultizedScatterSeriesType, type ScatterValueType } from '../models';

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

    // When the series is downsampled (Pro feature), only the selected original indices are
    // rendered. `series.data` is left untouched so item interaction keeps using the full data.
    const sampledIndices = series.sampledIndices;
    const length = sampledIndices ? sampledIndices.length : series.data.length;

    for (let cursor = 0; cursor < length; cursor += 1) {
      const i = sampledIndices ? sampledIndices[cursor] : cursor;
      const scatterPoint = series.data[i];

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
  }, [xScale, yScale, series.data, series.id, series.sampledIndices, isPointInside]);
}
