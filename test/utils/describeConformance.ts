import {
  describeConformance as baseDescribeConformance,
  ConformanceOptions,
} from '@mui/internal-test-utils';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export function describeConformance(
  minimalElement: React.ReactElement,
  getOptions: () => ConformanceOptions,
) {
  function getOptionsWithDefaults() {
    return {
      ThemeProvider,
      createTheme,
      ...getOptions(),
    };
  }

  return baseDescribeConformance(minimalElement, getOptionsWithDefaults);
}
