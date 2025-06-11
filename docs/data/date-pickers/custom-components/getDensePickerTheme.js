'use client';

export const gray = {
  50: 'hsl(220, 60%, 99%)',
  100: 'hsl(220, 35%, 94%)',
  200: 'hsl(220, 35%, 88%)',
  300: 'hsl(220, 25%, 80%)',
  400: 'hsl(220, 20%, 65%)',
  500: 'hsl(220, 20%, 42%)',
  600: 'hsl(220, 25%, 35%)',
  700: 'hsl(220, 25%, 25%)',
  800: 'hsl(220, 25%, 10%)',
  900: 'hsl(220, 30%, 5%)',
};

export const getDensePickerTheme = (mode) => ({
  palette: {
    mode,
    primary: {
      light: 'hsl(240, 83%, 88%)',
      main: 'hsl(240, 83%, 65%)',
      dark: 'hsl(240, 78%, 43%)',
      contrastText: '#fff',
      ...(mode === 'dark' && {
        contrastText: 'hsl(240, 82%, 97%)',
        light: 'hsl(240, 83%, 80%)',
        main: 'hsl(240, 83%, 70%)',
        dark: 'hsl(240, 78%, 35%)',
      }),
    },
  },
  typography: {
    fontFamily: ['"Inter", "sans-serif"'].join(','),
    fontSize: 13,
  },
  components: {
    MuiDateRangePickerDay2: {
      styleOverrides: {
        root: {
          '--PickerDay-horizontalMargin': '8px',
          '--PickerDay-size': '24px',
          borderRadius: '4px',
        },
        insidePreviewing: {
          '::after': {
            borderColor: 'transparent',
            backgroundColor: gray[200],
            opacity: 0.2,
            ...(mode === 'dark' && {
              backgroundColor: gray[600],
            }),
          },
        },
        previewStart: {
          '::after': {
            borderColor: 'transparent',
            backgroundColor: gray[200],
            opacity: 0.2,
            ...(mode === 'dark' && {
              backgroundColor: gray[600],
            }),
          },
        },
        previewEnd: {
          '::after': {
            borderColor: 'transparent',
            backgroundColor: gray[200],
            opacity: 0.2,
            ...(mode === 'dark' && {
              backgroundColor: gray[600],
            }),
          },
        },
      },
    },
  },
});
