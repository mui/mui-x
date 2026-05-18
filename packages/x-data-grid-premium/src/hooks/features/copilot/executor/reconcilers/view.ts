import { GridPreferencePanelsValue } from '@mui/x-data-grid-pro';
import type { PatchHandler } from '../types';
import { ok, invalid } from '../types';
import { GridSidebarValue } from '../../../sidebar';

export const viewDensityHandler: PatchHandler = {
  path: '/view/density',
  allowedOps: ['replace'],
  guard: null,
  phase: 'layout',
  tier: 2,
  plan: 'community',
  validate: (_op, doc) => {
    const v = doc.view.density;
    if (v !== 'compact' && v !== 'standard' && v !== 'comfortable') {
      return invalid(`/view/density must be 'compact' | 'standard' | 'comfortable'`);
    }
    return ok();
  },
  reconcile: (doc, _op, ctx) => {
    ctx.apiRef.current.setDensity(doc.view.density);
  },
};

export const viewPaginationHandler: PatchHandler = {
  path: '/view/pagination',
  allowedOps: ['replace'],
  guard: null,
  phase: 'layout',
  tier: 2,
  plan: 'community',
  validate: (_op, doc) => {
    const m = doc.view.pagination;
    if (!m || typeof m.page !== 'number' || typeof m.pageSize !== 'number') {
      return invalid('/view/pagination must have page and pageSize numbers');
    }
    return ok();
  },
  reconcile: (doc, _op, ctx) => {
    ctx.apiRef.current.setPaginationModel(doc.view.pagination);
  },
};

export const viewPaginationPageHandler: PatchHandler = {
  path: '/view/pagination/page',
  allowedOps: ['replace'],
  guard: null,
  phase: 'layout',
  tier: 2,
  plan: 'community',
  reconcile: (doc, _op, ctx) => {
    ctx.apiRef.current.setPage(doc.view.pagination.page);
  },
};

export const viewPaginationPageSizeHandler: PatchHandler = {
  path: '/view/pagination/pageSize',
  allowedOps: ['replace'],
  guard: null,
  phase: 'layout',
  tier: 2,
  plan: 'community',
  reconcile: (doc, _op, ctx) => {
    ctx.apiRef.current.setPageSize(doc.view.pagination.pageSize);
  },
};

export const viewSidebarHandler: PatchHandler = {
  path: '/view/sidebar',
  allowedOps: ['replace'],
  guard: null,
  phase: 'layout',
  tier: 2,
  plan: 'premium',
  reconcile: (doc, _op, ctx) => {
    const value = doc.view.sidebar;
    if (value == null) {
      ctx.apiRef.current.hideSidebar();
      return;
    }
    if (
      value === GridSidebarValue.Pivot ||
      value === GridSidebarValue.Charts ||
      value === GridSidebarValue.Copilot
    ) {
      ctx.apiRef.current.showSidebar(value);
    }
  },
};

export const viewChartsPanelOpenHandler: PatchHandler = {
  path: '/view/chartsPanelOpen',
  allowedOps: ['replace'],
  guard: 'chartsIntegration',
  phase: 'layout',
  tier: 2,
  plan: 'premium',
  reconcile: (doc, _op, ctx) => {
    ctx.apiRef.current.setChartsPanelOpen(!!doc.view.chartsPanelOpen);
  },
};

export const viewPreferencesHandler: PatchHandler = {
  path: '/view/preferences',
  allowedOps: ['replace'],
  guard: null,
  phase: 'layout',
  tier: 2,
  plan: 'community',
  reconcile: (doc, _op, ctx) => {
    const value = doc.view.preferences;
    if (value == null) {
      ctx.apiRef.current.hidePreferences();
      return;
    }
    if (
      value === GridPreferencePanelsValue.filters ||
      value === GridPreferencePanelsValue.columns ||
      value === GridPreferencePanelsValue.aiAssistant
    ) {
      ctx.apiRef.current.showPreferences(value as GridPreferencePanelsValue);
    }
  },
};

export const viewActiveChartIdHandler: PatchHandler = {
  path: '/view/activeChartId',
  allowedOps: ['replace'],
  guard: 'chartsIntegration',
  phase: 'chart',
  tier: 2,
  plan: 'premium',
  reconcile: (doc, _op, ctx) => {
    if (typeof doc.view.activeChartId === 'string' && doc.view.activeChartId) {
      ctx.apiRef.current.setActiveChartId(doc.view.activeChartId);
    }
  },
};
