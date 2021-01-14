import * as React from 'react';
import { useEventCallback as muiUseEventCallback } from '@material-ui/core/utils';

export function useEventCallback<T extends (...args: any[]) => any>(func: T): T {
  // @ts-ignore TODO remove wrapper once upgraded to v5
  return muiUseEventCallback(func);
}

// TODO replace with { useEnhancedEffect } from @material-ui/core/utils.
export const useEnhancedEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
