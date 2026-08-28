import * as React from 'react';
import { spy } from 'sinon';
import { ErrorBoundary, reactMajor, screen } from '@mui/internal-test-utils';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { describe, it, expect, beforeEach } from 'vitest';
import { EventCalendarProvider } from '../../EventCalendarProvider';
import { EventDialogFormProvider, useEventDialogFormContext } from './EventDialogFormContext';
import { useEventDialogFormField } from '../../../../event-dialog/useEventDialogFormField';
import type { EventDialogFormStore } from './EventDialogFormStore';

describe('EventDialogForm', () => {
  beforeEach(() => clearWarningsCache());

  const { render: renderBase } = createSchedulerRenderer();

  // The field hook reads the scheduler store (per-property read-only state).
  function StoreWrapper(props: { children?: React.ReactNode }) {
    return <EventCalendarProvider events={[]}>{props.children}</EventCalendarProvider>;
  }
  const render: typeof renderBase = (element, options) =>
    renderBase(element, { ...options, wrapper: StoreWrapper });

  const occurrence = EventBuilder.new().toOccurrence();
  const sessionParameters = { occurrence, resourceSelectionMode: 'single' } as const;

  interface FieldProbeProps {
    fieldKey: string;
    validate?: (value: unknown) => string | string[] | null;
    defaultValue?: string;
    onRender?: () => void;
  }

  function FieldProbe(props: FieldProbeProps) {
    const { fieldKey, validate, defaultValue, onRender } = props;
    const { value, setValue, error, errors } = useEventDialogFormField(fieldKey, {
      validate,
      defaultValue,
    });
    onRender?.();
    return (
      <React.Fragment>
        <input
          aria-label={fieldKey}
          value={value ?? ''}
          onChange={(event) => setValue(event.target.value)}
        />
        {error && <p role="alert">{error}</p>}
        <ul aria-label={`${fieldKey} errors`}>
          {errors.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </React.Fragment>
    );
  }

  function StoreGrabber(props: { onMount: (store: EventDialogFormStore) => void }) {
    const { onMount } = props;
    const store = useEventDialogFormContext();
    React.useEffect(() => {
      onMount(store);
    }, [onMount, store]);
    return null;
  }

  describe('useEventDialogFormField', () => {
    it('should read the seeded value', () => {
      render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{ title: 'Meeting' }}>
          <FieldProbe fieldKey="title" />
        </EventDialogFormProvider>,
      );
      expect(screen.getByLabelText('title')).to.have.value('Meeting');
    });

    it('should write the value through setValue', async () => {
      const { user } = render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{ title: '' }}>
          <FieldProbe fieldKey="title" />
        </EventDialogFormProvider>,
      );
      await user.type(screen.getByLabelText('title'), 'Standup');
      expect(screen.getByLabelText('title')).to.have.value('Standup');
    });

    it('should treat a field named after an Object.prototype member as a regular custom field', async () => {
      const { user } = render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{ title: '' }}>
          <FieldProbe fieldKey="constructor" defaultValue="" />
        </EventDialogFormProvider>,
      );

      // Without own-property checks, `'constructor' in values` is true and the inherited
      // `Object` constructor leaks as the field value instead of the seeded default.
      expect(screen.getByLabelText('constructor')).to.have.value('');

      await user.type(screen.getByLabelText('constructor'), 'custom');
      expect(screen.getByLabelText('constructor')).to.have.value('custom');
    });

    it('should expose the field error after a failed validateAll', async () => {
      let formStore: EventDialogFormStore | null = null;
      render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{ title: '' }}>
          <FieldProbe fieldKey="title" validate={(value) => (value ? null : 'Required')} />
          <StoreGrabber
            onMount={(store) => {
              formStore = store;
            }}
          />
        </EventDialogFormProvider>,
      );

      await React.act(async () => {
        expect(await formStore!.validateAll()).to.equal(false);
      });
      expect(screen.getByRole('alert')).to.have.text('Required');
    });

    it('should expose every message through the errors array and clear them on setValue', async () => {
      let formStore: EventDialogFormStore | null = null;
      const { user } = render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{ title: '' }}>
          <FieldProbe fieldKey="title" validate={() => ['Too short', 'Missing a number']} />
          <StoreGrabber
            onMount={(store) => {
              formStore = store;
            }}
          />
        </EventDialogFormProvider>,
      );

      const list = screen.getByRole('list', { name: 'title errors' });
      expect(list.children).to.have.length(0);

      await React.act(async () => {
        expect(await formStore!.validateAll()).to.equal(false);
      });
      expect(Array.from(list.children, (item) => item.textContent)).to.deep.equal([
        'Too short',
        'Missing a number',
      ]);

      // Writing the field clears its errors as a whole, not just the first message.
      await user.type(screen.getByLabelText('title'), 'x');
      expect(list.children).to.have.length(0);
    });

    it('should clear the field error when the field is written', async () => {
      let formStore: EventDialogFormStore | null = null;
      const { user } = render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{ title: '' }}>
          <FieldProbe fieldKey="title" validate={(value) => (value ? null : 'Required')} />
          <StoreGrabber
            onMount={(store) => {
              formStore = store;
            }}
          />
        </EventDialogFormProvider>,
      );

      await React.act(async () => {
        await formStore!.validateAll();
      });
      expect(screen.getByRole('alert')).to.have.text('Required');

      await user.type(screen.getByLabelText('title'), 'S');
      expect(screen.queryByRole('alert')).to.equal(null);
    });

    it('should render the first message when the validator returns several', async () => {
      let formStore: EventDialogFormStore | null = null;
      render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{ title: '' }}>
          <FieldProbe fieldKey="title" validate={() => ['Too long', 'Invalid characters']} />
          <StoreGrabber
            onMount={(store) => {
              formStore = store;
            }}
          />
        </EventDialogFormProvider>,
      );

      await React.act(async () => {
        expect(await formStore!.validateAll()).to.equal(false);
      });
      expect(screen.getByRole('alert')).to.have.text('Too long');
    });

    it('should seed an absent key with the provided default value', async () => {
      let formStore: EventDialogFormStore | null = null;
      const { user } = render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{ title: '' }}>
          <FieldProbe fieldKey="notes" defaultValue="default" />
          <StoreGrabber
            onMount={(store) => {
              formStore = store;
            }}
          />
        </EventDialogFormProvider>,
      );

      expect(screen.getByLabelText('notes')).to.have.value('default');
      // An untouched default is not part of the dirty values.
      expect(formStore!.getDirtyValues()).to.deep.equal({});

      await user.type(screen.getByLabelText('notes'), '!');
      expect(formStore!.getDirtyValues()).to.deep.equal({ notes: 'default!' });
    });

    it('should keep the value from the seed over the default value', () => {
      render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{ notes: 'from-model' }}>
          <FieldProbe fieldKey="notes" defaultValue="default" />
        </EventDialogFormProvider>,
      );
      expect(screen.getByLabelText('notes')).to.have.value('from-model');
    });

    it('should not fall back to the default value when the field is reset to undefined', async () => {
      let formStore: EventDialogFormStore | null = null;
      render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{ title: '' }}>
          <FieldProbe fieldKey="notes" defaultValue="default" />
          <StoreGrabber
            onMount={(store) => {
              formStore = store;
            }}
          />
        </EventDialogFormProvider>,
      );
      expect(screen.getByLabelText('notes')).to.have.value('default');

      await React.act(async () => {
        formStore!.setValue('notes', undefined);
      });
      // The rendered value must match what would be submitted, not the default.
      expect(screen.getByLabelText('notes')).to.have.value('');
      expect(formStore!.getDirtyValues()).to.deep.equal({ notes: undefined });
    });

    it('should not re-render a field bound to another key when a field is written', async () => {
      const onTitleRender = spy();
      const onPriorityRender = spy();
      const { user } = render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{ title: '', priority: '' }}>
          <FieldProbe fieldKey="title" onRender={onTitleRender} />
          <FieldProbe fieldKey="priority" onRender={onPriorityRender} />
        </EventDialogFormProvider>,
      );

      const priorityRendersAfterMount = onPriorityRender.callCount;
      await user.type(screen.getByLabelText('title'), 'S');

      expect(onTitleRender.callCount).to.be.greaterThan(1);
      expect(onPriorityRender.callCount).to.equal(priorityRendersAfterMount);
    });

    it('should warn when the key is a built-in event property not handled by the form', () => {
      expect(() => {
        render(
          <EventDialogFormProvider {...sessionParameters} initialValues={{}}>
            <FieldProbe fieldKey="timezone" />
          </EventDialogFormProvider>,
        );
      }).toWarnDev(['MUI X Scheduler: useEventDialogFormField() received the key "timezone"']);
    });

    it('should not warn for a built-in form key or a custom key', () => {
      render(
        <EventDialogFormProvider
          {...sessionParameters}
          initialValues={{ title: '', priority: 'high' }}
        >
          <FieldProbe fieldKey="title" />
          <FieldProbe fieldKey="priority" />
        </EventDialogFormProvider>,
      );
    });

    it('should warn when a built-in form key receives a defaultValue', () => {
      expect(() => {
        render(
          <EventDialogFormProvider {...sessionParameters} initialValues={{ title: 'Meeting' }}>
            <FieldProbe fieldKey="title" defaultValue="Untitled" />
          </EventDialogFormProvider>,
        );
      }).toWarnDev([
        'MUI X Scheduler: useEventDialogFormField() received a `defaultValue` for the built-in key "title".',
      ]);
    });

    it('should not warn when a custom key receives a defaultValue', () => {
      render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{}}>
          <FieldProbe fieldKey="priority" defaultValue="normal" />
        </EventDialogFormProvider>,
      );
    });

    it('should unregister the validator when the section unmounts', async () => {
      let formStore: EventDialogFormStore | null = null;
      const grabber = (
        <StoreGrabber
          onMount={(store) => {
            formStore = store;
          }}
        />
      );
      const { setProps } = render(
        <EventDialogFormProvider {...sessionParameters} initialValues={{ title: '' }}>
          {grabber}
          <FieldProbe fieldKey="title" validate={() => 'Required'} />
        </EventDialogFormProvider>,
      );

      await React.act(async () => {
        expect(await formStore!.validateAll()).to.equal(false);
      });

      setProps({ children: grabber });

      await React.act(async () => {
        expect(await formStore!.validateAll()).to.equal(true);
      });
    });
  });

  describe('useEventDialogFormContext', () => {
    it('should throw when used outside of the provider', () => {
      const errorRef = React.createRef<any>();

      const errorMessage1 =
        'MUI X Scheduler: The component must be rendered inside the event dialog form.';
      const errorMessage2 = 'The above error occurred in the <Consumer> component';
      const expectedError = reactMajor < 19 ? [errorMessage2] : [errorMessage1];

      function Consumer() {
        useEventDialogFormContext();
        return null;
      }

      expect(() =>
        render(
          <ErrorBoundary ref={errorRef}>
            <Consumer />
          </ErrorBoundary>,
        ),
      ).toErrorDev(expectedError);

      expect((errorRef.current as any).errors).to.have.length(1);
      expect((errorRef.current as any).errors[0].toString()).to.include(errorMessage1);
    });
  });

  describe('EventDialogFormProvider', () => {
    it('should notify onValuesChange when a field is written', async () => {
      const changes: Array<[Record<string, unknown>, string[]]> = [];
      const { user } = render(
        <EventDialogFormProvider
          {...sessionParameters}
          initialValues={{ title: '' }}
          onValuesChange={(values, changedKeys) => changes.push([values, changedKeys])}
        >
          <FieldProbe fieldKey="title" />
        </EventDialogFormProvider>,
      );

      await user.type(screen.getByLabelText('title'), 'S');
      expect(changes).to.deep.equal([[{ title: 'S' }, ['title']]]);
    });
  });
});
