import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { useThemeProps, useTheme, Theme } from '@mui/material/styles';
import { getSeriesToDisplay } from './utils';
import { getLegendUtilityClass } from './chartsLegendClasses';
import { DefaultizedProps } from '../models/helpers';
import { DefaultChartsLegend, LegendRendererProps } from './DefaultChartsLegend';
import { useDrawingArea } from '../hooks';
import { useSeries } from '../hooks/useSeries';
import { LegendPlacement } from './legend.types';

export type ChartsLegendPropsBase = Pick<
  Omit<LegendRendererProps, keyof LegendPlacement>,
  'classes' | 'hidden' | 'onItemClick'
> &
  LegendPlacement;

export interface ChartsLegendSlots {
  /**
   * Custom rendering of the legend.
   * @default DefaultChartsLegend
   */
  legend?: React.JSXElementConstructor<ChartsLegendPropsBase>;
}

export interface ChartsLegendSlotProps {
  legend?: Partial<ChartsLegendPropsBase>;
}

export interface ChartsLegendProps extends ChartsLegendPropsBase {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsLegendSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsLegendSlotProps;
}

type DefaultizedChartsLegendProps = DefaultizedProps<ChartsLegendProps, 'direction' | 'position'>;

const useUtilityClasses = (ownerState: DefaultizedChartsLegendProps & { theme: Theme }) => {
  const { classes, direction } = ownerState;
  const slots = {
    root: ['root', direction],
    mark: ['mark'],
    label: ['label'],
    series: ['series'],
    itemBackground: ['itemBackground'],
  };

  return composeClasses(slots, getLegendUtilityClass, classes);
};

function ChartsLegend(inProps: ChartsLegendProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiChartsLegend',
  });

  const defaultizedProps: DefaultizedChartsLegendProps = {
    direction: 'row',
    ...props,
    position: { horizontal: 'middle', vertical: 'top', ...props.position },
  };
  const { slots, slotProps, ...other } = defaultizedProps;

  const theme = useTheme();
  const classes = useUtilityClasses({ ...defaultizedProps, theme });

  const drawingArea = useDrawingArea();
  const series = useSeries();

  const seriesToDisplay = getSeriesToDisplay(series);

  const ChartLegendRender = slots?.legend ?? DefaultChartsLegend;
  const chartLegendRenderProps = useSlotProps({
    elementType: ChartLegendRender,
    externalSlotProps: slotProps?.legend,
    additionalProps: {
      ...other,
      classes,
      drawingArea,
      series,
      seriesToDisplay,
    },
    ownerState: {},
  });

  return <ChartLegendRender {...chartLegendRenderProps} />;
}

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
   * Set to true to hide the legend.
   * @default false
   */
  hidden: PropTypes.bool,
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<SVGRectElement, MouseEvent>} event The click event.
   * @param {SeriesLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   * @default undefined
   */
  onItemClick: PropTypes.func,
  /**
   * The position of the legend.
   */
  position: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'middle', 'right']).isRequired,
    vertical: PropTypes.oneOf(['bottom', 'middle', 'top']).isRequired,
  }),
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
