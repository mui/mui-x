import * as React from 'react';
import PropTypes from 'prop-types';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { GridColumnMenuItemProps } from '../GridColumnMenuItemProps';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';

function GridColumnMenuFilterItem(props: GridColumnMenuItemProps) {
  const { colDef, onClick } = props;
  const apiRef = useGridApiContext();
  const { disableColumnFilter, slots } = useGridRootProps();

  const showFilter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef.current.showFilterPanel(colDef.field);
    },
    [apiRef, colDef.field, onClick],
  );

  if (disableColumnFilter || !colDef.filterable) {
    return null;
  }

  return (
    <slots.baseMenuItem
      onClick={showFilter}
      iconStart={<slots.columnMenuFilterIcon fontSize="small" />}
    >
      {apiRef.current.getLocaleText('columnMenuFilter')}
    </slots.baseMenuItem>
  );
}

GridColumnMenuFilterItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnMenuFilterItem };
