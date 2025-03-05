import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockHour12Options(parameters: useClockHour12Options.Parameters) {
  const utils = useUtils();

  return useClockOptionList({
    ...parameters,
    section: 'hour12',
    precision: 'hour',
    step: 1, // TODO: Add step prop?
    format: utils.formats.hours12h,
  });
}

export namespace useClockHour12Options {
  export interface Parameters extends useClockOptionList.PublicParameters {}
}
