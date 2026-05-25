import { renderHook } from '@mui/internal-test-utils';
import { ResourceBuilder } from 'test/utils/scheduler';
import { useExtractEventTimelinePremiumParameters } from '../useExtractEventTimelinePremiumParameters';

describe('useExtractEventTimelinePremiumParameters', () => {
  it('should forward `requireResources` to the parameters object', () => {
    const { result } = renderHook(() =>
      useExtractEventTimelinePremiumParameters({
        events: [],
        resources: [ResourceBuilder.new().build()],
        requireResources: true,
      }),
    );

    expect(result.current.parameters.requireResources).to.equal(true);
  });
});
