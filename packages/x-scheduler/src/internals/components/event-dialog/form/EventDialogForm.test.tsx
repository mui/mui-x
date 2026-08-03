import * as React from 'react';
import { ErrorBoundary, reactMajor, screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { EventDialogFormProvider, useEventDialogFormContext } from './EventDialogFormContext';
import { useField } from './useField';
import type { EventDialogFormStore } from './EventDialogFormStore';

describe('EventDialogForm', () => {
  const { render } = createSchedulerRenderer();

  interface FieldProbeProps {
    fieldKey: string;
    validate?: (value: unknown) => string | string[] | null;
  }

  function FieldProbe(props: FieldProbeProps) {
    const { fieldKey, validate } = props;
    const { value, setValue, error } = useField<string>(fieldKey, { validate });
    return (
      <React.Fragment>
        <input
          aria-label={fieldKey}
          value={value ?? ''}
          onChange={(event) => setValue(event.target.value)}
        />
        {error && <p role="alert">{error}</p>}
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

  describe('useField', () => {
    it('should read the seeded value', () => {
      render(
        <EventDialogFormProvider initialValues={{ title: 'Meeting' }}>
          <FieldProbe fieldKey="title" />
        </EventDialogFormProvider>,
      );
      expect(screen.getByLabelText('title')).to.have.value('Meeting');
    });

    it('should write the value through setValue', async () => {
      const { user } = render(
        <EventDialogFormProvider initialValues={{ title: '' }}>
          <FieldProbe fieldKey="title" />
        </EventDialogFormProvider>,
      );
      await user.type(screen.getByLabelText('title'), 'Standup');
      expect(screen.getByLabelText('title')).to.have.value('Standup');
    });

    it('should expose the field error after a failed validateAll', async () => {
      let formStore: EventDialogFormStore | null = null;
      render(
        <EventDialogFormProvider initialValues={{ title: '' }}>
          <FieldProbe fieldKey="title" validate={(value) => (value ? null : 'Required')} />
          <StoreGrabber
            onMount={(store) => {
              formStore = store;
            }}
          />
        </EventDialogFormProvider>,
      );

      React.act(() => {
        expect(formStore!.validateAll()).to.equal(false);
      });
      expect(screen.getByRole('alert')).to.have.text('Required');
    });

    it('should clear the field error when the field is written', async () => {
      let formStore: EventDialogFormStore | null = null;
      const { user } = render(
        <EventDialogFormProvider initialValues={{ title: '' }}>
          <FieldProbe fieldKey="title" validate={(value) => (value ? null : 'Required')} />
          <StoreGrabber
            onMount={(store) => {
              formStore = store;
            }}
          />
        </EventDialogFormProvider>,
      );

      React.act(() => {
        formStore!.validateAll();
      });
      expect(screen.getByRole('alert')).to.have.text('Required');

      await user.type(screen.getByLabelText('title'), 'S');
      expect(screen.queryByRole('alert')).to.equal(null);
    });

    it('should unregister the validator when the section unmounts', () => {
      let formStore: EventDialogFormStore | null = null;
      const grabber = (
        <StoreGrabber
          onMount={(store) => {
            formStore = store;
          }}
        />
      );
      const { setProps } = render(
        <EventDialogFormProvider initialValues={{ title: '' }}>
          {grabber}
          <FieldProbe fieldKey="title" validate={() => 'Required'} />
        </EventDialogFormProvider>,
      );

      React.act(() => {
        expect(formStore!.validateAll()).to.equal(false);
      });

      setProps({ children: grabber });

      React.act(() => {
        expect(formStore!.validateAll()).to.equal(true);
      });
    });
  });

  describe('useEventDialogFormContext', () => {
    it('should throw when used outside of the provider', () => {
      const errorRef = React.createRef<any>();

      const errorMessage1 =
        'MUI X Scheduler: useEventDialogFormContext must be used within an <EventDialogFormProvider />';
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
