import * as React from 'react';
import { GridApiContext } from './GridApiContext';
import { GridOverlay } from './containers/GridOverlay';

export interface ErrorOverlayProps {
  message?: string;
}
export function ErrorOverlay({ message }: ErrorOverlayProps) {
  const apiRef = React.useContext(GridApiContext);
  const defaultLabel = apiRef!.current.getLocaleText('errorOverlayDefaultLabel');
  return <GridOverlay>{message || defaultLabel}</GridOverlay>;
}
