import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProgressIndicator, ProgressRoot, ProgressTrack } from './ProgressSlots';
import { ScrollRoot, ScrollScrollbar, ScrollThumb, ScrollViewport } from './ScrollAreaSlots';

const { render } = createRenderer();

// The ScrollArea wrappers use `props: any` internally, but their public type
// signature from React.forwardRef only exposes RefAttributes.  We cast them
// for testing so we can pass `ownerState` and verify it is stripped.
const AnyProgressRoot = ProgressRoot as React.ComponentType<any>;
const AnyProgressTrack = ProgressTrack as React.ComponentType<any>;
const AnyProgressIndicator = ProgressIndicator as React.ComponentType<any>;
const AnyScrollRoot = ScrollRoot as React.ComponentType<any>;
const AnyScrollViewport = ScrollViewport as React.ComponentType<any>;
const AnyScrollScrollbar = ScrollScrollbar as React.ComponentType<any>;
const AnyScrollThumb = ScrollThumb as React.ComponentType<any>;

function expectOwnerStateStripped(el: Element) {
  expect(el.hasAttribute('ownerState')).to.equal(false);
  expect(el.hasAttribute('ownerstate')).to.equal(false);
}

describe('ProgressSlots', () => {
  it('ProgressRoot strips ownerState and forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <AnyProgressRoot
        data-testid="progress-root"
        ownerState={{ foo: 'bar' }}
        ref={ref}
        value={50}
        aria-label="Loading"
      />,
    );

    const el = screen.getByTestId('progress-root');

    expect(el).not.to.equal(null);
    expectOwnerStateStripped(el);
    expect(ref.current).to.be.instanceOf(window.HTMLDivElement);
  });

  it('ProgressTrack strips ownerState', () => {
    render(
      <AnyProgressRoot value={50} aria-label="Loading">
        <AnyProgressTrack data-testid="progress-track" ownerState={{ foo: 'bar' }} />
      </AnyProgressRoot>,
    );

    const el = screen.getByTestId('progress-track');

    expect(el).not.to.equal(null);
    expectOwnerStateStripped(el);
  });

  it('ProgressIndicator strips ownerState', () => {
    render(
      <AnyProgressRoot value={50} aria-label="Loading">
        <AnyProgressTrack>
          <AnyProgressIndicator data-testid="progress-indicator" ownerState={{ foo: 'bar' }} />
        </AnyProgressTrack>
      </AnyProgressRoot>,
    );

    const el = screen.getByTestId('progress-indicator');

    expect(el).not.to.equal(null);
    expectOwnerStateStripped(el);
  });
});

describe('ScrollAreaSlots', () => {
  // Base UI's ScrollArea performs internal state updates on mount that trigger
  // React "not wrapped in act()" warnings in JSDOM.
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation((...args: any[]) => {
      if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) {
        return;
      }
      // eslint-disable-next-line no-console
      console.info(...args);
    });
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('ScrollRoot strips ownerState and forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <AnyScrollRoot data-testid="scroll-root" ownerState={{ foo: 'bar' }} ref={ref}>
        <AnyScrollViewport>
          <div>Content</div>
        </AnyScrollViewport>
      </AnyScrollRoot>,
    );

    const el = screen.getByTestId('scroll-root');

    expect(el).not.to.equal(null);
    expectOwnerStateStripped(el);
    expect(ref.current).to.be.instanceOf(window.HTMLDivElement);
  });

  it('ScrollViewport strips ownerState', () => {
    render(
      <AnyScrollRoot>
        <AnyScrollViewport data-testid="scroll-viewport" ownerState={{ foo: 'bar' }}>
          <div>Content</div>
        </AnyScrollViewport>
      </AnyScrollRoot>,
    );

    const el = screen.getByTestId('scroll-viewport');

    expect(el).not.to.equal(null);
    expectOwnerStateStripped(el);
  });

  it('ScrollScrollbar strips ownerState', () => {
    render(
      <AnyScrollRoot>
        <AnyScrollViewport>
          <div>Content</div>
        </AnyScrollViewport>
        <AnyScrollScrollbar
          data-testid="scroll-scrollbar"
          keepMounted
          ownerState={{ foo: 'bar' }}
        />
      </AnyScrollRoot>,
    );

    const el = screen.getByTestId('scroll-scrollbar');

    expect(el).not.to.equal(null);
    expectOwnerStateStripped(el);
  });

  it('ScrollThumb strips ownerState', () => {
    render(
      <AnyScrollRoot>
        <AnyScrollViewport>
          <div>Content</div>
        </AnyScrollViewport>
        <AnyScrollScrollbar keepMounted>
          <AnyScrollThumb data-testid="scroll-thumb" ownerState={{ foo: 'bar' }} />
        </AnyScrollScrollbar>
      </AnyScrollRoot>,
    );

    const el = screen.getByTestId('scroll-thumb');

    expect(el).not.to.equal(null);
    expectOwnerStateStripped(el);
  });
});
