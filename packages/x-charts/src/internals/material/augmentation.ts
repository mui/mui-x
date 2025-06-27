import type { ButtonProps } from '@mui/material/Button';
import type { IconButtonProps } from '@mui/material/IconButton';

declare module '@mui/x-charts' {
  interface ChartBaseButtonPropsOverrides {
    material?: Partial<ButtonProps>;
  }

  interface ChartBaseIconButtonPropsOverrides {
    material?: Partial<IconButtonProps>;
  }
}
