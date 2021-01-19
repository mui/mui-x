import * as React from 'react';
import { ApiContext } from './api-context';
import { GridOverlay } from './containers/GridOverlay';

export interface ErrorOverlayProps {
  message?: string;
}
export function ErrorOverlay({ message }: ErrorOverlayProps) {
  const apiRef = React.useContext(ApiContext);
  const defaultLabel = apiRef!.current.getLocaleText('errorOverlayDefaultLabel');
  return <GridOverlay>{message || defaultLabel}</GridOverlay>;
}
