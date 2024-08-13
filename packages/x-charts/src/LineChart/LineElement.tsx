import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import useSlotProps from '@mui/utils/useSlotProps';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { SlotComponentPropsFromProps } from '../internals/SlotComponentPropsFromProps';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { AnimatedLine, AnimatedLineProps } from './AnimatedLine';
import { SeriesId } from '../models/seriesType/common';
import { useItemHighlighted } from '../context';

export interface LineElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when highlighted. */
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
  line?: SlotComponentPropsFromProps<AnimatedLineProps, {}, LineElementOwnerState>;
}

export interface LineElementProps
  extends Omit<LineElementOwnerState, 'isFaded' | 'isHighlighted'>,
    Pick<AnimatedLineProps, 'skipAnimation'>,
    Omit<React.SVGProps<SVGPathElement>, 'ref' | 'color' | 'id'> {
  d: string;
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
    slots,
    slotProps,
    onClick,
    ...other
  } = props;
  const getInteractionItemProps = useInteractionItemProps();
  const { isFaded, isHighlighted } = useItemHighlighted({
    seriesId: id,
  });

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
      ...getInteractionItemProps({ type: 'line', seriesId: id }),
      onClick,
      cursor: onClick ? 'pointer' : 'unset',
    },
    className: classes.root,
    ownerState,
  });

  return <Line {...other} {...lineProps} />;
}

LineElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  color: PropTypes.string.isRequired,
  d: PropTypes.string.isRequired,
  gradientId: PropTypes.string,
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
