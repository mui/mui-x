import { createSvgIcon } from '@mui/material/utils';
import * as React from 'react';
import type { DataStudioSheetTemplate } from '../DataStudio/DataStudio.types';

const DashboardIcon = createSvgIcon(
  React.createElement('path', {
    d: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  }),
  'Dashboard',
);

/**
 * Built-in template: an auto-generated analytics Dashboard over a Data Source —
 * KPI cards + a breakdown of the top measure by category. When started from a
 * Data Source's preview (or the Composer with an active source) it binds to it.
 *
 * Premium-only — registered by default on `plan="premium"`. Pair with
 * `dashboardViewType` when wiring `<DataStudio>` manually.
 */
export const dashboardTemplate: DataStudioSheetTemplate = {
  id: 'dashboard',
  label: 'Dashboard',
  description: 'Auto-generated KPIs and breakdowns from a Data Source.',
  icon: DashboardIcon,
  build({ dataSourceId }) {
    return {
      label: 'Dashboard',
      dataSourceId: dataSourceId ?? null,
      type: 'dashboard',
      params: {},
    };
  },
};
