import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockMeridiemOptions(parameters: useClockMeridiemOptions.Parameters) {
  const utils = useUtils();

  return useClockOptionList({
    ...parameters,
    section: 'meridiem',
    precision: 'meridiem',
    step: 1,
    format: utils.formats.meridiem,
  });
}

export namespace useClockMeridiemOptions {
  export interface Parameters extends useClockOptionList.PublicParameters {}
}
