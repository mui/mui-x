'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import HTMLElementType from '@mui/utils/HTMLElementType';
import composeClasses from '@mui/utils/composeClasses';
import {
  ChartsTooltipPaper,
  useItemTooltip,
  ChartsTooltipContainerProps,
  getChartsTooltipUtilityClass,
  ChartsTooltipContainer,
  ChartsItemTooltipContainer,
  ChartsItemTooltipText,
} from '@mui/x-charts/ChartsTooltip';
import { useXAxis, useYAxis } from '@mui/x-charts/hooks';
import { getLabel, ChartsLabelMark } from '@mui/x-charts/internals';
import { useHeatmapSeriesContext } from '../../hooks/useHeatmapSeries';
import { HeatmapTooltipAxesValue } from './HeatmapTooltipAxesValue';

export interface HeatmapTooltipProps
  extends Omit<ChartsTooltipContainerProps, 'trigger' | 'children'> {
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'none': Does not display tooltip
   * @default 'item'
   */
  trigger?: 'item' | 'none';
}

const useUtilityClasses = (ownerState: { classes: HeatmapTooltipProps['classes'] }) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
    paper: ['paper'],
    table: ['table'],
    row: ['row'],
    cell: ['cell'],
    mark: ['mark'],
    markCell: ['markCell'],
    labelCell: ['labelCell'],
    valueCell: ['valueCell'],
  };

  return composeClasses(slots, getChartsTooltipUtilityClass, classes);
};

function DefaultHeatmapTooltipContent(props: Pick<HeatmapTooltipProps, 'classes'>) {
  const { classes } = props;

  const xAxis = useXAxis();
  const yAxis = useYAxis();
  const heatmapSeries = useHeatmapSeriesContext();

  const tooltipData = useItemTooltip<'heatmap'>();

  if (!tooltipData || !heatmapSeries || heatmapSeries.seriesOrder.length === 0) {
    return null;
  }

  const { series, seriesOrder } = heatmapSeries;
  const seriesId = seriesOrder[0];

  const { color, value, identifier, markType } = tooltipData;

  const [xIndex, yIndex] = value;

  const formattedX =
    xAxis.valueFormatter?.(xAxis.data![xIndex], {
      location: 'tooltip',
      scale: xAxis.scale,
    }) ?? xAxis.data![xIndex].toLocaleString();
  const formattedY =
    yAxis.valueFormatter?.(yAxis.data![yIndex], { location: 'tooltip', scale: yAxis.scale }) ??
    yAxis.data![yIndex].toLocaleString();
  const formattedValue = series[seriesId].valueFormatter(value, {
    dataIndex: identifier.dataIndex,
  });

  const seriesLabel = getLabel(series[seriesId].label, 'tooltip');

  return (
    <ChartsTooltipPaper className={classes?.paper}>
      <HeatmapTooltipAxesValue>
        <span>{formattedX}</span>
        <span>{formattedY}</span>
      </HeatmapTooltipAxesValue>

      <ChartsItemTooltipContainer>
        <ChartsLabelMark type={markType} color={color} className={classes?.mark} />
        <ChartsItemTooltipText>
          <span className={classes?.labelCell}>{seriesLabel}</span>
          <span className={classes?.valueCell}>{formattedValue}</span>
        </ChartsItemTooltipText>
      </ChartsItemTooltipContainer>
    </ChartsTooltipPaper>
  );
}

DefaultHeatmapTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
} as any;

function HeatmapTooltip(props: HeatmapTooltipProps) {
  const classes = useUtilityClasses({ classes: props.classes });

  return (
    <ChartsTooltipContainer trigger="item" {...props} classes={classes}>
      <DefaultHeatmapTooltipContent classes={classes} />
    </ChartsTooltipContainer>
  );
}

HeatmapTooltip.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * An HTML element, [virtualElement](https://popper.js.org/docs/v2/virtual-elements/),
   * or a function that returns either.
   * It's used to set the position of the popper.
   * The return value will passed as the reference object of the Popper instance.
   */
  anchorEl: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    HTMLElementType,
    PropTypes.object,
    PropTypes.func,
  ]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The components used for each slot inside the Popper.
   * Either a string to use a HTML element or a component.
   *
   * @deprecated use the `slots` prop instead. This prop will be removed in v7. [How to migrate](/material-ui/migration/migrating-from-deprecated-apis/).
   * @default {}
   */
  components: PropTypes.shape({
    Root: PropTypes.elementType,
  }),
  /**
   * The props used for each slot inside the Popper.
   *
   * @deprecated use the `slotProps` prop instead. This prop will be removed in v7. [How to migrate](/material-ui/migration/migrating-from-deprecated-apis/).
   * @default {}
   */
  componentsProps: PropTypes.shape({
    root: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  }),
  /**
   * An HTML element or function that returns one.
   * The `container` will have the portal children appended to it.
   *
   * You can also provide a callback, which is called in a React layout effect.
   * This lets you set the container from a ref, and also makes server-side rendering possible.
   *
   * By default, it uses the body of the top-level document object,
   * so it's simply `document.body` most of the time.
   */
  container: PropTypes.oneOfType([
    (props, propName) => {
      if (props[propName] == null) {
        return new Error(`Prop '${propName}' is required but wasn't specified`);
      }
      if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
        return new Error(`Expected prop '${propName}' to be of type Element`);
      }
      return null;
    },
    PropTypes.func,
  ]),
  /**
   * The `children` will be under the DOM hierarchy of the parent component.
   * @default false
   */
  disablePortal: PropTypes.bool,
  /**
   * Always keep the children in the DOM.
   * This prop can be useful in SEO situation or
   * when you want to maximize the responsiveness of the Popper.
   * @default false
   */
  keepMounted: PropTypes.bool,
  /**
   * Popper.js is based on a "plugin-like" architecture,
   * most of its features are fully encapsulated "modifiers".
   *
   * A modifier is a function that is called each time Popper.js needs to
   * compute the position of the popper.
   * For this reason, modifiers should be very performant to avoid bottlenecks.
   * To learn how to create a modifier, [read the modifiers documentation](https://popper.js.org/docs/v2/modifiers/).
   */
  modifiers: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.object,
      effect: PropTypes.func,
      enabled: PropTypes.bool,
      fn: PropTypes.func,
      name: PropTypes.any,
      options: PropTypes.object,
      phase: PropTypes.oneOf([
        'afterMain',
        'afterRead',
        'afterWrite',
        'beforeMain',
        'beforeRead',
        'beforeWrite',
        'main',
        'read',
        'write',
      ]),
      requires: PropTypes.arrayOf(PropTypes.string),
      requiresIfExists: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  /**
   * If `true`, the component is shown.
   */
  open: PropTypes.bool,
  /**
   * Popper placement.
   * @default 'bottom'
   */
  placement: PropTypes.oneOf([
    'auto-end',
    'auto-start',
    'auto',
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
  /**
   * Options provided to the [`Popper.js`](https://popper.js.org/docs/v2/constructors/#options) instance.
   * @default {}
   */
  popperOptions: PropTypes.shape({
    modifiers: PropTypes.array,
    onFirstUpdate: PropTypes.func,
    placement: PropTypes.oneOf([
      'auto-end',
      'auto-start',
      'auto',
      'bottom-end',
      'bottom-start',
      'bottom',
      'left-end',
      'left-start',
      'left',
      'right-end',
      'right-start',
      'right',
      'top-end',
      'top-start',
      'top',
    ]),
    strategy: PropTypes.oneOf(['absolute', 'fixed']),
  }),
  /**
   * A ref that points to the used popper instance.
   */
  popperRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        destroy: PropTypes.func.isRequired,
        forceUpdate: PropTypes.func.isRequired,
        setOptions: PropTypes.func.isRequired,
        state: PropTypes.shape({
          attributes: PropTypes.object.isRequired,
          elements: PropTypes.object.isRequired,
          modifiersData: PropTypes.object.isRequired,
          options: PropTypes.object.isRequired,
          orderedModifiers: PropTypes.arrayOf(PropTypes.object).isRequired,
          placement: PropTypes.oneOf([
            'auto-end',
            'auto-start',
            'auto',
            'bottom-end',
            'bottom-start',
            'bottom',
            'left-end',
            'left-start',
            'left',
            'right-end',
            'right-start',
            'right',
            'top-end',
            'top-start',
            'top',
          ]).isRequired,
          rects: PropTypes.object.isRequired,
          reset: PropTypes.bool.isRequired,
          scrollParents: PropTypes.object.isRequired,
          strategy: PropTypes.oneOf(['absolute', 'fixed']).isRequired,
          styles: PropTypes.object.isRequired,
        }).isRequired,
        update: PropTypes.func.isRequired,
      }),
    }),
  ]),
  /**
   * The props used for each slot inside the Popper.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * The components used for each slot inside the Popper.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  slots: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Help supporting a react-transition-group/Transition component.
   * @default false
   */
  transition: PropTypes.bool,
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'none': Does not display tooltip
   * @default 'item'
   */
  trigger: PropTypes.oneOf(['item', 'none']),
} as any;

export { HeatmapTooltip };
