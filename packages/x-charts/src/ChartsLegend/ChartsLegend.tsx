'use client';
import * as React from 'react';
import { styled, SxProps, Theme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useLegend } from '../hooks/useLegend';
import type { Direction } from './direction';
import { SeriesLegendItemContext } from './legendContext.types';
import { ChartsLabelMark } from '../ChartsLabel/ChartsLabelMark';
import { seriesContextBuilder } from './onClickContextBuilder';
import { legendClasses, useUtilityClasses, type ChartsLegendClasses } from './chartsLegendClasses';
import { consumeSlots } from '../internals/consumeSlots';
import { ChartsLabel } from '../ChartsLabel/ChartsLabel';

export interface ChartsLegendProps {
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
  ...theme.typography.caption,
  color: (theme.vars || theme).palette.text.primary,
  lineHeight: '100%',
  display: 'flex',
  flexDirection: ownerState.direction === 'vertical' ? 'column' : 'row',
  alignItems: ownerState.direction === 'vertical' ? undefined : 'center',
  flexShrink: 0,
  gap: theme.spacing(2),
  listStyleType: 'none',
  paddingInlineStart: 0,
  marginBlock: theme.spacing(1),
  marginInline: theme.spacing(1),
  flexWrap: 'wrap',
  li: {
    display: ownerState.direction === 'horizontal' ? 'inline-flex' : undefined,
  },
  [`button.${legendClasses.series}`]: {
    // Reset button styles
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'inherit',
    fontWeight: 'inherit',
    fontSize: 'inherit',
    letterSpacing: 'inherit',
    color: 'inherit',
  },
  [`& .${legendClasses.series}`]: {
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
    // @ts-expect-error position is used only in the slots, but it is passed to the SVG wrapper.
    // We omit it here to avoid passing to slots.
    omitProps: ['position'],
    classesResolver: useUtilityClasses,
  },
  function ChartsLegend(props: ChartsLegendProps, ref: React.Ref<HTMLUListElement>) {
    const data = useLegend();
    const { direction, onItemClick, className, classes, ...other } = props;

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
                    ? // @ts-ignore onClick is only attached to a button
                      (event) => onItemClick(event, seriesContextBuilder(item), i)
                    : undefined
                }
              >
                <ChartsLabelMark
                  className={classes?.mark}
                  color={item.color}
                  type={item.markType}
                />
                <ChartsLabel className={classes?.label}>{item.label}</ChartsLabel>
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
