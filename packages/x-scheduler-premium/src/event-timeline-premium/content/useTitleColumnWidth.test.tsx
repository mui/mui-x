import { act, renderHook } from '@mui/internal-test-utils';
import { TITLE_HEADER_KEY, useTitleColumnWidth } from './useTitleColumnWidth';

type Row = { id: string };

describe('useTitleColumnWidth', () => {
  it('should expose the max reported width across all known ids', () => {
    const { result } = renderHook(() =>
      useTitleColumnWidth<Row>({ minWidth: 50, rows: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] }),
    );

    act(() => {
      result.current.report('a', 120);
      result.current.report('b', 200);
      result.current.report('c', 80);
      result.current.report(TITLE_HEADER_KEY, 90);
    });

    expect(result.current.width).to.equal(200);
    expect(result.current.contentWidth).to.equal(200);
    expect(result.current.hasOverflow).to.equal(false);
  });

  it('should clamp width by maxWidth while keeping contentWidth uncapped and flipping hasOverflow', () => {
    const { result, rerender } = renderHook(
      (props: { maxWidth?: number }) =>
        useTitleColumnWidth<Row>({ minWidth: 50, maxWidth: props.maxWidth, rows: [{ id: 'a' }] }),
      { initialProps: { maxWidth: undefined } as { maxWidth?: number } },
    );

    act(() => {
      result.current.report('a', 300);
    });
    // No cap → no overflow yet.
    expect(result.current.width).to.equal(300);
    expect(result.current.contentWidth).to.equal(300);
    expect(result.current.hasOverflow).to.equal(false);

    rerender({ maxWidth: 150 });
    expect(result.current.width).to.equal(150);
    expect(result.current.contentWidth).to.equal(300);
    expect(result.current.hasOverflow).to.equal(true);

    // A maxWidth below minWidth must not push width below minWidth; the floor wins.
    rerender({ maxWidth: 20 });
    expect(result.current.width).to.equal(50);
    expect(result.current.contentWidth).to.equal(300);
    expect(result.current.hasOverflow).to.equal(true);
  });

  it('should fall back to minWidth when nothing has been reported', () => {
    const { result } = renderHook(() =>
      useTitleColumnWidth<Row>({ minWidth: 64, rows: [{ id: 'a' }] }),
    );

    expect(result.current.width).to.equal(64);
    expect(result.current.contentWidth).to.equal(64);
    expect(result.current.hasOverflow).to.equal(false);
  });

  it('should evict cached widths when a row id is no longer present and recompute the max', () => {
    const { result, rerender } = renderHook(
      (props: { rows: Row[] }) => useTitleColumnWidth<Row>({ minWidth: 50, rows: props.rows }),
      { initialProps: { rows: [{ id: 'a' }, { id: 'b' }] } },
    );

    act(() => {
      result.current.report('a', 100);
      result.current.report('b', 250);
    });
    expect(result.current.width).to.equal(250);

    // Drop the widest row → the cache for `b` must be evicted so the max drops to `a`'s 100.
    rerender({ rows: [{ id: 'a' }] });
    expect(result.current.width).to.equal(100);

    // The TITLE_HEADER_KEY entry must survive row changes (it isn't a resource id).
    act(() => {
      result.current.report(TITLE_HEADER_KEY, 175);
    });
    rerender({ rows: [{ id: 'a' }] });
    expect(result.current.width).to.equal(175);
  });
});
