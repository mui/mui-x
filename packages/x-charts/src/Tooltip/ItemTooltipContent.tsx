import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ItemInteractionData } from '../context/InteractionProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';

const format = (data: any) => (typeof data === 'object' ? `(${data.x}, ${data.y})` : data);

export type ItemContentProps<T extends ChartSeriesType> = {
  /**
   * The data used to identify the triggered item.
   */
  itemData: ItemInteractionData<T>;
  /**
   * The series linked to the triggered axis.
   */
  series: ChartSeriesDefaultized<T>;
};

export function DefaultItemContent<T extends ChartSeriesType>(props: ItemContentProps<T>) {
  const { series, itemData } = props;

  if (itemData.dataIndex === undefined) {
    return null;
  }

  const data = series.data[itemData.dataIndex];
  return (
    <Paper sx={{ p: 1 }}>
      <p>
        {series.label ?? series.id}: {format(data)}
      </p>
    </Paper>
  );
}

export function ItemTooltipContent<T extends ChartSeriesType>(props: {
  itemData: ItemInteractionData<T>;
  content?: React.ElementType<ItemContentProps<T>>;
}) {
  const { content, itemData } = props;

  const series = React.useContext(SeriesContext)[itemData.type]!.series[
    itemData.seriesId
  ] as ChartSeriesDefaultized<T>;

  const Content = content ?? DefaultItemContent<T>;
  
  return <Content itemData={itemData} series={series} />;
}
