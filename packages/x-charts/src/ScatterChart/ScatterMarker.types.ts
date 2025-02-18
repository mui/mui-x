import * as React from 'react';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { DefaultizedScatterSeriesType } from '../models';

export interface ScatterMarkerProps {
  series: DefaultizedScatterSeriesType;
  dataIndex: number;
  x: number;
  y: number;
  color: string;
  isHighlighted: boolean;
  isFaded: boolean;
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   */
  onClick?: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
}

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

export interface ScatterMarkerElementProps
  extends Pick<
    ScatterMarkerProps,
    'series' | 'dataIndex' | 'x' | 'y' | 'color' | 'isHighlighted' | 'isFaded'
  > {
  slots?: ScatterMarkerSlots;
  slotProps?: ScatterMarkerSlotProps;
  onItemClick: ScatterMarkerProps['onClick'];
  interactionProps: ReturnType<ReturnType<typeof useInteractionItemProps>>;
}
