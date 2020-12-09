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

  describe('state', () => {
    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        // Need layouting
        this.skip();
      }
    });
    it('should allow to control the state using useState', async () => {
      function GridStateTest({direction, sortedRows}) {
        const gridState = {
          sorting: {sortModel: [{field: 'brand', sort: direction}], sortedRows},
        };

        return (
          <div style={{width: 300, height: 500}}>
            <DataGrid {...baselineProps} state={gridState}/>
          </div>
        );
      }

      const {setProps} = render(<GridStateTest direction={'desc'} sortedRows={[2, 0, 1]}/>);
      expect(getColumnValues()).to.deep.equal(['Puma', 'Nike', 'Adidas']);
      setProps({direction: 'asc', sortedRows: [1, 0, 2]});
      expect(getColumnValues()).to.deep.equal(['Puma', 'Nike', 'Adidas'].reverse());
    });
  });
});
