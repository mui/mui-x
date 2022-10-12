import * as React from 'react';
import { styled } from '@mui/material/styles';

export interface PickerViewContainerProps {
  children: React.ReactNode;
  isLandscape: boolean;
}

export const PickerViewContainerRoot = styled('div')<{ ownerState: { isLandscape: boolean } }>(
  ({ ownerState }) => ({
    display: 'flex',
    flexDirection: 'column',
    ...(ownerState.isLandscape && {
      flexDirection: 'row',
    }),
  }),
);

export function PickerViewContainer(props: PickerViewContainerProps) {
  const { isLandscape, children } = props;

  return <PickerViewContainerRoot ownerState={{ isLandscape }}>{children}</PickerViewContainerRoot>;
}
