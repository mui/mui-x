import * as React from 'react';
import { DataGridPro, GRID_CHECKBOX_SELECTION_FIELD, GridToolbar } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';
import { experimental_extendTheme as extendMuiTheme, styled } from '@mui/material/styles';
import {
  CssVarsProvider,
  extendTheme as extendJoyTheme,
  useColorScheme,
  ThemeInput,
} from '@mui/joy/styles';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Checkbox from '@mui/joy/Checkbox';
import TextField from '@mui/joy/TextField';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import Search from '@mui/icons-material/Search';

const theme = extendJoyTheme(extendMuiTheme() as ThemeInput);

const StyledBox = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: 600,
  width: '100%',
  marginTop: '4rem',
  '& .MuiFormGroup-options': {
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
    '& > div': {
      minWidth: 100,
      margin: theme.spacing(2),
      marginLeft: 0,
    },
  },
});

const ModeToggle = () => {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <IconButton
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      sx={{ position: 'fixed', top: '1rem', right: '1rem' }}
    >
      {mode === 'dark' ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
};

export default function Playground() {
  const { loading, data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 40,
    editable: true,
  });
  return (
    <CssVarsProvider theme={theme}>
      <ModeToggle />
      <StyledBox>
        <DataGridPro
          {...data}
          components={{
            Toolbar: GridToolbar,
            BaseCheckbox: Checkbox,
            BaseTextField: TextField,
            BaseButton: Button,
          }}
          componentsProps={{
            toolbar: { showQuickFilter: true },
            baseButton: {
              variant: 'plain',
              size: 'sm',
            },
            baseTextField: {
              size: 'sm',
              variant: 'outlined',
              startDecorator: <Search />,
            },
          }}
          loading={loading}
          checkboxSelection
          disableSelectionOnClick
          rowThreshold={0}
          initialState={{
            ...data.initialState,
            pinnedColumns: { left: [GRID_CHECKBOX_SELECTION_FIELD, 'desk'] },
          }}
        />
      </StyledBox>
    </CssVarsProvider>
  );
}
