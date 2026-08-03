import { EventDialogFormStore } from './EventDialogFormStore';
import { eventDialogFormSelectors } from './eventDialogFormSelectors';

describe('eventDialogFormSelectors', () => {
  it('should read a value and an error by key', () => {
    const store = new EventDialogFormStore({ title: '' });
    store.registerValidator('title', () => 'Required');
    store.validateAll();
    expect(eventDialogFormSelectors.value(store.state, 'title')).to.equal('');
    expect(eventDialogFormSelectors.error(store.state, 'title')).to.equal('Required');
  });
});
