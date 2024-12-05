'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { PrependKeys } from '@mui/x-internals/types';
import { useLegend } from '../hooks/useLegend';
import { ChartsLegendItem } from './ChartsLegendItem';
import { ChartsLegendPlacement, LegendItemParams, SeriesLegendItemContext } from './legend.types';
import { ChartsLabelProps } from '../ChartsLabel/ChartsLabel';
import { ChartsLabelMarkProps } from '../ChartsLabel/ChartsLabelMark';

const seriesContextBuilder = (context: LegendItemParams): SeriesLegendItemContext =>
  ({
    type: 'series',
    color: context.color,
    label: context.label,
    seriesId: context.seriesId!,
    itemId: context.itemId,
  }) as const;

export interface ChartsLegendProps
  extends ChartsLegendPlacement,
    Omit<ChartsLabelProps, 'children'>,
    PrependKeys<Omit<ChartsLabelMarkProps, 'color'>, 'mark'> {
  // TODO: should be handled by the `BarChart/LineChart/etc` components
  // hidden?: boolean
  /**
   * Space between two legend items (in px).
   * @default theme.spacing(2)
   */
  gap?: number;
  /**
   * Space between the mark and the label (in px).
   * @default theme.spacing(1)
   */
  markGap?: number;
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event The click event.
   * @param {SeriesLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    legendItem: SeriesLegendItemContext,
    index: number,
  ) => void;
}

const RootDiv = styled(
  'div',
  {},
)<{ ownerState: Pick<ChartsLegendProps, 'gap' | 'direction'> }>(({ ownerState, theme }) => ({
  display: 'flex',
  flexDirection: ownerState.direction ?? 'row',
  gap: ownerState.gap ?? theme.spacing(2),
}));

const ChartsLegend = React.forwardRef(function BarChart(
  props: ChartsLegendProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const data = useLegend();
  const {
    direction,
    gap,
    labelStyle,
    markGap,
    markBorderRadius,
    markLineWidth,
    markSize,
    markType,
    onItemClick,
  } = props;

  return (
    <RootDiv ownerState={{ direction, gap }} ref={ref}>
      {data.itemsToDisplay.map((item, i) => {
        return (
          <ChartsLegendItem
            key={item.id}
            labelStyle={labelStyle}
            gap={markGap}
            onClick={
              onItemClick ? (event) => onItemClick(event, seriesContextBuilder(item), i) : undefined
            }
            mark={{
              color: item.color,
              type: markType ?? item.markType,
              borderRadius: markBorderRadius,
              lineWidth: markLineWidth,
              size: markSize,
            }}
          >
            {item.label}
          </ChartsLegendItem>
        );
      })}
    </RootDiv>
  );
});

export { ChartsLegend };
