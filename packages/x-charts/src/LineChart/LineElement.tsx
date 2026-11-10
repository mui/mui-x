'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import type { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { AnimatedLine } from './AnimatedLine';
import type { AnimatedLineProps } from './AnimatedLine';
import type { SeriesId } from '../models/seriesType/common';
import { useItemHighlightState } from '../hooks/useItemHighlightState';
import { selectorChartExperimentalFeaturesState } from '../internals/plugins/corePlugins/useChartExperimentalFeature';
import { useStore } from '../internals/store/useStore';
import { useUtilityClasses as useLineUtilityClasses } from './lineClasses';
import type { LineClasses } from './lineClasses';
import type { LinePropsOverrides } from '../models/chartsSlotsComponentsProps';

export interface LineElementOwnerState {
  /**
   * The id of the series the element belongs to.
   */
  seriesId: SeriesId;
  /**
   * The color of the line.
   */
  color: string;
  /**
   * The id of the gradient used to color the element.
   * The `gradientId` is used as `url(#gradientId)`.
   */
  gradientId?: string;
  isFaded: boolean;
  isHighlighted: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<Pick<LineClasses, 'line'>>;
  /** If `true`, the line is hidden. */
  hidden?: boolean;
}

export interface LineElementSlots {
  /**
   * The component that renders the line.
   * @default LineElementPath
   */
  line?: React.JSXElementConstructor<AnimatedLineProps & LinePropsOverrides>;
}

export interface LineElementSlotProps {
  line?: SlotComponentPropsFromProps<AnimatedLineProps, LinePropsOverrides, LineElementOwnerState>;
}

export interface LineElementProps
  extends
    Omit<LineElementOwnerState, 'isFaded' | 'isHighlighted'>,
    Pick<AnimatedLineProps, 'skipAnimation'>,
    Omit<React.SVGProps<SVGPathElement>, 'ref' | 'color'> {
  /**
   * The SVG path of the element.
   */
  d: string;
  /** If `true`, the line is hidden. */
  hidden?: boolean;
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
    seriesId,
    classes: innerClasses,
    color,
    gradientId,
    slots,
    slotProps,
    onClick,
    hidden,
    ...other
  } = props;

  const store = useStore();
  const enablePositionBasedPointerInteraction = store.use(
    selectorChartExperimentalFeaturesState,
    'enablePositionBasedPointerInteraction',
  );
  const identifier = React.useMemo(() => ({ type: 'line' as const, seriesId }), [seriesId]);
  const interactionProps = useInteractionItemProps(identifier);

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
    hidden,
  };
  const classes = useLineUtilityClasses();

  const Line = slots?.line ?? AnimatedLine;
  const lineProps = useSlotProps({
    elementType: Line,
    externalSlotProps: slotProps?.line,
    additionalProps: {
      ...(enablePositionBasedPointerInteraction ? {} : interactionProps),
      onClick,
      cursor: onClick ? 'pointer' : 'unset',
      'data-highlighted': isHighlighted || undefined,
      'data-faded': isFaded || undefined,
      'data-series-id': seriesId,
      'data-series': seriesId,
    },
    className: classes.line,
    ownerState,
  });

  return <Line {...other} {...lineProps} />;
}

LineElement.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The color of the line.
   */
  color: PropTypes.string.isRequired,
  /**
   * The SVG path of the element.
   */
  d: PropTypes.string.isRequired,
  /**
   * The id of the gradient used to color the element.
   * The `gradientId` is used as `url(#gradientId)`.
   */
  gradientId: PropTypes.string,
  /**
   * If `true`, the line is hidden.
   */
  hidden: PropTypes.bool,
  /**
   * The id of the series the element belongs to.
   */
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

export { LineElement };
