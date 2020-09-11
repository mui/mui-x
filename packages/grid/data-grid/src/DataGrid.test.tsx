/* eslint-disable react/forbid-foreign-prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
// @ts-ignore
import { createClientRender } from 'test/utils';
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
    columns: [
      { field: 'id', hide: true },
      { field: 'brand', width: 100 },
    ],
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
  });
});
