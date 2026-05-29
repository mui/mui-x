import * as React from 'react';
import { render } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';

describe('StrictMode behavior probe', () => {
  it('reports react build and StrictMode invocation counts', () => {
    let initializerCalls = 0;
    let renderCalls = 0;
    let effectSetupCalls = 0;
    let effectCleanupCalls = 0;
    let memoCalls = 0;

    function Probe() {
      renderCalls += 1;
      React.useState(() => {
        initializerCalls += 1;
        return null;
      });
      React.useMemo(() => {
        memoCalls += 1;
        return null;
      }, []);
      React.useEffect(() => {
        effectSetupCalls += 1;
        return () => {
          effectCleanupCalls += 1;
        };
      }, []);
      return null;
    }

    render(
      <React.StrictMode>
        <Probe />
      </React.StrictMode>,
    );

    const reactVersion = React.version;
    const nodeEnv = process.env.NODE_ENV;
    // Detect dev vs prod react-dom by looking at whether the strict-mode effect cycle
    // and the lazy-initializer double-invoke align.
    const summary = {
      reactVersion,
      nodeEnv,
      renderCalls,
      initializerCalls,
      memoCalls,
      effectSetupCalls,
      effectCleanupCalls,
    };

    // Force the diagnostic into the failure message so it lands in CI logs unambiguously.
    expect(JSON.stringify(summary)).toEqual('STRICT_MODE_PROBE_DIAGNOSTIC');
  });
});
