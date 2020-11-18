import * as React from 'react';
import { Story, Meta } from '@storybook/react';
import { DataGrid, DataGridProps, SortDirection } from '@material-ui/data-grid';
import { useData } from '../../hooks/useData';

export default {
  title: 'Data-Grid Demos/Options Events',
  component: DataGrid,
  parameters: {
    options: { selectedPanel: 'storybook/controls/panel' },
    docs: {
      page: null,
    },
  },
} as Meta;

interface StoryExtraArgs {
  resizable: boolean;
}

const Template: Story<Omit<DataGridProps, 'columns' | 'rows'> & StoryExtraArgs> = ({
  resizable,
  sortingOrder,
  ...args
}) => {
  const { rows, columns } = useData(2000, 200);
  if (resizable) {
    columns.forEach((c) => {
      c.resizable = true;
    });
  }
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      sortingOrder={sortingOrder?.map((value) => ((value as string) === 'null' ? null : value))}
      {...args}
    />
  );
};

export const Options = Template.bind({});
Options.args = {
  pageSize: 100,
  autoPageSize: false,
  rowsPerPageOptions: [25, 50, 100],
  hideFooterRowCount: false,
  hideFooterPagination: false,
  hideFooter: false,
  disableExtendRowFullWidth: false,
  showCellRightBorder: false,
  showColumnRightBorder: false,
  checkboxSelection: true,
  disableSelectionOnClick: false,
  sortingOrder: ['asc', 'desc', 'null' as SortDirection],
  headerHeight: 56,
  rowHeight: 52,
};

export const ResizableValidation = Template.bind({});
ResizableValidation.args = {
  ...Options.args,
  resizable: true,
};
