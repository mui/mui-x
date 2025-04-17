import { composeStyles } from '@mui/x-internals/css';
import type { DataGridProcessedProps } from '../models/props/DataGridProps';

export function composeGridStyles<T extends Record<string, string>>(
  styles: T,
  classes: DataGridProcessedProps['classes'],
): T {
  return composeStyles('MuiDataGrid', styles, classes);
}
