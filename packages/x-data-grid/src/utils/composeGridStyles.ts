import { composeStyles, type CSSMeta, type CSSStyles } from '@mui/x-internals/css';
import type { DataGridProcessedProps } from '../models/props/DataGridProps';

export function composeGridStyles<T extends CSSStyles>(
  styles: CSSMeta<T>,
  classes: DataGridProcessedProps['classes'],
) {
  return composeStyles('MuiDataGrid', styles, classes);
}
