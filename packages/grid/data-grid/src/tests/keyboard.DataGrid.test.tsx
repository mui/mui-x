import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  // @ts-expect-error need to migrate helpers to TypeScript
  createEvent,
} from 'test/utils/index';
import { spy } from 'sinon';
import { expect } from 'chai';
import { DataGrid } from '@material-ui/data-grid';

describe('<DataGrid /> - Keyboard', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

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
          <input type="text" data-testid="custom-input" onKeyDown={handleInputKeyDown} />
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
      <div style={{ width: 300, height: 300 }}>
        <DataGrid rows={rows} columns={columns} />
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
