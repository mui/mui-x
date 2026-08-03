import { spy } from 'sinon';
import { EventDialogFormStore, eventDialogFormSelectors } from './EventDialogFormStore';

describe('EventDialogFormStore', () => {
  describe('constructor', () => {
    it('should seed values and initialValues from the provided object', () => {
      const store = new EventDialogFormStore({ title: 'Meeting', priority: 'high' });
      expect(store.state.values).to.deep.equal({ title: 'Meeting', priority: 'high' });
      expect(store.state.initialValues).to.deep.equal({ title: 'Meeting', priority: 'high' });
      expect(store.state.errors).to.deep.equal({});
    });
  });

  describe('setValue', () => {
    it('should update the value and keep the other keys', () => {
      const store = new EventDialogFormStore({ title: 'Meeting', priority: 'high' });
      store.setValue('title', 'Updated');
      expect(store.state.values).to.deep.equal({ title: 'Updated', priority: 'high' });
    });

    it('should add a key not present in the initial values', () => {
      const store = new EventDialogFormStore({ title: 'Meeting' });
      store.setValue('priority', 'low');
      expect(store.state.values).to.deep.equal({ title: 'Meeting', priority: 'low' });
    });

    it('should clear the error of the written key', () => {
      const store = new EventDialogFormStore({ title: '' });
      store.registerValidator('title', (value) => (value ? null : 'Required'));
      store.validateAll();
      expect(store.state.errors).to.deep.equal({ title: 'Required' });

      store.setValue('title', 'Meeting');
      expect(store.state.errors).to.deep.equal({});
    });

    it('should keep the errors of the other keys', () => {
      const store = new EventDialogFormStore({ title: '', priority: null });
      store.registerValidator('title', (value) => (value ? null : 'Required'));
      store.registerValidator('priority', (value) => (value ? null : 'Required'));
      store.validateAll();

      store.setValue('title', 'Meeting');
      expect(store.state.errors).to.deep.equal({ priority: 'Required' });
    });

    it('should call onValuesChange with the new values and the changed keys', () => {
      const onValuesChange = spy();
      const store = new EventDialogFormStore({ title: 'Meeting' }, { onValuesChange });
      store.setValue('title', 'Updated');
      expect(onValuesChange.calledOnce).to.equal(true);
      expect(onValuesChange.lastCall.args[0]).to.deep.equal({ title: 'Updated' });
      expect(onValuesChange.lastCall.args[1]).to.deep.equal(['title']);
    });
  });

  describe('setValues', () => {
    it('should merge several keys in a single update', () => {
      const store = new EventDialogFormStore({ a: 1, b: 2, c: 3 });
      const listener = spy();
      store.subscribe(listener);
      store.setValues({ a: 10, b: 20 });
      expect(store.state.values).to.deep.equal({ a: 10, b: 20, c: 3 });
      expect(listener.callCount).to.equal(1);
    });

    it('should clear the errors of all the written keys', () => {
      const store = new EventDialogFormStore({ a: null, b: null, c: null });
      store.registerValidator('a', (value) => (value ? null : 'Required'));
      store.registerValidator('b', (value) => (value ? null : 'Required'));
      store.registerValidator('c', (value) => (value ? null : 'Required'));
      store.validateAll();

      store.setValues({ a: 1, b: 2 });
      expect(store.state.errors).to.deep.equal({ c: 'Required' });
    });
  });

  describe('clearErrors', () => {
    it('should remove all the errors', () => {
      const store = new EventDialogFormStore({ title: '' });
      store.registerValidator('title', () => 'Required');
      store.validateAll();
      store.clearErrors();
      expect(store.state.errors).to.deep.equal({});
    });
  });

  describe('validateAll', () => {
    it('should return true and clear the errors when every validator passes', () => {
      const store = new EventDialogFormStore({ title: 'Meeting' });
      store.registerValidator('title', (value) => (value ? null : 'Required'));
      expect(store.validateAll()).to.equal(true);
      expect(store.state.errors).to.deep.equal({});
    });

    it('should collect the errors of all the failing fields at once', () => {
      const store = new EventDialogFormStore({ title: '', priority: null });
      store.registerValidator('title', (value) => (value ? null : 'Title required'));
      store.registerValidator('priority', (value) => (value ? null : 'Priority required'));
      expect(store.validateAll()).to.equal(false);
      expect(store.state.errors).to.deep.equal({
        title: 'Title required',
        priority: 'Priority required',
      });
    });

    it('should keep the first error when a field has several validators', () => {
      const store = new EventDialogFormStore({ title: '' });
      store.registerValidator('title', () => 'First');
      store.registerValidator('title', () => 'Second');
      store.validateAll();
      expect(store.state.errors).to.deep.equal({ title: 'First' });
    });

    it('should pass all the values to the validator', () => {
      const store = new EventDialogFormStore({ startDate: '2025-01-02', endDate: '2025-01-01' });
      store.registerValidator('startDate', (value, allValues) =>
        String(value) > String(allValues.endDate) ? 'Start after end' : null,
      );
      expect(store.validateAll()).to.equal(false);
      expect(store.state.errors).to.deep.equal({ startDate: 'Start after end' });
    });

    it('should ignore a validator once unregistered', () => {
      const store = new EventDialogFormStore({ title: '' });
      const validator = () => 'Required';
      store.registerValidator('title', validator);
      store.unregisterValidator('title', validator);
      expect(store.validateAll()).to.equal(true);
    });

    it('should treat an empty error array as valid', () => {
      const store = new EventDialogFormStore({ title: '' });
      store.registerValidator('title', () => []);
      expect(store.validateAll()).to.equal(true);
      expect(store.state.errors).to.deep.equal({});
    });
  });

  describe('getDirtyValues', () => {
    it('should return only the values that changed since seeding', () => {
      const store = new EventDialogFormStore({ title: 'Meeting', priority: 'high' });
      store.setValue('priority', 'low');
      expect(store.getDirtyValues()).to.deep.equal({ priority: 'low' });
    });

    it('should exclude the provided keys', () => {
      const store = new EventDialogFormStore({ title: 'Meeting', priority: 'high' });
      store.setValues({ title: 'Updated', priority: 'low' });
      expect(store.getDirtyValues(new Set(['title']))).to.deep.equal({ priority: 'low' });
    });

    it('should include keys added after seeding', () => {
      const store = new EventDialogFormStore({ title: 'Meeting' });
      store.setValue('priority', 'low');
      expect(store.getDirtyValues()).to.deep.equal({ priority: 'low' });
    });

    it('should not report a value reverted to its initial state', () => {
      const store = new EventDialogFormStore({ title: 'Meeting' });
      store.setValue('title', 'Updated');
      store.setValue('title', 'Meeting');
      expect(store.getDirtyValues()).to.deep.equal({});
    });
  });

  describe('reset', () => {
    it('should restore the initial values and clear the errors', () => {
      const store = new EventDialogFormStore({ title: 'Meeting' });
      store.registerValidator('title', () => 'Required');
      store.setValue('title', 'Updated');
      store.validateAll();

      store.reset();
      expect(store.state.values).to.deep.equal({ title: 'Meeting' });
      expect(store.state.errors).to.deep.equal({});
    });
  });

  describe('selectors', () => {
    it('should read a value and an error by key', () => {
      const store = new EventDialogFormStore({ title: '' });
      store.registerValidator('title', () => 'Required');
      store.validateAll();
      expect(eventDialogFormSelectors.value(store.state, 'title')).to.equal('');
      expect(eventDialogFormSelectors.error(store.state, 'title')).to.equal('Required');
    });
  });
});
