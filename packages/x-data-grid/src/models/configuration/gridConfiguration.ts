import { GridRowInternalHook } from './gridRowConfiguration';

export type GridInternalHook = GridRowInternalHook;
export interface GridConfiguration {
  hooks: Record<string, GridInternalHook>;
}
