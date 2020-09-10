import * as React from 'react';
import * as PropTypes from 'prop-types';
import { chainPropTypes } from '@material-ui/utils';
import {
  GridComponent,
  GridComponentProps,
  classnames,
  ColDef as XGridColDef,
} from '@material-ui/x-grid-modules';

export * from '@material-ui/x-grid-modules';
export type DataGridColDef = Omit<XGridColDef, 'resizable'> & { resizable? : false };
export interface ColDef extends DataGridColDef {}

const FORCED_PROPS: Partial<GridComponentProps> = {
  pagination: true,
  disableMultipleColumnsSorting: true,
  disableMultipleSelection: true,
  disableColumnResize: true,
};

export type DataGridProps = Omit<
  GridComponentProps,
  | 'disableMultipleColumnsSorting'
  | 'disableMultipleSelection'
  | 'disableColumnResize'
  | 'licenseStatus'
  | 'options'
  | 'pagination'
  | 'columns'
> & {
  disableMultipleColumnsSorting?: true;
  disableMultipleSelection?: true;
  disableColumnResize?: true;
  pagination?: true;
  columns: ColDef[];
};

const MAX_PAGE_SIZE = 100;

const DataGrid2 = React.forwardRef<HTMLDivElement, DataGridProps>(function DataGrid(props, ref) {
  const { className, pageSize: pageSizeProp, columns, ...other } = props;

  let pageSize = pageSizeProp;
  if (pageSize && pageSize > MAX_PAGE_SIZE) {
    pageSize = MAX_PAGE_SIZE;
  }

  return (
    <GridComponent
      ref={ref}
      columns={ columns }
      className={classnames('MuiDataGrid-root', className)}
      pageSize={pageSize}
      {...other}
      {...FORCED_PROPS}
      licenseStatus="Valid"
    />
  );
});

DataGrid2.propTypes = {
  disableColumnResize: chainPropTypes(PropTypes.bool, (props) => {
    if (props.disableColumnResize === false) {
      throw new Error(
        [
          `Material-UI: \`<DataGrid disableColumnResize={false} />\` is not a valid prop.`,
          'Column resizing is not available in the MIT version',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
  }),
  disableMultipleColumnsSorting: chainPropTypes(PropTypes.bool, (props) => {
    if (props.disableMultipleColumnsSorting === false) {
      throw new Error(
        [
          `Material-UI: \`<DataGrid disableMultipleColumnsSorting={false} />\` is not a valid prop.`,
          'Only single column sorting is available in the MIT version',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }

    return null;
  }),
  disableMultipleSelection: chainPropTypes(PropTypes.bool, (props) => {
    if (props.disableMultipleSelection === false) {
      throw new Error(
        [
          `Material-UI: \`<DataGrid disableMultipleSelection={false} />\` is not a valid prop.`,
          'Only single column selection is available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }

    return null;
  }),
  pageSize: chainPropTypes(PropTypes.number, (props) => {
    if (props.pageSize && props.pageSize > MAX_PAGE_SIZE) {
      throw new Error(
        [
          `Material-UI: \`<DataGrid pageSize={${props.pageSize}} />\` is not a valid prop.`,
          `Only page size below ${MAX_PAGE_SIZE} is available in the MIT version.`,
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }

    return null;
  }),
  pagination: (props) => {
    if (props.pagination === false) {
      return new Error(
        [
          'Material-UI: `<DataGrid pagination={false} />` is not a valid prop.',
          'Infinite scrolling is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to disable the pagination.',
        ].join('\n'),
      );
    }
    return null;
  },
};

export const DataGrid = React.memo(DataGrid2);

// @ts-ignore
DataGrid.Naked = DataGrid2;
