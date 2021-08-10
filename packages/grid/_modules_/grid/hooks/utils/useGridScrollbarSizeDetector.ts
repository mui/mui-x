// TODO replace with { unstable_getScrollbarSize } from '@material-ui/utils'
import { ownerDocument } from '@material-ui/core/utils';
import * as React from 'react';
import { GridComponentProps } from '../../GridComponentProps';
import { GridApiRef } from '../../models/api/gridApiRef';
import { allGridColumnsSelector } from '../features/columns/gridColumnsSelector';
import { useGridSelector } from '../features/core/useGridSelector';
import { useGridState } from '../features/core/useGridState';
import { useLogger } from './useLogger';


export function useGridScrollbarSizeDetector(
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'scrollbarSize'>,
) {
  const logger = useLogger('useGridScrollbarSizeDetector');
  const [, setGridState] = useGridState(apiRef);
  const hasColumns = useGridSelector(apiRef, allGridColumnsSelector).length > 0;


}
