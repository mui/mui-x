import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import {
  GridFilterItem,
  GridFilterOperator,
  useGridApiContext,
  GridColDef,
} from '@mui/x-data-grid';
import { unstable_gridHeaderFilteringMenuSelector } from '@mui/x-data-grid/internals';
import { GridHeaderFilterMenu } from './GridHeaderFilterMenu';
import { OPERATOR_SYMBOL_MAPPING } from './constants';

function GridHeaderFilterAdorment(props: {
  operators: GridFilterOperator<any, any, any>[];
  field: GridColDef['field'];
  item: GridFilterItem;
  applyFilterChanges: (item: GridFilterItem) => void;
  headerFilterMenuRef: React.MutableRefObject<HTMLButtonElement | null>;
  buttonRef: React.Ref<HTMLButtonElement>;
}) {
  const { operators, item, field, buttonRef, headerFilterMenuRef, ...others } = props;

  const apiRef = useGridApiContext();
  const open = Boolean(
    unstable_gridHeaderFilteringMenuSelector(apiRef) === field && headerFilterMenuRef.current,
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    headerFilterMenuRef.current = event.currentTarget;
    apiRef.current.showHeaderFilterMenu(field);
  };

  return (
    <React.Fragment>
      <InputAdornment position="start">
        <IconButton ref={buttonRef} tabIndex={-1} size="small" onClick={handleClick}>
          {OPERATOR_SYMBOL_MAPPING[item?.operator] ?? ''}
        </IconButton>
      </InputAdornment>
      <GridHeaderFilterMenu
        field={field}
        open={open}
        item={item}
        target={headerFilterMenuRef.current}
        operators={operators}
        {...others}
      />
    </React.Fragment>
  );
}

export { GridHeaderFilterAdorment };
