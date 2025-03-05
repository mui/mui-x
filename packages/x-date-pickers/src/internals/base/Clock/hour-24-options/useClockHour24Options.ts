import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockHour24Options(parameters: useClockHour24Options.Parameters) {
  const utils = useUtils();

  return useClockOptionList({
    ...parameters,
    section: 'hour24',
    precision: 'hour',
    step: 1, // TODO: Add step prop?
    format: utils.formats.hours24h,
  });
}

export namespace useClockHour24Options {
  export interface Parameters extends useClockOptionList.PublicParameters {}
}
