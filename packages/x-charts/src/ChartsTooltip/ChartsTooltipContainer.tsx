'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useLazyRef from '@mui/utils/useLazyRef';
import { styled, useThemeProps, SxProps, Theme } from '@mui/material/styles';
import Popper, { PopperProps as BasePopperProps } from '@mui/material/Popper';
import NoSsr from '@mui/material/NoSsr';
import useSlotProps from '@mui/utils/useSlotProps';
import { useStore } from '../context/InteractionProvider';
import { useSvgRef } from '../hooks/useSvgRef';
import { TriggerOptions, usePointerType } from './utils';
import { ChartsTooltipClasses } from './chartsTooltipClasses';
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

export interface ChartsTooltipContainerSlots {
  /**
   * Custom component for the tooltip popper.
   * @default ChartsTooltipRoot
   */
  popper?: React.ElementType<PopperProps>;
}

export interface ChartsTooltipContainerSlotProps {
  popper?: Partial<PopperProps>;
}

export interface ChartsTooltipContainerProps {
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
  slots?: ChartsTooltipContainerSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsTooltipContainerSlotProps;
  children?: React.ReactNode;
}

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
function ChartsTooltipContainer(inProps: ChartsTooltipContainerProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiChartsTooltipContainer',
  });
  const { trigger = 'axis', slots, slotProps, classes, children } = props;

  const svgRef = useSvgRef();
  const pointerType = usePointerType();
  const xAxis = useXAxis();

  const xAxisHasData = xAxis.data !== undefined && xAxis.data.length !== 0;

  const popperRef: PopperProps['popperRef'] = React.useRef(null);
  const positionRef = useLazyRef(() => ({ x: 0, y: 0 }));

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

  const PopperComponent = slots?.popper ?? ChartsTooltipRoot;

  const popperProps = useSlotProps({
    elementType: PopperComponent,
    externalSlotProps: slotProps?.popper,
    className: classes?.root,
    additionalProps: {
      open: popperOpen,
      placement: pointerType?.pointerType === 'mouse' ? ('right-start' as const) : ('top' as const),
      popperRef,
      anchorEl: {
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
      },
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
      // eslint-disable-next-line react-compiler/react-compiler
      positionRef.current = { x: event.clientX, y: event.clientY };
      popperRef.current?.update();
    };
    element.addEventListener('pointermove', handleMove);

    return () => {
      element.removeEventListener('pointermove', handleMove);
    };
  }, [svgRef, positionRef]);

  if (trigger === 'none') {
    return null;
  }

  return (
    <NoSsr>{popperOpen && <PopperComponent {...popperProps}>{children}</PopperComponent>}</NoSsr>
  );
}

ChartsTooltipContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
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

export { ChartsTooltipContainer };
