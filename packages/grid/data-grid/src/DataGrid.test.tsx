/* eslint-disable react/forbid-foreign-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error need to migrate helpers to TypeScript
import { createClientRender, ErrorBoundary } from 'test/utils';
import { useFakeTimers } from 'sinon';
import { expect } from 'chai';
import { DataGrid } from '@material-ui/data-grid';

describe('<DataGrid />', () => {
  const render = createClientRender();
  const defaultProps = {
    rows: [
      {
        id: 0,
        brand: 'Nike',
      },
    ],
    columns: [{ field: 'brand', width: 100 }],
  };

  describe('layout', () => {
    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        // Need layouting
        this.skip();
      }
    });

    // Adapation of describeConformance()
    describe('Material-UI component API', () => {
      it(`attaches the ref`, () => {
        const ref = React.createRef<HTMLDivElement>();
        const { container } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...defaultProps} ref={ref} />
          </div>,
        );
        expect(ref.current).to.be.instanceof(window.HTMLDivElement);
        expect(ref.current).to.equal(container.firstChild.firstChild.firstChild);
      });

      function randomStringValue() {
        return `r${Math.random().toString(36).slice(2)}`;
      }

      it('applies the className to the root component', () => {
        const className = randomStringValue();

        const { container } = render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...defaultProps} className={className} />
          </div>,
        );

        expect(document.querySelector(`.${className}`)).to.equal(
          container.firstChild.firstChild.firstChild,
        );
      });

      it('should apply the page prop correctly', () => {
        const rows = [
          {
            id: 0,
            brand: 'Nike',
          },
          {
            id: 1,
            brand: 'Addidas',
          },
          {
            id: 2,
            brand: 'Puma',
          },
        ];
        render(
          <div style={{ width: 300, height: 300 }}>
            <DataGrid {...defaultProps} rows={rows} page={2} pageSize={1} />
          </div>,
        );
        const cell = document.querySelector('[role="cell"][aria-colindex="0"]')!;
        expect(cell).to.have.text('Addidas');
      });
    });

    describe('warnings', () => {
      let clock;

      beforeEach(() => {
        clock = useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      it('should warn if the container has no intrinsic height', () => {
        expect(() => {
          render(
            <div style={{ width: 300, height: 0 }}>
              <DataGrid {...defaultProps} />
            </div>,
          );
          clock.tick(100);
        }).toWarnDev('Material-UI Data Grid: The parent of the grid has an empty height.');
      });

      it('should warn if the container has no intrinsic width', () => {
        expect(() => {
          render(
            <div style={{ width: 0 }}>
              <div style={{ width: '100%', height: 300 }}>
                <DataGrid {...defaultProps} />
              </div>
            </div>,
          );
          clock.tick(100);
        }).toWarnDev('Material-UI Data Grid: The parent of the grid has an empty width.');
      });
    });
  });

  describe('warnings', () => {
    before(() => {
      PropTypes.resetWarningCache();
    });

    it('should raise a warning if trying to use an enterprise feature', () => {
      expect(() => {
        PropTypes.checkPropTypes(
          // @ts-ignore
          DataGrid.Naked.propTypes,
          {
            pagination: false,
          },
          'prop',
          'MockedDataGrid',
        );
      }).toErrorDev('Material-UI: `<DataGrid pagination={false} />` is not a valid prop.');
    });

    it('should throw if the rows has no id', function test() {
      // TODO is this fixed?
      if (!/jsdom/.test(window.navigator.userAgent)) {
        // can't catch render errors in the browser for unknown reason
        // tried try-catch + error boundary + window onError preventDefault
        this.skip();
      }

      const rows = [
        {
          brand: 'Nike',
        },
      ];

      const errorRef = React.createRef();
      expect(() => {
        render(
          <ErrorBoundary ref={errorRef}>
            {/* @ts-expect-error missing id */}
            <DataGrid {...defaultProps} rows={rows} />
          </ErrorBoundary>,
        );
      }).toErrorDev([
        'The data grid component requires all rows to have a unique id property',
        'The above error occurred in the <ForwardRef(DataGrid)> component',
        'The above error occurred in the <ForwardRef(DataGrid)> component',
      ]);
      expect((errorRef.current as any).errors).to.have.length(1);
      expect((errorRef.current as any).errors[0].toString()).to.include(
        'The data grid component requires all rows to have a unique id property',
      );
    });
  });
});
