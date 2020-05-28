import React from 'react';
import { GridOverlay } from './styled-wrappers';
import { CircularProgress } from '@material-ui/core';

export const LoadingOverlay: React.FC<{}> = () => (
  <GridOverlay>
    <CircularProgress />
  </GridOverlay>
);
