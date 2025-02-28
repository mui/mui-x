import { useClockOptionList } from '../utils/useClockOptionList';
import { useUtils } from '../../../hooks/useUtils';

export function useClockMinuteOptions(parameters: useClockMinuteOptions.Parameters) {
  const { children, getItems, step = 1 } = parameters;
  const utils = useUtils();

  return useClockOptionList({
    section: 'minute',
    precision: 'minute',
    children,
    getItems,
    step,
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
