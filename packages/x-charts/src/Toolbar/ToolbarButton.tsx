import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import * as React from 'react';

export const ToolbarButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function ToolbarButton(props, ref) {
    return <IconButton ref={ref} {...props} />;
  },
);
