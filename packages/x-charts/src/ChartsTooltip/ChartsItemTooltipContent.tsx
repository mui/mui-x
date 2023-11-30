import * as React from 'react';
import PropTypes from 'prop-types';
import { SxProps, Theme } from '@mui/material/styles';
import { useSlotProps } from '@mui/base/utils';
import { ItemInteractionData } from '../context/InteractionProvider';
import { SeriesContext } from '../context/SeriesContextProvider';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import { ChartsTooltipClasses } from './chartsTooltipClasses';
import { DefaultChartsItemTooltipContent } from './DefaultChartsItemTooltipContent';

export type ChartsItemContentProps<T extends ChartSeriesType = ChartSeriesType> = {
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

function ChartsItemTooltipContent<T extends ChartSeriesType>(props: {
  itemData: ItemInteractionData<T>;
  content?: React.ElementType<ChartsItemContentProps<T>>;
  contentProps?: Partial<ChartsItemContentProps<T>>;
  sx?: SxProps<Theme>;
  classes: ChartsItemContentProps<T>['classes'];
}) {
  const { content, itemData, sx, classes, contentProps } = props;

  const series = React.useContext(SeriesContext)[itemData.type]!.series[
    itemData.seriesId
  ] as ChartSeriesDefaultized<T>;

  const Content = content ?? DefaultChartsItemTooltipContent;
  const chartTooltipContentProps = useSlotProps({
    elementType: Content,
    externalSlotProps: contentProps,
    additionalProps: {
      itemData,
      series,
      sx,
      classes,
    },
    ownerState: {},
  });
  return <Content {...chartTooltipContentProps} />;
}

ChartsItemTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object.isRequired,
  content: PropTypes.elementType,
  contentProps: PropTypes.shape({
    classes: PropTypes.object,
    itemData: PropTypes.shape({
      dataIndex: PropTypes.number,
      seriesId: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bar', 'line', 'pie', 'scatter']).isRequired,
    }),
    series: PropTypes.shape({
      color: PropTypes.string,
      data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.number),
        PropTypes.shape({
          '__@iterator@33399': PropTypes.func.isRequired,
          '__@unscopables@36265': PropTypes.object.isRequired,
          at: PropTypes.func.isRequired,
          concat: PropTypes.func.isRequired,
          copyWithin: PropTypes.func.isRequired,
          entries: PropTypes.func.isRequired,
          every: PropTypes.func.isRequired,
          fill: PropTypes.func.isRequired,
          filter: PropTypes.func.isRequired,
          find: PropTypes.func.isRequired,
          findIndex: PropTypes.func.isRequired,
          findLast: PropTypes.func.isRequired,
          findLastIndex: PropTypes.func.isRequired,
          flat: PropTypes.func.isRequired,
          flatMap: PropTypes.func.isRequired,
          forEach: PropTypes.func.isRequired,
          includes: PropTypes.func.isRequired,
          indexOf: PropTypes.func.isRequired,
          join: PropTypes.func.isRequired,
          keys: PropTypes.func.isRequired,
          lastIndexOf: PropTypes.func.isRequired,
          length: PropTypes.number.isRequired,
          map: PropTypes.func.isRequired,
          pop: PropTypes.func.isRequired,
          push: PropTypes.func.isRequired,
          reduce: PropTypes.func.isRequired,
          reduceRight: PropTypes.func.isRequired,
          reverse: PropTypes.func.isRequired,
          shift: PropTypes.func.isRequired,
          slice: PropTypes.func.isRequired,
          some: PropTypes.func.isRequired,
          sort: PropTypes.func.isRequired,
          splice: PropTypes.func.isRequired,
          toLocaleString: PropTypes.func.isRequired,
          toReversed: PropTypes.func.isRequired,
          toSorted: PropTypes.func.isRequired,
          toSpliced: PropTypes.func.isRequired,
          toString: PropTypes.func.isRequired,
          unshift: PropTypes.func.isRequired,
          values: PropTypes.func.isRequired,
          with: PropTypes.func.isRequired,
        }),
      ]).isRequired,
      highlightScope: PropTypes.shape({
        faded: PropTypes.oneOf(['global', 'none', 'series']),
        highlighted: PropTypes.oneOf(['item', 'none', 'series']),
      }),
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bar', 'line', 'pie', 'scatter']).isRequired,
      valueFormatter: PropTypes.func.isRequired,
    }),
    sx: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
      PropTypes.func,
      PropTypes.object,
    ]),
  }),
  itemData: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['bar', 'line', 'pie', 'scatter']).isRequired,
  }).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChartsItemTooltipContent };
