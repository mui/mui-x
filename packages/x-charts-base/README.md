# @mui/x-charts-base

**Framework-agnostic base charting library for MUI X Charts**

This package provides the core, framework-agnostic implementation of MUI X Charts components without any dependency on `@mui/material`.

## Key Features

- ✅ **Zero Material UI dependencies** - Works with any UI framework
- ✅ **Simple theming system** - CSS-in-JS free, uses inline styles
- ✅ **Minimal bundle size** - No runtime styling overhead
- ✅ **Full TypeScript support** - Type-safe charting components

## Installation

```bash
npm install @mui/x-charts-base
```

## Usage

### Basic Example

```tsx
import { ChartThemeProvider, PieArc } from '@mui/x-charts-base';

function App() {
  return <ChartThemeProvider>{/* Your chart components */}</ChartThemeProvider>;
}
```

### With Custom Theme

```tsx
import { ChartThemeProvider } from '@mui/x-charts-base';

const customTheme = {
  palette: {
    text: {
      primary: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
};

function App() {
  return <ChartThemeProvider theme={customTheme}>{/* Your chart components */}</ChartThemeProvider>;
}
```

## Integration with Material UI

If you want to use this package with Material UI theming, check out the `@mui/x-charts-material` package which provides Material UI integration on top of this base package.

## Architecture

This package follows a "headless" approach where:

1. **Core logic** is framework-agnostic
2. **Styling** uses inline styles and CSS variables
3. **Theming** is provided through React Context
4. **Components** are fully customizable

## Related Packages

- `@mui/x-charts-material` - Material UI integration
- `@mui/x-charts` - Full-featured charts with Material UI (legacy)

## License

MIT
