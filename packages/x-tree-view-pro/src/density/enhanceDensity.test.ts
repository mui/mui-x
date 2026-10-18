import { describe, it, expect } from 'vitest';
import { createTheme, unstable_enhanceDensity as enhanceMaterial } from '@mui/material/styles';
import { enhanceDensity } from './enhanceDensity';

describe('enhanceDensity', () => {
  it('adds the virtualized row height and indentation on top of the community emissions', () => {
    const input = enhanceMaterial(createTheme());
    const theme = enhanceDensity(input);
    expect(theme).not.toBe(input);
    expect(theme.components.MuiRichTreeViewPro?.defaultProps).toEqual({
      itemHeight: 32,
      itemChildrenIndentation: 12,
    });
    expect(theme.components.MuiRichTreeView?.defaultProps).toEqual({ itemChildrenIndentation: 12 });
  });
});
