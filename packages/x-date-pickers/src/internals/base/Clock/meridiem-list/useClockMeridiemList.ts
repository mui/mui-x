import { useClockList } from '../utils/useClockList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockMeridiemList(parameters: useClockMeridiemList.Parameters) {
  const utils = useUtils();

  return useClockList({
    ...parameters,
    section: 'meridiem',
    precision: 'meridiem',
    step: 1,
    format: utils.formats.meridiem,
  });
}

export namespace useClockMeridiemList {
  export interface Parameters extends useClockList.PublicParameters {}
}
