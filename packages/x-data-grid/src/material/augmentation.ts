import type { AutocompleteProps } from '@mui/material/Autocomplete';
import type { BadgeProps } from '@mui/material/Badge';
import type { CheckboxProps } from '@mui/material/Checkbox';
import type { CircularProgressProps } from '@mui/material/CircularProgress';
import type { DividerProps } from '@mui/material/Divider';
import type { LinearProgressProps } from '@mui/material/LinearProgress';
import type { MenuListProps } from '@mui/material/MenuList';
import type { MenuItemProps } from '@mui/material/MenuItem';
import type { TextFieldProps } from '@mui/material/TextField';
import type { SwitchProps } from '@mui/material/Switch';
import type { ButtonProps } from '@mui/material/Button';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { TablePaginationProps } from '@mui/material/TablePagination';
import type { PopperProps } from '@mui/material/Popper';
import type { TooltipProps } from '@mui/material/Tooltip';
import type { InputProps } from '@mui/material/Input';
import type { SelectProps } from '@mui/material/Select';
import type { SkeletonProps } from '@mui/material/Skeleton';

declare module '@mui/x-data-grid' {
  interface BaseAutocompletePropsOverrides {
    material?: Partial<AutocompleteProps<string, true, false, true>>;
  }
  interface BaseBadgePropsOverrides {
    material?: Partial<BadgeProps>;
  }
  interface BaseCheckboxPropsOverrides {
    material?: Partial<CheckboxProps>;
  }
  interface BaseCircularProgressPropsOverrides {
    material?: Partial<CircularProgressProps>;
  }
  interface BaseDividerPropsOverrides {
    material?: Partial<DividerProps>;
  }
  interface BaseLinearProgressPropsOverrides {
    material?: Partial<LinearProgressProps>;
  }
  interface BaseMenuListPropsOverrides {
    material?: Partial<MenuListProps>;
  }
  interface BaseMenuItemPropsOverrides {
    material?: Partial<MenuItemProps>;
  }
  interface BaseTextFieldPropsOverrides {
    material?: Partial<TextFieldProps>;
  }
  interface BaseSwitchPropsOverrides {
    material?: Partial<SwitchProps>;
  }
  interface BaseButtonPropsOverrides {
    material?: Partial<ButtonProps>;
  }
  interface BaseIconButtonPropsOverrides {
    material?: Partial<IconButtonProps>;
  }
  interface BasePaginationPropsOverrides {
    material?: Partial<TablePaginationProps>;
  }
  interface BasePopperPropsOverrides {
    material?: Partial<PopperProps>;
  }
  interface BaseTooltipPropsOverrides {
    material?: Partial<TooltipProps>;
  }
  interface BaseInputPropsOverrides {
    material?: Partial<InputProps>;
  }
  interface BaseSelectPropsOverrides {
    material?: Partial<SelectProps>;
  }
  interface BaseSkeletonPropsOverrides {
    material?: Partial<SkeletonProps>;
  }
}
