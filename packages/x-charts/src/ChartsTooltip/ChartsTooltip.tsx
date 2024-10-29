'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { styled, useThemeProps, SxProps, Theme } from '@mui/material/styles';
import Popper, { PopperProps as BasePopperProps } from '@mui/material/Popper';
import NoSsr from '@mui/material/NoSsr';
import useSlotProps from '@mui/utils/useSlotProps';
import { useStore } from '../context/InteractionProvider';
import { useSvgRef } from '../hooks/useSvgRef';
import { generateVirtualElement, TriggerOptions, usePointerType, VirtualElement } from './utils';
import { ChartsItemTooltipContent } from './ChartsItemTooltipContent';
import { ChartsAxisTooltipContent } from './ChartsAxisTooltipContent';
import { ChartsTooltipClasses, getChartsTooltipUtilityClass } from './chartsTooltipClasses';
import { useSelector } from '../internals/useSelector';
import { useXAxis } from '../hooks';
import {
  selectorChartsInteractionItemIsDefined,
  selectorChartsInteractionXAxisIsDefined,
  selectorChartsInteractionYAxisIsDefined,
} from '../context/InteractionSelectors';

export type PopperProps = BasePopperProps & {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
};

export interface ChartsTooltipSlots {
  /**
   * Custom component for the tooltip popper.
   * @default ChartsTooltipRoot
   */
  popper?: React.ElementType<PopperProps>;
}

export interface ChartsTooltipSlotProps {
  popper?: Partial<PopperProps>;
}

export interface ChartsTooltipProps {
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows values associated with the hovered x value
   * - 'none': Does not display tooltip
   * @default 'axis'
   */
  trigger?: TriggerOptions;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsTooltipSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsTooltipSlotProps;
  children?: React.ReactNode;
}

const useUtilityClasses = (ownerState: { classes: ChartsTooltipProps['classes'] }) => {
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

const ChartsTooltipRoot = styled(Popper, {
  name: 'MuiChartsTooltip',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  pointerEvents: 'none',
  zIndex: theme.zIndex.modal,
}));

/**
 * Demos:
 *
 * - [ChartsTooltip](https://mui.com/x/react-charts/tooltip/)
 *
 * API:
 *
 * - [ChartsTooltip API](https://mui.com/x/api/charts/charts-tool-tip/)
 */
function ChartsTooltip(inProps: ChartsTooltipProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiChartsTooltip',
  });
  const { trigger = 'axis', slots, slotProps, children } = props;

  const svgRef = useSvgRef();
  const pointerType = usePointerType();
  const xAxis = useXAxis();

  const xAxisHasData = xAxis.data !== undefined && xAxis.data.length !== 0;

  const positionRef = React.useRef({ x: 0, y: 0 });

  const popperRef: PopperProps['popperRef'] = React.useRef(null);

  const virtualElement = React.useRef<VirtualElement | null>(null);
  if (virtualElement.current === null) {
    virtualElement.current = generateVirtualElement(null);
  }
  const store = useStore();

  const isOpen = useSelector(
    store,
    // eslint-disable-next-line no-nested-ternary
    trigger === 'axis'
      ? xAxisHasData
        ? selectorChartsInteractionXAxisIsDefined
        : selectorChartsInteractionYAxisIsDefined
      : selectorChartsInteractionItemIsDefined,
  );

  const popperOpen = pointerType !== null && isOpen; // tooltipHasData;

  const classes = useUtilityClasses({ classes: props.classes });

  const PopperComponent = slots?.popper ?? ChartsTooltipRoot;

  const popperProps = useSlotProps({
    elementType: PopperComponent,
    externalSlotProps: slotProps?.popper,
    additionalProps: {
      open: popperOpen,
      placement: pointerType?.pointerType === 'mouse' ? ('right-start' as const) : ('top' as const),
      popperRef,
      anchorEl: virtualElement.current,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, pointerType?.pointerType === 'touch' ? 40 - pointerType.height : 0],
          },
        },
      ],
    },
    ownerState: {},
  });

  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null) {
      return () => {};
    }

    const handleMove = (event: PointerEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY };
      popperRef.current?.update();
    };
    element.addEventListener('pointermove', handleMove);

    return () => {
      element.removeEventListener('pointermove', handleMove);
    };
  }, [svgRef]);

  if (trigger === 'none') {
    return null;
  }

  return (
    <NoSsr>
      {popperOpen && (
        <PopperComponent
          sx={{ pointerEvents: 'none' }}
          {...popperProps}
          className={classes.root}
          anchorEl={{
            getBoundingClientRect: () => ({
              x: positionRef.current.x,
              y: positionRef.current.y,
              top: positionRef.current.y,
              left: positionRef.current.x,
              right: positionRef.current.x,
              bottom: positionRef.current.y,
              width: 0,
              height: 0,
              toJSON: () => '',
            }),
          }}
          popperRef={popperRef}
        >
          {children ??
            (trigger === 'axis' ? (
              <ChartsAxisTooltipContent classes={classes} />
            ) : (
              <ChartsItemTooltipContent classes={classes} />
            ))}
        </PopperComponent>
      )}
    </NoSsr>
  );
}

ChartsTooltip.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Component to override the tooltip content when trigger is set to 'axis'.
   * @deprecated Use slots.axisContent instead
   */
  axisContent: PropTypes.elementType,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Component to override the tooltip content when trigger is set to 'item'.
   * @deprecated Use slots.itemContent instead
   */
  itemContent: PropTypes.elementType,
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
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows values associated with the hovered x value
   * - 'none': Does not display tooltip
   * @default 'axis'
   */
  trigger: PropTypes.oneOf(['axis', 'item', 'none']),
} as any;

export { ChartsTooltip };
