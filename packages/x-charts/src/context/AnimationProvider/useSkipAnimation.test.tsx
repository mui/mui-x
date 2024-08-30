import * as React from 'react';
import { expect } from 'chai';
import { ErrorBoundary, createRenderer, screen } from '@mui/internal-test-utils';
import { useSkipAnimation } from './useSkipAnimation';
import { AnimationProvider } from './AnimationProvider';

function UseSkipAnimation({ localSkipAnimation }: { localSkipAnimation?: boolean }) {
  const skipAnimation = useSkipAnimation(localSkipAnimation);
  return <div>value: {skipAnimation}</div>;
}

describe('useSkipAnimation', () => {
  const { render } = createRenderer();

  it('should throw an error when parent context not present', function test() {
    if (!/jsdom/.test(window.navigator.userAgent)) {
      // can't catch render errors in the browser for unknown reason
      // tried try-catch + error boundary + window onError preventDefault
      this.skip();
    }

    const errorRef = React.createRef<any>();

    expect(() =>
      render(
        <ErrorBoundary ref={errorRef}>
          <UseSkipAnimation />
        </ErrorBoundary>,
      ),
    ).toErrorDev([
      'MUI X: Could not find the animation ref context.',
      'It looks like you rendered your component outside of a ChartsContainer parent component.',
      'The above error occurred in the <UseSkipAnimation> component:',
    ]);

    expect((errorRef.current as any).errors).to.have.length(1);
    expect((errorRef.current as any).errors[0].toString()).to.include(
      'MUI X: Could not find the animation ref context.',
    );
  });

  it('should not throw an error when parent context is present', () => {
    render(
      <AnimationProvider skipAnimation>
        <UseSkipAnimation />
      </AnimationProvider>,
    );

    expect(screen.getByText('value: true')).toBeVisible();
  });

  it('should use preference when pref is true and skip is false', () => {
    window.matchMedia = () => ({ matches: true }) as any;
    render(
      <AnimationProvider skipAnimation={false}>
        <UseSkipAnimation />
      </AnimationProvider>,
    );

    expect(screen.getByText('value: false')).toBeVisible();
  });

  it('should use preference when pref is false and skip is false', () => {
    window.matchMedia = () => ({ matches: false }) as any;
    render(
      <AnimationProvider skipAnimation={false}>
        <UseSkipAnimation />
      </AnimationProvider>,
    );

    expect(screen.getByText('value: undefined')).toBeVisible();
  });

  it('should use preference when pref is true and local skip is false', () => {
    window.matchMedia = () => ({ matches: true }) as any;
    render(
      <AnimationProvider>
        <UseSkipAnimation localSkipAnimation={false} />
      </AnimationProvider>,
    );

    expect(screen.getByText('value: true')).toBeVisible();
  });

  it('should use local skip when it is true', () => {
    window.matchMedia = () => ({ matches: false }) as any;
    render(
      <AnimationProvider>
        <UseSkipAnimation localSkipAnimation />
      </AnimationProvider>,
    );

    expect(screen.getByText('value: true')).toBeVisible();
  });

  it('should use the global config if local is false', () => {
    window.matchMedia = () => ({ matches: false }) as any;
    render(
      <AnimationProvider skipAnimation>
        <UseSkipAnimation localSkipAnimation={false} />
      </AnimationProvider>,
    );

    expect(screen.getByText('value: true')).toBeVisible();
  });
});
