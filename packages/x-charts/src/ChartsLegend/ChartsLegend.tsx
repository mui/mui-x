'use client';
import * as React from 'react';
import { styled, type SxProps, type Theme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useEventCallback from '@mui/utils/useEventCallback';
import { useLegend } from '../hooks/useLegend';
import type { Direction } from './direction';
import { type SeriesLegendItemContext, type LegendItemParams } from './legendContext.types';
import { ChartsLabelMark } from '../ChartsLabel/ChartsLabelMark';
import { seriesContextBuilder } from './onClickContextBuilder';
import { legendClasses, useUtilityClasses, type ChartsLegendClasses } from './chartsLegendClasses';
import { consumeSlots } from '../internals/consumeSlots';
import { ChartsLabel } from '../ChartsLabel/ChartsLabel';
import { useChartContext } from '../context/ChartProvider';
import {
  selectorIsItemVisibleGetter,
  type UseChartVisibilityManagerSignature,
} from '../internals/plugins/featurePlugins/useChartVisibilityManager';
import { useStore } from '../internals/store/useStore';
import { selectorChartSeriesConfig } from '../internals/plugins/corePlugins/useChartSeriesConfig';

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
  /**
   * If `true`, clicking on a legend item will toggle the visibility of the corresponding series.
   * @default false
   */
  toggleVisibilityOnClick?: boolean;
  className?: string;
  sx?: SxProps<Theme>;
  tabIndex?: number;
}

const RootElement = styled('ul', {
  name: 'MuiChartsLegend',
  slot: 'Root',
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
    cursor: ownerState.onItemClick || ownerState.toggleVisibilityOnClick ? 'pointer' : 'default',
    [`&.${legendClasses.hidden}`]: {
      opacity: 0.5,
    },
  },
  gridArea: 'legend',
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
  React.forwardRef(function ChartsLegend(
    props: ChartsLegendProps,
    ref: React.Ref<HTMLUListElement>,
  ) {
    const data = useLegend();
    const { instance } = useChartContext<[UseChartVisibilityManagerSignature]>();
    const store = useStore<[UseChartVisibilityManagerSignature]>();
    const seriesConfig = store.use(selectorChartSeriesConfig);
    const isItemVisible = store.use(selectorIsItemVisibleGetter);
    const { direction, onItemClick, className, classes, toggleVisibilityOnClick, ...other } = props;

    const isButton = Boolean(onItemClick || toggleVisibilityOnClick);

    const Element = isButton ? 'button' : 'div';

    const handleClick = useEventCallback(
      (item: LegendItemParams, i: number) =>
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          if (onItemClick && item) {
            onItemClick(event, seriesContextBuilder(item), i);
          }

          if (toggleVisibilityOnClick) {
            instance.toggleItemVisibility({
              // TODO: Remove in v9
              // @ts-expect-error item always has type defined.
              type: item.type,
              seriesId: item.seriesId,
              dataIndex: item.dataIndex,
            });
          }
        },
    );

    if (data.items.length === 0) {
      return null;
    }

    return (
      <RootElement
        className={clsx(classes?.root, className)}
        ref={ref}
        {...other}
        ownerState={props}
      >
        {data.items.map((item, i) => {
          const isVisible = isItemVisible(seriesConfig, {
            // TODO: Remove in v9
            // @ts-expect-error item always has type defined.
            type: item.type,
            seriesId: item.seriesId,
            dataIndex: item.dataIndex,
          });
          return (
            <li
              key={`${item.seriesId}-${item.dataIndex}`}
              className={classes?.item}
              data-series={item.seriesId}
              data-index={item.dataIndex}
            >
              <Element
                className={clsx(classes?.series, !isVisible && classes?.hidden)}
                role={isButton ? 'button' : undefined}
                type={isButton ? 'button' : undefined}
                // @ts-expect-error onClick is only attached to a button
                onClick={isButton ? handleClick(item, i) : undefined}
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
  }),
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
  /**
   * If `true`, clicking on a legend item will toggle the visibility of the corresponding series.
   * @default false
   */
  toggleVisibilityOnClick: PropTypes.bool,
} as any;

export { ChartsLegend };
