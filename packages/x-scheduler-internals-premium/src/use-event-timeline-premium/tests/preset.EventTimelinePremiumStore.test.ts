import { clearWarningsCache } from '@mui/x-internals/warning';
import { adapter, DEFAULT_TESTING_VISIBLE_DATE, ResourceBuilder } from 'test/utils/scheduler';
import type { EventTimelinePremiumPreset } from '@mui/x-scheduler-internals-premium/models';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

const DEFAULT_PARAMS = {
  events: [],
  defaultVisibleDate: DEFAULT_TESTING_VISIBLE_DATE,
  resources: [ResourceBuilder.new().build()],
};

describe('Preset - EventTimelinePremiumStore', () => {
  beforeEach(() => {
    clearWarningsCache();
  });

  describe('presetConfig validation', () => {
    it('should warn about an invalid hour range even when the preset is not active', () => {
      // The selector only resolves the rendered preset, so without eager validation
      // the typo would stay silent until an end user switches to dayAndHour.
      expect(() => {
        // eslint-disable-next-line no-new
        new EventTimelinePremiumStore(
          {
            ...DEFAULT_PARAMS,
            defaultPreset: 'dayAndMonth',
            presetConfig: { dayAndHour: { startTime: 9, endTime: 9 } },
          },
          adapter,
        );
      }).toWarnDev(['MUI X Scheduler: `presetConfig.dayAndHour` received an invalid hour range']);
    });

    it('should not warn when a known preset is configured but currently not in presets', () => {
      // A wrapper can configure `dayAndHour` once while a screen or a responsive mode
      // narrows `presets`. The Event Calendar accepts `viewConfig` for absent views too.
      expect(() => {
        // eslint-disable-next-line no-new
        new EventTimelinePremiumStore(
          {
            ...DEFAULT_PARAMS,
            defaultPreset: 'dayAndMonth',
            presets: ['dayAndMonth', 'year'] as EventTimelinePremiumPreset[],
            presetConfig: { dayAndHour: { startTime: 8, endTime: 20 } },
          },
          adapter,
        );
      }).not.toWarnDev();
    });

    it('should still validate the hour range of a preset that is not in presets', () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new EventTimelinePremiumStore(
          {
            ...DEFAULT_PARAMS,
            defaultPreset: 'dayAndMonth',
            presets: ['dayAndMonth', 'year'] as EventTimelinePremiumPreset[],
            presetConfig: { dayAndHour: { startTime: 20, endTime: 8 } },
          },
          adapter,
        );
      }).toWarnDev(['MUI X Scheduler: `presetConfig.dayAndHour` received an invalid hour range']);
    });

    it('should warn when a presetConfig key is not a known preset', () => {
      // Only reachable from JavaScript: the type has `dayAndHour` as its single key.
      expect(() => {
        // eslint-disable-next-line no-new
        new EventTimelinePremiumStore(
          {
            ...DEFAULT_PARAMS,
            presetConfig: { dayAndHours: { startTime: 8, endTime: 20 } } as any,
          },
          adapter,
        );
      }).toWarnDev(['MUI X Scheduler: `presetConfig.dayAndHours` is not a known preset']);
    });
  });

  describe('Method: setPreset', () => {
    it('should update preset and call onPresetChange when value changes and is uncontrolled', () => {
      const onPresetChange = vi.fn();
      const store = new EventTimelinePremiumStore({ ...DEFAULT_PARAMS, onPresetChange }, adapter);

      store.setPreset('dayAndMonth', {} as any);

      expect(store.state.preset).to.equal('dayAndMonth');
      expect(onPresetChange.mock.calls.length).to.equal(1);
      expect(onPresetChange.mock.lastCall?.[0]).to.equal('dayAndMonth');
    });

    it('should NOT mutate store but call onPresetChange when is controlled', () => {
      const onPresetChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, preset: 'dayAndWeek', onPresetChange },
        adapter,
      );

      store.setPreset('dayAndMonth', {} as any);

      expect(store.state.preset).to.equal('dayAndWeek');
      expect(onPresetChange.mock.calls.length).to.equal(1);
      expect(onPresetChange.mock.lastCall?.[0]).to.equal('dayAndMonth');
    });

    it('should do nothing if setting the same preset: no state change, no callback', () => {
      const onPresetChange = vi.fn();
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, defaultPreset: 'monthAndYear', onPresetChange },
        adapter,
      );

      store.setPreset('monthAndYear', {} as any);

      expect(store.state.preset).to.equal('monthAndYear');
      expect(onPresetChange.mock.calls.length).to.equal(0);
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

      store.setPreset('dayAndMonth', {} as any);
      expect(store.state.preset).to.equal('dayAndWeek');
    });

    it('should warn in dev when controlled without an onPresetChange handler', () => {
      const store = new EventTimelinePremiumStore(
        { ...DEFAULT_PARAMS, preset: 'dayAndWeek' },
        adapter,
      );

      expect(() => store.setPreset('dayAndMonth', {} as any)).toWarnDev(
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
      { preset: 'dayAndMonth', next: '2025-08-28T00:00:00Z', previous: '2025-05-08T00:00:00Z' },
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
