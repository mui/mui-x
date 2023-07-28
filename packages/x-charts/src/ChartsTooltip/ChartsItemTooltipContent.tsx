import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { ItemInteractionData } from '../context/InteractionProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import {
  ChartsTooltipTable,
  ChartsTooltipCell,
  ChartsTooltipMark,
  ChartsTooltipPaper,
  ChartsTooltipRow,
} from './ChartsTooltipTable';
import { ChartsTooltipClasses } from './tooltipClasses';

export type ChartsItemContentProps<T extends ChartSeriesType> = {
  /**
   * The data used to identify the triggered item.
   */
  itemData: ItemInteractionData<T>;
  /**
   * The series linked to the triggered axis.
   */
  series: ChartSeriesDefaultized<T>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes: ChartsTooltipClasses;
  sx?: SxProps<Theme>;
};

export function DefaultChartsItemContent<T extends ChartSeriesType>(
  props: ChartsItemContentProps<T>,
) {
  const { series, itemData, sx, classes } = props;

  if (itemData.dataIndex === undefined) {
    return null;
  }
  const { displayedLabel, color } =
    series.type === 'pie'
      ? {
          color: series.data[itemData.dataIndex].color,
          displayedLabel: series.data[itemData.dataIndex].label,
        }
      : {
          color: series.color,
          displayedLabel: series.label,
        };

  // TODO: Manage to let TS understand series.data and series.valueFormatter are coherent
  // @ts-ignore
  const formattedValue = series.valueFormatter(series.data[itemData.dataIndex]);
  return (
    <ChartsTooltipPaper sx={sx} variant="outlined" className={classes.root}>
      <ChartsTooltipTable>
        <tbody>
          <ChartsTooltipRow>
            <ChartsTooltipCell className={classes.markCell}>
              <ChartsTooltipMark ownerState={{ color }} />
            </ChartsTooltipCell>

            <ChartsTooltipCell className={classes.labelCell}>{displayedLabel}</ChartsTooltipCell>

            <ChartsTooltipCell className={classes.valueCell}>{formattedValue}</ChartsTooltipCell>
          </ChartsTooltipRow>
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

export function ChartsItemTooltipContent<T extends ChartSeriesType>(props: {
  itemData: ItemInteractionData<T>;
  content?: React.ElementType<ChartsItemContentProps<T>>;
  sx?: SxProps<Theme>;
  classes: ChartsItemContentProps<T>['classes'];
}) {
  const { content, itemData, sx, classes } = props;

  const series = React.useContext(SeriesContext)[itemData.type]!.series[
    itemData.seriesId
  ] as ChartSeriesDefaultized<T>;

  const Content = content ?? DefaultChartsItemContent<T>;

  return <Content itemData={itemData} series={series} sx={sx} classes={classes} />;
}
