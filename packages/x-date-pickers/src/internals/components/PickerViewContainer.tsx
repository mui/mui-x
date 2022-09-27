import * as React from 'react';
import { styled } from '@mui/material/styles';

interface PickerViewContainerProps {
  isLandscape: boolean;
  children: React.ReactNode;
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
