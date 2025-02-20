/* eslint-env mocha */
import createEmotionCache from '@emotion/cache';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import {
  buildQueries,
  cleanup,
  queries,
  RenderResult,
  render as testingLibraryRender,
  reactMajor,
} from '@mui/internal-test-utils';
import { userEvent } from '@testing-library/user-event';

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

interface Interaction {
  id: number;
  name: string;
  timestamp: number;
}

const enableDispatchingProfiler = process.env.TEST_GATE === 'enable-dispatching-profiler';

const interactionStack: Interaction[] = [];

interface Profiler {
  id: string;
  onRender: import('react').ProfilerOnRenderCallback;
  report(): void;
}

class NoopProfiler implements Profiler {
  id = 'noop';

  // eslint-disable-next-line class-methods-use-this
  onRender() {}

  // eslint-disable-next-line class-methods-use-this
  report() {}
}

type RenderMark = [
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
  interactions: Interaction[],
];

class DispatchingProfiler implements Profiler {
  id: string;

  private renders: RenderMark[] = [];

  constructor(id: string) {
    this.id = id;
  }

  onRender: Profiler['onRender'] = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  ) => {
    // Do minimal work here to keep the render fast.
    // Though it's unclear whether work here affects the profiler results.
    // But even if it doesn't we'll keep the test feedback snappy.
    this.renders.push([
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactionStack.slice(),
    ]);
  };

  report() {
    const event = new window.CustomEvent('reactProfilerResults', {
      detail: {
        [this.id]: this.renders.map((entry) => {
          return {
            phase: entry[1],
            actualDuration: entry[2],
            baseDuration: entry[3],
            startTime: entry[4],
            commitTime: entry[5],
            interactions: entry[6],
          };
        }),
      },
    });
    window.dispatchEvent(event);
  }
}

const UsedProfiler = enableDispatchingProfiler ? DispatchingProfiler : NoopProfiler;

function queryAllDescriptionsOf(baseElement: HTMLElement, element: Element): HTMLElement[] {
  const ariaDescribedBy = element.getAttribute('aria-describedby');
  if (ariaDescribedBy === null) {
    return [];
  }
  return ariaDescribedBy
    .split(' ')
    .map((id) => {
      return document.getElementById(id);
    })
    .filter((maybeElement): maybeElement is HTMLElement => {
      return maybeElement !== null && baseElement.contains(maybeElement);
    });
}

const [
  queryDescriptionOf,
  getAllDescriptionsOf,
  getDescriptionOf,
  findAllDescriptionsOf,
  findDescriptionOf,
] = buildQueries<[Element]>(
  queryAllDescriptionsOf,
  function getMultipleError() {
    return `Found multiple descriptions.`;
  },
  function getMissingError() {
    return `Found no describing element.`;
  },
);

const customQueries = {
  queryDescriptionOf,
  queryAllDescriptionsOf,
  getDescriptionOf,
  getAllDescriptionsOf,
  findDescriptionOf,
  findAllDescriptionsOf,
};

interface RenderConfiguration {
  /**
   * https://testing-library.com/docs/react-testing-library/api#container
   */
  container?: HTMLElement;
  /**
   * if true does not cleanup before mount
   */
  disableUnmount?: boolean;
  /**
   * wrap in React.StrictMode?
   */
  strict?: boolean;
  /**
   * Set to `true` if the test fails due to [Strict Effects](https://github.com/reactwg/react-18/discussions/19).
   */
  strictEffects?: boolean;
  wrapper: React.JSXElementConstructor<{ children?: React.ReactNode }>;
}

interface ClientRenderConfiguration extends RenderConfiguration {
  /**
   * https://testing-library.com/docs/react-testing-library/api#hydrate
   */
  hydrate: boolean;
}

interface ServerRenderConfiguration extends RenderConfiguration {
  container: HTMLElement;
}

type RenderOptions = Partial<RenderConfiguration>;

interface MuiRenderResult extends RenderResult<typeof queries & typeof customQueries> {
  user: any;
  forceUpdate(): void;
  /**
   * convenience helper. Better than repeating all props.
   */
  setProps(props: object): void;
}

interface MuiRenderToStringResult {
  container: HTMLElement;
  hydrate(): MuiRenderResult;
}

interface DataAttributes {
  [key: `data-${string}`]: string;
}

function render(
  element: React.ReactElement<DataAttributes>,
  configuration: ClientRenderConfiguration,
): MuiRenderResult {
  const { container, hydrate, wrapper } = configuration;

  const testingLibraryRenderResult = testingLibraryRender(element, {
    container,
    hydrate,
    queries: { ...queries, ...customQueries },
    wrapper,
  });

  const result: MuiRenderResult = {
    ...testingLibraryRenderResult,
    user: userEvent.setup(),
    forceUpdate() {
      testingLibraryRenderResult.rerender(
        React.cloneElement(element, {
          'data-force-update': String(Math.random()),
        }),
      );
    },
    setProps(props) {
      testingLibraryRenderResult.rerender(React.cloneElement(element, props));
    },
  };

  return result;
}

function renderToString(
  element: React.ReactElement<DataAttributes>,
  configuration: ServerRenderConfiguration,
): { container: HTMLElement; hydrate(): MuiRenderResult } {
  const { container, wrapper: Wrapper } = configuration;

  container.innerHTML = ReactDOMServer.renderToString(<Wrapper>{element}</Wrapper>);

  return {
    container,
    hydrate() {
      return render(element, { ...configuration, hydrate: true });
    },
  };
}

const isVitest =
  // VITEST is present on the environment when not in browser mode.
  process.env.VITEST === 'true' ||
  // VITEST_BROWSER_DEBUG is present on vitest in browser mode.
  typeof process.env.VITEST_BROWSER_DEBUG !== 'undefined';

interface Renderer {
  render(element: React.ReactElement<DataAttributes>, options?: RenderOptions): MuiRenderResult;
  renderToString(
    element: React.ReactElement<DataAttributes>,
    options?: RenderOptions,
  ): MuiRenderToStringResult;
}

interface CreateRendererOptions extends Pick<RenderOptions, 'strict' | 'strictEffects'> {}

export function createRenderer(globalOptions: CreateRendererOptions = {}): Renderer {
  const { strict: globalStrict = true, strictEffects: globalStrictEffects = globalStrict } =
    globalOptions;
  // save stack to re-use in test-hooks
  const { stack: createClientRenderStack } = new Error();

  /**
   * Flag whether `createRenderer` was called in a suite i.e. describe() block.
   * For legacy reasons `createRenderer` might accidentally be called in a before(Each) hook.
   */
  let wasCalledInSuite = false;
  before(function beforeHook() {
    wasCalledInSuite = true;
  });

  let emotionCache: import('@emotion/cache').EmotionCache = null!;
  /**
   * target container for SSR
   */
  let serverContainer: HTMLElement;
  /**
   * Flag whether all setup for `configuredClientRender` was completed.
   * For legacy reasons `configuredClientRender` might accidentally be called in a before(Each) hook.
   */
  let prepared = false;
  let profiler: Profiler = null!;
  beforeEach(function beforeEachHook() {
    if (!wasCalledInSuite) {
      const error = new Error(
        'Unable to run `before` hook for `createRenderer`. This usually indicates that `createRenderer` was called in a `before` hook instead of in a `describe()` block.',
      );
      error.stack = createClientRenderStack;
      throw error;
    }

    let id: string | null = null;

    if (isVitest) {
      // @ts-expect-error
      id = expect.getState().currentTestName;
    } else {
      id = this.currentTest?.fullTitle() ?? null;
    }

    if (!id) {
      throw new Error(
        'Unable to find the currently running test. This is a bug with the client-renderer. Please report this issue to a maintainer.',
      );
    }

    profiler = new UsedProfiler(id);

    emotionCache = createEmotionCache({ key: 'emotion-client-render' });

    serverContainer = document.createElement('div');
    document.body.appendChild(serverContainer);

    prepared = true;
  });

  afterEach(() => {
    cleanup();
    profiler.report();
    profiler = null!;

    emotionCache.sheet.tags.forEach((styleTag) => {
      styleTag.remove();
    });
    emotionCache = null!;

    serverContainer.remove();
    serverContainer = null!;
  });

  function createWrapper(options: Partial<RenderConfiguration>) {
    const {
      strict = globalStrict,
      strictEffects = globalStrictEffects,
      wrapper: InnerWrapper = React.Fragment,
    } = options;

    const usesLegacyRoot = reactMajor < 18;
    const Mode = strict && (strictEffects || usesLegacyRoot) ? React.StrictMode : React.Fragment;
    return function Wrapper({ children }: { children?: React.ReactNode }) {
      return (
        <Mode>
          <EmotionCacheProvider value={emotionCache}>
            <React.Profiler id={profiler.id} onRender={profiler.onRender}>
              <InnerWrapper>{children}</InnerWrapper>
            </React.Profiler>
          </EmotionCacheProvider>
        </Mode>
      );
    };
  }

  return {
    render(element: React.ReactElement<DataAttributes>, options: RenderOptions = {}) {
      if (!prepared) {
        throw new Error(
          'Unable to finish setup before `render()` was called. ' +
            'This usually indicates that `render()` was called in a `before()` or `beforeEach` hook. ' +
            'Move the call into each `it()`. Otherwise you cannot run a specific test and we cannot isolate each test.',
        );
      }

      return render(element, {
        ...options,
        hydrate: false,
        wrapper: createWrapper(options),
      });
    },
    renderToString(element: React.ReactElement<DataAttributes>, options: RenderOptions = {}) {
      if (!prepared) {
        throw new Error(
          'Unable to finish setup before `render()` was called. ' +
            'This usually indicates that `render()` was called in a `before()` or `beforeEach` hook. ' +
            'Move the call into each `it()`. Otherwise you cannot run a specific test and we cannot isolate each test.',
        );
      }

      const { container = serverContainer, ...localOptions } = options;
      return renderToString(element, {
        ...localOptions,
        container,
        wrapper: createWrapper(options),
      });
    },
  };
}
