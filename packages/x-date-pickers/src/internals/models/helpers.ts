import { ComponentNameToClassKey, ComponentsPropsList } from '@mui/material/styles';
import { CSSObject, CSSInterpolation, Interpolation } from '@mui/system';
/**
 * All standard components exposed by `material-ui` are `StyledComponents` with
 * certain `classes`, on which one can also set a top-level `className` and inline
 * `style`.
 */
export type ExtendMui<C, Removals extends keyof C = never> = Omit<
  C,
  'classes' | 'theme' | Removals
>;

type OverridesStyleRules<
  ClassKey extends string = string,
  ComponentName = keyof ComponentsPropsList,
  Theme = unknown,
  OwnerState = unknown,
> = Record<
  ClassKey,
  Interpolation<
    (ComponentName extends keyof ComponentsPropsList
      ? ComponentsPropsList[ComponentName] &
          Record<string, unknown> & {
            ownerState: (OwnerState extends Object
              ? OwnerState
              : ComponentsPropsList[ComponentName]) &
              Record<string, unknown>;
          }
      : {}) & {
      theme: Theme;
    } & Record<string, unknown>
  >
>;

export type ComponentsOverrides<Theme = unknown, OwnerState = unknown> = {
  [Name in keyof ComponentNameToClassKey]?: Partial<
    OverridesStyleRules<ComponentNameToClassKey[Name], Name, Theme, OwnerState>
  >;
} & {
  MuiCssBaseline?: CSSObject | string | ((theme: Theme) => CSSInterpolation);
};
