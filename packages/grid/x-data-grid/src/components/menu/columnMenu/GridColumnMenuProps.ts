import * as React from 'react';
import { MenuListProps } from '@mui/material/MenuList';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridColumnMenuRootProps } from '../../../hooks/features/columnMenu';

export interface GridColumnMenuContainerProps extends React.HTMLAttributes<HTMLUListElement> {
  hideMenu: (event: React.SyntheticEvent) => void;
  colDef: GridColDef;
  open: boolean;
  id?: string;
  labelledby?: string;
  /**
   * Props of type `Partial<MenuListProps>` to override MenuList default props
   */
  MenuListProps?: Partial<MenuListProps>;
}

export interface GridGenericColumnMenuProps
  extends GridColumnMenuRootProps,
    GridColumnMenuContainerProps {}

export interface GridColumnMenuProps
  extends Omit<GridGenericColumnMenuProps, 'defaultComponents' | 'defaultComponentsProps'> {}
