import { XGrid } from '@material-ui/x-grid/XGrid';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import * as React from 'react';
import { getActiveCell } from '../../../../test/utils/helperFn';
// @ts-expect-error need to migrate helpers to TypeScript
import { createClientRenderStrictMode, fireEvent } from '../../../../test/utils/index';
import { useData } from '../../../storybook/src/hooks/useData';
import { Columns } from '../../_modules_/grid/models/colDef/colDef';

describe('<XGrid /> - Keyboard ', () => {
  // TODO v5: replace with createClientRender
  const render = createClientRenderStrictMode();

  before(function beforeHook() {
    if (/jsdom/.test(window.navigator.userAgent)) {
      // Need layouting
      this.skip();
    }
  });

  /* eslint-disable material-ui/disallow-active-element-as-key-event-target */
  const KeyboardTest = () => {
    const data = useData(100, 20);
    const transformColSizes = (columns: Columns) =>
      columns.map((column) => ({ ...column, width: 60 }));

    return (
      <div style={{ width: 300, height: 300 }}>
        <XGrid rows={data.rows} columns={transformColSizes(data.columns)} />
      </div>
    );
  };

  it('cell navigation with arrows ', () => {
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
