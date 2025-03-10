import { useClockList } from '../utils/useClockList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockHour12List(parameters: useClockHour12List.Parameters) {
  const utils = useUtils();

  return useClockList({
    ...parameters,
    section: 'hour12',
    precision: 'hour',
    step: 1, // TODO: Add step prop?
    format: utils.formats.hours12h,
  });
}

export namespace useClockHour12List {
  export interface Parameters extends useClockList.PublicParameters {}
}
