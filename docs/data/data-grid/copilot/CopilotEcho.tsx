import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DataGridPremium, GridSidebarValue } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

type DataSet = 'Employee' | 'Commodity';

const VISIBLE_FIELDS: Record<DataSet, string[]> = {
  Employee: [
    'id',
    'avatar',
    'name',
    'website',
    'rating',
    'email',
    'phone',
    'username',
    'position',
    'company',
    'salary',
    'country',
    'city',
  ],
  Commodity: [
    'id',
    'desk',
    'commodity',
    'traderName',
    'traderEmail',
    'quantity',
    'filledQuantity',
    'status',
    'unitPrice',
    'unitPriceCurrency',
    'subTotal',
    'feeRate',
    'feeAmount',
    'incoTerm',
  ],
};

const SUGGESTIONS: Record<DataSet, string[]> = {
  Employee: [
    'Group employees by country',
    'Which company has the highest average salary?',
    'Filter to people with a rating above 4',
  ],
  Commodity: [
    'Summarize total quantity by commodity',
    'Which desk has the largest sub-total?',
    'Filter to orders that are not yet filled',
  ],
};

export default function CopilotEcho() {
  const [dataSet, setDataSet] = React.useState<DataSet>('Employee');
  const { data } = useDemoData({
    dataSet,
    visibleFields: VISIBLE_FIELDS[dataSet],
    rowLength: 500,
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}>
        <Tabs value={dataSet} onChange={(_, value) => setDataSet(value as DataSet)}>
          <Tab label="Employees" value="Employee" />
          <Tab label="Commodities" value="Commodity" />
        </Tabs>
      </Box>
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGridPremium
          key={dataSet}
          {...data}
          copilot
          copilotSuggestions={SUGGESTIONS[dataSet]}
          initialState={{ sidebar: { open: true, value: GridSidebarValue.Copilot } }}
          showToolbar
        />
      </Box>
    </Box>
  );
}
