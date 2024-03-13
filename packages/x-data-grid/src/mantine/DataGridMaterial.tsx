import * as React from 'react'
import { useThemeProps } from '@mui/material';
import { DataGridRaw } from '../DataGrid';
import { DataGridProps } from '../models/props/DataGridProps';

export const DATA_GRID_MATERIAL_PROPS: Partial<DataGridProps> = {
  useThemeProps: useThemeProps as any,
}

export function DataGridMaterial(props: DataGridProps) {
  return (
    <DataGridRaw
      {...DATA_GRID_MATERIAL_PROPS}
      {...props}
    />
  )
}
