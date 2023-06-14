import * as React from 'react';
import { ItemInteractionData } from '../context/InteractionProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import {
  ChartsTooltipTable,
  ChartsTooltipCell,
  ChartsTooltipMark,
  ChartsTooltipPaper,
} from './ChartsTooltipTable';

export type ChartsItemContentProps<T extends ChartSeriesType> = {
  /**
   * The data used to identify the triggered item.
   */
  itemData: ItemInteractionData<T>;
  /**
   * The series linked to the triggered axis.
   */
  series: ChartSeriesDefaultized<T>;
};

export function DefaultChartsItemContent<T extends ChartSeriesType>(
  props: ChartsItemContentProps<T>,
) {
  const { series, itemData } = props;

  if (itemData.dataIndex === undefined) {
    return null;
  }

  const displayedLabel = series.label ?? null;
  const color = series.color;
  // TODO: Manage to let TS understand series.data and series.valueFormatter are coherent
  // @ts-ignore
  const formattedValue = series.valueFormatter(series.data[itemData.dataIndex]);
  return (
    <ChartsTooltipPaper>
      <ChartsTooltipTable>
        <tbody>
          <tr>
            <ChartsTooltipCell>
              <ChartsTooltipMark ownerState={{ color }} />
            </ChartsTooltipCell>

            <ChartsTooltipCell>{displayedLabel}</ChartsTooltipCell>

            <ChartsTooltipCell>{formattedValue}</ChartsTooltipCell>
          </tr>
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

export function ChartsItemTooltipContent<T extends ChartSeriesType>(props: {
  itemData: ItemInteractionData<T>;
  content?: React.ElementType<ChartsItemContentProps<T>>;
}) {
  const { content, itemData } = props;

  const series = React.useContext(SeriesContext)[itemData.type]!.series[
    itemData.seriesId
  ] as ChartSeriesDefaultized<T>;

  const Content = content ?? DefaultChartsItemContent<T>;

  return <Content itemData={itemData} series={series} />;
}
