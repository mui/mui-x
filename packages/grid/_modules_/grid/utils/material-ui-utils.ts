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

// TODO replace with { unstable_getScrollbarSize } from '@material-ui/utils'
// A change of the browser zoom change the scrollbar size.
// Credit https://github.com/twbs/bootstrap/blob/3ffe3a5d82f6f561b82ff78d82b32a7d14aed558/js/src/modal.js#L512-L519
export function getScrollbarSize(doc: Document): number {
  const scrollDiv = doc.createElement('div');
  scrollDiv.style.width = '99px';
  scrollDiv.style.height = '99px';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';
  scrollDiv.style.overflow = 'scroll';

  doc.body.appendChild(scrollDiv);
  const scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  doc.body.removeChild(scrollDiv);

  return scrollbarSize;
}
