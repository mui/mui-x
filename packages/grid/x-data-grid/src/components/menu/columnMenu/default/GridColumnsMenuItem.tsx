import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material';
import { GridPreferencePanelsValue } from '../../../../hooks/features/preferencesPanel/gridPreferencePanelsValue';
import { useGridApiContext } from '../../../../hooks/utils/useGridApiContext';
import { GridItemProps } from '../GridItemProps';
import { useGridRootProps } from '../../../../hooks/utils/useGridRootProps';

const StyledStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(1, 1.5, 0, 1.5),
  flexDirection: 'row',
}));

const GridColumnsMenuItem = (props: GridItemProps) => {
  const { onClick } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const showColumns = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      onClick(event);
      apiRef.current.showPreferences(GridPreferencePanelsValue.columns);
    },
    [apiRef, onClick],
  );

  if (rootProps.disableColumnSelector) {
    return null;
  }

  return (
    <StyledStack>
      <Button
        onClick={showColumns}
        startIcon={<rootProps.components.ColumnMenuManageColumnsIcon />}
      >
        {apiRef.current.getLocaleText('columnMenuShowColumns')}
      </Button>
    </StyledStack>
  );
};

GridColumnsMenuItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  column: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
} as any;

export { GridColumnsMenuItem };
