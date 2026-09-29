import { describe, it, expect } from 'vitest';
import { createTheme } from '@mui/material/styles';
import { getInlineTypographyStyle } from './getInlineTypographyStyle';

describe('getInlineTypographyStyle', () => {
  it('should keep flat properties and drop nested rules', () => {
    const baseTheme = createTheme();
    const theme = createTheme(baseTheme, {
      typography: {
        caption: {
          [baseTheme.breakpoints.up('md')]: { fontSize: '0.875rem' },
          '&:hover': { color: 'red' },
        },
      },
    });

    const {
      [baseTheme.breakpoints.up('md')]: mediaQuery,
      '&:hover': hover,
      ...flat
    } = theme.typography.caption as Record<string, unknown>;

    expect(mediaQuery).not.to.equal(undefined);
    expect(getInlineTypographyStyle(theme.typography.caption)).to.deep.equal(flat);
  });
});
