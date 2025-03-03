import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockHour24Options(parameters: useClockHour24Options.Parameters) {
  const { children, getItems } = parameters;
  const utils = useUtils();

  return useClockOptionList({
    section: 'hour24',
    precision: 'hour',
    children,
    getItems,
    step: 1, // TODO: Add step prop?
    format: utils.formats.hours24h,
  });
}

export namespace useClockHour24Options {
  export interface Parameters extends useClockOptionList.PublicParameters {}
}
