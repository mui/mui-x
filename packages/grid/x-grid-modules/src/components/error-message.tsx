import * as React from 'react';
import { GridOverlay } from './styled-wrappers/window-overlay';

export function ErrorMessage({message}: {message?: string}) {
  return <GridOverlay>{message || 'An error occurred.'}</GridOverlay>;
}
