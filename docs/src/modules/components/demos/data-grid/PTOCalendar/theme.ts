import type {} from '@mui/x-data-grid-premium/themeAugmentation';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { createTheme } from '@mui/material/styles';

export const ptoCalendarTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        text: {
          primary: '#38363f',
          secondary: '#76747f',
        },
        divider: '#EEEBF0',
        action: {
          hover: '#6550b9',
        },
        DataGrid: {
          bg: '#fff',
          pinnedBg: '#fff',
          headerBg: '#fdfcfe',
        },
      },
    },
    dark: {
      palette: {
        text: {
          primary: '#faf8ff',
          secondary: '#d0cdd7',
        },
        divider: '#38363E',
        action: {
          hover: '#558bbc',
        },
        DataGrid: {
          bg: '#141A1F',
          pinnedBg: '#141A1F',
          headerBg: '#1e2429',
        },
      },
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          '&:hover': {
            backgroundColor: '#faf8ff',
            ...theme.applyStyles('dark', {
              backgroundColor: '#252d34',
            }),
          },
          '&:focus-visible': {
            outline: '2px solid #3E63DD',
            outlineOffset: '-1px',
          },
        }),
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: ({ theme }) => ({
          display: 'flex',
          gap: '1px',
          background: '#faf8ff',
          ...theme.applyStyles('dark', {
            background: '#1e2933',
          }),
        }),
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          letterSpacing: '0.01em',
          padding: '6px 12px',
          borderRadius: '10px !important',
          borderColor: 'transparent',
          margin: '0 !important',
          color: '#76747f',
          ...theme.applyStyles('dark', {
            color: '#bcbac7',
          }),
          '&.Mui-selected': {
            background: '#fff',
            borderColor: 'rgba(46, 43, 48, 0.1)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            ...theme.applyStyles('dark', {
              background: '#1d2329',
              borderColor: '#38363e',
              color: '#f2eff3',
            }),
            '&:hover': {
              background: '#fff',
              ...theme.applyStyles('dark', {
                background: '#1d2329',
              }),
            },
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: '0 12px',
          background: '#fff',
          borderColor: 'rgba(46, 43, 48, 0.1)',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          whiteSpace: 'nowrap',
          textTransform: 'none',
          color: '#38363f',
          letterSpacing: '0.01em',
          ...theme.applyStyles('dark', {
            color: '#f2eff3',
            background: '#1d2329',
            borderColor: '#38363e',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          }),
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: '#38363f',
          '&:hover': {
            backgroundColor: '#faf8ff',
          },
          ...theme.applyStyles('dark', {
            color: '#e3dfe6',
            '&:hover': {
              backgroundColor: '#252d34',
            },
          }),
        }),
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          fontSize: '0.875rem',
          height: 36,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3E63DD',
          },
        },
        notchedOutline: {
          borderColor: '#EEEBF0',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
        },
        label: {
          fontWeight: '500',
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        slotProps: {
          popper: {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -8],
                },
              },
            ],
          },
        },
      },
      styleOverrides: {
        tooltip: ({ theme }) => ({
          color: '#38363f',
          backgroundColor: '#fff',
          borderRadius: '8px',
          border: '1px solid rgba(46, 43, 48, 0.1)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)',
          fontSize: '0.75rem',
          padding: '4px 8px',
          ...theme.applyStyles('dark', {
            color: '#f2eff3',
            backgroundColor: '#1d2329',
            border: '1px solid #38363e',
          }),
        }),
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: '#EEEBF0',
          '--DataGrid-rowBorderColor': '#EEEBF0',
          ...theme.applyStyles('dark', {
            borderColor: '#38363E',
            '--DataGrid-rowBorderColor': '#38363E',
          }),
        }),
        // scrollbar: {
        //   scrollbarWidth: 'thin',
        // },
        cell: ({ theme }) => ({
          padding: 0,
          '&.today': {
            backgroundColor: '#faf8ff',
            ...theme.applyStyles('dark', {
              backgroundColor: '#1e2933',
            }),
          },
          '&:focus': {
            outline: 'none',
          },
          '&:focus-within': {
            outline: 'none',
          },
        }),
        'cell--pinnedLeft': {
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          color: '#09090b',
          borderTopColor: 'transparent',
        },
        // row: ({ theme }) => ({
        //   '&:hover': {
        //     backgroundColor: '#f7f9ff',
        //     ...theme.applyStyles('dark', {
        //       backgroundColor: '#1e2933',
        //     }),
        //   },
        // }),
        columnSeparator: {
          display: 'none',
        },
        columnHeader: {
          '&:focus': {
            outline: 'none',
          },
          '&:focus-within': {
            outline: 'none',
          },
        },
        'columnHeader--pinnedLeft': {
          padding: '0 16px',
        },
      },
    },
    MuiDateCalendar: {
      styleOverrides: {
        root: {
          height: '280px',
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        labelContainer: {
          fontSize: '1rem',
        },
      },
    },
    MuiMonthCalendar: {
      styleOverrides: {
        button: ({ theme }) => ({
          fontWeight: '500',
          fontSize: '0.875rem',
          color: '#76747f',
          borderRadius: '10px',
          ...theme.applyStyles('dark', {
            color: '#faf8ff',
          }),
          '&:hover, &:focus': {
            backgroundColor: '#faf8ff',
            ...theme.applyStyles('dark', {
              backgroundColor: '#252d34',
            }),
          },
          '&.Mui-selected': {
            backgroundColor: '#faf8ff',
            color: '#6550b9',
            ...theme.applyStyles('dark', {
              backgroundColor: '#1e2933',
              color: '#aa99ec',
            }),
            '&:hover, &:focus': {
              backgroundColor: '#faf8ff',
              ...theme.applyStyles('dark', {
                backgroundColor: '#1e2933',
              }),
            },
          },
        }),
      },
    },
    MuiPickerPopper: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: '10px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          ...theme.applyStyles('dark', {
            backgroundColor: '#141A1F',
          }),
        }),
      },
    },
  },
});
