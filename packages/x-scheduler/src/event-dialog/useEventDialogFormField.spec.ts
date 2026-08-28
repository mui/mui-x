import type { SchedulerEventColor, SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import { useEventDialogFormField } from './useEventDialogFormField';

// Built-in keys resolve to their actual value type without an explicit generic.
export function BuiltInKeys() {
  const title = useEventDialogFormField('title');
  const titleValue: string = title.value;
  title.setValue('ok');
  // @ts-expect-error the title field holds a string
  title.setValue(42);

  const allDay = useEventDialogFormField('allDay');
  const allDayValue: boolean = allDay.value;

  const resourceIds = useEventDialogFormField('resourceIds');
  const ids: SchedulerResourceId[] = resourceIds.value;

  const color = useEventDialogFormField('color');
  const colorValue: SchedulerEventColor | null = color.value;

  return { titleValue, allDayValue, ids, colorValue };
}

// A custom field can always be `undefined`: `setValue(undefined)` submits the
// removal of the stored property, also when a `defaultValue` seeded the field.
export function CustomKeys() {
  const seeded = useEventDialogFormField('room', { defaultValue: '' });
  const seededValue: string | undefined = seeded.value;
  // @ts-expect-error the value can be undefined again after setValue(undefined)
  const seededUnsound: string = seeded.value;

  // Explicit typing supplies the key literal first, so the guard still sees it.
  const explicit = useEventDialogFormField<'room', string>('room', { defaultValue: '' });
  const explicitValue: string | undefined = explicit.value;

  // A custom field accepts an explicit undefined write (submitted as the removal).
  seeded.setValue(undefined);

  const unseeded = useEventDialogFormField<'room', string>('room');
  // @ts-expect-error without a defaultValue the value can be undefined
  const unseededValue: string = unseeded.value;

  // The validator can receive undefined, with or without a defaultValue.
  useEventDialogFormField<'room', string>('room', {
    validate: (value) => (value === undefined ? 'Missing' : null),
  });
  useEventDialogFormField('room', {
    defaultValue: '',
    validate: (value) => (value === undefined ? 'Missing' : null),
  });

  return { seededValue, seededUnsound, explicitValue, unseededValue };
}

// Known limitation, kept compiling on purpose: a single explicit type argument
// supplies the KEY type, so a wide string compiles and leaves the value
// `unknown`. If this line ever errors, the guard got stronger.
export function KnownLimitations() {
  const wideKey = useEventDialogFormField<string>('room');
  // @ts-expect-error the value stays unknown without a key literal or a value type
  const wideValue: string = wideKey.value;
  return { wideKey, wideValue };
}

// A mistyped parameter on a built-in key must error instead of silently
// falling through to the custom-key overload, and the reserved event
// properties must not type-check as custom keys.
export function RejectedCalls(condition: boolean) {
  // @ts-expect-error the title defaultValue cannot retype the field
  useEventDialogFormField('title', { defaultValue: 123 });
  // @ts-expect-error a built-in key rejects a defaultValue-driven generic
  useEventDialogFormField('allDay', { defaultValue: 'yes' });
  // @ts-expect-error built-in keys are seeded from the event, a defaultValue is never applied
  useEventDialogFormField('title', { defaultValue: 'x' });
  // @ts-expect-error a union mixing built-in and custom keys is rejected
  useEventDialogFormField(condition ? 'title' : 'room', { defaultValue: 42 });
  // @ts-expect-error `id` is a reserved event property, dropped on save
  useEventDialogFormField('id');
  // @ts-expect-error `timezone` is a reserved event property, dropped on save
  useEventDialogFormField('timezone', { defaultValue: 'UTC' });
  // @ts-expect-error `readOnly` is a reserved event property, dropped on save
  useEventDialogFormField('readOnly');
  // @ts-expect-error an explicit value type cannot retype a built-in field
  useEventDialogFormField<number>('title', { defaultValue: 123 });
  // @ts-expect-error an explicit value type cannot bypass the key guard
  useEventDialogFormField<number, string>('title');
}
