import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act, createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import type { Virtualizer } from '../../useVirtualizer';
import { LayoutGridSticky } from './layout';
import {
  ScrollContainerGrid,
  type ScrollContainerGridProps,
  type DemoLayout,
} from '../../../docs/ScrollContainerGrid';

function Example({
  windowScroll = false,
  before = 200,
  after = 600,
  ...props
}: ScrollContainerGridProps & { windowScroll?: boolean; before?: number; after?: number }) {
  const owner = React.useRef<HTMLDivElement>(null);
  return (
    <div
      ref={owner}
      data-testid="owner"
      style={{
        width: 600,
        height: windowScroll ? undefined : 400,
        overflow: windowScroll ? 'visible' : 'auto',
        overflowAnchor: 'none',
      }}
      dir={props.rtl ? 'rtl' : 'ltr'}
    >
      <div data-testid="before" style={{ height: before }} />
      <ScrollContainerGrid
        {...props}
        scrollContainer={props.scrollContainer ?? (windowScroll ? 'window' : () => owner.current)}
      />
      <div style={{ height: after }} />
    </div>
  );
}

function rowIds() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-row]'), (node) =>
    Number(node.dataset.row),
  );
}

describe.skipIf(isJSDOM)('external scroll containers', () => {
  const { render } = createRenderer();
  afterEach(() => {
    document.documentElement.dir = '';
    window.scrollTo(0, 0);
  });

  const layouts: DemoLayout[] = ['list', 'sticky-list', 'sticky-grid', 'grid', 'controlled-grid'];

  it('measures external geometry once per scroll event and keeps static layout props stable', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(<Example apiRef={apiRef} />);
    await waitFor(() => expect(rowIds()).to.include(0));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2000 });
    });
    await waitFor(() => expect(rowIds()).to.include(50));
    const selectors = LayoutGridSticky.selectors;
    const staticSelectors = [
      selectors.containerProps,
      selectors.contentProps,
      selectors.topContainerProps,
      selectors.bottomContainerProps,
      selectors.scrollerProps,
      selectors.scrollCanvasProps,
    ];
    const previous = staticSelectors.map((selector) => selector(apiRef.current!.store.state));
    const rect = vi.spyOn(screen.getByTestId('grid'), 'getBoundingClientRect');
    const owner = screen.getByTestId('owner');
    try {
      act(() => {
        owner.scrollTop += 1;
        owner.dispatchEvent(new Event('scroll'));
      });
      expect(rect).toHaveBeenCalledTimes(1);
      staticSelectors.forEach((selector, index) =>
        expect(selector(apiRef.current!.store.state)).to.equal(previous[index]),
      );
    } finally {
      rect.mockRestore();
    }
  });

  it('does not publish a second scrolling state update for grid-owned scrolling', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(<Example apiRef={apiRef} scrollContainer="self" />);
    await waitFor(() => expect(rowIds()).to.include(0));
    const listener = vi.fn();
    const unsubscribe = apiRef.current!.store.subscribe(listener);
    const grid = screen.getByTestId('grid').firstElementChild as HTMLElement;
    act(() => {
      grid.scrollTop = 1;
      grid.dispatchEvent(new Event('scroll'));
    });
    unsubscribe();
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('retains the external sticky render buffer during small native scrolls', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(<Example apiRef={apiRef} />);
    await waitFor(() => expect(rowIds()).to.include(0));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2000 });
    });
    await waitFor(() => expect(rowIds()).to.include(50));
    const owner = screen.getByTestId('owner');
    act(() => {
      owner.scrollTop += 1;
      owner.dispatchEvent(new Event('scroll'));
    });
    const context = apiRef.current!.store.state.virtualization.renderContext;
    act(() => {
      owner.scrollTop += 80;
      owner.dispatchEvent(new Event('scroll'));
    });
    expect(apiRef.current!.store.state.virtualization.renderContext).to.equal(context);
  });

  it('keeps retained rows at stable layer offsets when the external sticky buffer advances', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(<Example apiRef={apiRef} />);
    await waitFor(() => expect(rowIds()).to.include(0));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2000 });
    });
    await waitFor(() => expect(rowIds()).to.include(60));
    const row = document.querySelector<HTMLElement>('[data-row="60"]')!;
    const offset = row.offsetTop;
    const first = apiRef.current!.store.state.virtualization.renderContext.firstRowIndex;
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2400 });
    });
    await waitFor(() =>
      expect(
        apiRef.current!.store.state.virtualization.renderContext.firstRowIndex,
      ).to.be.greaterThan(first),
    );
    expect(row.offsetTop).to.equal(offset);
    expect(document.querySelector('[data-row="60"]')).to.equal(row);
  });

  for (const layout of ['list', 'grid'] as const) {
    it(`${layout}: updates the buffered rows when a clipping ancestor scrolls`, async () => {
      const apiRef = React.createRef<Virtualizer>();
      render(
        <div data-testid="clip" style={{ height: 300, width: 650, overflow: 'auto' }}>
          <Example before={0} apiRef={apiRef} layout={layout} />
        </div>,
      );
      await waitFor(() => expect(rowIds()).to.include(0));
      screen.getByTestId('owner').style.height = '1800px';
      act(() => {
        screen.getByTestId('clip').scrollTop = 500;
      });
      await waitFor(() => expect(rowIds()).to.include(15));
      const position = apiRef.current!.api.getScrollPosition().top;
      act(() => {
        screen.getByTestId('clip').scrollTop = 1000;
      });
      await waitFor(() => expect(rowIds()).to.include(25));
      expect(apiRef.current!.api.getScrollPosition().top).to.equal(position);
    });
  }
  for (const layout of layouts) {
    it(`${layout}: keeps its self-scrolling renderer aligned`, async () => {
      const apiRef = React.createRef<Virtualizer>();
      render(<Example apiRef={apiRef} layout={layout} scrollContainer="self" />);
      await waitFor(() => expect(rowIds()).to.include(0));
      act(() => {
        apiRef.current!.api.scrollToPosition({ top: 2000, left: 1200 });
      });
      await waitFor(() => expect(rowIds()).to.include(50));
      const grid = screen.getByTestId('grid');
      const row = grid.querySelector<HTMLElement>('[data-row="50"]')!;
      const bounds = grid.getBoundingClientRect();
      const header = screen.getByTestId('header').getBoundingClientRect();
      expect(header.top).to.be.closeTo(bounds.top, 1);
      expect(row.getBoundingClientRect().top).to.be.closeTo(header.bottom, 1);
      expect(
        row.querySelector('[data-pinned="start"]')!.getBoundingClientRect().left,
      ).to.be.closeTo(bounds.left, 1);
      expect(row.querySelector('[data-pinned="end"]')!.getBoundingClientRect().right).to.be.closeTo(
        bounds.right - apiRef.current!.store.state.dimensions.scrollbarSize,
        1,
      );
    });
  }

  for (const layout of layouts) {
    for (const windowScroll of [false, true]) {
      for (const axes of ['vertical', 'both'] as const) {
        it(`${layout}, ${windowScroll ? 'window' : 'element'}, ${axes}: virtualizes and aligns pinned bands`, async () => {
          const apiRef = React.createRef<Virtualizer>();
          render(
            <Example
              apiRef={apiRef}
              layout={layout}
              windowScroll={windowScroll}
              axes={axes}
              after={2000}
            />,
          );
          await waitFor(() => expect(rowIds().length).to.be.greaterThan(0));
          expect(rowIds().length).to.be.lessThan(100);
          act(() => {
            apiRef.current!.api.scrollToPosition({ top: 20000, left: 1200 });
          });
          await waitFor(() => expect(rowIds()).to.include(500));
          const grid = screen.getByTestId('grid');
          expect(grid.getAttribute('role')).to.equal('grid');
          for (const band of grid.querySelectorAll('[data-row], [data-band]')) {
            expect(band.closest('[role="grid"]')).to.equal(grid);
          }
          const header = screen.getByTestId('header').getBoundingClientRect();
          const owner = screen.getByTestId('owner');
          const viewportTop = windowScroll
            ? 0
            : owner.getBoundingClientRect().top + owner.clientTop;
          expect(header.top).to.be.closeTo(viewportTop, 1);
          const row = grid.querySelector<HTMLElement>('[data-row="500"]')!;
          expect(row.getBoundingClientRect().top).to.be.closeTo(header.bottom, 1);
          const headerCell = grid.querySelector<HTMLElement>(
            '[data-band="header"] [data-column="12"]',
          );
          const bodyCell = row.querySelector<HTMLElement>('[data-column="12"]');
          expect(headerCell).not.to.equal(null);
          expect(bodyCell).not.to.equal(null);
          expect(headerCell!.getBoundingClientRect().left).to.be.closeTo(
            bodyCell!.getBoundingClientRect().left,
            1,
          );
          const horizontalPosition =
            axes === 'vertical'
              ? screen.getByTestId('body-scroller').scrollLeft
              : apiRef.current!.api.getScrollPosition().left;
          expect(horizontalPosition).to.equal(1200);
          expect(apiRef.current!.api.getScrollPosition().top).to.be.closeTo(20000, 1);
          expect(row.querySelectorAll('[data-column]').length).to.be.lessThan(20);
          const startPin = row.querySelector<HTMLElement>('[data-pinned="start"]')!;
          const endPin = row.querySelector<HTMLElement>('[data-pinned="end"]')!;
          let horizontalViewport = windowScroll
            ? { left: 0, right: document.documentElement.clientWidth }
            : owner.getBoundingClientRect();
          if (axes === 'vertical') {
            horizontalViewport = screen.getByTestId('body-scroller').getBoundingClientRect();
          }
          expect(startPin.getBoundingClientRect().left).to.be.closeTo(horizontalViewport.left, 1);
          expect(endPin.getBoundingClientRect().right).to.be.closeTo(horizontalViewport.right, 1);
          const footer = screen.getByTestId('footer').getBoundingClientRect();
          const lane =
            axes === 'vertical' ? apiRef.current!.store.state.dimensions.scrollbarSize : 0;
          const viewportBottom = windowScroll
            ? document.documentElement.clientHeight
            : owner.getBoundingClientRect().top + owner.clientTop + owner.clientHeight;
          expect(footer.bottom).to.be.closeTo(viewportBottom - lane, 1);
          act(() => {
            apiRef.current!.api.scrollToPosition({ top: 1000000 });
          });
          await waitFor(() => expect(rowIds()).to.have.length(0));
          expect(screen.getByTestId('header').getBoundingClientRect().bottom).to.be.at.most(
            grid.getBoundingClientRect().bottom + 1,
          );
          expect(screen.getByTestId('footer').getBoundingClientRect().top).to.be.at.least(
            grid.getBoundingClientRect().top - 1,
          );
        });
      }
    }
  }

  for (const windowScroll of [false, true]) {
    for (const layout of ['sticky-grid', 'controlled-grid'] as const) {
      for (const scrollbarSize of [0, 16]) {
        it(`${layout}, ${windowScroll ? 'window' : 'element'}: reserves only the ${scrollbarSize}px scrollbar lane below pinned rows`, async () => {
          const apiRef = React.createRef<Virtualizer>();
          render(
            <Example
              apiRef={apiRef}
              layout={layout}
              windowScroll={windowScroll}
              rowCount={100}
              scrollbarSize={scrollbarSize}
              insets={{ bottom: 20 }}
              after={2000}
            />,
          );
          await waitFor(() => expect(rowIds()).to.include(0));
          act(() => {
            apiRef.current!.api.scrollToPosition({ top: 2000, left: 1200 });
          });
          await waitFor(() => expect(rowIds()).to.include(50));
          const owner = screen.getByTestId('owner');
          const viewportBottom = windowScroll
            ? document.documentElement.clientHeight
            : owner.getBoundingClientRect().top + owner.clientTop + owner.clientHeight;
          const grid = screen.getByTestId('grid');
          const footer = screen.getByTestId('footer');
          const scrollbar = screen.getByTestId('horizontal-scrollbar');
          expect(footer.getBoundingClientRect().bottom).to.be.closeTo(
            viewportBottom - 20 - scrollbarSize,
            1,
          );
          expect(scrollbar.getBoundingClientRect().bottom).to.be.closeTo(viewportBottom - 20, 1);
          expect(scrollbar.getBoundingClientRect().height).to.equal(Math.max(14, scrollbarSize));
          expect(grid.getBoundingClientRect().height).to.equal(4120 + scrollbarSize);
          // At the end of the grid, both the footer and scrollbar stop together.
          act(() => {
            apiRef.current!.api.scrollToPosition({ top: 3990 });
          });
          await waitFor(() =>
            expect(apiRef.current!.api.getScrollPosition().top).to.be.closeTo(3990, 1),
          );
          expect(footer.getBoundingClientRect().bottom).to.be.closeTo(
            grid.getBoundingClientRect().bottom - scrollbarSize,
            1,
          );
          expect(scrollbar.getBoundingClientRect().bottom).to.be.closeTo(
            grid.getBoundingClientRect().bottom,
            1,
          );
        });
      }
    }
  }

  it('renders no screenful when wholly outside the viewport and refreshes after surrounding content resizes', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(<Example apiRef={apiRef} before={800} />);
    await waitFor(() => expect(rowIds()).to.have.length(0));
    expect(apiRef.current!.api.getViewportPageSize()).to.equal(0);
    act(() => {
      screen.getByTestId('before').style.height = '100px';
    });
    await waitFor(() => expect(rowIds()).to.include(0));
  });

  it('preserves the shared owner position on mount and independently writes axes', async () => {
    const apiRef = React.createRef<Virtualizer>();
    const { setProps } = render(<Example apiRef={apiRef} axes="both" />);
    await waitFor(() => expect(rowIds().length).to.be.greaterThan(0));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 1000, left: 500 });
    });
    await waitFor(() => expect(apiRef.current!.api.getScrollPosition().left).to.be.closeTo(500, 1));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2000 });
    });
    expect(apiRef.current!.api.getScrollPosition().left).to.be.closeTo(500, 1);
    setProps({ pinned: false });
    expect(apiRef.current!.api.getScrollPosition().left).to.be.closeTo(500, 1);
  });

  it('supports insets and variable row heights', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(<Example apiRef={apiRef} insets={{ top: 32, bottom: 20 }} variableHeight />);
    await waitFor(() => expect(rowIds().length).to.be.greaterThan(0));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 15200 });
    });
    await waitFor(() => expect(rowIds()).to.include(300));
    expect(
      screen.getByTestId('header').getBoundingClientRect().top -
        screen.getByTestId('owner').getBoundingClientRect().top,
    ).to.be.closeTo(32, 1);
  });

  it('waits for an unresolved owner and restores an explicit initial position', async () => {
    const apiRef = React.createRef<Virtualizer>();
    let owner: HTMLElement | null = null;
    render(
      <Example
        apiRef={apiRef}
        scrollContainer={() => owner}
        initialScroll={{ top: 20000, left: 1200 }}
      />,
    );
    expect(rowIds()).to.have.length(0);
    const nextOwner = screen.getByTestId('owner');
    act(() => {
      owner = nextOwner;
      apiRef.current!.api.refreshScrollContainer();
    });
    await waitFor(() => expect(rowIds()).to.include(500));
    expect(apiRef.current!.api.getScrollPosition().left).to.equal(1200);
  });

  for (const layout of ['list', 'sticky-grid', 'controlled-grid'] as const) {
    for (const axes of ['vertical', 'both'] as const) {
      it(`${layout}, ${axes}: restores horizontal scrolling before initially empty rows become available`, async () => {
        const apiRef = React.createRef<Virtualizer>();
        const { setProps } = render(
          <Example
            apiRef={apiRef}
            layout={layout}
            axes={axes}
            rowCount={0}
            initialScroll={{ top: 2000, left: 1200 }}
          />,
        );
        await waitFor(() => expect(apiRef.current!.api.getScrollPosition().left).to.equal(1200));
        await waitFor(() =>
          expect(screen.getByTestId('header').textContent).to.include('header × 12'),
        );
        setProps({ rowCount: 10000 });
        await waitFor(() => expect(rowIds()).to.include(50));
        expect(apiRef.current!.api.getScrollPosition().top).to.equal(2000);
        expect(apiRef.current!.api.getScrollPosition().left).to.equal(1200);
      });
    }
  }

  it('renders visible header columns without overscanning into an offscreen body', async () => {
    render(<Example before={380} />);
    await waitFor(() => expect(screen.getByTestId('header').textContent).to.include('header × 2'));
    expect(rowIds()).to.have.length(0);
  });

  for (const rowCount of [0, 10000]) {
    it(`restores an explicit zero position relative to a grid with ${rowCount} rows`, async () => {
      const apiRef = React.createRef<Virtualizer>();
      render(<Example apiRef={apiRef} rowCount={rowCount} initialScroll={{ top: 0, left: 0 }} />);
      await waitFor(() => expect(apiRef.current!.api.getScrollPosition().top).to.equal(0));
      expect(screen.getByTestId('owner').scrollTop).to.equal(200);
    });
  }

  it('cleans up owner listeners on unmount', async () => {
    const callback = vi.fn();
    const { unmount } = render(<Example onScrollChange={callback} />);
    await waitFor(() => expect(rowIds().length).to.be.greaterThan(0));
    const owner = screen.getByTestId('owner');
    unmount();
    callback.mockClear();
    owner.dispatchEvent(new Event('scroll'));
    expect(callback).not.toHaveBeenCalled();
  });

  for (const layout of layouts) {
    for (const windowScroll of [false, true]) {
      for (const axes of ['vertical', 'both'] as const) {
        it(`${layout}: uses RTL coordinates with ${windowScroll ? 'window' : 'element'} scrolling on ${axes}`, async () => {
          if (windowScroll) {
            document.documentElement.dir = 'rtl';
          }
          const apiRef = React.createRef<Virtualizer>();
          render(
            <Example apiRef={apiRef} layout={layout} rtl axes={axes} windowScroll={windowScroll} />,
          );
          await waitFor(() => expect(rowIds().length).to.be.greaterThan(0));
          act(() => {
            apiRef.current!.api.scrollToPosition({ top: 20000, left: -1200 });
          });
          await waitFor(() =>
            expect(apiRef.current!.api.getScrollPosition().left).to.be.closeTo(-1200, 1),
          );
          const headerPin = document.querySelector<HTMLElement>(
            '[data-band="header"] [data-pinned="start"]',
          )!;
          const rowPin = document.querySelector<HTMLElement>(
            '[data-row="500"] [data-pinned="start"]',
          )!;
          expect(headerPin.getBoundingClientRect().right).to.be.closeTo(
            rowPin.getBoundingClientRect().right,
            1,
          );
          expect(rowIds()).to.include(500);
          const ownerBounds = windowScroll
            ? { right: document.documentElement.clientWidth }
            : screen.getByTestId('owner').getBoundingClientRect();
          const right =
            axes === 'vertical'
              ? screen.getByTestId('body-scroller').getBoundingClientRect().right
              : ownerBounds.right;
          expect(rowPin.getBoundingClientRect().right).to.be.closeTo(right, 1);
        });
      }
    }
  }

  for (const layout of layouts) {
    it(`${layout}: retains the bottom band when the data interval is offscreen`, async () => {
      const apiRef = React.createRef<Virtualizer>();
      render(<Example apiRef={apiRef} layout={layout} rowCount={5} after={1000} />);
      await waitFor(() => expect(rowIds()).to.include(0));
      act(() => {
        apiRef.current!.api.scrollToPosition({ top: 280 });
      });
      await waitFor(() => expect(rowIds()).to.have.length(0));
      const grid = screen.getByTestId('grid').getBoundingClientRect();
      expect(screen.getByTestId('footer').getBoundingClientRect().bottom).to.be.closeTo(
        grid.bottom,
        1,
      );
    });
  }

  it('measures automatic row heights without rendering the whole dataset', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(<Example apiRef={apiRef} autoRowHeight variableHeight />);
    await waitFor(() => expect(apiRef.current!.api.rowsMeta.getRowHeight(0)).to.equal(72));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2000 });
    });
    await waitFor(() => expect(rowIds()[0]).to.be.greaterThan(0));
    expect(rowIds().length).to.be.lessThan(100);
  });

  it('keeps the focused row mounted when the grid moves outside the viewport', async () => {
    render(<Example before={800} focusedCell={() => ({ rowIndex: 10, columnIndex: 1, id: 10 })} />);
    await waitFor(() => expect(rowIds()).to.deep.equal([10]));
  });

  it('handles empty and short content, including the end of sticky travel', async () => {
    const { setProps } = render(<Example rowCount={0} />);
    await waitFor(() => expect(rowIds()).to.have.length(0));
    setProps({ rowCount: 3, before: 0 });
    await waitFor(() => expect(rowIds()).to.deep.equal([0, 1, 2]));
    act(() => {
      screen.getByTestId('owner').scrollTop = 400;
    });
    await waitFor(() => expect(rowIds()).to.have.length(0));
    expect(screen.getByTestId('header').getBoundingClientRect().bottom).to.be.at.most(
      screen.getByTestId('grid').getBoundingClientRect().bottom + 1,
    );
  });

  it('resolves a replacement owner and detaches the previous owner', async () => {
    const apiRef = React.createRef<Virtualizer>();
    let target: HTMLElement | null = null;
    const callback = vi.fn();
    render(
      <div data-testid="outer" style={{ height: 300, width: 650, overflow: 'auto' }}>
        <Example apiRef={apiRef} scrollContainer={() => target} onScrollChange={callback} />
      </div>,
    );
    const inner = screen.getByTestId('owner');
    const outer = screen.getByTestId('outer');
    act(() => {
      target = inner;
      apiRef.current!.api.refreshScrollContainer();
    });
    await waitFor(() => expect(rowIds()).to.include(0));
    act(() => {
      inner.style.overflow = 'visible';
      inner.style.height = 'auto';
      target = outer;
      apiRef.current!.api.refreshScrollContainer();
      apiRef.current!.api.scrollToPosition({ top: 2000 });
    });
    await waitFor(() => expect(rowIds()).to.include(50));
    callback.mockClear();
    act(() => {
      screen.getByTestId('owner').dispatchEvent(new Event('scroll'));
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it('switches between shared and grid-owned horizontal scrolling without remounting', async () => {
    const apiRef = React.createRef<Virtualizer>();
    const { setProps } = render(<Example apiRef={apiRef} axes="both" />);
    await waitFor(() => expect(rowIds()).to.include(0));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2000, left: 1200 });
    });
    await waitFor(() => expect(rowIds()).to.include(50));
    setProps({ axes: 'vertical' });
    await waitFor(() => expect(apiRef.current!.store.state.dimensions.hasScrollX).to.equal(true));
    act(() => {
      apiRef.current!.api.scrollToPosition({ left: 600 });
    });
    expect(screen.getByTestId('body-scroller').scrollLeft).to.equal(600);
    expect(screen.getByTestId('header-scroller').scrollLeft).to.equal(600);
    setProps({ axes: 'both' });
    await waitFor(() => expect(apiRef.current!.store.state.dimensions.hasScrollX).to.equal(false));
    act(() => {
      apiRef.current!.api.scrollToPosition({ left: 1200 });
    });
    expect(screen.getByTestId('owner').scrollLeft).to.equal(1200);
    expect(apiRef.current!.api.getScrollPosition().top).to.equal(2000);
  });

  it('switches between external and self scrolling without remounting', async () => {
    const apiRef = React.createRef<Virtualizer>();
    const { setProps } = render(<Example apiRef={apiRef} />);
    await waitFor(() => expect(rowIds()).to.include(0));
    setProps({ scrollContainer: 'self' });
    await waitFor(() => expect(apiRef.current!.store.state.dimensions.hasScrollY).to.equal(true));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2000 });
    });
    await waitFor(() => expect(rowIds()).to.include(50));
    expect((screen.getByTestId('grid').firstElementChild as HTMLElement).scrollTop).to.equal(2000);
    setProps({ scrollContainer: undefined });
    await waitFor(() => expect(apiRef.current!.store.state.dimensions.hasScrollY).to.equal(false));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 4000 });
    });
    await waitFor(() => expect(rowIds()).to.include(100));
    expect(apiRef.current!.api.getScrollPosition().top).to.equal(4000);
  });

  it('reserves a horizontal scrollbar when columns only overflow the grid borders', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(<Example apiRef={apiRef} columnCount={5} scrollbarSize={16} />);
    await waitFor(() => expect(rowIds()).to.include(0));
    const grid = screen.getByTestId('grid');
    act(() => {
      grid.style.boxSizing = 'border-box';
      grid.style.border = '2px solid black';
      apiRef.current!.api.refreshScrollContainer();
    });
    await waitFor(() => expect(apiRef.current!.store.state.dimensions.hasScrollX).to.equal(true));
    await waitFor(() =>
      expect(screen.getByTestId('horizontal-scrollbar').getBoundingClientRect().height).to.equal(
        16,
      ),
    );
  });

  it('does not reset a pre-scrolled owner when another virtualizer mounts', async () => {
    const apiRef = React.createRef<Virtualizer>();
    function Shared({ second = false }) {
      const ref = React.useRef<HTMLDivElement>(null);
      return (
        <div ref={ref} data-testid="shared" style={{ width: 600, height: 400, overflow: 'auto' }}>
          <ScrollContainerGrid apiRef={apiRef} scrollContainer={() => ref.current} axes="both" />
          {second && <ScrollContainerGrid scrollContainer={() => ref.current} axes="both" />}
        </div>
      );
    }
    const { setProps } = render(<Shared />);
    await waitFor(() => expect(rowIds()).to.include(0));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2000, left: 500 });
    });
    const owner = screen.getByTestId('shared');
    const before = { top: owner.scrollTop, left: owner.scrollLeft };
    setProps({ second: true });
    expect({ top: owner.scrollTop, left: owner.scrollLeft }).to.deep.equal(before);
    expect(rowIds().length).to.be.lessThan(100);
  });

  it('updates the visible range and page size when its owner resizes', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(<Example apiRef={apiRef} />);
    await waitFor(() => expect(rowIds()).to.include(0));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2000 });
    });
    const pageSize = apiRef.current!.api.getViewportPageSize();
    const lastRow = rowIds().at(-1)!;
    screen.getByTestId('owner').style.height = '600px';
    await waitFor(() =>
      expect(apiRef.current!.api.getViewportPageSize()).to.be.greaterThan(pageSize),
    );
    expect(rowIds().at(-1)).to.be.greaterThan(lastRow);
  });

  it('refreshes a position-only change even after the scroll position was read', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(<Example apiRef={apiRef} />);
    await waitFor(() => expect(rowIds()).to.include(0));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2000 });
    });
    screen.getByTestId('grid').style.marginTop = '400px';
    expect(apiRef.current!.api.getScrollPosition().top).to.be.closeTo(1600, 1);
    act(() => {
      apiRef.current!.api.refreshScrollContainer();
    });
    await waitFor(() => expect(rowIds()).to.include(40));
    expect(document.querySelector('[data-row="40"]')!.getBoundingClientRect().top).to.be.closeTo(
      screen.getByTestId('header').getBoundingClientRect().bottom,
      1,
    );
  });

  it('synchronizes horizontal input from the header, footer, body and scrollbar', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(<Example apiRef={apiRef} />);
    await waitFor(() => expect(rowIds()).to.include(0));
    const ids = ['header-scroller', 'footer-scroller', 'body-scroller', 'horizontal-scrollbar'];
    for (let i = 0; i < ids.length; i += 1) {
      act(() => {
        screen.getByTestId(ids[i]).scrollLeft = 300 * (i + 1);
      });
      // Each input must finish synchronizing before the next band is scrolled.
      // eslint-disable-next-line no-await-in-loop
      await waitFor(() => {
        ids.forEach((id) => expect(screen.getByTestId(id).scrollLeft).to.equal(300 * (i + 1)));
      });
    }
  });

  it('accounts for owner and grid borders and horizontal viewport insets', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(
      <Example apiRef={apiRef} axes="both" insets={{ top: 10, right: 20, bottom: 30, left: 40 }} />,
    );
    await waitFor(() => expect(rowIds()).to.include(0));
    const owner = screen.getByTestId('owner');
    const grid = screen.getByTestId('grid');
    act(() => {
      owner.style.border = '7px solid black';
      grid.style.border = '3px solid black';
      apiRef.current!.api.refreshScrollContainer();
      apiRef.current!.api.scrollToPosition({ top: 2000, left: 1200 });
    });
    await waitFor(() => expect(rowIds()).to.include(50));
    const ownerRect = owner.getBoundingClientRect();
    expect(screen.getByTestId('header').getBoundingClientRect().top).to.be.closeTo(
      ownerRect.top + owner.clientTop + 10,
      1,
    );
    const row = grid.querySelector<HTMLElement>('[data-row="50"]')!;
    expect(row.querySelector('[data-pinned="start"]')!.getBoundingClientRect().left).to.be.closeTo(
      ownerRect.left + owner.clientLeft + 40,
      1,
    );
    expect(row.querySelector('[data-pinned="end"]')!.getBoundingClientRect().right).to.be.closeTo(
      ownerRect.left + owner.clientLeft + owner.clientWidth - 20,
      1,
    );
    expect(apiRef.current!.api.getScrollPosition()).to.deep.equal({ top: 2000, left: 1200 });
  });

  for (const axes of ['vertical', 'both'] as const) {
    it(`controlled ${axes}: clips the viewport at both grid boundaries`, async () => {
      const apiRef = React.createRef<Virtualizer>();
      render(
        <Example
          apiRef={apiRef}
          layout="controlled-grid"
          axes={axes}
          rowCount={30}
          before={200}
          after={1000}
          insets={{ top: 24, bottom: 20 }}
        />,
      );
      await waitFor(() => expect(rowIds()).to.include(0));
      const grid = screen.getByTestId('grid');
      const owner = screen.getByTestId('owner');
      const view = screen.getByTestId('render-window');
      const header = screen.getByTestId('header');
      const footer = screen.getByTestId('footer');
      const check = () => {
        const bounds = grid.getBoundingClientRect();
        expect(view.getBoundingClientRect().top).to.be.at.least(bounds.top - 1);
        expect(view.getBoundingClientRect().bottom).to.be.at.most(bounds.bottom + 1);
        expect(header.getBoundingClientRect().top).to.be.closeTo(
          Math.max(bounds.top, owner.getBoundingClientRect().top + 24),
          1,
        );
        expect(footer.getBoundingClientRect().bottom).to.be.closeTo(
          Math.min(bounds.bottom, owner.getBoundingClientRect().bottom - 20),
          1,
        );
      };
      check();
      act(() => {
        apiRef.current!.api.scrollToPosition({ top: 1100 });
      });
      await waitFor(() => expect(rowIds()).to.include(29));
      check();
      const last = grid.querySelector('[data-row="29"]')!;
      expect(last.getBoundingClientRect().bottom).to.be.closeTo(
        footer.getBoundingClientRect().top,
        1,
      );
    });
  }

  it('updates a controlled viewport for position changes within the same row', async () => {
    const apiRef = React.createRef<Virtualizer>();
    render(<Example apiRef={apiRef} layout="controlled-grid" />);
    await waitFor(() => expect(rowIds()).to.include(0));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2010 });
    });
    await waitFor(() => expect(rowIds()).to.include(50));
    const positioner = screen.getByTestId('render-window');
    const previousTop = parseFloat(positioner.style.top);
    const range = apiRef.current!.store.state.virtualization.renderContext;
    act(() => {
      screen.getByTestId('grid').style.marginTop = '1px';
      apiRef.current!.api.refreshScrollContainer();
    });
    expect(apiRef.current!.store.state.virtualization.renderContext).to.deep.equal(range);
    expect(parseFloat(positioner.style.top)).to.equal(previousTop - 1);
  });

  it('uses the grid document window when rendered in an iframe', async () => {
    const apiRef = React.createRef<Virtualizer>();
    function Embedded() {
      const [body, setBody] = React.useState<HTMLElement | null>(null);
      return (
        <React.Fragment>
          <iframe
            title="Embedded grid"
            srcDoc="<!DOCTYPE html><html><body></body></html>"
            style={{ width: 600, height: 400 }}
            onLoad={(event) => setBody(event.currentTarget.contentDocument!.body)}
          />
          {body &&
            ReactDOM.createPortal(
              <ScrollContainerGrid apiRef={apiRef} scrollContainer="window" />,
              body,
            )}
        </React.Fragment>
      );
    }
    render(<Embedded />);
    await waitFor(() => expect(apiRef.current?.store.state.scrolling.ready).to.equal(true));
    const view = screen.getByTitle<HTMLIFrameElement>('Embedded grid').contentWindow!;
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2000 });
    });
    await waitFor(() => expect(view.scrollY).to.be.greaterThan(0));
    expect(window.scrollY).to.equal(0);
    expect(apiRef.current!.api.getScrollPosition().top).to.equal(2000);
  });

  it('resets an external axis only when a subsequent reset is requested', async () => {
    const apiRef = React.createRef<Virtualizer>();
    const { setProps } = render(<Example apiRef={apiRef} axes="both" scrollReset={0} />);
    await waitFor(() => expect(rowIds()).to.include(0));
    act(() => {
      apiRef.current!.api.scrollToPosition({ top: 2000, left: 1200 });
    });
    setProps({ scrollReset: 1 });
    expect(apiRef.current!.api.getScrollPosition()).to.deep.equal({ top: 2000, left: 0 });
  });
});
