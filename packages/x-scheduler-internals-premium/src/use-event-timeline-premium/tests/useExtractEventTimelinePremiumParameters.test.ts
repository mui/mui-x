import { renderHook } from '@mui/internal-test-utils';
import { ResourceBuilder } from 'test/utils/scheduler';
import { useExtractEventTimelinePremiumParameters } from '../useExtractEventTimelinePremiumParameters';

describe('useExtractEventTimelinePremiumParameters', () => {
  it('should forward `shouldEventRequireResource` to the parameters object', () => {
    const { result } = renderHook(() =>
      useExtractEventTimelinePremiumParameters({
        events: [],
        resources: [ResourceBuilder.new().build()],
        shouldEventRequireResource: true,
      }),
    );

    expect(result.current.parameters.shouldEventRequireResource).to.equal(true);
  });
});
