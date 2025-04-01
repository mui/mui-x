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

type P<T> = Partial<Omit<T, 'className' | 'style' | 'slotProps'>>;

declare module '@mui/x-data-grid' {
  interface BaseAutocompletePropsOverrides {
    material?: P<AutocompleteProps<string, true, false, true>>;
  }
  interface BaseBadgePropsOverrides {
    material?: P<BadgeProps>;
  }
  interface BaseCheckboxPropsOverrides {
    material?: P<CheckboxProps>;
  }
  interface BaseCircularProgressPropsOverrides {
    material?: P<CircularProgressProps>;
  }
  interface BaseDividerPropsOverrides {
    material?: P<DividerProps>;
  }
  interface BaseLinearProgressPropsOverrides {
    material?: P<LinearProgressProps>;
  }
  interface BaseMenuListPropsOverrides {
    material?: P<MenuListProps>;
  }
  interface BaseMenuItemPropsOverrides {
    material?: P<MenuItemProps>;
  }
  interface BaseTextFieldPropsOverrides {
    material?: P<TextFieldProps>;
  }
  interface BaseSwitchPropsOverrides {
    material?: P<SwitchProps>;
  }
  interface BaseButtonPropsOverrides {
    material?: P<ButtonProps>;
  }
  interface BaseIconButtonPropsOverrides {
    material?: P<IconButtonProps>;
  }
  interface BasePaginationPropsOverrides {
    material?: P<TablePaginationProps>;
  }
  interface BasePopperPropsOverrides {
    material?: P<PopperProps>;
  }
  interface BaseTooltipPropsOverrides {
    material?: P<TooltipProps>;
  }
  interface BaseInputPropsOverrides {
    material?: P<InputProps>;
  }
  interface BaseSelectPropsOverrides {
    material?: P<SelectProps>;
  }
  interface BaseSkeletonPropsOverrides {
    material?: P<SkeletonProps>;
  }
}
