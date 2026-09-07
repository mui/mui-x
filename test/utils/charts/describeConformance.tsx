import * as React from 'react';
import { afterAll } from 'vitest';
import {
  ConformanceOptions,
  MuiRenderResult,
  RenderOptions,
  act,
  createDescribe,
  describeRef,
  flushMicrotasks,
  testPropsSpread,
  testRootClass,
} from '@mui/internal-test-utils';
import { testClassName } from './conformanceTests/className';

export type ConformantComponentProps = {
  render?: React.ReactElement<unknown> | ((props: Record<string, unknown>) => React.ReactNode);
  ref?: React.Ref<unknown>;
  'data-testid'?: string;
  className?: string | ((state: unknown) => string);
  style?: React.CSSProperties;
};

export interface ChartsSingleComponentConformanceTestsOptions extends Omit<
  Partial<ConformanceOptions>,
  'render' | 'mount' | 'skip' | 'classes'
> {
  render: (
    element: React.ReactElement<
      ConformantComponentProps,
      string | React.JSXElementConstructor<any>
    >,
    options?: RenderOptions | undefined,
  ) => Promise<MuiRenderResult> | MuiRenderResult;
  skip?: (keyof typeof fullSuite)[];
  testRenderPropWith?: keyof React.JSX.IntrinsicElements;
}

const fullSuite = {
  mergeClassName: testClassName,
  propsSpread: testPropsSpread,
  refForwarding: describeRef,
  rootClass: testRootClass,
};

function describeConformanceFn(
  minimalElement: React.ReactElement<any>,
  getOptions: () => ChartsSingleComponentConformanceTestsOptions,
) {
  const { after: runAfterHook = () => {}, only = Object.keys(fullSuite), skip = [] } = getOptions();

  const filteredTests = Object.keys(fullSuite).filter(
    (testKey) =>
      only.indexOf(testKey) !== -1 && skip.indexOf(testKey as keyof typeof fullSuite) === -1,
  ) as (keyof typeof fullSuite)[];

  afterAll(runAfterHook);

  // Series/axes processors may be asynchronous (they resolve in a microtask and
  // then write back to the store). Wrap the provided `render` so that, after
  // rendering, those microtasks are flushed inside `act`. This keeps the shared
  // conformance assertions deterministic and avoids "not wrapped in act"
  // warnings. For synchronous-processor charts this is a no-op.
  const wrappedGetOptions = () => {
    const options = getOptions();
    const originalRender = options.render;
    return {
      ...options,
      render: async (
        element: React.ReactElement<ConformantComponentProps, any>,
        renderOptions?: RenderOptions,
      ) => {
        const result = await originalRender(element, renderOptions);
        await act(async () => {
          await flushMicrotasks();
        });
        return result;
      },
    };
  };

  filteredTests.forEach((testKey) => {
    const test = fullSuite[testKey];
    test(minimalElement, wrappedGetOptions as any);
  });
}

export const describeConformance = createDescribe(
  'Charts single component API',
  describeConformanceFn,
);
