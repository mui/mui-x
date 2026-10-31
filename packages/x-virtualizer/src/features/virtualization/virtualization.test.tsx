import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import { useVirtualizer, LayoutList } from '@mui/x-virtualizer';
import type { FocusedCell } from '@mui/x-virtualizer';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

const ROW_HEIGHT = 40;

const rows = Array.from({ length: 1000 }, (_, index) => ({ id: index, model: {} }));

function List(props: { focusedVirtualCell: FocusedCell | null }) {
  const refs = {
    container: React.useRef<HTMLDivElement>(null),
    scroller: React.useRef<HTMLDivElement>(null),
  };
  const layout = useLazyRef(() => new LayoutList(refs)).current;
  const virtualizer = useVirtualizer({
    layout,
    dimensions: {
      rowHeight: ROW_HEIGHT,
    },
    virtualization: {},

    rows,
    range: { firstRowIndex: 0, lastRowIndex: rows.length },
    rowCount: rows.length,
    focusedVirtualCell: () => props.focusedVirtualCell,

    renderRow: (params) => (
      <div key={params.id} data-testid="row" data-id={params.id} style={{ height: ROW_HEIGHT }} />
    ),
  });

  const containerProps = virtualizer.store.use(LayoutList.selectors.containerProps);
  const contentProps = virtualizer.store.use(LayoutList.selectors.contentProps);
  const positionerProps = virtualizer.store.use(LayoutList.selectors.positionerProps);

  return (
    <div {...containerProps} style={{ ...containerProps.style, height: 400, overflowY: 'auto' }}>
      <div {...contentProps} />
      <div {...positionerProps} />
      {virtualizer.api.getters.getRows()}
    </div>
  );
}

function renderedRowIds() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-testid="row"]')).map((node) =>
    Number(node.dataset.id),
  );
}

describe.skipIf(isJSDOM)('focusedVirtualCell', () => {
  const { render } = createRenderer();

  it('renders the focused row right after the last rendered row', async () => {
    const view = render(<List focusedVirtualCell={null} />);
    await waitFor(() => {
      expect(renderedRowIds().length).to.be.greaterThan(0);
    });

    const nextRowIndex = Math.max(...renderedRowIds()) + 1;
    expect(nextRowIndex).to.be.lessThan(rows.length);

    view.setProps({ focusedVirtualCell: { rowIndex: nextRowIndex, columnIndex: 0 } });

    expect(renderedRowIds()).to.include(nextRowIndex);
  });
});
