import * as React from 'react';
import { afterAll } from 'vitest';
import {
  ConformanceOptions,
  MuiRenderResult,
  RenderOptions,
  createDescribe,
  describeRef,
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

  filteredTests.forEach((testKey) => {
    const test = fullSuite[testKey];
    test(minimalElement, getOptions as any);
  });
}

export const describeConformance = createDescribe(
  'Charts single component API',
  describeConformanceFn,
);
