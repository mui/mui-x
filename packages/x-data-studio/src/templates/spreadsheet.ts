import { createSvgIcon } from '@mui/material/utils';
import * as React from 'react';
import type { DataStudioSheetTemplate } from '../DataStudio/DataStudio.types';

const SpreadsheetIcon = createSvgIcon(
  React.createElement('path', {
    d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5zm2-8h4v2H7v-2zm0 4h4v2H7v-2zm6-4h4v2h-4v-2zm0 4h4v2h-4v-2zM7 7h10v2H7V7z',
  }),
  'Spreadsheet',
);

/**
 * Built-in template: a blank, free-form Spreadsheet Sheet — no Data Source
 * binding, an empty editable grid (A–H, 10 rows) supplied by
 * `spreadsheetViewType` at render time.
 *
 * Pair with `spreadsheetViewType` when wiring `<DataStudio>`:
 *
 *     <DataStudio
 *       viewTypes={[spreadsheetViewType]}
 *       sheetTemplates={[spreadsheetTemplate]}
 *     />
 */
export const spreadsheetTemplate: DataStudioSheetTemplate = {
  id: 'spreadsheet',
  label: 'Spreadsheet',
  description: 'A blank sheet you can type into.',
  icon: SpreadsheetIcon,
  build() {
    return {
      label: 'Spreadsheet',
      dataSourceId: null,
      type: 'spreadsheet',
      params: {},
    };
  },
};
