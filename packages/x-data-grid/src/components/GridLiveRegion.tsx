'use client';
import * as React from 'react';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';

export function GridLiveRegion() {
  const apiRef = useGridPrivateApiContext();
  // The content is written by `apiRef.current.announce()`, not by React
  return (
    <div
      ref={apiRef.current.liveRegionRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={visuallyHidden}
    />
  );
}
