import { createSvgIcon } from '@mui/material/utils';
import * as React from 'react';
import type { DataStudioSheetTemplate } from '../DataStudio/DataStudio.types';

const PivotIcon = createSvgIcon(
  React.createElement('path', {
    d: 'M3 3h18v18H3V3zm2 2v4h4V5H5zm6 0v4h8V5h-8zM5 11v8h4v-8H5zm6 0v8h8v-8h-8z',
  }),
  'Pivot',
);

/**
 * Built-in template: a Pivot table Sheet over a Data Source. When started from
 * a Data Source's preview (or the Composer with an active source) the new
 * Sheet binds to it; otherwise it's free-form and the pivot view prompts to
 * connect one.
 *
 * Premium-only — registered by default on `plan="premium"`. Pair with
 * `pivotViewType` when wiring `<DataStudio>` manually.
 */
export const pivotTemplate: DataStudioSheetTemplate = {
  id: 'pivot',
  label: 'Pivot table',
  description: 'Summarize a Data Source by rows, columns, and values.',
  icon: PivotIcon,
  build({ dataSourceId }) {
    return {
      label: 'Pivot table',
      dataSourceId: dataSourceId ?? null,
      type: 'pivot',
      params: {},
    };
  },
};
