import { Story } from '@storybook/react';
import * as React from 'react';
import { DataGridPro, DataGridProProps } from '@mui/x-data-grid-pro';
import { useData } from '../hooks/useData';

export default {
  title: 'DataGridPro Test/Dataset',
  component: DataGridPro,
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

interface GridDatasetProps extends Omit<DataGridProProps, 'rows' | 'columns'> {
  nbRows: number;
  nbCols: number;
}

const GridDataSet = ({ nbRows, nbCols, ...other }: GridDatasetProps) => {
  const data = useData(nbRows, nbCols);
  return (
    <div className="grid-container">
      <DataGridPro rows={data.rows} columns={data.columns} {...other} />
    </div>
  );
};

export const NoRows = () => <GridDataSet nbRows={0} nbCols={20} />;
export const NoRowsNoCols = () => <GridDataSet nbRows={0} nbCols={0} />;
export const LoadingRows = () => <GridDataSet nbRows={0} nbCols={20} loading />;
export const NoRowsAutoHeight = () => <GridDataSet nbRows={0} nbCols={20} autoHeight />;
export const NoRowsNoColsAutoHeight = () => <GridDataSet nbRows={0} nbCols={0} autoHeight />;
export const LoadingRowsAutoHeight = () => (
  <GridDataSet nbRows={0} nbCols={20} autoHeight loading />
);
export const VerticalScroll = () => <GridDataSet nbRows={200} nbCols={2} />;
export const HorizontalScroll = () => <GridDataSet nbRows={15} nbCols={20} />;
export const BothScroll = () => <GridDataSet nbRows={200} nbCols={50} />;
export const BothScrollNoExtendAndBorders = () => (
  <GridDataSet nbRows={200} nbCols={50} disableExtendRowFullWidth showCellRightBorder />
);
export const Grid20By2 = () => <GridDataSet nbRows={20} nbCols={2} />;
export const Grid100by100 = () => <GridDataSet nbRows={100} nbCols={100} />;
export const Grid1000by100 = () => <GridDataSet nbRows={1000} nbCols={100} />;
export const Grid1000by200 = () => <GridDataSet nbRows={1000} nbCols={20} />;
export const Grid2000by20 = () => <GridDataSet nbRows={2000} nbCols={20} />;
export const Grid2000by200 = () => <GridDataSet nbRows={2000} nbCols={200} />;
export const Grid1000by1000 = () => <GridDataSet nbRows={1000} nbCols={1000} />;
export const Grid2000by2000 = () => <GridDataSet nbRows={2000} nbCols={2000} />;
export const Grid6002 = () => <GridDataSet nbRows={6002} nbCols={100} />;
export const Grid3012 = () => <GridDataSet nbRows={3012} nbCols={100} />;
export const Grid8628 = () => <GridDataSet nbRows={8628} nbCols={100} />;
export const Grid5234 = () => <GridDataSet nbRows={5234} nbCols={100} />;
export const Grid10000 = () => <GridDataSet nbRows={10000} nbCols={100} />;
export const Grid100000 = () => <GridDataSet nbRows={100000} nbCols={100} />;

interface GridDynamicContainerProps extends Omit<DataGridProProps, 'rows' | 'columns'> {
  height: number;
  width: number | string;
  nbRows: number;
  nbCols: number;
}

const DemoDynamicContainerTemplate: Story<GridDynamicContainerProps> = ({
  nbRows,
  nbCols,
  height,
  width,
  ...args
}) => {
  const data = useData(nbRows, nbCols);
  return (
    <div className="demo-rendering grid-container" style={{ padding: 10 }}>
      <div style={{ width, height }}>
        <DataGridPro rows={data.rows} columns={data.columns} {...args} />
      </div>
    </div>
  );
};

export const GridXRowsPlay = DemoDynamicContainerTemplate.bind({});

GridXRowsPlay.args = {
  height: 560,
  width: '100%',
  rowHeight: 32,
  nbRows: 80,
  nbCols: 20,
};
