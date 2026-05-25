import { renderHook } from '@mui/internal-test-utils';
import { useExtractEventCalendarParameters } from '../useExtractEventCalendarParameters';

describe('useExtractEventCalendarParameters', () => {
  it('should forward `requireResources` to the parameters object', () => {
    const { result } = renderHook(() =>
      useExtractEventCalendarParameters({ events: [], requireResources: true }),
    );

    expect(result.current.parameters.requireResources).to.equal(true);
  });
});
