import { useClockList } from '../utils/useClockList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockHour24List(parameters: useClockHour24List.Parameters) {
  const utils = useUtils();

  return useClockList({
    ...parameters,
    section: 'hour24',
    precision: 'hour',
    step: 1, // TODO: Add step prop?
    format: utils.formats.hours24h,
  });
}

export namespace useClockHour24List {
  export interface Parameters extends useClockList.PublicParameters {}
}
