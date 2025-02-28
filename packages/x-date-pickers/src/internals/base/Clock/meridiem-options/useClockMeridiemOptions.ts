import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockMeridiemOptions(parameters: useClockMeridiemOptions.Parameters) {
  const { children, getItems } = parameters;
  const utils = useUtils();

  return useClockOptionList({
    section: 'meridiem',
    precision: 'meridiem',
    children,
    getItems,
    step: 1,
    format: utils.formats.meridiem,
  });
}

export namespace useClockMeridiemOptions {
  export interface Parameters extends useClockOptionList.PublicParameters {}
}
