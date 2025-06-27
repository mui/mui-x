import type { DividerProps } from '@mui/material/Divider';
import type { MenuItemProps } from '@mui/material/MenuItem';
import type { MenuListProps } from '@mui/material/MenuList';
import type { PopperProps } from '@mui/material/Popper';
import type { TooltipProps } from '@mui/material/Tooltip';

declare module '@mui/x-charts-pro' {
  interface ChartBaseDividerPropsOverrides {
    material?: Partial<DividerProps>;
  }

  interface ChartBaseMenuItemPropsOverrides {
    material?: Partial<MenuItemProps>;
  }

  interface ChartBaseMenuListPropsOverrides {
    material?: Partial<MenuListProps>;
  }

  interface ChartBasePopperPropsOverrides {
    material?: Partial<PopperProps>;
  }

  interface ChartBaseTooltipPropsOverrides {
    material?: Partial<TooltipProps>;
  }
}
