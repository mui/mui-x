import { EventBuilder } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { EventDialogFormStore, eventDialogFormSelectors } from './EventDialogFormStore';

const occurrence = EventBuilder.new().toOccurrence();

describe('EventDialogFormStore', () => {
  it('should expose the constants of the editing session', () => {
    const store = new EventDialogFormStore(
      { title: 'Meeting' },
      { occurrence, resourceSelectionMode: 'multiple' },
    );

    expect(store.occurrence).to.equal(occurrence);
    expect(store.resourceSelectionMode).to.equal('multiple');
    expect(store.state.values).to.deep.equal({ title: 'Meeting' });
  });

  it('should keep the range values stable until one of them changes', () => {
    const store = new EventDialogFormStore(
      {
        title: 'Meeting',
        startDate: '2025-07-03',
        startTime: '09:00',
        endDate: '2025-07-03',
        endTime: '10:00',
        allDay: false,
      },
      { occurrence, resourceSelectionMode: 'single' },
    );

    const range = eventDialogFormSelectors.rangeValues(store.state as any);
    store.setValue('title', 'Renamed');
    expect(eventDialogFormSelectors.rangeValues(store.state as any)).to.equal(range);

    store.setValue('endTime', '11:00');
    expect(eventDialogFormSelectors.rangeValues(store.state as any)).not.to.equal(range);
  });
});
