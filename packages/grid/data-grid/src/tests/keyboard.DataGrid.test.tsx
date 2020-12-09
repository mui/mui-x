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

  describe('keyboard', () => {
    before(function beforeHook() {
      if (/jsdom/.test(window.navigator.userAgent)) {
        // Need layouting
        this.skip();
      }
    });

    it('should be able to type in an child input', () => {
      const handleInputKeyDown = spy();

      const columns = [
        {
          field: 'name',
          headerName: 'Name',
          width: 200,
          renderCell: () => (
            <input type="text" data-testid="custom-input" onKeyDown={handleInputKeyDown}/>
          ),
        },
      ];

      const rows = [
        {
          id: 1,
          name: 'John',
        },
      ];

      render(
        <div style={{width: 300, height: 300}}>
          <DataGrid rows={rows} columns={columns}/>
        </div>,
      );
      const input = screen.getByTestId('custom-input');
      input.focus();
      const keydownEvent = createEvent.keyDown(input, {
        key: 'a',
      });
      fireEvent(input, keydownEvent);
      expect(handleInputKeyDown.callCount).to.equal(1);
    });
  });
});
