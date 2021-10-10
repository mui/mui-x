import * as React from 'react';
import { useEventCallback as muiUseEventCallback } from '@mui/material/utils';
import { getThemeProps } from '@mui/styles';
import { StyledComponentProps, useTheme } from '@mui/material/styles';

/**
 * TODO import from the v5 directly
 *
 * Remove properties `K` from `T`.
 * Distributive for union types.
 *
 * @internal
 */
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

/**
 * TODO import from the core v5 directly
 *
 * @internal ONLY USE FROM WITHIN mui/mui
 *
 * Internal helper type for conform (describeConformance) components
 * However, we don't declare classes on this type.
 * It is recommended to declare them manually with an interface so that each class can have a separate JSDOC.
 */
export type InternalStandardProps<C, Removals extends keyof C = never> = DistributiveOmit<
  C,
  'classes' | Removals
> &
  // each component declares it's classes in a separate interface for proper JSDOC
  StyledComponentProps<never> & {
    ref?: C extends { ref?: infer RefType } ? RefType : React.Ref<unknown>;
    // TODO: Remove implicit props. Up to each component.
    className?: string;
    style?: React.CSSProperties;
  };

export function useEventCallback<T extends (...args: any[]) => any>(func: T): T {
  // @ts-expect-error TODO remove wrapper once upgraded to v5
  return muiUseEventCallback(func);
}

// TODO replace with { useEnhancedEffect } from @mui/material/utils.
export const useEnhancedEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

// TODO replace with { useThemeProps } from @mui/material/styles.
export function useThemeProps({ props: inputProps, name }) {
  const contextTheme: any = useTheme();

  return React.useMemo(() => {
    const props = { ...inputProps };
    const more = getThemeProps({ theme: contextTheme, name, props });
    const theme = more.theme || contextTheme;
    const isRtl = theme.direction === 'rtl';

    return {
      theme,
      isRtl,
      ...more,
    };
  }, [inputProps, name, contextTheme]);
}

// TODO replace with { unstable_composeClasses } from '@material-ui/unstyled'
export function composeClasses<ClassKey extends string>(
  slots: Record<ClassKey, ReadonlyArray<string | false | undefined | null>>,
  getUtilityClass: (slot: string) => string,
  classes: Record<string, string> | undefined,
): Record<ClassKey, string> {
  const output: Record<ClassKey, string> = {} as any;

  Object.keys(slots).forEach(
    // `Objet.keys(slots)` can't be wider than `T` because we infer `T` from `slots`.
    // @ts-expect-error https://github.com/microsoft/TypeScript/pull/12253#issuecomment-263132208
    (slot: ClassKey) => {
      output[slot] = slots[slot]
        .reduce((acc, key) => {
          if (key) {
            if (classes && classes[key]) {
              acc.push(classes[key]);
            }
            acc.push(getUtilityClass(key));
          }
          return acc;
        }, [] as string[])
        .join(' ');
    },
  );

  return output;
}

// TODO replace with { generateUtilityClass } from '@material-ui/unstyled';
const globalPseudoClassesMapping: Record<string, string> = {
  active: 'Mui-active',
  checked: 'Mui-checked',
  disabled: 'Mui-disabled',
  error: 'Mui-error',
  focused: 'Mui-focused',
  focusVisible: 'Mui-focusVisible',
  required: 'Mui-required',
  expanded: 'Mui-expanded',
  selected: 'Mui-selected',
};

export function generateUtilityClass(componentName: string, slot: string): string {
  const globalPseudoClass = globalPseudoClassesMapping[slot];
  return globalPseudoClass || `${componentName}-${slot}`;
}

// TODO replace with { generateUtilityClasses } from '@material-ui/unstyled';
export function generateUtilityClasses<T extends string>(
  componentName: string,
  slots: T[],
): Record<T, string> {
  const result: Record<string, string> = {};

  slots.forEach((slot) => {
    result[slot] = generateUtilityClass(componentName, slot);
  });

  return result;
}
