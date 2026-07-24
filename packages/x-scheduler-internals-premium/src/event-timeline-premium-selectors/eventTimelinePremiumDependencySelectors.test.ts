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

const DEP_4: SchedulerDependency = {
  id: 'dep-4',
  source: 'unknown-y',
  target: 'event-b',
  type: 'FinishToStart',
};

const DEP_5: SchedulerDependency = {
  id: 'dep-5',
  source: 'event-r',
  target: 'event-b',
  type: 'FinishToStart',
};

// `DEP_2` and `DEP_3` reference a recurring/unknown event on purpose (to exercise the
// selector's filtering below), which the scheduling plugin flags with a dev warning.
// `DEP_4` does the same but on the `source` side, unlike `DEP_2`/`DEP_3`.
// `DEP_5` also references the recurring event on the `source` side, unlike `DEP_2`.
const getState = () => {
  let state!: ReturnType<typeof getEventTimelinePremiumStateFromParameters>;
  expect(() => {
    state = getEventTimelinePremiumStateFromParameters({
      resources: TEST_RESOURCES,
      events: [eventA, eventB, eventR],
      dependencies: [DEP_1, DEP_2, DEP_3, DEP_4, DEP_5],
    });
  }).toWarnDev([
    'MUI X Scheduler: The dependency "dep-2" references the recurring event "event-r".',
    'MUI X Scheduler: The dependency "dep-3" references the unknown event "unknown-x".',
    'MUI X Scheduler: The dependency "dep-4" references the unknown event "unknown-y".',
    'MUI X Scheduler: The dependency "dep-5" references the recurring event "event-r".',
  ]);
  return state;
};

describe('eventTimelinePremiumDependencySelectors', () => {
  it('should return the dependencyModelList from the state', () => {
    const state = getState();

    expect(eventTimelinePremiumDependencySelectors.modelList(state)).to.equal(
      state.dependencyModelList,
    );
  });

  it('should return the dependencyModelLookup from the state', () => {
    const state = getState();

    expect(eventTimelinePremiumDependencySelectors.modelLookup(state)).to.equal(
      state.dependencyModelLookup,
    );
  });

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

  it('should group the source event titles by target event id', () => {
    const state = getState();

    const titlesByTarget =
      eventTimelinePremiumDependencySelectors.activeSourceTitlesByTarget(state);

    expect(titlesByTarget.get('event-b')).to.deep.equal([eventA.title]);
    expect(titlesByTarget.get('event-a')).to.equal(undefined);
  });

  it('should return the source titles of all the active dependencies targeting the event', () => {
    const eventC = EventBuilder.new().id('event-c').title('Event C').build();
    const state = getEventTimelinePremiumStateFromParameters({
      resources: TEST_RESOURCES,
      events: [eventA, eventB, eventC],
      dependencies: [
        DEP_1,
        { id: 'dep-c', source: 'event-c', target: 'event-b', type: 'FinishToStart' },
      ],
    });

    expect(
      eventTimelinePremiumDependencySelectors.activeSourceTitlesForTarget(state, 'event-b'),
    ).to.deep.equal([eventA.title, 'Event C']);
  });

  it('should return the same empty instance for every event without predecessors', () => {
    const state = getState();

    const first = eventTimelinePremiumDependencySelectors.activeSourceTitlesForTarget(
      state,
      'event-a',
    );
    const second = eventTimelinePremiumDependencySelectors.activeSourceTitlesForTarget(
      state,
      'event-r',
    );

    expect(first).to.deep.equal([]);
    expect(first).to.equal(second);
  });

  it('should report the feature as enabled only when a dependencies parameter is provided', () => {
    const stateWithDependencies = getState();
    const stateWithoutDependencies = getEventTimelinePremiumStateFromParameters({
      resources: TEST_RESOURCES,
      events: [eventA, eventB],
    });

    expect(eventTimelinePremiumDependencySelectors.enabled(stateWithDependencies)).to.equal(true);
    expect(eventTimelinePremiumDependencySelectors.enabled(stateWithoutDependencies)).to.equal(
      false,
    );
  });

  it('should return the creation gesture source and target flags', () => {
    const state = {
      ...getState(),
      dependencyCreation: {
        sourceEventId: 'event-a',
        sourceOccurrenceKey: 'event-a-0',
        targetEventId: 'event-b',
        targetOccurrenceKey: 'event-b-0',
        cursor: { clientX: 10, clientY: 20 },
      },
    };

    expect(eventTimelinePremiumDependencySelectors.isCreationSource(state, 'event-a')).to.equal(
      true,
    );
    expect(eventTimelinePremiumDependencySelectors.isCreationSource(state, 'event-b')).to.equal(
      false,
    );
    expect(eventTimelinePremiumDependencySelectors.isCreationTarget(state, 'event-b')).to.equal(
      true,
    );
    expect(eventTimelinePremiumDependencySelectors.isCreationTarget(state, 'event-a')).to.equal(
      false,
    );
  });

  it('should not flag any event when no creation gesture is in progress', () => {
    const state = getState();

    expect(eventTimelinePremiumDependencySelectors.isCreationSource(state, 'event-a')).to.equal(
      false,
    );
    expect(eventTimelinePremiumDependencySelectors.isCreationTarget(state, 'event-b')).to.equal(
      false,
    );
  });

  it('should resolve the selected id to null when the dependency no longer exists', () => {
    const state = getState();

    expect(
      eventTimelinePremiumDependencySelectors.selectedId({
        ...state,
        selectedDependencyId: 'dep-1',
      }),
    ).to.equal('dep-1');
    expect(
      eventTimelinePremiumDependencySelectors.selectedId({
        ...state,
        selectedDependencyId: 'removed-dep',
      }),
    ).to.equal(null);
    expect(eventTimelinePremiumDependencySelectors.selectedId(state)).to.equal(null);
  });

  it('should report whether a dependency is selected', () => {
    const state = { ...getState(), selectedDependencyId: 'dep-1' };

    expect(eventTimelinePremiumDependencySelectors.isSelected(state, 'dep-1')).to.equal(true);
    expect(eventTimelinePremiumDependencySelectors.isSelected(state, 'dep-2')).to.equal(false);
  });

  it('should keep only the last dependency when two of them share the same id', () => {
    const firstDependency: SchedulerDependency = {
      id: 'dup-1',
      source: 'event-a',
      target: 'event-b',
      type: 'FinishToStart',
    };
    const lastDependency: SchedulerDependency = {
      id: 'dup-1',
      source: 'event-b',
      target: 'event-a',
      type: 'FinishToStart',
    };

    let state!: ReturnType<typeof getEventTimelinePremiumStateFromParameters>;
    expect(() => {
      state = getEventTimelinePremiumStateFromParameters({
        resources: TEST_RESOURCES,
        events: [eventA, eventB],
        dependencies: [firstDependency, lastDependency],
      });
    }).toWarnDev(['MUI X Scheduler: Two or more dependencies share the same id "dup-1".']);

    expect(eventTimelinePremiumDependencySelectors.activeModelList(state)).to.deep.equal([
      lastDependency,
    ]);
  });
});
