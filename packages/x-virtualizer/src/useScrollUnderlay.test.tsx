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
const PERIOD_ITEM_COUNT = 4;
const PERIOD = PERIOD_ITEM_COUNT * ITEM_HEIGHT;
const UNDERLAY_ITEM_COUNT = Math.ceil(VIEWPORT_HEIGHT / ITEM_HEIGHT) + PERIOD_ITEM_COUNT + 1;

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

function layer() {
  return screen.getByTestId('underlay').firstElementChild as HTMLElement;
}

function translation(element: Element) {
  const matrix = new DOMMatrix(getComputedStyle(element).transform);
  return { x: matrix.m41, y: matrix.m42 };
}

// Two frames: the scroll-driven animations start, or pick up a new scroll position, in the next one.
function waitForFrames() {
  return act(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}

async function renderAndWaitForBuild(
  getUnderlayContent: ListProps['getUnderlayContent'] & { mock: { calls: unknown[] } },
  render: ReturnType<typeof createRenderer>['render'],
  props?: Partial<ListProps>,
) {
  render(<List getUnderlayContent={getUnderlayContent} {...props} />);
  await waitFor(() => {
    expect(getUnderlayContent.mock.calls.length).to.be.greaterThan(0);
  });
  await waitForFrames();
}

async function stopAt(
  scrollTop: number,
  getUnderlayContent: { mock: { calls: unknown[] } },
  scroller = screen.getByTestId('scroller'),
) {
  const builds = getUnderlayContent.mock.calls.length;
  act(() => {
    scroller.scrollTop = scrollTop;
    scroller.dispatchEvent(new Event('scroll'));
  });
  await waitFor(() => {
    expect(getUnderlayContent.mock.calls.length).to.be.greaterThan(builds);
  });
  await waitForFrames();
}

// The underlay has to cover the area and line up with the items, whatever came before.
function expectToCoverTheItems(scrollTop: number) {
  const area = screen.getByTestId('underlay').getBoundingClientRect();
  const box = layer().getBoundingClientRect();
  expect(box.top).to.be.lessThan(area.top + 0.5);
  expect(box.bottom).to.be.greaterThan(area.bottom - 0.5);
  const fromItems = (box.top - area.top + scrollTop) % ITEM_HEIGHT;
  expect(Math.min(Math.abs(fromItems), ITEM_HEIGHT - Math.abs(fromItems))).to.be.lessThan(0.5);
}

describe.skipIf(isJSDOM)('useScrollUnderlay', () => {
  const { render } = createRenderer();

  it('fills the area with the content, out of reach of assistive technology', async () => {
    const getUnderlayContent =
      vi.fn<(params: UnderlayParams) => UnderlayContent>(createUnderlayContent);
    await renderAndWaitForBuild(getUnderlayContent, render);

    expect(getUnderlayContent.mock.lastCall![0]).to.deep.equal({
      itemCount: UNDERLAY_ITEM_COUNT,
      itemHeight: ITEM_HEIGHT,
    });
    const underlay = screen.getByTestId('underlay');
    expect(underlay.inert).to.equal(true);
    expect(underlay.getAttribute('aria-hidden')).to.equal('true');

    // The content goes in a box that moves sideways with the scroll, the pinned nodes beside it.
    const { results } = getUnderlayContent.mock;
    const [content] = results[results.length - 1].value.content;
    const [pinned] = results[results.length - 1].value.pinned!;
    expect(layer().firstElementChild!.firstElementChild).to.equal(content);
    expect(layer().lastElementChild).to.equal(pinned);
    expect(layer().style.height).to.equal(`${UNDERLAY_ITEM_COUNT * ITEM_HEIGHT}px`);
  });

  it('covers the items wherever the scroll goes, without the scroll stopping', async () => {
    const getUnderlayContent = vi.fn(createUnderlayContent);
    await renderAndWaitForBuild(getUnderlayContent, render);
    const scroller = screen.getByTestId('scroller');
    await stopAt(1010, getUnderlayContent);
    const builds = getUnderlayContent.mock.calls.length;
    expectToCoverTheItems(1010);

    // Past whole periods and back beyond where the scroll stopped.
    for (const scrollTop of [1015, 1160, 1170, 1490, 1100, 1000, 700, 30]) {
      scroller.scrollTop = scrollTop;
      // eslint-disable-next-line no-await-in-loop
      await waitForFrames();
      expectToCoverTheItems(scrollTop);
    }
    expect(getUnderlayContent.mock.calls.length).to.equal(builds);
  });

  it('moves with the items between jumps back', async () => {
    const getUnderlayContent = vi.fn(createUnderlayContent);
    await renderAndWaitForBuild(getUnderlayContent, render);
    const scroller = screen.getByTestId('scroller');
    await stopAt(1010, getUnderlayContent);

    // It rests halfway through a period.
    const rest = translation(layer()).y;
    expect(rest).to.be.closeTo(-PERIOD / 2, 0.5);

    scroller.scrollTop = 1010 + 50;
    await waitForFrames();
    expect(translation(layer()).y).to.be.closeTo(rest - 50, 0.5);

    scroller.scrollTop = 1010 - 50;
    await waitForFrames();
    expect(translation(layer()).y).to.be.closeTo(rest + 50, 0.5);
  });

  it('stays running at rest, so the compositor has it ready for a fling', async () => {
    const getUnderlayContent = vi.fn(createUnderlayContent);
    await renderAndWaitForBuild(getUnderlayContent, render);
    const scroller = screen.getByTestId('scroller');
    const scrollTopMax = scroller.scrollHeight - scroller.clientHeight;

    expect(layer().getAnimations()[0].playState).to.equal('running');
    await stopAt(scrollTopMax, getUnderlayContent);
    expect(layer().getAnimations()[0].playState).to.equal('running');
    expectToCoverTheItems(scrollTopMax);
    await stopAt(0, getUnderlayContent);
    expect(layer().getAnimations()[0].playState).to.equal('running');
    expectToCoverTheItems(0);
  });

  it('moves the content sideways with the scroll', async () => {
    const getUnderlayContent = vi.fn(createUnderlayContent);
    await renderAndWaitForBuild(getUnderlayContent, render);
    const scroller = screen.getByTestId('scroller');

    const [animation] = layer().getAnimations();
    expect((animation.timeline as ScrollTimeline).source).to.equal(scroller);
    expect((animation.timeline as ScrollTimeline).axis).to.equal('block');
    const [sideways] = layer().firstElementChild!.getAnimations();
    expect((sideways.timeline as ScrollTimeline).axis).to.equal('inline');

    scroller.scrollLeft = 50;
    await waitForFrames();
    expect(translation(layer().firstElementChild!).x).to.be.closeTo(-50, 0.5);
  });

  it('lines the content up with right-to-left items', async () => {
    const getUnderlayContent = vi.fn(createUnderlayContent);
    await renderAndWaitForBuild(getUnderlayContent, render, { isRtl: true });
    const scroller = screen.getByTestId('scroller');
    const scrollLeftMax = scroller.scrollWidth - scroller.clientWidth;

    // The content's left edge starts a whole scroll range left of the viewport.
    expect(translation(layer().firstElementChild!).x).to.be.closeTo(-scrollLeftMax, 0.5);
    scroller.scrollLeft = -50;
    await waitForFrames();
    expect(translation(layer().firstElementChild!).x).to.be.closeTo(-scrollLeftMax + 50, 0.5);
  });

  it('asks for no content when the items do not scroll', async () => {
    const getUnderlayContent = vi.fn(createUnderlayContent);
    render(<List itemCount={3} getUnderlayContent={getUnderlayContent} />);
    await act(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(resolve, 250);
        }),
    );
    expect(getUnderlayContent.mock.calls.length).to.equal(0);
    expect(layer().firstElementChild!.children.length).to.equal(0);
  });

  it('empties the underlay when getUnderlayContent returns null', async () => {
    let underlayContent: UnderlayContent | null = createUnderlayContent();
    const getUnderlayContent = vi.fn(() => underlayContent);
    const rebuildRef = React.createRef<(() => void) | null>();
    render(<List getUnderlayContent={getUnderlayContent} rebuildRef={rebuildRef} />);
    await waitFor(() => {
      expect(layer().firstElementChild!.children.length).to.equal(1);
    });

    underlayContent = null;
    act(() => {
      rebuildRef.current!();
    });
    await waitFor(() => {
      expect(layer().firstElementChild!.children.length).to.equal(0);
    });
    expect(layer().getAnimations().length).to.equal(0);
  });
});
