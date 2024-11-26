import * as React from 'react';

export interface SizeProviderProps {
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width?: number;
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height?: number;
  children: React.ReactNode;
}

export interface SizeContextState extends Required<Pick<SizeProviderProps, 'height' | 'width'>> {
  /**
   * The ref of the container element that the chart is rendered in.
   */
  containerRef: React.RefObject<HTMLDivElement>;
  /**
   * If the chart has a defined size.
   */
  hasIntrinsicSize: boolean;
  /**
   * The input height of the chart in px.
   */
  inHeight?: number;
  /**
   * The input width of the chart in px.
   */
  inWidth?: number;
}
