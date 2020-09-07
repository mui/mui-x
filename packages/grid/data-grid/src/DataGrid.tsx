import * as React from 'react';
import * as PropTypes from 'prop-types';
import { chainPropTypes } from '@material-ui/utils';
import { GridComponent, GridComponentProps, classnames } from '@material-ui/x-grid-modules';

const FORCED_PROPS: Partial<GridComponentProps> = {
  pagination: true,
  disableMultipleColumnsSorting: true,
  disableMultipleSelection: true,
};

export type DataGridProps = Omit<
  GridComponentProps,
  | 'disableMultipleColumnsSorting'
  | 'disableMultipleSelection'
  | 'licenseStatus'
  | 'options'
  | 'pagination'
> & {
  disableMultipleColumnsSorting?: true;
  disableMultipleSelection?: true;
  pagination?: true;
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
      className={classnames('data-grid', className)}
      pageSize={pageSize}
      {...other}
      {...FORCED_PROPS}
      licenseStatus="Valid"
    />
  );
});

DataGrid2.propTypes = {
  disableMultipleColumnsSorting: chainPropTypes(PropTypes.number, (props) => {
    if (props.pageSize && props.pageSize > MAX_PAGE_SIZE) {
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
  disableMultipleSelection: chainPropTypes(PropTypes.number, (props) => {
    if (props.pageSize && props.pageSize > MAX_PAGE_SIZE) {
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
