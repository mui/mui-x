import * as React from 'react';
import { spy } from 'sinon';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { grid } from 'test/utils/helperFn';
import { expect } from 'chai';
import { DataGrid, DataGridProps, GridToolbar, gridClasses } from '@mui/x-data-grid';
import {
  COMFORTABLE_DENSITY_FACTOR,
  COMPACT_DENSITY_FACTOR,
} from '../hooks/features/density/densitySelector';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

describe('<DataGrid /> - Density', () => {
  const { render, clock } = createRenderer({ clock: 'fake' });

  const baselineProps = {
    autoHeight: isJSDOM,
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
      {
        id: 1,
        brand: 'Adidas',
      },
      {
        id: 2,
        brand: 'Puma',
      },
    ],
    columns: [
      {
        field: 'id',
      },
      {
        field: 'brand',
      },
    ],
  };

  function expectHeight(value: number) {
    expect(screen.getAllByRole('row')[1]).toHaveInlineStyle({
      maxHeight: `${Math.floor(value)}px`,
    });

    expect(getComputedStyle(screen.getAllByRole('gridcell')[1]).height).to.equal(
      `${Math.floor(value)}px`,
    );
  }

  before(function beforeHook() {
    if (isJSDOM) {
      // JSDOM seem to not support CSS variables properly and `height: var(--height)` ends up being `height: ''`
      this.skip();
    }
  });

  describe('prop: `initialState.density`', () => {
    it('should set the density to the value of initialState.density', () => {
      const rowHeight = 30;
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            initialState={{ density: 'compact' }}
            slots={{
              toolbar: GridToolbar,
            }}
            rowHeight={rowHeight}
          />
        </div>,
      );

      expectHeight(rowHeight * COMPACT_DENSITY_FACTOR);
    });
  });

  describe('prop: `density`', () => {
    it('should set the density value using density prop', () => {
      const rowHeight = 30;
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} density="compact" rowHeight={rowHeight} />
        </div>,
      );

      expectHeight(rowHeight * COMPACT_DENSITY_FACTOR);
    });

    it('should allow to control the density from the prop using state', () => {
      const rowHeight = 30;

      function Grid(props: Partial<DataGridProps>) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid
              {...baselineProps}
              slots={{
                toolbar: GridToolbar,
              }}
              {...props}
            />
          </div>
        );
      }

      const { setProps } = render(<Grid rowHeight={rowHeight} density="standard" />);

      expectHeight(rowHeight);

      fireEvent.click(screen.getByText('Density'));
      clock.tick(100);
      fireEvent.click(screen.getByText('Compact'));

      // Not updated because of the controlled prop
      expectHeight(rowHeight);

      // Explicitly update the prop
      setProps({ density: 'compact' });
      clock.tick(200);
      expectHeight(rowHeight * COMPACT_DENSITY_FACTOR);
    });

    it('should call `onDensityChange` prop when density gets updated', () => {
      const onDensityChange = spy();
      function Test() {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid
              {...baselineProps}
              slots={{
                toolbar: GridToolbar,
              }}
              onDensityChange={onDensityChange}
            />
          </div>
        );
      }
      render(<Test />);
      fireEvent.click(screen.getByText('Density'));
      fireEvent.click(screen.getByText('Comfortable'));
      expect(onDensityChange.callCount).to.equal(1);
      expect(onDensityChange.firstCall.args[0]).to.equal('comfortable');
    });
  });

  describe('density selection menu', () => {
    it('should increase grid density when selecting compact density', () => {
      const rowHeight = 30;
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            slots={{
              toolbar: GridToolbar,
            }}
            rowHeight={rowHeight}
          />
        </div>,
      );

      fireEvent.click(screen.getByText('Density'));
      clock.tick(100);
      fireEvent.click(screen.getByText('Compact'));

      expectHeight(rowHeight * COMPACT_DENSITY_FACTOR);
    });

    it('should decrease grid density when selecting comfortable density', () => {
      const rowHeight = 30;
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid
            {...baselineProps}
            slots={{
              toolbar: GridToolbar,
            }}
            rowHeight={rowHeight}
          />
        </div>,
      );

      fireEvent.click(screen.getByText('Density'));
      fireEvent.click(screen.getByText('Comfortable'));

      expectHeight(rowHeight * COMFORTABLE_DENSITY_FACTOR);
    });

    it('should increase grid density even if toolbar is not enabled', () => {
      const rowHeight = 30;
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} rowHeight={rowHeight} density="compact" />
        </div>,
      );

      expectHeight(rowHeight * COMPACT_DENSITY_FACTOR);
    });

    it('should decrease grid density even if toolbar is not enabled', () => {
      const rowHeight = 30;
      render(
        <div style={{ width: 300, height: 300 }}>
          <DataGrid {...baselineProps} rowHeight={rowHeight} density="comfortable" />
        </div>,
      );

      expectHeight(rowHeight * COMFORTABLE_DENSITY_FACTOR);
    });

    it('should apply to the root element a class corresponding to the current density', () => {
      function Test(props: Partial<DataGridProps>) {
        return (
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...baselineProps} {...props} />
          </div>
        );
      }
      const { setProps } = render(<Test />);
      expect(grid('root')).to.have.class(gridClasses['root--densityStandard']);
      setProps({ density: 'compact' });
      expect(grid('root')).to.have.class(gridClasses['root--densityCompact']);
      setProps({ density: 'comfortable' });
      expect(grid('root')).to.have.class(gridClasses['root--densityComfortable']);
    });
  });
});
