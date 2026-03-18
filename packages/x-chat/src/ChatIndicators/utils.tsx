import * as React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { joinClassNames } from '../internals/utils';

export function createSxRootSlot(
  Component: React.ElementType,
  className: string,
  sx?: SxProps<Theme>,
) {
  return React.forwardRef(function RootSlot(
    props: React.HTMLAttributes<HTMLElement> & {
      ownerState?: unknown;
    },
    ref: React.Ref<any>,
  ) {
    const { ownerState, ...other } = props;

    return (
      <Component
        className={joinClassNames(className, (other as { className?: string }).className)}
        ownerState={ownerState}
        ref={ref}
        sx={sx}
        {...other}
      />
    );
  });
}
