import { createSvgIcon as createSvgIconMaterial } from '@mui/material/utils';
import { GridBaseIconProps } from '../../models/gridSlotsComponentsProps';

export const createSvgIcon = createSvgIconMaterial as (
  path: React.ReactNode,
  displayName?: string,
) => (props: GridBaseIconProps) => React.ReactNode;
