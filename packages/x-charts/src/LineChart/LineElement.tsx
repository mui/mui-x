import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { useSlotProps } from '@mui/base/utils';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { InteractionContext } from '../context/InteractionProvider';
import {
  getIsFaded,
  getIsHighlighted,
  useInteractionItemProps,
} from '../hooks/useInteractionItemProps';
import { HighlightScope } from '../context/HighlightProvider';
import { AnimatedLine, AnimatedLineProps } from './AnimatedLine';
import { SeriesId } from '../models/seriesType/common';

export interface LineElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when higlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type LineElementClassKey = keyof LineElementClasses;

export interface LineElementOwnerState {
  id: SeriesId;
  color: string;
  gradientId?: string;
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

export interface LineElementSlots {
  /**
   * The component that renders the line.
   * @default LineElementPath
   */
  line?: React.JSXElementConstructor<AnimatedLineProps>;
}

export interface LineElementSlotProps {
  line?: AnimatedLineProps;
}

export interface LineElementProps
  extends Omit<LineElementOwnerState, 'isFaded' | 'isHighlighted'>,
    Pick<AnimatedLineProps, 'skipAnimation'>,
    Omit<React.ComponentPropsWithoutRef<'path'>, 'color' | 'id'> {
  d: string;
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
    gradientId,
    highlightScope,
    slots,
    slotProps,
    onClick,
    ...other
  } = props;
  const getInteractionItemProps = useInteractionItemProps(highlightScope);

  const { item } = React.useContext(InteractionContext);

  const isHighlighted = getIsHighlighted(item, { type: 'line', seriesId: id }, highlightScope);
  const isFaded =
    !isHighlighted && getIsFaded(item, { type: 'line', seriesId: id }, highlightScope);

  const ownerState = {
    id,
    classes: innerClasses,
    color,
    gradientId,
    isFaded,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  const Line = slots?.line ?? AnimatedLine;
  const lineProps = useSlotProps({
    elementType: Line,
    externalSlotProps: slotProps?.line,
    additionalProps: {
      ...other,
      ...getInteractionItemProps({ type: 'line', seriesId: id }),
      className: classes.root,
      onClick,
      cursor: onClick ? 'pointer' : 'unset',
    },
    ownerState,
  });

  return <Line {...lineProps} />;
}

LineElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  color: PropTypes.string.isRequired,
  d: PropTypes.string.isRequired,
  gradientId: PropTypes.string,
  highlightScope: PropTypes.shape({
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series']),
  }),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
