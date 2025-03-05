import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockMinuteOptions(parameters: useClockMinuteOptions.Parameters) {
  const utils = useUtils();

  return useClockOptionList({
    ...parameters,
    section: 'minute',
    precision: 'minute',
    step: parameters.step ?? 1,
    format: utils.formats.minutes,
  });
}

export namespace useClockMinuteOptions {
  export interface Parameters extends useClockOptionList.PublicParameters {
    /**
     * The step in minutes between two consecutive items.
     * @default 1
     */
    step?: number;
  }
}
