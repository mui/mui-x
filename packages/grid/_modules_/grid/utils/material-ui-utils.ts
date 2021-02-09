import * as React from 'react';
import { useEventCallback as muiUseEventCallback } from '@material-ui/core/utils';
import { getThemeProps } from '@material-ui/styles';
import { useTheme } from '@material-ui/core/styles';

export function useEventCallback<T extends (...args: any[]) => any>(func: T): T {
  // @ts-expect-error TODO remove wrapper once upgraded to v5
  return muiUseEventCallback(func);
}

// TODO replace with { useEnhancedEffect } from @material-ui/core/utils.
export const useEnhancedEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

// TODO replace with { useThemeProps } from @material-ui/core/styles.
export function useThemeProps({ props: inputProps, name }) {
  const props = { ...inputProps };
  const contextTheme: any = useTheme();
  const more = getThemeProps({ theme: contextTheme, name, props });
  const theme = more.theme || contextTheme;
  const isRtl = theme.direction === 'rtl';

  return {
    theme,
    isRtl,
    ...more,
  };
}
