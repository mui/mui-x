import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { createRenderer } from '@mui/internal-test-utils';
import { useVirtualizer, LayoutList } from '@mui/x-virtualizer';
import type { Virtualizer } from '@mui/x-virtualizer';
import { describe, it, expect } from 'vitest';

const ROW_HEIGHT = 40;

const rows = Array.from({ length: 100 }, (_, index) => ({ id: index, model: {} }));

function List(props: { apiRef: React.RefObject<Virtualizer | null>; getRowHeight?: () => number }) {
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
    getRowHeight: props.getRowHeight,

    renderRow: (params) => <div key={params.id} style={{ height: ROW_HEIGHT }} />,
  });

  React.useEffect(() => {
    props.apiRef.current = virtualizer;
  }, [props.apiRef, virtualizer]);

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

describe('rowsMeta', () => {
  const { render } = createRenderer();

  it('positions rows without per-row heights at multiples of the row height', () => {
    const apiRef = React.createRef<Virtualizer | null>();
    render(<List apiRef={apiRef} />);

    const { state } = apiRef.current!.store;
    expect(state.rowsMeta.positions).to.deep.equal(rows.map((_, index) => index * ROW_HEIGHT));
    expect(state.rowsMeta.currentPageTotalHeight).to.equal(rows.length * ROW_HEIGHT);
    // The rows all have the base height, so none of them needs a height entry.
    expect(state.rowHeights.size).to.equal(0);
  });

  it('gives every row the base height once the per-row heights are gone', () => {
    const apiRef = React.createRef<Virtualizer | null>();
    const lastRowId = rows[rows.length - 1].id;
    const { setProps } = render(<List apiRef={apiRef} getRowHeight={() => 2 * ROW_HEIGHT} />);
    expect(apiRef.current!.store.state.rowsMeta.positions[1]).to.equal(2 * ROW_HEIGHT);
    expect(apiRef.current!.api.rowsMeta.getRowHeight(lastRowId)).to.equal(2 * ROW_HEIGHT);

    setProps({ getRowHeight: undefined });

    expect(apiRef.current!.store.state.rowsMeta.positions).to.deep.equal(
      rows.map((_, index) => index * ROW_HEIGHT),
    );
    expect(apiRef.current!.api.rowsMeta.getRowHeight(lastRowId)).to.equal(ROW_HEIGHT);
  });
});
