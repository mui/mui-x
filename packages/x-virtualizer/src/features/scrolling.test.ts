import { describe, expect, it } from 'vitest';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ScrollContainerGrid } from '../../docs/ScrollContainerGrid';
import { getVisibleScrollRange, intersectScrollViewport } from './scrolling';

describe('intersectScrollViewport', () => {
  const viewport = { top: 100, left: 50, bottom: 500, right: 650 };
  it('measures a partial intersection', () => {
    expect(
      intersectScrollViewport(viewport, { top: 200, left: 0, bottom: 1200, right: 1000 }),
    ).toEqual({ width: 600, height: 300 });
  });
  it('keeps offscreen content empty on either side of the viewport', () => {
    expect(
      intersectScrollViewport(viewport, { top: 600, left: 0, bottom: 1600, right: 1000 }).height,
    ).toBe(0);
    expect(
      intersectScrollViewport(viewport, { top: -500, left: 0, bottom: 0, right: 1000 }).height,
    ).toBe(0);
  });
});

describe('getVisibleScrollRange', () => {
  it('excludes pinned bands when they occupy the visible viewport', () => {
    expect(getVisibleScrollRange(200, 600, 200, 600, 1000, 80, 40)).toEqual({
      start: 280,
      size: 280,
    });
  });

  it('does not subtract a footer clipped by an outer scrollport', () => {
    expect(getVisibleScrollRange(-200, 200, -200, 100, 1000, 80, 40)).toEqual({
      start: 80,
      size: 20,
    });
  });

  it('excludes only the visible part of a clipped header', () => {
    expect(getVisibleScrollRange(200, 600, 260, 600, 1000, 80, 40)).toEqual({
      start: 280,
      size: 280,
    });
    expect(getVisibleScrollRange(200, 600, 300, 600, 1000, 80, 40)).toEqual({
      start: 300,
      size: 260,
    });
  });

  it('bounds sticky bands at both ends of short content', () => {
    expect(getVisibleScrollRange(-200, 200, -200, 200, 160, 40, 40)).toEqual({
      start: 40,
      size: 80,
    });
    expect(getVisibleScrollRange(200, 600, 200, 600, 160, 40, 40).size).toBe(0);
  });
});

describe('scroll container SSR', () => {
  it('reserves content height without resolving an external owner on the server', () => {
    expect(
      ReactDOMServer.renderToString(
        React.createElement(ScrollContainerGrid, {
          rowCount: 10,
          scrollContainer: () => {
            throw new Error('The scroll owner must only be resolved after mounting.');
          },
        }),
      ),
    ).toContain('height:440px');
  });

  it('renders window scrolling without reading a window during render', () => {
    expect(() =>
      ReactDOMServer.renderToString(
        React.createElement(ScrollContainerGrid, { rowCount: 10, scrollContainer: 'window' }),
      ),
    ).not.toThrow();
  });
});
