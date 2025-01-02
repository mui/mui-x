import * as React from 'react';
import { expect } from 'chai';
import { ErrorBoundary, createRenderer, screen, reactMajor } from '@mui/internal-test-utils';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';
import { useSkipAnimation } from './useSkipAnimation';
import { AnimationProvider } from './AnimationProvider';

function UseSkipAnimation({ localSkipAnimation }: { localSkipAnimation?: boolean }) {
  const skipAnimation = useSkipAnimation(localSkipAnimation);
  return <div>{`value: ${skipAnimation}`}</div>;
}

const createMatchMedia = (matches: boolean) => () =>
  ({ matches, addEventListener: () => {}, removeEventListener: () => {} }) as any;

describe('useSkipAnimation', () => {
  const { render } = createRenderer();
  const oldMatchMedia = window.matchMedia;

  beforeEach(() => {
    // @ts-expect-error
    delete window?.matchMedia;
    window.matchMedia = createMatchMedia(false);
  });

  afterEach(() => {
    // @ts-expect-error
    delete window?.matchMedia;
    window.matchMedia = oldMatchMedia;
  });

  // can't catch render errors in the browser for unknown reason
  // tried try-catch + error boundary + window onError preventDefault
  testSkipIf(!isJSDOM)('should throw an error when parent context not present', function test() {
    const errorRef = React.createRef<any>();

    const errorMessage1 = 'MUI X: Could not find the animation ref context.';
    const errorMessage2 =
      'It looks like you rendered your component outside of a ChartsContainer parent component.';
    const errorMessage3 = 'The above error occurred in the <UseSkipAnimation> component:';
    const expextedError =
      reactMajor < 19
        ? [errorMessage1, errorMessage2, errorMessage3]
        : `${errorMessage1}\n${errorMessage2}`;

    expect(() =>
      render(
        <ErrorBoundary ref={errorRef}>
          <UseSkipAnimation />
        </ErrorBoundary>,
      ),
    ).toErrorDev(expextedError);

    expect((errorRef.current as any).errors).to.have.length(1);
    expect((errorRef.current as any).errors[0].toString()).to.include(
      'MUI X: Could not find the animation ref context.',
    );
  });

  it('should not throw an error when parent context is present', async () => {
    window.matchMedia = createMatchMedia(true);

    render(
      <AnimationProvider skipAnimation>
        <UseSkipAnimation />
      </AnimationProvider>,
    );

    const node = await screen.findByText('value: true');

    expect(node).toBeVisible();
  });

  it('should use preference when pref is true and skip is false', async () => {
    window.matchMedia = createMatchMedia(true);
    render(
      <AnimationProvider skipAnimation={false}>
        <UseSkipAnimation />
      </AnimationProvider>,
    );

    const node = await screen.findByText('value: true');

    expect(node).toBeVisible();
  });

  it('should use preference when pref is false and skip is false', () => {
    window.matchMedia = createMatchMedia(false);
    render(
      <AnimationProvider skipAnimation={false}>
        <UseSkipAnimation />
      </AnimationProvider>,
    );

    expect(screen.getByText('value: undefined')).toBeVisible();
  });

  it('should use preference when pref is true and local skip is false', async () => {
    window.matchMedia = createMatchMedia(true);
    render(
      <AnimationProvider>
        <UseSkipAnimation localSkipAnimation={false} />
      </AnimationProvider>,
    );

    const node = await screen.findByText('value: true');

    expect(node).toBeVisible();
  });

  it('should use local skip when it is true', async () => {
    window.matchMedia = createMatchMedia(false);
    render(
      <AnimationProvider>
        <UseSkipAnimation localSkipAnimation />
      </AnimationProvider>,
    );

    const node = await screen.findByText('value: true');

    expect(node).toBeVisible();
  });

  it('should use the global config if local is false', async () => {
    window.matchMedia = createMatchMedia(false);
    render(
      <AnimationProvider skipAnimation>
        <UseSkipAnimation localSkipAnimation={false} />
      </AnimationProvider>,
    );

    const node = await screen.findByText('value: true');

    expect(node).toBeVisible();
  });
});
