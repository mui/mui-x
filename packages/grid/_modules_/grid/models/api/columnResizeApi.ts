import * as React from 'react';

/**
 * The columnResize API interface that is available in the grid [[apiRef]].
 */
export interface ColumnResizeApi {
  /**
   * Event handler to be hooked on mousedown that will handle resize.
   * @param field
   */
  startResizeOnMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
}
