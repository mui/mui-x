import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { GridColumnMenuItemProps } from '../GridColumnMenuItemProps';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';
import { gridVisibleColumnDefinitionsSelector } from '../../../../hooks/features/columns';

const StyledStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5, 0.5, 1.5),
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
  fontWeight: theme.typography.fontWeightRegular,
  textTransform: 'none',
}));

const GridColumnMenuHideItem = (props: GridColumnMenuItemProps) => {
  const { column, onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const timeoutRef = React.useRef<any>();

  const visibleColumns = gridVisibleColumnDefinitionsSelector(apiRef);
  const columnsWithMenu = visibleColumns.filter((col) => col.disableColumnMenu !== true);
  // do not allow to hide the last column with menu
  const disabled = columnsWithMenu.length === 1;

  const toggleColumn = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      /**
       * Disabled `MenuItem` would trigger `click` event
       * after imperative `.click()` call on HTML element.
       * Also, click is triggered in testing environment as well.
       */
      if (disabled) {
        return;
      }
      onClick?.(event);
      // time for the transition
      timeoutRef.current = setTimeout(() => {
        if (column?.field) {
          apiRef.current.setColumnVisibility(column.field, false);
        }
      }, 100);
    },
    [apiRef, column?.field, onClick, disabled],
  );

  React.useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  if (rootProps.disableColumnSelector) {
    return null;
  }

  if (column?.hideable === false) {
    return null;
  }

  return (
    <StyledStack>
      <StyledButton
        onClick={toggleColumn}
        disabled={disabled}
        startIcon={<rootProps.components.ColumnMenuHideIcon fontSize="small" />}
        color="inherit"
      >
        {apiRef.current.getLocaleText('columnMenuHideColumnDefault')}
      </StyledButton>
    </StyledStack>
  );
};

GridColumnMenuHideItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object,
  onClick: PropTypes.func,
} as any;

export { GridColumnMenuHideItem };
