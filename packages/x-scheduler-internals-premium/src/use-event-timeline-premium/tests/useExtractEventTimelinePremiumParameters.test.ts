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

  it('should forward `presetConfig` to the parameters object instead of the forwarded props', () => {
    const presetConfig = { dayAndHour: { startTime: 8, endTime: 20 } };
    const { result } = renderHook(() =>
      useExtractEventTimelinePremiumParameters({
        events: [],
        resources: [ResourceBuilder.new().build()],
        presetConfig,
      }),
    );

    expect(result.current.parameters.presetConfig).to.equal(presetConfig);
    expect(result.current.forwardedProps).to.not.have.property('presetConfig');
  });
});
