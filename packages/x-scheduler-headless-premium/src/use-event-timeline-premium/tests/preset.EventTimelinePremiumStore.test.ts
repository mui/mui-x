import { spy } from 'sinon';
import { adapter, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { EventTimelinePremiumPreset } from '@mui/x-scheduler-headless-premium/models';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

const DEFAULT_PARAMS = { events: [], defaultVisibleDate: DEFAULT_TESTING_VISIBLE_DATE };

describe('Preset - EventTimelinePremiumStore', () => {
  describe('Method: setPreset', () => {
    it('should update preset and call onPresetChange when value changes and is uncontrolled', () => {
      const onPresetChange = spy();
      const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, onPresetChange }, adapter);

      store.setPreset('day', {} as any);

      expect(store.state.preset).to.equal('day');
      expect(onPresetChange.calledOnce).to.equal(true);
      expect(onPresetChange.lastCall.firstArg).to.equal('day');
    });

    it('should NOT mutate store but call onPresetChange when is controlled', () => {
      const onPresetChange = spy();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, preset: 'dayAndWeek', onPresetChange },
        adapter,
      );

      store.setPreset('day', {} as any);

      expect(store.state.preset).to.equal('dayAndWeek');
      expect(onPresetChange.calledOnce).to.equal(true);
      expect(onPresetChange.lastCall.firstArg).to.equal('day');
    });

    it('should do nothing if setting the same preset: no state change, no callback', () => {
      const onPresetChange = spy();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, defaultPreset: 'monthAndYear', onPresetChange },
        adapter,
      );

      store.setPreset('monthAndYear', {} as any);

      expect(store.state.preset).to.equal('monthAndYear');
      expect(onPresetChange.called).to.equal(false);
    });

    it('should NOT mutate store when onPresetChange cancels the change', () => {
      const store = new EventTimelinePremiumStore(
        {
          ...DEFAULT_PARAMS,
          defaultPreset: 'dayAndWeek',
          onPresetChange: (_, eventDetails) => eventDetails.cancel(),
        },
        adapter,
      );

      store.setPreset('day', {} as any);
      expect(store.state.preset).to.equal('dayAndWeek');
    });

    it('should warn in dev when controlled without an onPresetChange handler', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, preset: 'dayAndWeek' },
        adapter,
      );

      expect(() => store.setPreset('day', {} as any)).toWarnDev(
        'MUI X Scheduler: EventTimelinePremium is controlled (received a `preset` prop) but `onPresetChange` is not provided',
      );
    });
  });

  describe('Navigation', () => {
    const NAVIGATION_CASES: {
      preset: EventTimelinePremiumPreset;
      next: string;
      previous: string;
    }[] = [
      { preset: 'dayAndHour', next: '2025-07-07T00:00:00Z', previous: '2025-06-29T00:00:00Z' },
      { preset: 'day', next: '2025-08-28T00:00:00Z', previous: '2025-05-08T00:00:00Z' },
      { preset: 'dayAndWeek', next: '2025-10-23T00:00:00Z', previous: '2025-03-13T00:00:00Z' },
      { preset: 'monthAndYear', next: '2028-07-03T00:00:00Z', previous: '2022-07-03T00:00:00Z' },
      { preset: 'year', next: '2055-07-03T00:00:00Z', previous: '1995-07-03T00:00:00Z' },
    ];

    NAVIGATION_CASES.forEach(({ preset, next, previous }) => {
      it(`should advance visibleDate by one span in the ${preset} preset`, () => {
        const store = new EventTimelinePremiumStore(
          { ...DEFAULT_PARAMS, defaultPreset: preset },
          adapter,
        );

        store.goToNextVisibleDate({} as any);

        expect(store.state.visibleDate).toEqualDateTime(next);
      });

      it(`should rewind visibleDate by one span in the ${preset} preset`, () => {
        const store = new EventTimelinePremiumStore(
          { ...DEFAULT_PARAMS, defaultPreset: preset },
          adapter,
        );

        store.goToPreviousVisibleDate({} as any);

        expect(store.state.visibleDate).toEqualDateTime(previous);
      });
    });
  });
});
