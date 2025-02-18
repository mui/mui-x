import * as React from 'react';
import { ScatterMarkerOwnerState, ScatterMarkerProps } from './ScatterMarker';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';

export interface ScatterMarkerSlots {
  /**
   * The component that renders the marker for a scatter point.
   * @default ScatterMarker
   */
  marker?: React.JSXElementConstructor<ScatterMarkerProps>;
}

export interface ScatterMarkerSlotProps {
  marker?: ScatterMarkerProps;
}

export interface ScatterMarkerElementProps extends ScatterMarkerOwnerState {
  slots?: ScatterMarkerSlots;
  slotProps?: ScatterMarkerSlotProps;
  onItemClick: ScatterMarkerProps['onClick'];
  interactionProps: ReturnType<ReturnType<typeof useInteractionItemProps>>;
}
