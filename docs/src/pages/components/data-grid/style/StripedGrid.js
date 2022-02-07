import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { DataGrid, GridRow, gridClasses } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import clsx from 'clsx';

const StripedDataGrid = styled(DataGrid)({
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: '#EEEEEE',
    '&:hover, &.Mui-hovered': {
      backgroundColor: '#DDDDDD',
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
  },
});

const CustomRow = (props) => (
  <GridRow
    {...props}
    className={clsx(
      props.className,
      props.indexes.pageRows % 2 === 1 ? 'odd' : undefined,
    )}
  />
);

CustomRow.propTypes = {
  className: PropTypes.string,
  indexes: PropTypes.shape({
    /**
     * Index of the row in the current page.
     * If the pagination is disabled, this value will be equal to the `dataset` value.
     */
    pageRows: PropTypes.number.isRequired,
    /**
     * Index of the row in the list of rows currently rendered by the virtualization engine.
     * If the pagination is disabled, this value will be equal to the `page` value.
     */
    virtualizationEngineRows: PropTypes.number.isRequired,
    /**
     * Index of the row in the whole sorted and filtered dataset.
     */
    visibleRows: PropTypes.number.isRequired,
  }).isRequired,
};

export default function StripedGrid() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 200,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <StripedDataGrid loading={loading} {...data} components={{ Row: CustomRow }} />
    </div>
  );
}
