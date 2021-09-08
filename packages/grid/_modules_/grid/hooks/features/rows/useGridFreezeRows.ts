import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';

export function useGridFreezeRows(apiRef: GridApiRef, props: Pick<GridComponentProps, 'rows'>) {
  if (process.env.NODE_ENV !== 'production') {
    // Freeze rows for immutability
    Object.freeze(props.rows);
  }
}
