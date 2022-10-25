import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { GridColumnMenuContainer } from './GridColumnMenuContainer';
import { GridColumnMenuProps } from './GridColumnMenuProps';
import { GridColumnsMenuItem } from './GridColumnsMenuItem';
import { GridFilterMenuItem } from './GridFilterMenuItem';
import { HideGridColMenuItem } from './HideGridColMenuItem';
import { SortGridMenuItems } from './SortGridMenuItems';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';

const GridColumnMenu = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenu(props: GridColumnMenuProps, ref) {
    const { hideMenu, currentColumn, condensed } = props;
    const apiRef = useGridApiContext();

    const defaultButtons = [
      <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />, // TODO update types to allow `onClick` and `column` to be optional
      <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />,
      <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} />,
      <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} />,
    ];

    const condensedButtons = [
      <SortGridMenuItems onClick={hideMenu} column={currentColumn!} condensed={condensed} />,
      <Divider sx={{ my: 1 }} />,
      <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} condensed={condensed} />,
      <Divider />,
      <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} condensed={condensed} />,
      <Divider sx={{ borderColor: 'grey.400' }} />,
      <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} condensed={condensed} />,
    ];

    const preProcessedButtons = apiRef.current.unstable_applyPipeProcessors(
      'columnMenu',
      condensed ? condensedButtons : defaultButtons,
      currentColumn,
    );

    return (
      <GridColumnMenuContainer ref={ref} {...props}>
        {preProcessedButtons.map((button: any, index: number) =>
          React.cloneElement(button, { key: index, onClick: hideMenu, column: currentColumn }),
        )}
      </GridColumnMenuContainer>
    );
  },
);

GridColumnMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  condensed: PropTypes.bool,
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenu };
