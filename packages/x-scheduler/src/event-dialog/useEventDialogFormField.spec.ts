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

// A custom key with a `defaultValue` always has a value; without one it can be `undefined`.
export function CustomKeys() {
  const seeded = useEventDialogFormField('room', { defaultValue: '' });
  const seededValue: string = seeded.value;

  const explicit = useEventDialogFormField<string>('room', { defaultValue: '' });
  const explicitValue: string = explicit.value;

  // A custom field accepts an explicit undefined write (submitted as-is).
  seeded.setValue(undefined);

  const unseeded = useEventDialogFormField<string>('room');
  // @ts-expect-error without a defaultValue the value can be undefined
  const unseededValue: string = unseeded.value;

  return { seededValue, explicitValue, unseededValue };
}

// Known limitations of the built-in-key guard, kept compiling on purpose:
// an explicit type argument defaults K to string, and a union key distributes
// past the conditional. If these lines ever error, the guard got stronger.
export function KnownLimitations(condition: boolean) {
  const bypassed = useEventDialogFormField<number>('title', { defaultValue: 123 });
  const unionKey: 'title' | 'room' = condition ? 'title' : 'room';
  const union = useEventDialogFormField(unionKey, { defaultValue: 42 });
  return { bypassed, union };
}

// A mistyped parameter on a built-in key must error instead of silently
// falling through to the custom-key overloads.
export function RejectedCalls() {
  // @ts-expect-error the title defaultValue cannot retype the field
  useEventDialogFormField('title', { defaultValue: 123 });
  // @ts-expect-error a built-in key rejects a defaultValue-driven generic
  useEventDialogFormField('allDay', { defaultValue: 'yes' });
}
