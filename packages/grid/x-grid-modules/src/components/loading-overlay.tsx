import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GridOverlay } from './styled-wrappers';

export const LoadingOverlay: React.FC<{}> = () => (
  <GridOverlay>
    <CircularProgress />
  </GridOverlay>
);
