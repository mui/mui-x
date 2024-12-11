'use client';
import * as React from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { PrependKeys } from '@mui/x-internals/types';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useLegend } from '../hooks/useLegend';
import { ChartsLegendItem } from './ChartsLegendItem';
import type { ChartsLegendSlotExtension, Direction } from './legend.types';
import { SeriesLegendItemContext } from './legendContext.types';
import { ChartsLabelMarkProps } from '../ChartsLabel/ChartsLabelMark';
import { seriesContextBuilder } from './onClickContextBuilder';
import { useUtilityClasses, type ChartsLegendClasses } from './chartsLegendClasses';
import { consumeSlots } from '../internals/consumeSlots';

export interface ChartsLegendProps
  extends PrependKeys<Omit<ChartsLabelMarkProps, 'color'>, 'mark'> {
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<HTMLLIElement, MouseEvent>} event The click event.
   * @param {SeriesLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick?: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    legendItem: SeriesLegendItemContext,
    index: number,
  ) => void;
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction?: Direction;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLegendClasses>;
  className?: string;
  sx?: SxProps<Theme>;
}

const RootElement = styled('ul', {
  name: 'MuiChartsLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: Pick<ChartsLegendProps, 'direction'> }>(({ ownerState, theme }) => ({
  display: 'flex',
  flexDirection: ownerState.direction ?? 'row',
  alignItems: ownerState.direction === 'row' ? 'center' : undefined,
  gap: theme.spacing(2),
  listStyleType: 'none',
  paddingInlineStart: 0,
  flexWrap: 'wrap',
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
    ref: React.Ref<HTMLUListElement>,
  ) {
    const data = useLegend();
    const { direction, markType, onItemClick, className, classes, ...other } = props;

    return (
      <RootElement
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
              direction={direction}
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
      </RootElement>
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
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<HTMLLIElement, MouseEvent>} event The click event.
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
