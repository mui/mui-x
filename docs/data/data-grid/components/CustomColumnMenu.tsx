import * as React from 'react';
import Box from '@mui/material/Box';
import { styled, Theme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import {
  GridColumnMenu,
  GridColumnMenuContainer,
  GridColumnMenuProps,
  GridColumnMenuFilterItem,
  GridColumnMenuSortItem,
  useGridApiRef,
  DataGridPro,
  GridSlots,
} from '@mui/x-data-grid-pro';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

type PaletteColorKey = 'primary' | 'secondary';
type OwnerState = {
  color: PaletteColorKey;
};

const StyledGridColumnMenuContainer = styled(GridColumnMenuContainer)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }: { theme: Theme; ownerState: OwnerState }) => ({
  background: theme.palette[ownerState.color].main,
}));

const StyledGridColumnMenu = styled(GridColumnMenu)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }: { theme: Theme; ownerState: OwnerState }) => ({
  background: theme.palette[ownerState.color].main,
}));

export function CustomColumnMenuComponent(props: GridColumnMenuProps & OwnerState) {
  const { hideMenu, colDef, color, ...other } = props;

  if (colDef.field === 'name') {
    return (
      <StyledGridColumnMenuContainer
        hideMenu={hideMenu}
        colDef={colDef}
        ownerState={{ color }}
        {...other}
      >
        <GridColumnMenuSortItem onClick={hideMenu} colDef={colDef!} />
        <GridColumnMenuFilterItem onClick={hideMenu} colDef={colDef!} />
      </StyledGridColumnMenuContainer>
    );
  }
  if (colDef.field === 'stars') {
    return (
      <StyledGridColumnMenuContainer
        hideMenu={hideMenu}
        colDef={colDef}
        ownerState={{ color }}
        {...other}
      >
        <Box
          sx={{
            width: 127,
            height: 160,
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <StarOutlineIcon sx={{ fontSize: 80 }} />
        </Box>
      </StyledGridColumnMenuContainer>
    );
  }
  return (
    <StyledGridColumnMenu
      hideMenu={hideMenu}
      colDef={colDef}
      ownerState={{ color }}
      {...other}
    />
  );
}

export default function CustomColumnMenu() {
  const [color, setColor] = React.useState<PaletteColorKey>('primary');
  const apiRef = useGridApiRef();

  return (
    <Box sx={{ width: '100%' }}>
      <Button
        color={color}
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          setColor((current) => (current === 'primary' ? 'secondary' : 'primary'));
          apiRef.current.showColumnMenu('default');
        }}
      >
        Toggle menu background
      </Button>
      <Box sx={{ height: 250, mt: 1 }}>
        <DataGridPro
          apiRef={apiRef}
          columns={[
            { field: 'default', width: 150 },
            { field: 'name', width: 150 },
            { field: 'stars', width: 150 },
          ]}
          rows={[
            {
              id: 1,
              name: 'MUI',
              stars: 28000,
              default: 'Open source',
            },
            {
              id: 2,
              name: 'DataGridPro',
              stars: 15000,
              default: 'Enterprise',
            },
          ]}
          slots={{
            columnMenu: CustomColumnMenuComponent as GridSlots['columnMenu'],
          }}
          slotProps={{
            columnMenu: { color },
          }}
        />
      </Box>
    </Box>
  );
}
