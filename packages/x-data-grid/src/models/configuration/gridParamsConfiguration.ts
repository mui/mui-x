import type { RefObject } from '@mui/x-internals/types';
import type { GridParamsApi } from '../api/gridParamsApi';

/**
 * Overridable params methods interface, these methods could be overriden in a higher plan package.
 */
export interface GridParamsOverridableMethodsInternalHook<Api> {
  useGridParamsOverridableMethods: (apiRef: RefObject<Api>) => {
    getCellValue: GridParamsApi['getCellValue'];
    getRowValue: GridParamsApi['getRowValue'];
    getRowFormattedValue: GridParamsApi['getRowFormattedValue'];
  };
}
