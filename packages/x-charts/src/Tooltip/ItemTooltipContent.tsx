import * as React from 'react';
import { ItemInteractionData } from '../context/InteractionProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import { TooltipTable, TooltipCell, TooltipMark, TooltipPaper } from './TooltipTable';

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

  const displayedLabel = series.label ?? series.id;
  const color = series.color;
  // TODO: Manage to let TS understand series.data and series.valueFormatter are coherent
  // @ts-ignore
  const formattedValue = series.valueFormatter(series.data[itemData.dataIndex]);
  return (
    <TooltipPaper>
      <TooltipTable>
        <tbody>
          <tr>
            <TooltipCell>
              <TooltipMark ownerState={{ color }} />
            </TooltipCell>

            <TooltipCell>{displayedLabel}</TooltipCell>

            <TooltipCell>{formattedValue}</TooltipCell>
          </tr>
        </tbody>
      </TooltipTable>
    </TooltipPaper>
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
