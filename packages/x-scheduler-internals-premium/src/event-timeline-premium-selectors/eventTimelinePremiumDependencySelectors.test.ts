import {
  EventBuilder,
  getEventTimelinePremiumStateFromParameters,
  ResourceBuilder,
} from 'test/utils/scheduler';
import type { SchedulerDependency } from '@mui/x-scheduler-internals-premium/models';
import { eventTimelinePremiumDependencySelectors } from './eventTimelinePremiumDependencySelectors';

const TEST_RESOURCES = [ResourceBuilder.new().build()];

const eventA = EventBuilder.new().id('event-a').build();
const eventB = EventBuilder.new().id('event-b').build();
const eventR = EventBuilder.new().id('event-r').recurrent('DAILY').build();

const DEP_1: SchedulerDependency = {
  id: 'dep-1',
  source: 'event-a',
  target: 'event-b',
  type: 'FinishToStart',
};

const DEP_2: SchedulerDependency = {
  id: 'dep-2',
  source: 'event-a',
  target: 'event-r',
  type: 'FinishToStart',
};

const DEP_3: SchedulerDependency = {
  id: 'dep-3',
  source: 'event-a',
  target: 'unknown-x',
  type: 'FinishToStart',
};

// `DEP_2` and `DEP_3` reference a recurring/unknown event on purpose (to exercise the
// selector's filtering below), which the scheduling plugin flags with a dev warning.
const getState = () => {
  let state!: ReturnType<typeof getEventTimelinePremiumStateFromParameters>;
  expect(() => {
    state = getEventTimelinePremiumStateFromParameters({
      resources: TEST_RESOURCES,
      events: [eventA, eventB, eventR],
      dependencies: [DEP_1, DEP_2, DEP_3],
    });
  }).toWarnDev([
    'MUI X Scheduler: The dependency "dep-2" references the recurring event "event-r".',
    'MUI X Scheduler: The dependency "dep-3" references the unknown event "unknown-x".',
  ]);
  return state;
};

describe('eventTimelinePremiumDependencySelectors', () => {
  it('should return the dependency by id', () => {
    const state = getState();

    expect(eventTimelinePremiumDependencySelectors.model(state, 'dep-1')).to.deep.equal(DEP_1);
    expect(eventTimelinePremiumDependencySelectors.model(state, 'nope')).to.equal(null);
  });

  it('should keep unknown and recurring references out of the active list', () => {
    const state = getState();

    expect(eventTimelinePremiumDependencySelectors.activeModelList(state)).to.deep.equal([DEP_1]);
  });

  it('should group active dependencies by source event id', () => {
    const state = getState();

    const bySource = eventTimelinePremiumDependencySelectors.activeModelListBySource(state);

    expect(bySource.get('event-a')).to.deep.equal([DEP_1]);
    expect(bySource.get('event-r')).to.equal(undefined);
  });

  it('should group active dependencies by target event id', () => {
    const state = getState();

    const byTarget = eventTimelinePremiumDependencySelectors.activeModelListByTarget(state);

    expect(byTarget.get('event-b')).to.deep.equal([DEP_1]);
    expect(byTarget.get('unknown-x')).to.equal(undefined);
  });

  it('should return the same instance while the inputs are unchanged', () => {
    const state = getState();

    const first = eventTimelinePremiumDependencySelectors.activeModelListBySource(state);
    const second = eventTimelinePremiumDependencySelectors.activeModelListBySource(state);

    expect(first).to.equal(second);
  });
});
