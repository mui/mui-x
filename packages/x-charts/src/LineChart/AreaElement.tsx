'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { type SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useItemHighlightState } from '../hooks/useItemHighlightState';
import { AnimatedArea, type AnimatedAreaProps } from './AnimatedArea';
import { type SeriesId } from '../models/seriesType/common';
import { type LineClasses, useUtilityClasses as useLineUtilityClasses } from './lineClasses';

export interface AreaElementOwnerState {
  seriesId: SeriesId;
  color: string;
  gradientId?: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<LineClasses>;
}

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
  extends
    Omit<AreaElementOwnerState, 'isFaded' | 'isHighlighted'>,
    Pick<AnimatedAreaProps, 'skipAnimation'>,
    Omit<React.SVGProps<SVGPathElement>, 'ref' | 'color'> {
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
    seriesId,
    classes: innerClasses,
    color,
    gradientId,
    slots,
    slotProps,
    onClick,
    ...other
  } = props;

  const identifier = React.useMemo(() => ({ type: 'line' as const, seriesId }), [seriesId]);
  const highlightState = useItemHighlightState(identifier);
  const isHighlighted = highlightState === 'highlighted';
  const isFaded = highlightState === 'faded';

  const ownerState = {
    seriesId,
    classes: innerClasses,
    color,
    gradientId,
    isFaded,
    isHighlighted,
  };
  const classes = useLineUtilityClasses();

  const Area = slots?.area ?? AnimatedArea;
  const areaProps = useSlotProps({
    elementType: Area,
    externalSlotProps: slotProps?.area,
    additionalProps: {
      onClick,
      cursor: onClick ? 'pointer' : 'unset',
      'data-highlighted': isHighlighted || undefined,
      'data-faded': isFaded || undefined,
      'data-series-id': seriesId,
      'data-series': seriesId,
    },
    className: classes.area,
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
  seriesId: PropTypes.string.isRequired,
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
