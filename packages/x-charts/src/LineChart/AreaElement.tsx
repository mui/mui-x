import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import useSlotProps from '@mui/utils/useSlotProps';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { SlotComponentPropsFromProps } from '../internals/SlotComponentPropsFromProps';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { AnimatedArea, AnimatedAreaProps } from './AnimatedArea';
import { SeriesId } from '../models/seriesType/common';
import { useItemHighlighted } from '../context';

export interface AreaElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when highlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type AreaElementClassKey = keyof AreaElementClasses;

export interface AreaElementOwnerState {
  id: SeriesId;
  color: string;
  gradientId?: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<AreaElementClasses>;
}

export function getAreaElementUtilityClass(slot: string) {
  return generateUtilityClass('MuiAreaElement', slot);
}

export const areaElementClasses: AreaElementClasses = generateUtilityClasses('MuiAreaElement', [
  'root',
  'highlighted',
  'faded',
]);

const useUtilityClasses = (ownerState: AreaElementOwnerState) => {
  const { classes, id, isFaded, isHighlighted } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded'],
  };

  return composeClasses(slots, getAreaElementUtilityClass, classes);
};

export interface AreaElementSlots {
  /**
   * The component that renders the area.
   * @default AnimatedArea
   */
  area?: React.JSXElementConstructor<AnimatedAreaProps>;
}

export interface AreaElementSlotProps {
  area?: SlotComponentPropsFromProps<AnimatedAreaProps, {}, AreaElementOwnerState>;
}

export interface AreaElementProps
  extends Omit<AreaElementOwnerState, 'isFaded' | 'isHighlighted'>,
    Pick<AnimatedAreaProps, 'skipAnimation'>,
    Omit<React.SVGProps<SVGPathElement>, 'ref' | 'color' | 'id'> {
  d: string;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: AreaElementSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: AreaElementSlots;
}

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 *
 * API:
 *
 * - [AreaElement API](https://mui.com/x/api/charts/area-element/)
 */
function AreaElement(props: AreaElementProps) {
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

  const Area = slots?.area ?? AnimatedArea;
  const areaProps = useSlotProps({
    elementType: Area,
    externalSlotProps: slotProps?.area,
    additionalProps: {
      ...getInteractionItemProps({ type: 'line', seriesId: id }),
      onClick,
      cursor: onClick ? 'pointer' : 'unset',
    },
    className: classes.root,
    ownerState,
  });

  return <Area {...other} {...areaProps} />;
}

AreaElement.propTypes = {
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

export { AreaElement };
