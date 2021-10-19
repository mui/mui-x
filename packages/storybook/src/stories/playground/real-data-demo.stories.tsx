import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as React from 'react';
import { Story, Meta, DecoratorFn } from '@storybook/react';
import { DataGridProProps, GridPreferencePanelsValue, DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData, UseDemoDataOptions } from '@mui/x-data-grid-generator';
import { useData } from '../../hooks/useData';
import {
  ColumnMenuComponent,
  CustomFooter,
  LoadingComponent,
  NoRowsComponent,
  PaginationComponent,
  SortedAscendingIcon,
  SortedDescendingIcon,
} from './customComponents';

export interface PlaygroundProps {
  multipleGrid: boolean;
  license: 'DataGridPro' | 'DataGrid';
}

const gridContainer: DecoratorFn = (storyFn) => <div className="grid-container">{storyFn()}</div>;

export default {
  title: 'X-Grid Demos/Playground',
  component: DataGridPro,
  argTypes: {
    dataSet: {
      defaultValue: 'Commodity',
      control: {
        type: 'inline-radio',
        options: ['Commodity', 'Employee', 'Raw'],
      },
    },
    license: {
      defaultValue: 'DataGridPro',
      control: {
        type: 'inline-radio',
        options: ['DataGridPro', 'DataGrid'],
      },
    },
    rowLength: {
      defaultValue: 500,
      control: {
        type: 'select',
        options: [1, 9, 10, 50, 100, 500, 1000, 2000, 5000, 8000, 10000, 50000, 100000, 500000],
      },
    },
    multipleGrid: {
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
    headerHeight: {
      control: { type: 'range', min: 20, max: 150, step: 10 },
    },
    rowHeight: {
      control: { type: 'range', min: 20, max: 150, step: 10 },
    },
  },
  decorators: [gridContainer],
  parameters: {
    options: { selectedPanel: 'storybook/controls/panel' },
  },
} as Meta;

const DemoTemplate: Story<DataGridProProps & UseDemoDataOptions & PlaygroundProps> = ({
  rows,
  columns,
  dataSet,
  license,
  rowLength,
  maxColumns,
  multipleGrid,
  ...args
}) => {
  const isRaw = dataSet.toString() === 'Raw';
  let data: any = useData(isRaw ? rowLength : 0, maxColumns || 20);
  const demoData = useDemoData({ rowLength: !isRaw ? rowLength : 0, dataSet, maxColumns });

  if (!isRaw) {
    data = demoData.data;
  }

  const Grid = license === 'DataGridPro' ? DataGridPro : DataGrid;

  return !multipleGrid ? (
    <Grid rows={data.rows} columns={data.columns} {...(args as unknown)} />
  ) : (
    <React.Fragment>
      <Grid rows={data.rows} columns={data.columns} {...(args as unknown)} />
      <Grid rows={data.rows} columns={data.columns} {...(args as unknown)} />
    </React.Fragment>
  );
};

export const Demo = DemoTemplate.bind({});
Demo.args = {
  checkboxSelection: true,
};

export const ColumnSelector = DemoTemplate.bind({});
ColumnSelector.args = {
  initialState: {
    preferencePanel: {
      open: true,
      openedPanelValue: GridPreferencePanelsValue.columns,
    },
  },
};

export const Custom = DemoTemplate.bind({});
Custom.args = {
  components: {
    Footer: CustomFooter,
    ColumnSortedDescendingIcon: SortedDescendingIcon,
    ColumnSortedAscendingIcon: SortedAscendingIcon,
    NoRowsOverlay: NoRowsComponent,
    LoadingOverlay: LoadingComponent,
    Pagination: PaginationComponent,
    ColumnMenu: ColumnMenuComponent,
    Toolbar: GridToolbar,
  },
};
