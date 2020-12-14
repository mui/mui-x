import * as React from 'react';
import {
  createClientRenderStrictMode,
  // @ts-expect-error need to migrate helpers to TypeScript
  fireEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  screen,
  // @ts-expect-error need to migrate helpers to TypeScript
  createEvent,
  // @ts-expect-error need to migrate helpers to TypeScript
  waitFor,
} from 'test/utils';
import { spy } from 'sinon';
import { expect } from 'chai';
import { getActiveCell } from 'test/utils/helperFn';
import { DataGrid } from '@material-ui/data-grid';
import { useData } from 'packages/storybook/src/hooks/useData';
import { Columns } from 'packages/grid/_modules_/grid/models/colDef/colDef';

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

  /* eslint-disable material-ui/disallow-active-element-as-key-event-target */
  const KeyboardTest = () => {
    const data = useData(100, 20);
    const transformColSizes = (columns: Columns) =>
      columns.map((column) => ({ ...column, width: 60 }));

    return (
      <div style={{ width: 300, height: 300 }}>
        <DataGrid rows={data.rows} columns={transformColSizes(data.columns)} />
      </div>
    );
  };

  it('cell navigation with arrows', () => {
    render(<KeyboardTest />);
    // @ts-ignore
    document.querySelector('[role="cell"][data-rowindex="0"][aria-colindex="0"]').focus();
    expect(getActiveCell()).to.equal('0-0');
    fireEvent.keyDown(document.activeElement!, { code: 'ArrowRight' });
    expect(getActiveCell()).to.equal('0-1');
    fireEvent.keyDown(document.activeElement!, { code: 'ArrowDown' });
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.keyDown(document.activeElement!, { code: 'ArrowLeft' });
    expect(getActiveCell()).to.equal('1-0');
    fireEvent.keyDown(document.activeElement!, { code: 'ArrowUp' });
    expect(getActiveCell()).to.equal('0-0');
  });

  it('Home / End navigation', async () => {
    render(<KeyboardTest />);
    // @ts-ignore
    document.querySelector('[role="cell"][data-rowindex="1"][aria-colindex="1"]').focus();
    expect(getActiveCell()).to.equal('1-1');
    fireEvent.keyDown(document.activeElement!, { code: 'Home' });
    expect(getActiveCell()).to.equal('1-0');
    fireEvent.keyDown(document.activeElement!, { code: 'End' });
    await waitFor(() =>
      document.querySelector('[role="cell"][data-rowindex="1"][aria-colindex="19"]'),
    );
    expect(getActiveCell()).to.equal('1-19');
  });
  /* eslint-enable material-ui/disallow-active-element-as-key-event-target */
});
