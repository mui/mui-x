import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import { type SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { useUtilityClasses } from '../scatterClasses';
import { type ScatterClasses } from '../scatterClasses';
import { useItemHighlightState } from '../../hooks/useItemHighlightState';
import { type SeriesId } from '../../models/seriesType/common';
import { type MarkerLabelFunction, type ScatterValueType } from '../../models/seriesType/scatter';
import { MarkerLabel, type MarkerLabelOwnerState, type MarkerLabelProps } from './MarkerLabel';
import { getMarkerLabel } from './getMarkerLabel';

export interface MarkerLabelSlots {
  /**
   * The component that renders the marker label.
   * @default MarkerLabel
   */
  markerLabel?: React.JSXElementConstructor<MarkerLabelProps>;
}

export interface MarkerLabelSlotProps {
  markerLabel?: SlotComponentPropsFromProps<MarkerLabelProps, {}, MarkerLabelOwnerState>;
}

export type MarkerLabelItemProps = {
  classes?: Partial<ScatterClasses>;
  seriesId: SeriesId;
  dataIndex: number;
  slotProps?: MarkerLabelSlotProps;
  slots?: MarkerLabelSlots;
  /**
   * The position of the marker in the x-axis.
   */
  x: number;
  /**
   * The position of the marker in the y-axis.
   */
  y: number;
  /**
   * The full scatter point value.
   */
  value: ScatterValueType;
  /**
   * The resolved marker size in pixels.
   */
  markerSize: number;
  /**
   * Resolver for the displayed label.
   */
  markerLabel: 'label' | MarkerLabelFunction;
};

function MarkerLabelItem(props: MarkerLabelItemProps) {
  const {
    seriesId,
    classes: innerClasses,
    dataIndex,
    slots,
    slotProps,
    x,
    y,
    value,
    markerSize,
    markerLabel,
  } = props;

  const highlightState = useItemHighlightState({
    type: 'scatter',
    seriesId,
    dataIndex,
  });
  const isHighlighted = highlightState === 'highlighted';
  const isFaded = highlightState === 'faded';

  const ownerState: MarkerLabelOwnerState = {
    classes: innerClasses,
    isFaded,
  };
  const classes = useUtilityClasses(ownerState);

  const Component = slots?.markerLabel ?? MarkerLabel;

  const { ownerState: markerLabelOwnerState, ...markerLabelProps } = useSlotProps({
    elementType: Component,
    externalSlotProps: slotProps?.markerLabel,
    additionalProps: {
      x,
      y,
      isFaded,
      className: classes.label,
      'data-highlighted': isHighlighted || undefined,
      'data-faded': isFaded || undefined,
    },
    ownerState,
  });

  const text = getMarkerLabel({ markerLabel, value, dataIndex, seriesId, markerSize });

  if (text === '') {
    return null;
  }

  return (
    <Component {...markerLabelProps} {...markerLabelOwnerState}>
      {text}
    </Component>
  );
}

MarkerLabelItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  markerLabel: PropTypes.oneOfType([PropTypes.oneOf(['label']), PropTypes.func]).isRequired,
  markerSize: PropTypes.number.isRequired,
  seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  slotProps: PropTypes.object,
  slots: PropTypes.object,
  value: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
} as any;

export { MarkerLabelItem };
