import { renderHook } from '@mui/internal-test-utils';
import { useExtractEventCalendarParameters } from '../useExtractEventCalendarParameters';

describe('useExtractEventCalendarParameters', () => {
  it('should forward `shouldEventRequireResource` to the parameters object', () => {
    const { result } = renderHook(() =>
      useExtractEventCalendarParameters({ events: [], shouldEventRequireResource: true }),
    );

    expect(result.current.parameters.shouldEventRequireResource).to.equal(true);
  });
});
