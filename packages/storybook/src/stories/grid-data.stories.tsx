import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { Grid, GridOptionsProp } from '@material-ui/x-grid';
import { useData } from '../hooks/useData';

export default {
  title: 'X-Grid Tests/Dataset',
  component: Grid,
  decorators: [withKnobs, withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/storysource/panel' },
    docs: {
      page: null,
    },
  },
};

interface GridDatasetProps {
  nbRows: number;
  nbCols: number;
  options?: GridOptionsProp;
  loading?: boolean;
}

const GridDataSet = ({ nbRows, nbCols, options, loading }: GridDatasetProps) => {
  const data = useData(nbRows, nbCols);
  return (
    <div className="grid-container">
      <Grid rows={data.rows} columns={data.columns} options={options} loading={loading} />
    </div>
  );
};

export const NoRows = () => <GridDataSet nbRows={0} nbCols={20} />;
export const NoRowsNoCols = () => <GridDataSet nbRows={0} nbCols={0} />;
export const loadingRows = () => <GridDataSet nbRows={0} nbCols={20} loading={true} />;
export const SmallDataSet = () => <GridDataSet nbRows={20} nbCols={2} />;
export const AndNoRowExtend = () => <GridDataSet nbRows={20} nbCols={2} options={{ extendRowFullWidth: false }} />;
export const AndWithRightBorder = () => (
  <GridDataSet nbRows={20} nbCols={2} options={{ extendRowFullWidth: false, showCellRightBorder: true }} />
);
export const AndWithRightBorderAndSeparator = () => (
  <GridDataSet
    nbRows={20}
    nbCols={2}
    options={{ extendRowFullWidth: false, showCellRightBorder: true, showColumnSeparator: true }}
  />
);
export const WithVerticalScroll = () => <GridDataSet nbRows={200} nbCols={2} />;
export const WithHorizontalScroll = () => <GridDataSet nbRows={20} nbCols={20} />;
export const WithScrollAndRightBorder = () => (
  <GridDataSet nbRows={20} nbCols={20} options={{ extendRowFullWidth: false, showCellRightBorder: true }} />
);
export const WithBothScroll = () => <GridDataSet nbRows={200} nbCols={20} />;
export const WithBothScrollAndRightBorder = () => (
  <GridDataSet nbRows={200} nbCols={20} options={{ extendRowFullWidth: false, showCellRightBorder: true }} />
);
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
