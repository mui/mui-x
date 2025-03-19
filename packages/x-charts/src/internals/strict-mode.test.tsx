import { configure, createRenderer } from '@mui/internal-test-utils';
import { expect } from 'chai';
import * as React from 'react';

const reactMajor = parseInt(React.version, 10);

describe('Strict Mode', () => {
  const { render } = createRenderer({ strict: true, strictEffects: true });

  it('does not work when `configure` is not called, even if `createRenderer` was created with `strict: true` and `strictEffects: true`', async () => {
    let mounted = 0;
    let unmounted = 0;
    let refCallback = 0;

    function TestComponent() {
      React.useEffect(() => {
        mounted += 1;

        return () => {
          unmounted += 1;
        };
      }, []);

      return (
        <div
          ref={() => {
            refCallback += 1;
          }}
        />
      );
    }

    render(<TestComponent />, { strict: true, strictEffects: true });

    expect(mounted).to.equal(2);
    expect(unmounted).to.equal(1);

    // Double ref callback call were introduced in React 19: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#strict-mode-improvements
    expect(refCallback).to.equal(reactMajor >= 19 ? 3 : 1);
  });

  it('works when `configure({ reactStrictMode: true })` is called', async () => {
    configure({ reactStrictMode: true });

    let mounted = 0;
    let unmounted = 0;
    let refCallback = 0;

    function TestComponent() {
      React.useEffect(() => {
        mounted += 1;

        return () => {
          unmounted += 1;
        };
      }, []);

      return (
        <div
          ref={() => {
            refCallback += 1;
          }}
        />
      );
    }

    render(<TestComponent />, { strict: true, strictEffects: true });

    expect(mounted).to.equal(2);
    expect(unmounted).to.equal(1);

    // Double ref callback call were introduced in React 19: https://react.dev/blog/2024/04/25/react-19-upgrade-guide#strict-mode-improvements
    expect(refCallback).to.equal(reactMajor >= 19 ? 3 : 1);
  });
});
