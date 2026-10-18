import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import { enhanceDensity } from './enhanceDensity';

const enhancedTheme = (components = {}, options = {}) =>
  enhanceMaterial(createTheme({ components, ...options }));

describe('enhanceDensity', () => {
  it('throws when the theme carries no density scale', () => {
    expect(() => enhanceDensity(createTheme())).toThrow(/unstable_densityScale/);
  });

  it('emits the indentation from the scale as defaultProps', () => {
    const theme = enhanceDensity(enhancedTheme());
    expect(theme.components.MuiRichTreeView?.defaultProps).toEqual({ itemChildrenIndentation: 12 });
    expect(theme.components.MuiSimpleTreeView?.defaultProps).toEqual({
      itemChildrenIndentation: 12,
    });
  });

  it('puts the item row on the touch target, keeping the item height and indentation', () => {
    const theme = enhanceDensity(enhancedTheme({}, { cssVariables: true }));
    expect(theme.components.MuiTreeItem?.styleOverrides?.content).toEqual([
      {
        minHeight: 'var(--TreeView-itemHeight, var(--mui-touchTarget, 32px))',
        paddingBlock: 0,
        paddingRight: 'var(--mui-spacing-xSmall, 8px)',
        paddingLeft:
          'calc(var(--mui-spacing-xSmall, 8px) + var(--TreeView-itemChildrenIndentation) * var(--TreeView-itemDepth, 0))',
        gap: 'var(--mui-spacing-xSmall, 8px)',
      },
    ]);
  });

  it("lets the theme's own defaultProps win", () => {
    const theme = enhanceDensity(
      enhancedTheme({ MuiRichTreeView: { defaultProps: { itemChildrenIndentation: '2rem' } } }),
    );
    expect(theme.components.MuiRichTreeView?.defaultProps).toEqual({
      itemChildrenIndentation: '2rem',
    });
  });

  it('does not mutate the input theme', () => {
    const input = enhancedTheme();
    const before = JSON.stringify(input.components);
    const output = enhanceDensity(input);
    expect(output).not.toBe(input);
    expect(JSON.stringify(input.components)).toBe(before);
  });
});
