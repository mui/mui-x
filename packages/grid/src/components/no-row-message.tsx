import React from 'react';
import { GridOverlay } from '../styled-wrappers/window-overlay';
import { CircularProgress } from '@material-ui/core';

export const NoRowMessage: React.FC<{}> = () => <GridOverlay>No Rows</GridOverlay>;
export const LoadingMessage: React.FC<{}> = () => (
  <GridOverlay>
    <CircularProgress />
  </GridOverlay>
);
