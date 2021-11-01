import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';
import { Story, Meta, DecoratorFn } from '@storybook/react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData, UseDemoDataOptions } from '@mui/x-data-grid-generator';

export interface PlaygroundProps extends UseDemoDataOptions {
  multipleGrid: boolean;
  component: typeof DataGridPro | typeof DataGrid;
}

const gridContainer: DecoratorFn = (storyFn) => <div className="grid-container">{storyFn()}</div>;

export default {
  title: 'Full DataGrid Demo',
  argTypes: {
    component: {
      defaultValue: 'DataGridPro',
      mapping: { DataGrid, DataGridPro },
      control: {
        type: 'select',
        options: ['DataGrid', 'DataGridPro'],
      },
    },
    rowLength: {
      defaultValue: 500,
      control: {
        type: 'select',
        options: [1, 10, 50, 100, 500, 1_000, 5_000, 10_000, 50_000, 100_000, 500_000],
      },
    },
    multipleGrid: {
      defaultValue: false,
      control: {
        type: 'boolean',
      },
    },
  },
  decorators: [gridContainer],
} as Meta;

const DemoStory: Story<PlaygroundProps> = ({
  component: Component,
  multipleGrid,
  ...dataOptions
}) => {
  const { data } = useDemoData(dataOptions);

  return (
    <React.Fragment>
      <Component {...data} />
      {multipleGrid && <Component {...data} />}
    </React.Fragment>
  );
};

export const Commodity = DemoStory.bind({});
Commodity.args = {
  dataSet: 'Commodity',
};

export const Employee = DemoStory.bind({});
Employee.args = {
  dataSet: 'Employee',
};
