# @mui/x-charts-material

**Material UI integration for @mui/x-charts-base**

This package provides Material UI styled components and theme integration for the framework-agnostic `@mui/x-charts-base` package.

## Key Features

- ✅ **Automatic Material UI theme integration** - Seamlessly uses your Material UI theme
- ✅ **Styled components** - All base components wrapped with Material UI `styled` API  
- ✅ **Zero configuration** - Just wrap your app with `MaterialChartThemeProvider`
- ✅ **Full TypeScript support** - Type-safe Material UI charts

## Installation

```bash
npm install @mui/x-charts-material @mui/x-charts-base @mui/material @emotion/react @emotion/styled
```

## Usage

### With Material UI Theme

The simplest way to use this package is with the `MaterialChartThemeProvider` which automatically adapts your Material UI theme:

```tsx
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MaterialChartThemeProvider, PieArc } from '@mui/x-charts-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MaterialChartThemeProvider>
        {/* Your chart components - they automatically use the Material UI theme */}
        <svg width={400} height={400}>
          <PieArc
            id="series-1"
            dataIndex={0}
            color="#1976d2"
            startAngle={0}
            endAngle={Math.PI}
            innerRadius={0}
            outerRadius={100}
            cornerRadius={0}
            paddingAngle={0}
            isFaded={false}
            isHighlighted={false}
            isFocused={false}
          />
        </svg>
      </MaterialChartThemeProvider>
    </ThemeProvider>
  );
}
```

### Manual Theme Adaptation

If you want more control, you can manually adapt a Material UI theme:

```tsx
import { useTheme } from '@mui/material/styles';
import { ChartThemeProvider, adaptMuiTheme } from '@mui/x-charts-material';

function MyCharts() {
  const muiTheme = useTheme();
  const chartTheme = adaptMuiTheme(muiTheme);

  return (
    <ChartThemeProvider theme={chartTheme}>
      {/* Your charts */}
    </ChartThemeProvider>
  );
}
```

## How It Works

This package acts as a bridge between:

1. **@mui/x-charts-base** - Framework-agnostic chart components
2. **@mui/material** - Material UI component library and theming

It provides:

- `MaterialChartThemeProvider` - Automatically converts Material UI theme to chart theme
- `adaptMuiTheme` - Function to manually convert Material UI theme  
- Styled versions of all base components using Material UI's `styled` API

## Architecture

```
@mui/x-charts-material (Material UI integration)
    ↓ uses
@mui/x-charts-base (Framework-agnostic core)
```

This architecture allows:
- Users who want Material UI integration can use `@mui/x-charts-material`
- Users who want framework-agnostic charts can use `@mui/x-charts-base` directly
- Users who want other frameworks (Chakra, Ant Design, etc.) can create their own integration packages

## Comparison with @mui/x-charts

| Feature | @mui/x-charts (legacy) | @mui/x-charts-material (new) |
|---------|----------------------|---------------------------|
| Material UI dependency | Required | Required |
| Bundle size | Larger | Smaller (split into base + material) |
| Framework flexibility | Material UI only | Can use base package standalone |
| Theming | Material UI only | Material UI + custom themes |
| Migration path | N/A | Smooth upgrade from base |

## Related Packages

- `@mui/x-charts-base` - Framework-agnostic base package
- `@mui/x-charts` - Legacy package (will be deprecated)
- `@mui/material` - Material UI component library

## License

MIT
