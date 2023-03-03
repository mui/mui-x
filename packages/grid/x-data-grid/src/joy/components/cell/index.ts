import { IconButtonProps } from '@mui/joy/IconButton';
import { MenuItemProps } from '@mui/joy/MenuItem';

import {
  GridActionsCellItem as InternalGridActionsCellItem,
  GridActionsCellItemProps as InternalActionsCellItemProps,
} from '../../../components/cell/GridActionsCellItem';

export type GridActionsCellItemProps = InternalActionsCellItemProps<IconButtonProps, MenuItemProps>;
export const GridActionsCellItem = InternalGridActionsCellItem as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<GridActionsCellItemProps> & React.RefAttributes<HTMLButtonElement>
>;
