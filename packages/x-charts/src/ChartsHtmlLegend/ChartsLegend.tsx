'use client';
import * as React from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { PrependKeys } from '@mui/x-internals/types';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useLegend } from '../hooks/useLegend';
import { ChartsLegendItem } from './ChartsLegendItem';
import type { ChartsLegendPlacement, ChartsLegendSlotExtension } from './legend.types';
import { SeriesLegendItemContext } from './legendContext.types';
import { ChartsLabelMarkProps } from '../ChartsLabel/ChartsLabelMark';
import { seriesContextBuilder } from './onClickContextBuilder';
import { useUtilityClasses, type ChartsLegendClasses } from './chartsLegendClasses';
import { consumeSlots } from '../internals/consumeSlots';

export interface ChartsLegendProps
  extends ChartsLegendPlacement,
    PrependKeys<Omit<ChartsLabelMarkProps, 'color'>, 'mark'> {
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
  /**
   * Override or extend the styles applied to the component.
   */
  // eslint-disable-next-line react/no-unused-prop-types
  classes?: Partial<ChartsLegendClasses>;
  className?: string;
  sx?: SxProps<Theme>;
}

const RootDiv = styled('div', {
  name: 'MuiChartsLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: Pick<ChartsLegendProps, 'direction'> }>(({ ownerState, theme }) => ({
  display: 'flex',
  flexDirection: ownerState.direction ?? 'row',
  gap: theme.spacing(2),
}));

const ChartsLegend = consumeSlots(
  'MuiChartsLegend',
  'legend',
  {
    defaultProps: { direction: 'row' },
    classesResolver: useUtilityClasses,
  },
  function ChartsLegend(
    props: ChartsLegendProps & ChartsLegendSlotExtension,
    ref: React.Ref<HTMLDivElement>,
  ) {
    const data = useLegend();
    const { direction, markType, onItemClick, className, classes, ...other } = props;

    return (
      <RootDiv
        className={clsx(classes?.root, className)}
        ref={ref}
        {...other}
        ownerState={{ direction }}
      >
        {data.itemsToDisplay.map((item, i) => {
          return (
            <ChartsLegendItem
              key={item.id}
              classes={classes}
              onClick={
                onItemClick
                  ? (event) => onItemClick(event, seriesContextBuilder(item), i)
                  : undefined
              }
              mark={{
                color: item.color,
                type: markType ?? item.markType,
              }}
            >
              {item.label}
            </ChartsLegendItem>
          );
        })}
      </RootDiv>
    );
  },
);

ChartsLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: PropTypes.oneOf(['column', 'row']),
  /**
   * Style applied to legend labels.
   * @default theme.typography.caption
   */
  labelStyle: PropTypes.object,
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event The click event.
   * @param {SeriesLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick: PropTypes.func,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { ChartsLegend };
