import * as React from 'react';
import PropTypes from 'prop-types';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  // @ts-expect-error need to migrate helpers to TypeScript
  ErrorBoundary,
  // @ts-expect-error need to migrate helpers to TypeScript
  createEvent,
} from 'test/utils/index';
import { useFakeTimers, spy } from 'sinon';
import { expect } from 'chai';
import { DataGrid, RowsProp } from '@material-ui/data-grid';
import { getColumnValues } from 'test/utils/helperFn';
import {
  COMFORTABLE_DENSITY_FACTOR,
  COMPACT_DENSITY_FACTOR,
} from 'packages/grid/_modules_/grid/hooks/features/density/useDensity';

describe('<DataGrid />', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  const baselineProps = {
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
    columns: [{field: 'brand'}],
  };


  describe('sorting', () => {
    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        // Need layouting
        this.skip();
      }
    });

    it('should sort when clicking the header cell', () => {
      render(
        <div style={{width: 300, height: 300}}>
          <DataGrid {...baselineProps} />
        </div>,
      );
      const header = screen
        .getByRole('columnheader', {name: 'brand'})
        .querySelector('.MuiDataGrid-colCellTitleContainer');
      expect(getColumnValues()).to.deep.equal(['Nike', 'Adidas', 'Puma']);
      fireEvent.click(header);
      expect(getColumnValues()).to.deep.equal(['Adidas', 'Nike', 'Puma']);
      fireEvent.click(header);
      expect(getColumnValues()).to.deep.equal(['Puma', 'Nike', 'Adidas']);
    });

    it('should keep rows sorted when rows prop change', () => {
      interface TestCaseProps {
        rows: any[];
      }

      const TestCase = (props: TestCaseProps) => {
        const {rows} = props;
        return (
          <div style={{width: 300, height: 300}}>
            <DataGrid
              {...baselineProps}
              rows={rows}
              sortModel={[
                {
                  field: 'brand',
                  sort: 'asc',
                },
              ]}
            />
          </div>
        );
      };

      const {setProps} = render(<TestCase rows={baselineProps.rows}/>);
      expect(getColumnValues()).to.deep.equal(['Adidas', 'Nike', 'Puma']);

      setProps({
        rows: [
          {
            id: 3,
            brand: 'Asics',
          },
          {
            id: 4,
            brand: 'RedBull',
          },
          {
            id: 5,
            brand: 'Hugo',
          },
        ],
      });
      expect(getColumnValues()).to.deep.equal(['Asics', 'Hugo', 'RedBull']);
    });

    it('should support server-side sorting', () => {
      interface TestCaseProps {
        rows: any[];
      }

      const TestCase = (props: TestCaseProps) => {
        const {rows} = props;
        return (
          <div style={{width: 300, height: 300}}>
            <DataGrid
              {...baselineProps}
              sortingMode="server"
              rows={rows}
              sortModel={[
                {
                  field: 'brand',
                  sort: 'desc',
                },
              ]}
            />
          </div>
        );
      };

      const rows = [
        {
          id: 3,
          brand: 'Asics',
        },
        {
          id: 4,
          brand: 'RedBull',
        },
        {
          id: 5,
          brand: 'Hugo',
        },
      ];

      const {setProps} = render(<TestCase rows={[rows[0], rows[1]]}/>);
      expect(getColumnValues()).to.deep.equal(['Asics', 'RedBull']);
      setProps({rows});
      expect(getColumnValues()).to.deep.equal(['Asics', 'RedBull', 'Hugo']);
    });
  });
});
