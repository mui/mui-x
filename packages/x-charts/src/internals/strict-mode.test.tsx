import { configure, createRenderer } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';

describe('Strict Mode', () => {
  const { render } = createRenderer({ strict: true, strictEffects: true });

  it('does not work when `configure` is not called, even if `createRenderer` was created with `strict: true` and `strictEffects: true`', async () => {
    let mounted = 0;
    let unmounted = 0;

    function TestComponent() {
      React.useEffect(() => {
        mounted += 1;

        return () => {
          unmounted += 1;
        };
      }, []);

      return <div />;
    }

    render(<TestComponent />, { strict: true, strictEffects: true });

    expect(mounted).to.equal(2);
    expect(unmounted).to.equal(1);
  });

  it('works when `configure({ reactStrictMode: true })` is called', async () => {
    configure({ reactStrictMode: true });

    let mounted = 0;
    let unmounted = 0;

    function TestComponent() {
      React.useEffect(() => {
        mounted += 1;

        return () => {
          unmounted += 1;
        };
      }, []);

      return <div />;
    }

    render(<TestComponent />, { strict: true, strictEffects: true });

    expect(mounted).to.equal(2);
    expect(unmounted).to.equal(1);
  });
});
