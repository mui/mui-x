import * as React from 'react';
import PropTypes from 'prop-types';
import { chainPropTypes } from '@material-ui/utils';
import { GridComponent, GridComponentProps, classnames } from '../../_modules_/grid';

const FORCED_PROPS: Partial<GridComponentProps> = {
  disableColumnResize: true,
  disableColumnReorder: true,
  disableMultipleColumnsFiltering: true,
  disableMultipleColumnsSorting: true,
  disableMultipleSelection: true,
  pagination: true,
  apiRef: undefined,
};

export type DataGridProps = Omit<
  GridComponentProps,
  | 'disableColumnResize'
  | 'disableColumnReorder'
  | 'disableMultipleColumnsFiltering'
  | 'disableMultipleColumnsSorting'
  | 'disableMultipleSelection'
  | 'licenseStatus'
  | 'apiRef'
  | 'options'
  | 'pagination'
> & {
  disableColumnResize?: true;
  disableColumnReorder?: true;
  disableMultipleColumnsFiltering?: true;
  disableMultipleColumnsSorting?: true;
  disableMultipleSelection?: true;
  pagination?: true;
  apiRef?: undefined;
};

const MAX_PAGE_SIZE = 100;

const DataGrid2 = React.forwardRef<HTMLDivElement, DataGridProps>(function DataGrid(props, ref) {
  const { className, pageSize: pageSizeProp, ...other } = props;

  let pageSize = pageSizeProp;
  if (pageSize && pageSize > MAX_PAGE_SIZE) {
    pageSize = MAX_PAGE_SIZE;
  }

  return (
    <GridComponent
      ref={ref}
      className={classnames('MuiDataGrid-root', className)}
      pageSize={pageSize}
      {...other}
      {...FORCED_PROPS}
      licenseStatus="Valid"
    />
  );
});

DataGrid2.propTypes = {
  apiRef: chainPropTypes(PropTypes.any, (props: any) => {
    if (props.apiRef != null) {
      return new Error(
        [
          `Material-UI: \`apiRef\` is not a valid prop.`,
          'ApiRef is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  columns: chainPropTypes(PropTypes.any, (props: any) => {
    if (props.columns && props.columns.some((column) => column.resizable)) {
      return new Error(
        [
          `Material-UI: \`column.resizable = true\` is not a valid prop.`,
          'Column resizing is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  disableColumnReorder: chainPropTypes(PropTypes.bool, (props: any) => {
    if (props.disableColumnReorder === false) {
      return new Error(
        [
          `Material-UI: \`<DataGrid disableColumnReorder={false} />\` is not a valid prop.`,
          'Column reordering is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  disableColumnResize: chainPropTypes(PropTypes.bool, (props: any) => {
    if (props.disableColumnResize === false) {
      return new Error(
        [
          `Material-UI: \`<DataGrid disableColumnResize={false} />\` is not a valid prop.`,
          'Column resizing is not available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  disableMultipleColumnsFiltering: chainPropTypes(PropTypes.bool, (props: any) => {
    if (props.disableMultipleColumnsFiltering === false) {
      return new Error(
        [
          `Material-UI: \`<DataGrid disableMultipleColumnsFiltering={false} />\` is not a valid prop.`,
          'Only single column sorting is available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  disableMultipleColumnsSorting: chainPropTypes(PropTypes.bool, (props: any) => {
    if (props.disableMultipleColumnsSorting === false) {
      return new Error(
        [
          `Material-UI: \`<DataGrid disableMultipleColumnsSorting={false} />\` is not a valid prop.`,
          'Only single column sorting is available in the MIT version.',
          '',
          'You need to upgrade to the XGrid component to unlock this feature.',
        ].join('\n'),
      );
    }
    return null;
  }),
  disableMultipleSelection: chainPropTypes(PropTypes.bool, (props: any) => {
    if (props.disableMultipleSelection === false) {
      return new Error(
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
  pageSize: chainPropTypes(PropTypes.number, (props: any) => {
    if (props.pageSize && props.pageSize > MAX_PAGE_SIZE) {
      return new Error(
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
  pagination: (props: any) => {
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
} as any;

export const DataGrid = React.memo(DataGrid2);

// @ts-ignore
DataGrid.Naked = DataGrid2;
