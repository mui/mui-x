import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { DataGrid } from '@mui/x-data-grid';
import { expect } from 'chai';

describe('<DataGrid /> - Accessibility', () => {
  const { render } = createRenderer();

  const baselineProps = {
    columns: [{ field: 'id' }],
    rows: [{ id: 0 }],
  };

  it('should use the `label` prop as the `aria-label` attribute of role="grid"', () => {
    render(<DataGrid {...baselineProps} label="Grid label" />);
    expect(document.querySelector('div[role="grid"]')).to.have.attribute(
      'aria-label',
      'Grid label',
    );
  });

  it('should only use the `label` prop as the `aria-label` attribute of role="grid" if `aria-label` is not provided', () => {
    render(<DataGrid {...baselineProps} label="Grid label" aria-label="Grid aria-label" />);
    expect(document.querySelector('div[role="grid"]')).to.have.attribute(
      'aria-label',
      'Grid aria-label',
    );
  });

  it('should only use the `label` prop as the `aria-label` attribute of role="grid" if `aria-labelledby` is not provided', () => {
    render(
      <DataGrid {...baselineProps} label="Grid label" aria-labelledby="Grid aria-labelledby" />,
    );
    expect(document.querySelector('div[role="grid"]')).to.have.attribute(
      'aria-labelledby',
      'Grid aria-labelledby',
    );
    expect(document.querySelector('div[role="grid"]')).not.to.have.attribute('aria-label');
  });
});
