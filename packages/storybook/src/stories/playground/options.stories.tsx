import * as React from 'react';
import { Story, Meta } from '@storybook/react';
import { XGrid, SortDirection, GridOptionsProp } from '@material-ui/x-grid';
import { useData } from '../../hooks/useData';

export default {
  title: 'X-Grid Demos/Options-Events',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/controls/panel' },
    docs: {
      page: null,
    },
  },
} as Meta;

const Template: Story<GridOptionsProp> = ({ sortingOrder, ...args }) => {
  const data = useData(2000, 200);
  return (
    <XGrid
      rows={data.rows}
      columns={data.columns}
      sortingOrder={sortingOrder?.map((value) => ((value as string) === 'null' ? null : value))}
      {...args}
    />
  );
};

export const Options = Template.bind({});
Options.args = {
  autoHeight: false,
  pagination: true,
  pageSize: 100,
  autoPageSize: false,
  rowsPerPageOptions: [25, 50, 100],
  hideFooterRowCount: false,
  hideFooterPagination: false,
  hideFooter: false,
  hideToolbar: false,
  disableExtendRowFullWidth: false,
  disableColumnMenu: false,
  disableColumnFilter: false,
  disableColumnSelector: false,
  showCellRightBorder: false,
  showColumnRightBorder: false,
  disableMultipleSelection: false,
  checkboxSelection: true,
  disableSelectionOnClick: false,
  disableMultipleColumnsSorting: false,
  sortingOrder: ['asc', 'desc', 'null' as SortDirection],
  headerHeight: 56,
  rowHeight: 52,
};
