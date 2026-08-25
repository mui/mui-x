import { spy } from 'sinon';
import { EventBuilder } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import type { EventDialogFormParameters } from './EventDialogFormStore';
import { EventDialogFormStore } from './EventDialogFormStore';

const occurrence = EventBuilder.new().toOccurrence();

function createFormStore<TValues extends Record<string, unknown>>(
  initialValues: TValues,
  parameters?: Partial<EventDialogFormParameters<TValues>>,
) {
  return new EventDialogFormStore<TValues>(initialValues, {
    occurrence,
    resourceSelectionMode: 'single',
    ...parameters,
  });
}

describe('EventDialogFormStore', () => {
  describe('constructor', () => {
    it('should seed the values from the provided object', () => {
      const store = createFormStore({ title: 'Meeting', priority: 'high' });
      expect(store.state.values).to.deep.equal({ title: 'Meeting', priority: 'high' });
      expect(store.state.errors).to.deep.equal({});
    });

    it('should not share the seed object with the caller', () => {
      const seed: Record<string, unknown> = { title: 'Meeting' };
      const store = createFormStore(seed);
      seed.title = 'Mutated';
      expect(store.state.values).to.deep.equal({ title: 'Meeting' });
      // The dirty baseline is also detached from the caller's object.
      expect(store.getDirtyValues()).to.deep.equal({});
    });
  });

  describe('setValue', () => {
    it('should update the value and keep the other keys', () => {
      const store = createFormStore({ title: 'Meeting', priority: 'high' });
      store.setValue('title', 'Updated');
      expect(store.state.values).to.deep.equal({ title: 'Updated', priority: 'high' });
    });

    it('should add a key not present in the initial values', () => {
      const store = createFormStore({ title: 'Meeting' });
      store.setValue('priority', 'low');
      expect(store.state.values).to.deep.equal({ title: 'Meeting', priority: 'low' });
    });

    it('should clear the error of the written key', async () => {
      const store = createFormStore({ title: '' });
      store.registerValidator('title', (value) => (value ? null : 'Required'));
      await store.validateAll();
      expect(store.state.errors).to.deep.equal({ title: ['Required'] });

      store.setValue('title', 'Meeting');
      expect(store.state.errors).to.deep.equal({});
    });

    it('should keep the errors of the other keys', async () => {
      const store = createFormStore({ title: '', priority: null });
      store.registerValidator('title', (value) => (value ? null : 'Required'));
      store.registerValidator('priority', (value) => (value ? null : 'Required'));
      await store.validateAll();

      store.setValue('title', 'Meeting');
      expect(store.state.errors).to.deep.equal({ priority: ['Required'] });
    });

    it('should call onValuesChange with the new values and the changed keys', () => {
      const onValuesChange = spy();
      const store = createFormStore({ title: 'Meeting' }, { onValuesChange });
      store.setValue('title', 'Updated');
      expect(onValuesChange.calledOnce).to.equal(true);
      expect(onValuesChange.lastCall.args[0]).to.deep.equal({ title: 'Updated' });
      expect(onValuesChange.lastCall.args[1]).to.deep.equal(['title']);
    });
  });

  describe('setValues', () => {
    it('should merge several keys in a single update', () => {
      const store = createFormStore({ a: 1, b: 2, c: 3 });
      const listener = spy();
      store.subscribe(listener);
      store.setValues({ a: 10, b: 20 });
      expect(store.state.values).to.deep.equal({ a: 10, b: 20, c: 3 });
      expect(listener.callCount).to.equal(1);
    });

    it('should accept a functional updater receiving the current values', () => {
      const store = createFormStore({ count: 1, other: 'x' });
      store.setValues((prev) => ({ count: (prev.count as number) + 1 }));
      expect(store.state.values).to.deep.equal({ count: 2, other: 'x' });
    });

    it('should notify nobody when the changes object is empty', () => {
      const onValuesChange = spy();
      const store = createFormStore({ title: 'Meeting' }, { onValuesChange });
      const listener = spy();
      store.subscribe(listener);

      store.setValues({});
      store.setValues(() => ({}));

      expect(listener.callCount).to.equal(0);
      expect(onValuesChange.called).to.equal(false);
    });

    it('should clear the errors of all the written keys', async () => {
      const store = createFormStore<Record<string, unknown>>({
        a: null,
        b: null,
        c: null,
      });
      store.registerValidator('a', (value) => (value ? null : 'Required'));
      store.registerValidator('b', (value) => (value ? null : 'Required'));
      store.registerValidator('c', (value) => (value ? null : 'Required'));
      await store.validateAll();

      store.setValues({ a: 1, b: 2 });
      expect(store.state.errors).to.deep.equal({ c: ['Required'] });
    });
  });

  describe('seedDefault', () => {
    it('should seed a missing key without marking it dirty or notifying onValuesChange', () => {
      const onValuesChange = spy();
      const store = createFormStore({ title: '' }, { onValuesChange });
      store.seedDefault('notes', 'default');

      expect(store.state.values).to.deep.equal({ title: '', notes: 'default' });
      expect(store.getDirtyValues()).to.deep.equal({});
      expect(onValuesChange.called).to.equal(false);
    });

    it('should not overwrite a key already present in the values', () => {
      const store = createFormStore({ notes: 'from-model' });
      store.seedDefault('notes', 'default');
      expect(store.state.values).to.deep.equal({ notes: 'from-model' });
    });

    it('should report a seeded key as dirty once edited, including a reset to undefined', () => {
      const store = createFormStore({ title: '' });
      store.seedDefault('notes', 'default');

      store.setValue('notes', undefined);
      expect(store.getDirtyValues()).to.deep.equal({ notes: undefined });
    });
  });

  describe('setError', () => {
    it('should set the error messages of the field, replacing any existing ones', () => {
      const store = createFormStore({ title: '' });
      store.setError('title', 'Required');
      expect(store.state.errors).to.deep.equal({ title: ['Required'] });

      store.setError('title', ['Too long', 'Invalid characters']);
      expect(store.state.errors).to.deep.equal({ title: ['Too long', 'Invalid characters'] });
    });

    it('should keep the errors of the other fields', async () => {
      const store = createFormStore({ title: '', priority: null });
      store.registerValidator('priority', () => 'Priority required');
      await store.validateAll();

      store.setError('title', 'Required');
      expect(store.state.errors).to.deep.equal({
        title: ['Required'],
        priority: ['Priority required'],
      });
    });

    it('should clear the error of the field when the messages normalize to none', () => {
      const store = createFormStore({ title: '' });
      store.setError('title', 'Required');
      store.setError('title', null);
      expect(store.state.errors).to.deep.equal({});
    });
  });

  describe('clearErrors', () => {
    it('should remove all the errors', async () => {
      const store = createFormStore({ title: '' });
      store.registerValidator('title', () => 'Required');
      await store.validateAll();
      store.clearErrors();
      expect(store.state.errors).to.deep.equal({});
    });

    it('should only remove the errors of the provided keys', async () => {
      const store = createFormStore({ title: '', priority: null });
      store.registerValidator('title', () => 'Title required');
      store.registerValidator('priority', () => 'Priority required');
      await store.validateAll();

      store.clearErrors(['title']);
      expect(store.state.errors).to.deep.equal({ priority: ['Priority required'] });
    });

    it('should not notify subscribers when none of the provided keys has an error', async () => {
      const store = createFormStore({ title: '', priority: null });
      store.registerValidator('priority', () => 'Priority required');
      await store.validateAll();

      const listener = spy();
      store.subscribe(listener);
      store.clearErrors(['title']);
      expect(listener.callCount).to.equal(0);
      expect(store.state.errors).to.deep.equal({ priority: ['Priority required'] });
    });
  });

  describe('hasValidator', () => {
    it('should report whether a key has at least one validator registered', () => {
      const store = createFormStore({ title: '' });
      const validator = () => 'Required';

      expect(store.hasValidator('title')).to.equal(false);
      store.registerValidator('title', validator);
      expect(store.hasValidator('title')).to.equal(true);
      expect(store.hasValidator('priority')).to.equal(false);
    });

    it('should report false once the last validator of a key is unregistered', () => {
      const store = createFormStore({ title: '' });
      const first = () => 'Required';
      const second = () => 'Too short';
      store.registerValidator('title', first);
      store.registerValidator('title', second);

      store.unregisterValidator('title', first);
      expect(store.hasValidator('title')).to.equal(true);
      store.unregisterValidator('title', second);
      expect(store.hasValidator('title')).to.equal(false);
    });
  });

  describe('validateAll', () => {
    it('should resolve with true and clear the errors when every validator passes', async () => {
      const store = createFormStore({ title: 'Meeting' });
      store.registerValidator('title', (value) => (value ? null : 'Required'));
      expect(await store.validateAll()).to.equal(true);
      expect(store.state.errors).to.deep.equal({});
    });

    it('should collect the errors of all the failing fields at once', async () => {
      const store = createFormStore({ title: '', priority: null });
      store.registerValidator('title', (value) => (value ? null : 'Title required'));
      store.registerValidator('priority', (value) => (value ? null : 'Priority required'));
      expect(await store.validateAll()).to.equal(false);
      expect(store.state.errors).to.deep.equal({
        title: ['Title required'],
        priority: ['Priority required'],
      });
    });

    it('should keep the first error when a field has several validators', async () => {
      const store = createFormStore({ title: '' });
      store.registerValidator('title', () => 'First');
      store.registerValidator('title', () => 'Second');
      await store.validateAll();
      expect(store.state.errors).to.deep.equal({ title: ['First'] });
    });

    it('should pass all the values to the validator', async () => {
      const store = createFormStore({ startDate: '2025-01-02', endDate: '2025-01-01' });
      store.registerValidator('startDate', (value, allValues) =>
        String(value) > String(allValues.endDate) ? 'Start after end' : null,
      );
      expect(await store.validateAll()).to.equal(false);
      expect(store.state.errors).to.deep.equal({ startDate: ['Start after end'] });
    });

    it('should ignore a validator once unregistered', async () => {
      const store = createFormStore({ title: '' });
      const validator = () => 'Required';
      store.registerValidator('title', validator);
      store.unregisterValidator('title', validator);
      expect(await store.validateAll()).to.equal(true);
    });

    it('should support an async validator', async () => {
      const store = createFormStore({ title: '' });
      store.registerValidator('title', async (value) => (value ? null : 'Required'));

      expect(await store.validateAll()).to.equal(false);
      expect(store.state.errors).to.deep.equal({ title: ['Required'] });

      store.setValue('title', 'Meeting');
      expect(await store.validateAll()).to.equal(true);
    });

    it('should run a validator registered while an async validation is pending', async () => {
      const store = createFormStore({ title: 'Meeting', priority: null });
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      let titleCalls = 0;
      store.registerValidator('title', async () => {
        titleCalls += 1;
        if (titleCalls === 1) {
          await gate;
        }
        return null;
      });

      const validation = store.validateAll();
      store.registerValidator('priority', (value) => (value ? null : 'Priority required'));
      release();

      expect(await validation).to.equal(false);
      expect(store.state.errors).to.deep.equal({ priority: ['Priority required'] });
    });

    it('should drop the error of a validator unregistered while an async validation is pending', async () => {
      const store = createFormStore({ title: 'Meeting', priority: null });
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      let titleCalls = 0;
      store.registerValidator('title', async () => {
        titleCalls += 1;
        if (titleCalls === 1) {
          await gate;
        }
        return null;
      });
      const priorityValidator = () => 'Priority required';
      store.registerValidator('priority', priorityValidator);

      const validation = store.validateAll();
      store.unregisterValidator('priority', priorityValidator);
      release();

      expect(await validation).to.equal(true);
      expect(store.state.errors).to.deep.equal({});
    });

    it('should keep several error messages returned as an array', async () => {
      const store = createFormStore({ title: '' });
      store.registerValidator('title', () => ['Too long', 'Invalid characters']);
      expect(await store.validateAll()).to.equal(false);
      expect(store.state.errors).to.deep.equal({ title: ['Too long', 'Invalid characters'] });
    });

    it('should treat an empty error array as valid', async () => {
      const store = createFormStore({ title: '' });
      store.registerValidator('title', () => []);
      expect(await store.validateAll()).to.equal(true);
      expect(store.state.errors).to.deep.equal({});
    });

    it('should treat an empty error string as valid', async () => {
      const store = createFormStore({ title: '' });
      store.registerValidator('title', () => '');
      expect(await store.validateAll()).to.equal(true);
      expect(store.state.errors).to.deep.equal({});
    });
  });

  describe('getDirtyValues', () => {
    it('should return only the values that changed since seeding', () => {
      const store = createFormStore({ title: 'Meeting', priority: 'high' });
      store.setValue('priority', 'low');
      expect(store.getDirtyValues()).to.deep.equal({ priority: 'low' });
    });

    it('should exclude the provided keys', () => {
      const store = createFormStore({ title: 'Meeting', priority: 'high' });
      store.setValues({ title: 'Updated', priority: 'low' });
      expect(store.getDirtyValues(new Set(['title']))).to.deep.equal({ priority: 'low' });
    });

    it('should include keys added after seeding', () => {
      const store = createFormStore({ title: 'Meeting' });
      store.setValue('priority', 'low');
      expect(store.getDirtyValues()).to.deep.equal({ priority: 'low' });
    });

    it('should not report a value reverted to its initial state', () => {
      const store = createFormStore({ title: 'Meeting' });
      store.setValue('title', 'Updated');
      store.setValue('title', 'Meeting');
      expect(store.getDirtyValues()).to.deep.equal({});
    });
  });
});
