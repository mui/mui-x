import { describe, expect, it, vi } from 'vitest';
import {
  createNextNavigationRoutingAdapter,
  createNextRouterRoutingAdapter,
  createReactRouterRoutingAdapter,
} from './routingAdapters';

describe('createNextNavigationRoutingAdapter', () => {
  it('reads from useSearchParams using the default keys', () => {
    const adapter = createNextNavigationRoutingAdapter({
      router: { push: vi.fn(), replace: vi.fn() },
      pathname: '/studio',
      searchParams: new URLSearchParams('dataSource=customers&sheet=vip'),
    });
    expect(adapter.read()).toEqual({ activeDataSourceId: 'customers', activeSheetId: 'vip' });
  });

  it("calls router.push with the new URL for mode='push'", () => {
    const push = vi.fn();
    const replace = vi.fn();
    const adapter = createNextNavigationRoutingAdapter({
      router: { push, replace },
      pathname: '/studio',
      searchParams: new URLSearchParams('foo=bar'),
    });

    adapter.write({ activeDataSourceId: 'orders', activeSheetId: null }, 'push');

    expect(push).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/studio?foo=bar&dataSource=orders');
    expect(replace).not.toHaveBeenCalled();
  });

  it("calls router.replace for mode='replace'", () => {
    const push = vi.fn();
    const replace = vi.fn();
    const adapter = createNextNavigationRoutingAdapter({
      router: { push, replace },
      pathname: '/studio',
      searchParams: new URLSearchParams(''),
    });

    adapter.write({ activeDataSourceId: 'a', activeSheetId: 'v1' }, 'replace');

    expect(replace).toHaveBeenCalledWith('/studio?dataSource=a&sheet=v1');
    expect(push).not.toHaveBeenCalled();
  });

  it('drops keys for null values', () => {
    const push = vi.fn();
    const adapter = createNextNavigationRoutingAdapter({
      router: { push, replace: vi.fn() },
      pathname: '/studio',
      searchParams: new URLSearchParams('dataSource=old&sheet=stale&keep=me'),
    });

    adapter.write({ activeDataSourceId: null, activeSheetId: null }, 'push');

    expect(push).toHaveBeenCalledWith('/studio?keep=me');
  });

  it('honors custom param names', () => {
    const push = vi.fn();
    const adapter = createNextNavigationRoutingAdapter({
      router: { push, replace: vi.fn() },
      pathname: '/studio',
      searchParams: new URLSearchParams('ds=foo&v=bar'),
      dataSourceParam: 'ds',
      sheetParam: 'v',
    });
    expect(adapter.read()).toEqual({ activeDataSourceId: 'foo', activeSheetId: 'bar' });

    adapter.write({ activeDataSourceId: 'baz', activeSheetId: null }, 'push');
    expect(push).toHaveBeenCalledWith('/studio?ds=baz');
  });
});

describe('createNextRouterRoutingAdapter', () => {
  it('reads from router.query using the default keys', () => {
    const adapter = createNextRouterRoutingAdapter({
      router: {
        push: vi.fn(),
        replace: vi.fn(),
        pathname: '/studio',
        query: { dataSource: 'customers', sheet: 'vip' },
      },
    });
    expect(adapter.read()).toEqual({ activeDataSourceId: 'customers', activeSheetId: 'vip' });
  });

  it('handles repeated query params (string[]) by taking the first value', () => {
    const adapter = createNextRouterRoutingAdapter({
      router: {
        push: vi.fn(),
        replace: vi.fn(),
        pathname: '/studio',
        query: { dataSource: ['a', 'b'] },
      },
    });
    expect(adapter.read()).toEqual({ activeDataSourceId: 'a', activeSheetId: null });
  });

  it("calls router.push for mode='push' and preserves unrelated query params", () => {
    const push = vi.fn();
    const adapter = createNextRouterRoutingAdapter({
      router: {
        push,
        replace: vi.fn(),
        pathname: '/studio',
        query: { dataSource: 'old', sheet: 'gone', keep: 'me' },
      },
    });

    adapter.write({ activeDataSourceId: 'new', activeSheetId: null }, 'push');

    expect(push).toHaveBeenCalledTimes(1);
    const writtenUrl = push.mock.calls[0][0] as string;
    expect(writtenUrl.startsWith('/studio?')).toBe(true);
    const search = new URLSearchParams(writtenUrl.slice('/studio?'.length));
    expect(search.get('keep')).toBe('me');
    expect(search.get('dataSource')).toBe('new');
    expect(search.has('sheet')).toBe(false);
  });

  it("calls router.replace for mode='replace'", () => {
    const push = vi.fn();
    const replace = vi.fn();
    const adapter = createNextRouterRoutingAdapter({
      router: { push, replace, pathname: '/studio', query: {} },
    });

    adapter.write({ activeDataSourceId: 'a', activeSheetId: null }, 'replace');
    expect(replace).toHaveBeenCalledWith('/studio?dataSource=a');
    expect(push).not.toHaveBeenCalled();
  });

  it('honors custom param names', () => {
    const push = vi.fn();
    const adapter = createNextRouterRoutingAdapter({
      router: { push, replace: vi.fn(), pathname: '/studio', query: { ds: 'x', v: 'y' } },
      dataSourceParam: 'ds',
      sheetParam: 'v',
    });
    expect(adapter.read()).toEqual({ activeDataSourceId: 'x', activeSheetId: 'y' });
  });
});

describe('createReactRouterRoutingAdapter', () => {
  it('reads from useSearchParams', () => {
    const adapter = createReactRouterRoutingAdapter({
      navigate: vi.fn(),
      location: { pathname: '/studio', search: '?dataSource=a&sheet=v1', hash: '' },
      searchParams: new URLSearchParams('dataSource=a&sheet=v1'),
    });
    expect(adapter.read()).toEqual({ activeDataSourceId: 'a', activeSheetId: 'v1' });
  });

  it("calls navigate with replace=false for mode='push'", () => {
    const navigate = vi.fn();
    const adapter = createReactRouterRoutingAdapter({
      navigate,
      location: { pathname: '/studio', search: '?keep=me', hash: '#section' },
      searchParams: new URLSearchParams('keep=me'),
    });

    adapter.write({ activeDataSourceId: 'orders', activeSheetId: null }, 'push');

    expect(navigate).toHaveBeenCalledWith('/studio?keep=me&dataSource=orders#section', {
      replace: false,
    });
  });

  it("calls navigate with replace=true for mode='replace'", () => {
    const navigate = vi.fn();
    const adapter = createReactRouterRoutingAdapter({
      navigate,
      location: { pathname: '/studio', search: '', hash: '' },
      searchParams: new URLSearchParams(''),
    });

    adapter.write({ activeDataSourceId: 'a', activeSheetId: null }, 'replace');
    expect(navigate).toHaveBeenCalledWith('/studio?dataSource=a', { replace: true });
  });

  it('honors custom param names', () => {
    const navigate = vi.fn();
    const adapter = createReactRouterRoutingAdapter({
      navigate,
      location: { pathname: '/s', search: '?ds=alpha&v=beta', hash: '' },
      searchParams: new URLSearchParams('ds=alpha&v=beta'),
      dataSourceParam: 'ds',
      sheetParam: 'v',
    });
    expect(adapter.read()).toEqual({ activeDataSourceId: 'alpha', activeSheetId: 'beta' });
    adapter.write({ activeDataSourceId: 'gamma', activeSheetId: null }, 'push');
    expect(navigate).toHaveBeenCalledWith('/s?ds=gamma', { replace: false });
  });
});

describe('subscribe (shared across framework adapters)', () => {
  it("notifies on browser 'popstate' for each adapter", () => {
    const adapters = [
      createNextNavigationRoutingAdapter({
        router: { push: vi.fn(), replace: vi.fn() },
        pathname: '/',
        searchParams: new URLSearchParams(''),
      }),
      createNextRouterRoutingAdapter({
        router: { push: vi.fn(), replace: vi.fn(), pathname: '/', query: {} },
      }),
      createReactRouterRoutingAdapter({
        navigate: vi.fn(),
        location: { pathname: '/', search: '', hash: '' },
        searchParams: new URLSearchParams(''),
      }),
    ];

    for (const adapter of adapters) {
      const listener = vi.fn();
      const unsubscribe = adapter.subscribe(listener);
      window.dispatchEvent(new Event('popstate'));
      expect(listener).toHaveBeenCalledTimes(1);
      unsubscribe();
      window.dispatchEvent(new Event('popstate'));
      expect(listener).toHaveBeenCalledTimes(1);
    }
  });
});
