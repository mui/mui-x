import * as React from 'react';
import { GridOverlay } from './styled-wrappers/GridOverlay';

export interface ErrorMessageProps {
  message?: string;
}
export function ErrorMessage({ message }: ErrorMessageProps) {
  return <GridOverlay>{message || 'An error occurred.'}</GridOverlay>;
}
