import type { Guards } from '@mui/x-copilot';

/**
 * Studio-specific guard flags. Extends the built-in `Guards` map; consumers
 * can toggle subsets through the `copilotFeatures` prop on `<DataStudio>`.
 *
 * - `mutations`: gates every tier-3 (mutation-class) handler. Off → the agent
 *   can read state and answer questions but cannot change anything.
 * - `viewCrud`: add / rename / duplicate / delete / move views.
 * - `viewEditing`: edit a view's stored `initialState` (filters, sort, columns).
 * - `dataSourceSwitching`: change the active dataSource, invalidate caches.
 * - `dataQuery`: enable the `queryStudioData` approval-aware flow.
 */
export interface StudioGuards extends Guards {
  mutations: boolean;
  viewCrud: boolean;
  viewEditing: boolean;
  dataSourceSwitching: boolean;
  dataQuery: boolean;
}

export const DEFAULT_STUDIO_GUARDS: StudioGuards = {
  mutations: true,
  viewCrud: true,
  viewEditing: true,
  dataSourceSwitching: true,
  dataQuery: true,
};

export function buildStudioGuards(overrides?: Partial<StudioGuards>): StudioGuards {
  return { ...DEFAULT_STUDIO_GUARDS, ...overrides };
}
