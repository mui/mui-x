import * as React from 'react';
import { styled } from '@mui/system';

export type BaseButtonProps = JSX.IntrinsicElements['button'] & {
  startIcon?: React.ReactNode;
  size?: 'small' | 'medium';
};

const ButtonRoot = styled('button')<{ ownerState: BaseButtonProps }>(({ ownerState }) => ({
  display: 'inline-flex',
  gap: '0.5rem',
  alignItems: 'center',
  fontSize: '17px',
  ...(ownerState.size === 'small' && {
    fontSize: '14px',
  }),
}));

export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>((inProps, ref) => {
  const { children, startIcon, size = 'medium', ...props } = inProps;
  const ownerState = {
    ...inProps,
    size,
  };
  return (
    <ButtonRoot type="button" ref={ref} ownerState={ownerState} {...props}>
      {startIcon}
      {children}
    </ButtonRoot>
  );
});
