import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { ChartProvider } from '../context/ChartProvider';
import { useSkipAnimation } from './useSkipAnimation';

function createWrapper({ skipAnimation }: { skipAnimation?: boolean } = {}) {
  return function Wrapper({ children }: React.PropsWithChildren) {
    return (
      <ChartProvider pluginParams={{ skipAnimation, width: 100, height: 100 }}>
        {children}
      </ChartProvider>
    );
  };
}

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

  it('should not throw an error when parent context is present', async () => {
    window.matchMedia = createMatchMedia(true);

    render(<UseSkipAnimation />, { wrapper: createWrapper({ skipAnimation: true }) });

    const node = await screen.findByText('value: true');

    expect(node).toBeVisible();
  });

  it('should use preference when pref is true and skip is false', async () => {
    window.matchMedia = createMatchMedia(true);
    render(<UseSkipAnimation />, { wrapper: createWrapper({ skipAnimation: false }) });

    const node = await screen.findByText('value: true');

    expect(node).toBeVisible();
  });

  it('should return false when pref and skip are false', () => {
    window.matchMedia = createMatchMedia(false);
    render(<UseSkipAnimation />, { wrapper: createWrapper({ skipAnimation: false }) });

    expect(screen.getByText('value: false')).toBeVisible();
  });

  it('should use preference when pref is true and local skip is false', async () => {
    window.matchMedia = createMatchMedia(true);
    render(<UseSkipAnimation localSkipAnimation={false} />, { wrapper: createWrapper() });

    const node = await screen.findByText('value: true');

    expect(node).toBeVisible();
  });

  it('should use local skip when it is true', async () => {
    window.matchMedia = createMatchMedia(false);
    render(<UseSkipAnimation localSkipAnimation />, { wrapper: createWrapper() });

    const node = await screen.findByText('value: true');

    expect(node).toBeVisible();
  });

  it('should use the global config if local is false', async () => {
    window.matchMedia = createMatchMedia(false);
    render(<UseSkipAnimation localSkipAnimation={false} />, {
      wrapper: createWrapper({ skipAnimation: true }),
    });

    const node = await screen.findByText('value: true');

    expect(node).toBeVisible();
  });
});
