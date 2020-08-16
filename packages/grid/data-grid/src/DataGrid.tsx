import * as React from 'react';
import {
  GridComponent,
  GridComponentProps,
  GridOptions,
  classnames,
} from '@material-ui/x-grid-modules';

export type DataGridOptionsProp = Partial<
  Exclude<GridOptions, 'pagination' | 'disableMultipleColumnsSorting' | 'disableMultipleSelection'>
>;

const OPTIONS_OVERRIDES: Partial<GridOptions> = {
  pagination: true,
  disableMultipleColumnsSorting: true,
  disableMultipleSelection: true,
};

export type DataGridProps = Omit<GridComponentProps, 'licenseStatus' | 'apiRef' | 'options'> &
  DataGridOptionsProp;

const MAX_PAGE_SIZE = 100;

export const DataGrid = React.memo(
  React.forwardRef<HTMLDivElement, DataGridProps>(function DataGrid(props, ref) {
    const { className, ...other } = props;

    React.useEffect(() => {
      if (props.pageSize && props.pageSize > MAX_PAGE_SIZE) {
        throw new Error(
          [
            `Material-UI: Option 'pageSize' cannot be above ${MAX_PAGE_SIZE}`,
            'Use @material-ui/x-grid to unlock this feature.',
          ].join('\n'),
        );
      }
    }, [props.pageSize]);

    return (
      <GridComponent
        ref={ref}
        className={classnames('data-grid', className)}
        {...other}
        {...OPTIONS_OVERRIDES}
        licenseStatus="Valid"
      />
    );
  }),
);
