import { createSvgIcon } from '@mui/material/utils';
import * as React from 'react';
import type { DataStudioSheetTemplate } from '../DataStudio/DataStudio.types';

const ChartIcon = createSvgIcon(
  React.createElement('path', {
    d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
  }),
  'Chart',
);

/**
 * Built-in template: a Chart Sheet over a Data Source. When started from a Data
 * Source's preview (or the Composer with an active source) the new Sheet binds
 * to it; otherwise it's free-form and the chart view prompts to connect one.
 *
 * Premium-only — registered by default on `plan="premium"`. Pair with
 * `chartViewType` when wiring `<DataStudio>` manually.
 */
export const chartTemplate: DataStudioSheetTemplate = {
  id: 'chart',
  label: 'Chart',
  description: 'Visualize a Data Source with bar, line, pie, and more.',
  icon: ChartIcon,
  build({ dataSourceId }) {
    return {
      label: 'Chart',
      dataSourceId: dataSourceId ?? null,
      type: 'chart',
      params: {},
    };
  },
};
