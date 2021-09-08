import * as React from 'react';
import { createClientRenderStrictMode } from 'test/utils';
import { expect } from 'chai';
import { DataGridPro, gridClasses } from '@mui/x-data-grid-pro';
import { useData } from 'packages/storybook/src/hooks/useData';

describe('<DataGridPro/> - Components', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  describe('footer', () => {
    it('should hide the row count if `hideFooterRowCount` prop is set', () => {
      const TestCase = () => {
        const data = useData(100, 1);
        return (
          <div style={{ width: 500, height: 300 }}>
            <DataGridPro {...data} hideFooterRowCount />
          </div>
        );
      };
      render(<TestCase />);
      expect(document.querySelector(`.${gridClasses.rowCount}`)).to.equal(null);
    });
  });
});
