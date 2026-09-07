import { renderHook } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { useExtractEventCalendarParameters } from '../useExtractEventCalendarParameters';

describe('useExtractEventCalendarParameters', () => {
  it('should forward `shouldEventRequireResource` to the parameters object', () => {
    const { result } = renderHook(() =>
      useExtractEventCalendarParameters({ events: [], shouldEventRequireResource: true }),
    );

    expect(result.current.parameters.shouldEventRequireResource).to.equal(true);
  });

  it('should forward `onEventEditingStart` to the parameters object instead of the forwarded props', () => {
    const onEventEditingStart = () => {};
    const { result } = renderHook(() =>
      useExtractEventCalendarParameters({ events: [], onEventEditingStart }),
    );

    expect(result.current.parameters.onEventEditingStart).to.equal(onEventEditingStart);
    expect(result.current.forwardedProps).to.not.have.property('onEventEditingStart');
  });
});
