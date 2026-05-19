import type { GridRowId } from '@mui/x-data-grid-pro';
import type { CommandHandler } from '../types';
import { ok, invalid } from '../types';
import type { GridSidebarValue } from '../../../sidebar';

interface ScrollParams {
  rowIndex?: number;
  colIndex?: number;
}

interface FocusParams {
  id: GridRowId;
  field: string;
}

interface ShowFilterPanelParams {
  targetField?: string;
}

interface ShowColumnMenuParams {
  field: string;
}

interface ShowSidebarParams {
  value: GridSidebarValue;
}

interface ShowPreferencesParams {
  value: 'filters' | 'columns' | 'aiAssistant';
}

export const viewScroll: CommandHandler<ScrollParams> = {
  type: 'view.scroll',
  namespace: 'view',
  tier: 2,
  plan: 'community',
  guard: null,
  phase: 'layout',
  dependsOn: () => ['/sort', '/filter'],
  run: (params, ctx) => {
    ctx.apiRef.current.scrollToIndexes(params ?? {});
  },
};

export const viewFocus: CommandHandler<FocusParams> = {
  type: 'view.focus',
  namespace: 'view',
  tier: 2,
  plan: 'community',
  guard: null,
  phase: 'layout',
  validate: (params) => {
    if (!params || params.id == null || typeof params.field !== 'string') {
      return invalid('view.focus requires { id, field }');
    }
    return ok();
  },
  run: ({ id, field }, ctx) => {
    ctx.apiRef.current.setCellFocus(id, field);
  },
};

export const viewShowFilterPanel: CommandHandler<ShowFilterPanelParams> = {
  type: 'view.showFilterPanel',
  namespace: 'view',
  tier: 2,
  plan: 'community',
  guard: 'filter',
  phase: 'layout',
  run: (params, ctx) => {
    ctx.apiRef.current.showFilterPanel(params?.targetField);
  },
};

export const viewHideFilterPanel: CommandHandler<void> = {
  type: 'view.hideFilterPanel',
  namespace: 'view',
  tier: 2,
  plan: 'community',
  guard: 'filter',
  phase: 'layout',
  run: (_, ctx) => {
    ctx.apiRef.current.hideFilterPanel();
  },
};

export const viewShowColumnMenu: CommandHandler<ShowColumnMenuParams> = {
  type: 'view.showColumnMenu',
  namespace: 'view',
  tier: 2,
  plan: 'community',
  guard: null,
  phase: 'layout',
  validate: (params) => {
    if (!params || typeof params.field !== 'string') {
      return invalid('view.showColumnMenu requires { field }');
    }
    return ok();
  },
  run: ({ field }, ctx) => {
    ctx.apiRef.current.showColumnMenu(field);
  },
};

export const viewHideColumnMenu: CommandHandler<void> = {
  type: 'view.hideColumnMenu',
  namespace: 'view',
  tier: 2,
  plan: 'community',
  guard: null,
  phase: 'layout',
  run: (_, ctx) => {
    ctx.apiRef.current.hideColumnMenu();
  },
};

export const viewShowSidebar: CommandHandler<ShowSidebarParams> = {
  type: 'view.showSidebar',
  namespace: 'view',
  tier: 2,
  plan: 'premium',
  guard: null,
  phase: 'layout',
  run: ({ value }, ctx) => {
    ctx.apiRef.current.showSidebar(value);
  },
};

export const viewHideSidebar: CommandHandler<void> = {
  type: 'view.hideSidebar',
  namespace: 'view',
  tier: 2,
  plan: 'premium',
  guard: null,
  phase: 'layout',
  run: (_, ctx) => {
    ctx.apiRef.current.hideSidebar();
  },
};

export const viewShowPreferences: CommandHandler<ShowPreferencesParams> = {
  type: 'view.showPreferences',
  namespace: 'view',
  tier: 2,
  plan: 'community',
  guard: null,
  phase: 'layout',
  run: ({ value }, ctx) => {
    ctx.apiRef.current.showPreferences(value as any);
  },
};

export const viewHidePreferences: CommandHandler<void> = {
  type: 'view.hidePreferences',
  namespace: 'view',
  tier: 2,
  plan: 'community',
  guard: null,
  phase: 'layout',
  run: (_, ctx) => {
    ctx.apiRef.current.hidePreferences();
  },
};

export const viewCommands: CommandHandler[] = [
  viewScroll,
  viewFocus,
  viewShowFilterPanel,
  viewHideFilterPanel,
  viewShowColumnMenu,
  viewHideColumnMenu,
  viewShowSidebar,
  viewHideSidebar,
  viewShowPreferences,
  viewHidePreferences,
];
