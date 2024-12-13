'use client';
import * as React from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import { PrependKeys } from '@mui/x-internals/types';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useLegend } from '../hooks/useLegend';
import type { Direction } from './direction';
import { SeriesLegendItemContext } from './legendContext.types';
import { ChartsLabelMark, ChartsLabelMarkProps } from '../ChartsLabel/ChartsLabelMark';
import { seriesContextBuilder } from './onClickContextBuilder';
import { legendClasses, useUtilityClasses, type ChartsLegendClasses } from './chartsLegendClasses';
import { consumeSlots } from '../internals/consumeSlots';
import { ChartsLegendSlotExtension } from './chartsLegend.types';
import { ChartsLabel } from '../ChartsLabel';

export interface ChartsLegendProps extends PrependKeys<Pick<ChartsLabelMarkProps, 'type'>, 'mark'> {
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event The click event.
   * @param {SeriesLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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
})<{ ownerState: ChartsLegendProps }>(({ ownerState, theme }) => ({
  display: 'flex',
  flexDirection: ownerState.direction === 'vertical' ? 'column' : 'row',
  alignItems: ownerState.direction === 'vertical' ? undefined : 'center',
  gap: theme.spacing(2),
  listStyleType: 'none',
  paddingInlineStart: 0,
  flexWrap: 'wrap',
  justifyContent: 'center',

  '> button': {
    // Reset button styles
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: ownerState.onItemClick ? 'pointer' : 'unset',
  },
  [`.${legendClasses.series}`]: {
    display: ownerState.direction === 'vertical' ? 'flex' : 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

const ChartsLegend = consumeSlots(
  'MuiChartsLegend',
  'legend',
  {
    defaultProps: { direction: 'horizontal' },
    classesResolver: useUtilityClasses,
  },
  function ChartsLegend(
    props: ChartsLegendProps & ChartsLegendSlotExtension,
    ref: React.Ref<HTMLUListElement>,
  ) {
    const data = useLegend();
    const { direction, markType, onItemClick, className, classes, ...other } = props;

    if (data.items.length === 0) {
      return null;
    }

    const Element = onItemClick ? 'button' : 'div';

    return (
      <RootElement
        className={clsx(classes?.root, className)}
        ref={ref}
        {...other}
        ownerState={props}
      >
        {data.items.map((item, i) => {
          return (
            <li key={item.id}>
              <Element
                className={classes?.series}
                role={onItemClick ? 'button' : undefined}
                type={onItemClick ? 'button' : undefined}
                onClick={
                  onItemClick
                    ? // @ts-expect-error onClick is only attached to a button
                      (event) => onItemClick(event, seriesContextBuilder(item), i)
                    : undefined
                }
              >
                <ChartsLabelMark
                  classes={{ root: classes?.mark }}
                  color={item.color}
                  type={item.markType}
                />
                <ChartsLabel classes={{ root: classes?.label }}>{item.label}</ChartsLabel>
              </Element>
            </li>
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
  className: PropTypes.string,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * The type of the mark.
   * @default 'square'
   */
  type: PropTypes.oneOf(['circle', 'line', 'square']),
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event The click event.
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
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChartsLegend };
