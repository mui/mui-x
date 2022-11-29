import * as React from 'react';
import { deepmerge } from '@mui/utils';
import {
  DataGrid,
  GridToolbar,
  // BaseTextFieldSlotProps
} from '@mui/x-data-grid';
import DataGridUnstyled from '@mui/x-data-grid/DataGridUnstyled';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  experimental_extendTheme as extendMuiTheme,
  styled,
} from '@mui/material/styles';
import {
  extendTheme as extendJoyTheme,
  // useColorScheme
} from '@mui/joy/styles';
// import IconButton from '@mui/joy/IconButton';
// import FormControl from '@mui/joy/FormControl';
// import FormLabel from '@mui/joy/FormLabel';
// import Input from '@mui/joy/Input';
// import Select from '@mui/joy/Select';
// import DarkMode from '@mui/icons-material/DarkMode';
// import LightMode from '@mui/icons-material/LightMode';

const muiTheme = extendMuiTheme();
const joyTheme = extendJoyTheme({
  cssVarPrefix: 'mui',
});
const theme = deepmerge(joyTheme, muiTheme);

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

// const ModeToggle = () => {
//   const { mode, setMode } = useColorScheme();
//   const [mounted, setMounted] = React.useState(false);
//   React.useEffect(() => {
//     setMounted(true);
//   }, []);
//   if (!mounted) {
//     return null;
//   }
//   return (
//     <IconButton
//       onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
//       sx={{ position: 'fixed', top: '1rem', right: '1rem' }}
//     >
//       {mode === 'dark' ? <DarkMode /> : <LightMode />}
//     </IconButton>
//   );
// };

// const TextFieldAdapter = React.forwardRef<any, BaseTextFieldSlotProps>(
//   (
//     {
//       label,
//       children,
//       fullWidth,
//       id,
//       type,
//       InputLabelProps,
//       InputProps,
//       // SelectProps,
//       inputRef,
//       onChange,
//       placeholder,
//       select,
//       value,
//       variant = 'outlined',
//     },
//     ref,
//   ) => {
//     const variantMapping = {
//       standard: 'soft',
//       outlined: 'outlined',
//     } as const;
//     return (
//       <FormControl id={id} ref={ref}>
//         {label && <FormLabel {...InputLabelProps}>{label}</FormLabel>}
//         {select ? (
//           // @ts-ignore
//           <Select componentsProps={{ button: { ref: inputRef } }} value={value} onChange={onChange}>
//             {children}
//           </Select>
//         ) : (
//           <Input
//             variant={variantMapping[variant]}
//             placeholder={placeholder}
//             type={type}
//             fullWidth={fullWidth}
//             startDecorator={InputProps?.startAdornment}
//             endDecorator={InputProps?.endAdornment}
//             componentsProps={{
//               input: {
//                 ref: inputRef,
//               },
//             }}
//             value={value}
//             onChange={onChange}
//           />
//         )}
//       </FormControl>
//     );
//   },
// );

export default function Playground() {
  const { loading, data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 40,
    editable: true,
  });
  return (
    <div style={{ maxWidth: 1200, margin: 'auto' }}>
      <StyledBox>
        <h2>DataGridUnstyled</h2>
        <DataGridUnstyled
          {...data}
          components={{
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: { showQuickFilter: true },
          }}
          loading={loading}
          checkboxSelection
          rowThreshold={0}
        />
      </StyledBox>
      <br />
      <br />
      <br />
      <MaterialCssVarsProvider>
        <StyledBox>
          <h2>DataGrid - Material UI</h2>
          <DataGrid
            {...data}
            components={{
              Toolbar: GridToolbar,
            }}
            componentsProps={{
              toolbar: { showQuickFilter: true },
            }}
            loading={loading}
            checkboxSelection
            rowThreshold={0}
          />
        </StyledBox>
      </MaterialCssVarsProvider>
      <br />
      <br />
      <br />
      {/* <CssVarsProvider theme={theme}>
        <ModeToggle />
        <StyledBox>
          <h2>DataGrid - Joy UI</h2>
          <DataGrid
            {...data}
            components={{
              Toolbar: GridToolbar,
              BaseCheckbox: Checkbox,
              BaseTextField: TextFieldAdapter,
              BaseButton: Button,
            }}
            componentsProps={{
              toolbar: { showQuickFilter: true },
              baseButton: {
                variant: 'plain',
                size: 'sm',
              },
            }}
            loading={loading}
            checkboxSelection
            rowThreshold={0}
          />
        </StyledBox>
      </CssVarsProvider> */}
      <br />
      <br />
      <br />
    </div>
  );
}
