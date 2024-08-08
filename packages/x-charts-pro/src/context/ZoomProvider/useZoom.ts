import * as React from 'react';
import { ZoomContext } from './ZoomContext';
import { ZoomState } from './Zoom.types';

/**
 * Get access to the zoom state.
 *
 * @returns {ZoomState} The zoom state.
 */
export function useZoom(): ZoomState {
  const { data, isInitialized } = React.useContext(ZoomContext);

  if (!isInitialized) {
    throw new Error(
      [
        'MUI X: Could not find the zoom context.',
        'It looks like you rendered your component outside of a ChartsContainer parent component.',
      ].join('\n'),
    );
  }

  return data;
}
