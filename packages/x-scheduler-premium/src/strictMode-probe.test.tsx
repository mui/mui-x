import * as React from 'react';
import { render } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';

describe('StrictMode detection alternatives', () => {
  it('compares detection techniques in R18 + R19', () => {
    let initializerCalls = 0;
    let oldDetectionResult: boolean | null = false;
    let internalsModeFirstRender: number | null = null;
    let internalsKeyFound = '';
    let strictBitsMatch: boolean | null = null;

    function Probe() {
      // Technique 1: old useRef+useState lazy initializer.
      const doubleInvokedRef = React.useRef<boolean | null>(false);
      React.useState(() => {
        initializerCalls += 1;
        if (doubleInvokedRef.current === false) {
          doubleInvokedRef.current = null;
        } else {
          doubleInvokedRef.current = true;
        }
        return null;
      });

      // Technique 2: React internals A.getOwner().mode bit check.
      const reactAny = React as unknown as Record<string, any>;
      const internals =
        reactAny.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE ??
        reactAny.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      if (internals) {
        internalsKeyFound =
          reactAny.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
            ? 'CLIENT_INTERNALS'
            : 'SECRET_INTERNALS';
        const owner = internals.A?.getOwner?.() ?? internals.ReactCurrentOwner?.current;
        if (owner && typeof owner.mode === 'number') {
          if (internalsModeFirstRender === null) {
            internalsModeFirstRender = owner.mode;
            // StrictLegacyMode = 8, StrictEffectsMode = 16. Either being set = StrictMode.
            strictBitsMatch = (owner.mode & 0b11000) !== 0;
          }
        }
      }

      React.useEffect(() => {
        oldDetectionResult = doubleInvokedRef.current;
      }, []);

      return null;
    }

    render(
      <React.StrictMode>
        <Probe />
      </React.StrictMode>,
    );

    const summary = {
      reactVersion: React.version,
      initializerCalls,
      oldDetectionResult,
      internalsKeyFound,
      internalsModeFirstRender,
      strictBitsMatch,
    };

    expect(JSON.stringify(summary)).toEqual('STRICT_MODE_DETECTION_PROBE');
  });
});
