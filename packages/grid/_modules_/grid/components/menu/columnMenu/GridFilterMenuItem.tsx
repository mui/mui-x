import * as React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { useGridApiContext } from '../../../hooks/root/useGridApiContext';
import { GridFilterItemProps } from './GridFilterItemProps';
import {GridRootPropsContext} from "../../../context/GridRootPropsContext";

export const GridFilterMenuItem = (props: GridFilterItemProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = React.useContext(GridRootPropsContext)!;

  const showFilter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef!.current.showFilterPanel(column?.field);
    },
    [apiRef, column?.field, onClick],
  );

  if (rootProps.disableColumnFilter || !column?.filterable) {
    return null;
  }

  return (
    <MenuItem onClick={showFilter}>{apiRef!.current.getLocaleText('columnMenuFilter')}</MenuItem>
  );
};
