import * as React from 'react';
import { Story, Meta, DecoratorFn } from '@storybook/react';
import { XGridProps, PreferencePanelsValue, XGrid, GridOptionsProp } from '@material-ui/x-grid';
import { useDemoData, DemoDataOptions } from '@material-ui/x-grid-data-generator';
import Button from '@material-ui/core/Button';
import '@material-ui/x-grid-data-generator/style/real-data-stories.css';
import { randomInt } from '../../data/random-generator';

export default {
  title: 'X-Grid Demos/Playground',
  component: XGrid,
  parameters: {
    options: { selectedPanel: 'storybook/controls/panel' },
    docs: {
      page: null,
    },
  },
} as Meta;

const gridContainer: DecoratorFn = (storyFn) => <div className="grid-container">{storyFn()}</div>;

export const Commodity: Story<XGridProps> = ({ rows, columns, ...args }) => {
  const { data, setRowLength, loadNewData } = useDemoData({ dataSet: 'Commodity', rowLength: 100 });

  return (
    <React.Fragment>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button color="primary" onClick={loadNewData}>
          Load New Rows
        </Button>
        <Button color="primary" onClick={() => setRowLength(randomInt(100, 500))}>
          Load New Rows with new length
        </Button>
      </div>
      <div className="grid-container">
        <XGrid rows={data.rows} columns={data.columns} {...args} />
      </div>
    </React.Fragment>
  );
};

const DemoTemplate: Story<XGridProps & DemoDataOptions> = ({
  rows,
  columns,
  rowLength,
  dataSet,
  maxColumns,
  ...args
}) => {
  const { data } = useDemoData({ rowLength, dataSet, maxColumns });

  return <XGrid rows={data.rows} columns={data.columns} {...args} />;
};

export const Commodity500 = DemoTemplate.bind({});
Commodity500.args = {
  rowLength: 500,
  dataSet: 'Commodity',
};
Commodity500.decorators = [gridContainer];

export const Commodity1000 = DemoTemplate.bind({});
Commodity1000.args = {
  rowLength: 1000,
  dataSet: 'Commodity',
};
Commodity1000.decorators = [gridContainer];

export const Commodity10000 = DemoTemplate.bind({});
Commodity10000.args = {
  rowLength: 100000,
  dataSet: 'Commodity',
};
Commodity10000.decorators = [gridContainer];

export const Employee100 = DemoTemplate.bind({});
Employee100.args = {
  rowLength: 500,
  dataSet: 'Employee',
};
Employee100.decorators = [gridContainer];

export const Employee1000 = DemoTemplate.bind({});
Employee1000.args = {
  rowLength: 1000,
  dataSet: 'Employee',
};
Employee1000.decorators = [gridContainer];

export const Employee10000 = DemoTemplate.bind({});
Employee10000.args = {
  rowLength: 10000,
  dataSet: 'Commodity',
};
Employee10000.decorators = [gridContainer];

export const MultipleEmployee100: Story<GridOptionsProp> = (args) => {
  const { data } = useDemoData({ dataSet: 'Employee', rowLength: 100 });

  return (
    <div className="grid-container" style={{ flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: 'auto' }}>
        <XGrid rows={data.rows} columns={data.columns} {...args} />
      </div>
      <div style={{ display: 'flex', flex: 'auto' }}>
        <XGrid rows={data.rows} columns={data.columns} {...args} />
      </div>
    </div>
  );
};

export const XGridDemo = DemoTemplate.bind({});
XGridDemo.args = {
  dataSet: 'Commodity',
  rowLength: 100000,
  rowHeight: 38,
  checkboxSelection: true,
};
XGridDemo.decorators = [gridContainer];

export const CommodityPreferencesDefaultOpen = DemoTemplate.bind({});
CommodityPreferencesDefaultOpen.args = {
  dataSet: 'Commodity',
  rowLength: 500,
  state: { preferencePanel: { open: true } },
};
CommodityPreferencesDefaultOpen.decorators = [gridContainer];

export const CommodityPreferences = DemoTemplate.bind({});
CommodityPreferences.args = {
  dataSet: 'Commodity',
  rowLength: 500,
  state: {
    preferencePanel: {
      open: true,
      openedPanelValue: PreferencePanelsValue.columns,
    },
  },
};
CommodityPreferences.decorators = [gridContainer];
