import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GridFilterItem,
  GridFilterOperator,
  useGridApiContext,
  GridColDef,
  useGridRootProps,
} from '@mui/x-data-grid';
import { unstable_useId as useId } from '@mui/utils';
import { unstable_gridHeaderFilteringMenuSelector } from '@mui/x-data-grid/internals';
import { DataGridProProcessedProps } from '../../models/dataGridProProps';
import { OPERATOR_SYMBOL_MAPPING } from './constants';

function GridHeaderFilterAdornment(props: {
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

  const rootProps = useGridRootProps() as DataGridProProcessedProps;
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
      <rootProps.slots.baseInputAdornment position="start">
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
          sx={{
            width: 22,
            height: 22,
            padding: '0px 0px 2px 2px',
          }}
        >
          {OPERATOR_SYMBOL_MAPPING[item?.operator] ?? ''}
        </rootProps.slots.baseIconButton>
      </rootProps.slots.baseInputAdornment>
      <rootProps.slots.headerFilterMenu
        field={field}
        open={open}
        item={item}
        targetRef={headerFilterMenuRef}
        operators={operators}
        labelledBy={buttonId!}
        id={menuId!}
        {...others}
      />
    </React.Fragment>
  );
}

GridHeaderFilterAdornment.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  applyFilterChanges: PropTypes.func.isRequired,
  buttonRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]),
  field: PropTypes.string.isRequired,
  headerFilterMenuRef: PropTypes.shape({
    current: PropTypes.object,
  }).isRequired,
  item: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operator: PropTypes.string.isRequired,
    value: PropTypes.any,
  }).isRequired,
  operators: PropTypes.arrayOf(
    PropTypes.shape({
      getApplyFilterFn: PropTypes.func.isRequired,
      getValueAsString: PropTypes.func,
      InputComponent: PropTypes.elementType,
      InputComponentProps: PropTypes.object,
      label: PropTypes.string,
      requiresFilterValue: PropTypes.bool,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
} as any;

export { GridHeaderFilterAdornment };
