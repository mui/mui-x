import * as React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import {
  GridFilterItem,
  GridFilterOperator,
  useGridApiContext,
  GridColDef,
  useGridRootProps,
} from '@mui/x-data-grid';
import { unstable_useId as useId } from '@mui/utils';
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

  const buttonId = useId();
  const menuId = useId();

  const rootProps = useGridRootProps();
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
        <rootProps.slots.baseIconButton
          id={buttonId}
          ref={buttonRef}
          aria-label={apiRef.current.getLocaleText('filterPanelOperator')}
          title={apiRef.current.getLocaleText('filterPanelOperator')}
          aria-controls={menuId}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          tabIndex={-1}
          size="small"
          onClick={handleClick}
        >
          {OPERATOR_SYMBOL_MAPPING[item?.operator] ?? ''}
        </rootProps.slots.baseIconButton>
      </InputAdornment>
      <GridHeaderFilterMenu
        field={field}
        open={open}
        item={item}
        target={headerFilterMenuRef.current}
        operators={operators}
        labelledBy={buttonId!}
        id={menuId!}
        {...others}
      />
    </React.Fragment>
  );
}

export { GridHeaderFilterAdorment };
