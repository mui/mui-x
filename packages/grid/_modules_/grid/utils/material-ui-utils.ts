import { useEventCallback as muiUseEventCallback } from '@material-ui/core/utils';

export function useEventCallback<T extends (...args: any[]) => any>(func: T): T {
  // @ts-expect-error TODO remove wrapper once upgraded to v5
  return muiUseEventCallback(func);
}
