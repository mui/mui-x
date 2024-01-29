import * as React from 'react';
import PropTypes from 'prop-types';
import { AnimatedComponent, animated, useSpring } from '@react-spring/web';
import { color as d3Color } from 'd3-color';
import composeClasses from '@mui/utils/composeClasses';
import { useSlotProps, SlotComponentProps } from '@mui/base/utils';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { InteractionContext } from '../context/InteractionProvider';
import {
  getIsFaded,
  getIsHighlighted,
  useInteractionItemProps,
} from '../hooks/useInteractionItemProps';
import { HighlightScope } from '../context/HighlightProvider';
import { useAnimatedPath } from '../internals/useAnimatedPath';
import { DrawingContext } from '../context/DrawingProvider';
import { cleanId } from '../internals/utils';

export interface LineElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type LineElementClassKey = keyof LineElementClasses;

interface LineElementOwnerState {
  id: string;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<LineElementClasses>;
}

export function getLineElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiLineElement', slot);
}

export const lineElementClasses: LineElementClasses = generateUtilityClasses('MuiLineElement', [
  'root',
  'highlighted',
  'faded',
]);

const useUtilityClasses = (ownerState: LineElementOwnerState) => {
  const { classes, id, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getLineElementUtilityClass, classes);
};

export const LineElementPath = styled(animated.path, {
  name: 'MuiLineElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: LineElementOwnerState }>(({ ownerState }) => ({
  strokeWidth: 2,
  strokeLinejoin: 'round',
  fill: 'none',
  stroke: ownerState.isHighlighted
    ? d3Color(ownerState.color)!.brighter(0.5).formatHex()
    : ownerState.color,
  transition: 'opacity 0.2s ease-in, stroke 0.2s ease-in',
  opacity: ownerState.isFaded ? 0.3 : 1,
}));

LineElementPath.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  as: PropTypes.elementType,
  ownerState: PropTypes.shape({
    classes: PropTypes.object,
    color: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    isFaded: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
  }).isRequired,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export interface LineElementSlots {
  /**
   * The component that renders the line.
   * @default LineElementPath
   */
  line?: AnimatedComponent<'path'>;
}

export interface LineElementSlotProps {
  line?: SlotComponentProps<
    AnimatedComponent<'path'>,
    // Added to make TS pass in `useSlotsProps`
    {
      className?: string;
      style?: React.CSSProperties;
      ref?: React.Ref<any>;
    },
    LineElementOwnerState
  >;
}

export interface LineElementProps extends Omit<LineElementOwnerState, 'isFaded' | 'isHighlighted'> {
  d: string;
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
  highlightScope?: Partial<HighlightScope>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: LineElementSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: LineElementSlots;
}

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineElement API](https://mui.com/x/api/charts/line-element/)
 */
function LineElement(props: LineElementProps) {
  const {
    id,
    classes: innerClasses,
    color,
    highlightScope,
    slots,
    slotProps,
    d,
    skipAnimation,
    ...other
  } = props;
  const getInteractionItemProps = useInteractionItemProps(highlightScope);
  const { left, top, bottom, width, height, right, chartId } = React.useContext(DrawingContext);

  const { item } = React.useContext(InteractionContext);

  const isHighlighted = getIsHighlighted(item, { type: 'line', seriesId: id }, highlightScope);
  const isFaded =
    !isHighlighted && getIsFaded(item, { type: 'line', seriesId: id }, highlightScope);

  const ownerState = {
    id,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  const Line = slots?.line ?? LineElementPath;
  const lineProps = useSlotProps({
    elementType: Line,
    externalSlotProps: slotProps?.line,
    additionalProps: {
      ...other,
      ...getInteractionItemProps({ type: 'line', seriesId: id }),
      className: classes.root,
    },
    ownerState,
  });

  const path = useAnimatedPath(d, skipAnimation);

  const { animatedWidth } = useSpring({
    from: { animatedWidth: left },
    to: { animatedWidth: width + left + right },
    reset: false,
    immediate: skipAnimation,
  });

  const clipId = cleanId(`${chartId}-${id}-line-clip`);
  return (
    <React.Fragment>
      <clipPath id={clipId}>
        <animated.rect x={0} y={0} width={animatedWidth} height={top + height + bottom} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <Line {...lineProps} d={path} />
      </g>
    </React.Fragment>
  );
}

LineElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  color: PropTypes.string.isRequired,
  d: PropTypes.string.isRequired,
  highlightScope: PropTypes.shape({
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series']),
  }),
  id: PropTypes.string.isRequired,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
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

export { LineElement };
