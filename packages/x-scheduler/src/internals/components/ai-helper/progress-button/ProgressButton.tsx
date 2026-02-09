'use client';
import * as React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import useTimeout from '@mui/utils/useTimeout';

export interface ProgressButtonProps extends ButtonProps {
  /**
   * The duration in milliseconds before the onClick handler is automatically triggered.
   */
  timeoutMs: number;
}

const ProgressButtonRoot = styled(Button)({
  position: 'relative',
  overflow: 'hidden',
});

const ProgressOverlay = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: '100%',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)',
  transformOrigin: 'left',
  animationName: 'progress-fill',
  animationTimingFunction: 'linear',
  animationFillMode: 'forwards',
  pointerEvents: 'none',
  '@keyframes progress-fill': {
    from: { transform: 'scaleX(0)' },
    to: { transform: 'scaleX(1)' },
  },
}));

export const ProgressButton = React.forwardRef<HTMLButtonElement, ProgressButtonProps>(
  function ProgressButton(props, ref) {
    const { timeoutMs, onClick, children, ...other } = props;
    const timeout = useTimeout();

    React.useEffect(() => {
      timeout.start(timeoutMs, () => {
        onClick?.(undefined as unknown as React.MouseEvent<HTMLButtonElement>);
      });
    }, [timeout, timeoutMs, onClick]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      timeout.clear();
      onClick?.(event);
    };

    return (
      <ProgressButtonRoot ref={ref} onClick={handleClick} {...other}>
        <ProgressOverlay style={{ animationDuration: `${timeoutMs}ms` }} />
        {children}
      </ProgressButtonRoot>
    );
  },
);
