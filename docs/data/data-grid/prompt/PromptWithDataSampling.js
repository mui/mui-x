import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

import { Toolbar } from './Toolbar';

const VISIBLE_FIELDS = [
  'name',
  'email',
  'position',
  'company',
  'salary',
  'phone',
  'country',
  'dateCreated',
  'isAdmin',
];

export default function PromptWithDataSampling() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    visibleFields: VISIBLE_FIELDS,
    rowLength: 10000,
  });

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        {...data}
        slots={{
          toolbar: Toolbar,
        }}
        slotProps={{
          toolbar: {
            assistantPanelProps: {
              allowDataSampling: true,
            },
          },
        }}
        showToolbar
      />
    </div>
  );
}
