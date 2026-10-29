import * as React from 'react';
import { act, createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import type { UnderlayContent, UnderlayParams } from '@mui/x-virtualizer';
import { useScrollUnderlay } from '@mui/x-virtualizer';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect, vi } from 'vitest';

const ITEM_HEIGHT = 40;
const ITEM_WIDTH = 400;
const VIEWPORT_HEIGHT = 300;
const VIEWPORT_WIDTH = 200;
const ITEM_COUNT = 100;
// Mirrors `useScrollUnderlay.ts`.
const BAND_ITEM_COUNT = 7;
const PERIOD = BAND_ITEM_COUNT * ITEM_HEIGHT;

type ListProps = {
  itemCount?: number;
  isRtl?: boolean;
  getUnderlayContent: (params: UnderlayParams) => UnderlayContent | null;
  rebuildRef?: React.RefObject<(() => void) | null>;
};

function List(props: ListProps) {
  const { itemCount = ITEM_COUNT, isRtl = false, getUnderlayContent, rebuildRef } = props;
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const underlayRef = React.useRef<HTMLDivElement>(null);
  const { rebuild } = useScrollUnderlay({
    scrollerRef,
    underlayRef,
    itemHeight: ITEM_HEIGHT,
    itemCount,
    isRtl,
    getUnderlayContent,
  });

  React.useEffect(() => {
    if (rebuildRef) {
      rebuildRef.current = rebuild;
    }
  }, [rebuildRef, rebuild]);

  const items = [];
  for (let index = 0; index < itemCount; index += 1) {
    items.push(
      <div key={index} style={{ width: ITEM_WIDTH, height: ITEM_HEIGHT, background: '#fff' }}>
        {index}
      </div>,
    );
  }

  return (
    <div
      dir={isRtl ? 'rtl' : undefined}
      style={{ position: 'relative', width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT }}
    >
      <div
        ref={underlayRef}
        data-testid="underlay"
        style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
      />
      <div
        ref={scrollerRef}
        data-testid="scroller"
        style={{ height: '100%', overflow: 'auto', scrollbarWidth: 'none' }}
      >
        {items}
      </div>
    </div>
  );
}

function createUnderlayContent(): UnderlayContent {
  const content = document.createElement('div');
  content.dataset.part = 'content';
  const pinned = document.createElement('div');
  pinned.dataset.part = 'pinned';
  return { content: [content], pinned: [pinned] };
}

function bands() {
  const [top, bottom] = Array.from(screen.getByTestId('underlay').children) as HTMLElement[];
  return { top, bottom };
}

function translation(element: Element) {
  const matrix = new DOMMatrix(getComputedStyle(element).transform);
  return { x: matrix.m41, y: matrix.m42 };
}

// Two frames: the scroll-driven animations pick up a new scroll position in the next one.
function waitForFrames() {
  return act(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}

describe.skipIf(isJSDOM)('useScrollUnderlay', () => {
  const { render } = createRenderer();

  it('keeps the underlay content in a band just past each edge of the items', async () => {
    const getUnderlayContent =
      vi.fn<(params: UnderlayParams) => UnderlayContent>(createUnderlayContent);
    render(<List getUnderlayContent={getUnderlayContent} />);
    await waitFor(() => {
      expect(getUnderlayContent.mock.calls.length).to.be.greaterThan(0);
    });
    expect(getUnderlayContent.mock.lastCall![0]).to.deep.equal({
      itemCount: BAND_ITEM_COUNT,
      itemHeight: ITEM_HEIGHT,
    });
    const underlay = screen.getByTestId('underlay');
    expect(underlay.inert).to.equal(true);
    expect(underlay.getAttribute('aria-hidden')).to.equal('true');

    // The band past the bottom edge holds the nodes, the band past the top edge copies of
    // them: the content in a box that moves sideways with the scroll, the pinned nodes beside it.
    const { results } = getUnderlayContent.mock;
    const [content] = results[results.length - 1].value.content;
    const { top, bottom } = bands();
    expect(bottom.firstElementChild!.firstElementChild).to.equal(content);
    [top, bottom].forEach((band) => {
      const [scrolling, pinned] = Array.from(band.children) as HTMLElement[];
      expect((scrolling.firstElementChild as HTMLElement).dataset.part).to.equal('content');
      expect(pinned.dataset.part).to.equal('pinned');
    });

    expect(bottom.style.top).to.equal(
      `${Math.floor(VIEWPORT_HEIGHT / ITEM_HEIGHT) * ITEM_HEIGHT}px`,
    );
    expect(top.style.top).to.equal(`${-PERIOD}px`);
  });

  it('moves the bands with the scroll, and to the new edges once it stops', async () => {
    const getUnderlayContent = vi.fn(createUnderlayContent);
    render(<List getUnderlayContent={getUnderlayContent} />);
    await waitFor(() => {
      expect(getUnderlayContent.mock.calls.length).to.be.greaterThan(0);
    });
    const scroller = screen.getByTestId('scroller');

    // The scroller's timelines drive the animations.
    const [bottomAnimation] = bands().bottom.getAnimations();
    expect((bottomAnimation.timeline as ScrollTimeline).source).to.equal(scroller);
    expect((bottomAnimation.timeline as ScrollTimeline).axis).to.equal('block');
    const [sidewaysAnimation] = bands().bottom.firstElementChild!.getAnimations();
    expect((sidewaysAnimation.timeline as ScrollTimeline).axis).to.equal('inline');
    // Nothing is above the first item.
    expect(bands().top.getAnimations().length).to.equal(0);

    // Before the bands are rebuilt, the band past the bottom edge moves up with the items, and
    // the content in both bands moves sideways with the scroll.
    scroller.scrollTop = 2 * ITEM_HEIGHT + 5;
    scroller.scrollLeft = 50;
    await waitForFrames();
    expect(translation(bands().bottom).y).to.be.closeTo(-(2 * ITEM_HEIGHT + 5), 0.5);
    expect(translation(bands().top.firstElementChild!).x).to.be.closeTo(-50, 0.5);

    // Once the scroll stops, each band waits past its edge of the new position.
    const scrollTop = 10 * ITEM_HEIGHT + 20;
    act(() => {
      scroller.scrollTop = scrollTop;
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(bands().bottom.style.top).to.equal(
        `${Math.floor((scrollTop + VIEWPORT_HEIGHT) / ITEM_HEIGHT) * ITEM_HEIGHT - scrollTop}px`,
      );
    });
    expect(bands().top.style.top).to.equal(
      `${(Math.ceil(scrollTop / ITEM_HEIGHT) - BAND_ITEM_COUNT) * ITEM_HEIGHT - scrollTop}px`,
    );
    // One iteration per band height, to each end of the scroll range.
    const scrollTopMax = scroller.scrollHeight - scroller.clientHeight;
    const [bottomAfter] = bands().bottom.getAnimations();
    expect(bottomAfter.effect!.getTiming().iterations).to.be.closeTo(
      (scrollTopMax - scrollTop) / PERIOD,
      1e-9,
    );
    const [topAfter] = bands().top.getAnimations();
    const before = scrollTop / PERIOD;
    expect(topAfter.effect!.getTiming().iterations).to.be.closeTo(before, 1e-9);
    expect(topAfter.effect!.getTiming().iterationStart).to.be.closeTo(
      Math.ceil(before) - before,
      1e-9,
    );
  });

  it('moves the bands with the items within a band height of either end', async () => {
    const getUnderlayContent = vi.fn(createUnderlayContent);
    render(<List getUnderlayContent={getUnderlayContent} />);
    await waitFor(() => {
      expect(getUnderlayContent.mock.calls.length).to.be.greaterThan(0);
    });
    const scroller = screen.getByTestId('scroller');
    const scrollTopMax = scroller.scrollHeight - scroller.clientHeight;
    const restAt = async (scrollTop: number) => {
      const builds = getUnderlayContent.mock.calls.length;
      act(() => {
        scroller.scrollTop = scrollTop;
        scroller.dispatchEvent(new Event('scroll'));
      });
      await waitFor(() => {
        expect(getUnderlayContent.mock.calls.length).to.be.greaterThan(builds);
      });
    };

    await restAt(scrollTopMax - 90);
    scroller.scrollTop = scrollTopMax - 40;
    await waitForFrames();
    expect(translation(bands().bottom).y).to.be.closeTo(-50, 0.5);

    await restAt(110);
    scroller.scrollTop = 80;
    await waitForFrames();
    expect(translation(bands().top).y).to.be.closeTo(30, 0.5);
  });

  it('lines the content up with right-to-left items', async () => {
    const getUnderlayContent = vi.fn(createUnderlayContent);
    render(<List isRtl getUnderlayContent={getUnderlayContent} />);
    await waitFor(() => {
      expect(getUnderlayContent.mock.calls.length).to.be.greaterThan(0);
    });
    const scroller = screen.getByTestId('scroller');
    const scrollLeftMax = scroller.scrollWidth - scroller.clientWidth;

    // The content's left edge starts a whole scroll range left of the viewport.
    expect(translation(bands().top.firstElementChild!).x).to.be.closeTo(-scrollLeftMax, 0.5);
    scroller.scrollLeft = -50;
    await waitForFrames();
    expect(translation(bands().top.firstElementChild!).x).to.be.closeTo(-scrollLeftMax + 50, 0.5);
  });

  it('hides the band past the bottom edge when the items end above it', async () => {
    const getUnderlayContent = vi.fn(createUnderlayContent);
    render(<List itemCount={3} getUnderlayContent={getUnderlayContent} />);
    await waitFor(() => {
      expect(getUnderlayContent.mock.calls.length).to.be.greaterThan(0);
    });
    expect(bands().bottom.hidden).to.equal(true);
  });

  it('empties the bands when getUnderlayContent returns null', async () => {
    let underlayContent: UnderlayContent | null = createUnderlayContent();
    const getUnderlayContent = vi.fn(() => underlayContent);
    const rebuildRef = React.createRef<(() => void) | null>();
    render(<List getUnderlayContent={getUnderlayContent} rebuildRef={rebuildRef} />);
    await waitFor(() => {
      expect(bands().bottom.firstElementChild!.children.length).to.equal(1);
    });

    underlayContent = null;
    act(() => {
      rebuildRef.current!();
    });
    await waitFor(() => {
      expect(bands().bottom.firstElementChild!.children.length).to.equal(0);
    });
    expect(bands().bottom.getAnimations().length).to.equal(0);
  });
});
