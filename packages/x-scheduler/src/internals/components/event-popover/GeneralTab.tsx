'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { Checkbox } from '@base-ui-components/react/checkbox';
import { Field } from '@base-ui-components/react/field';
import { Form } from '@base-ui-components/react/form';
import { Input } from '@base-ui-components/react/input';
import { Separator } from '@base-ui-components/react/separator';
import { CheckIcon } from 'lucide-react';
import { CalendarEventOccurrence } from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { Tabs } from '@base-ui-components/react/tabs';
import { useTranslations } from '../../utils/TranslationsContext';
import { computeRange, ControlledValue } from './utils';

interface GeneralTabProps {
  occurrence: CalendarEventOccurrence;
  setErrors: (errors: Form.Props['errors']) => void;
  controlled: ControlledValue;
  setControlled: React.Dispatch<React.SetStateAction<ControlledValue>>;
}

export function GeneralTab(props: GeneralTabProps) {
  const { occurrence, setErrors, controlled, setControlled } = props;

  // Context hooks
  const adapter = useAdapter();
  const translations = useTranslations();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const isPropertyReadOnly = useStore(
    store,
    schedulerEventSelectors.isPropertyReadOnly,
    occurrence.id,
  );
  const rawPlaceholder = useStore(store, schedulerOccurrencePlaceholderSelectors.value);
  function pushPlaceholder(next: ControlledValue) {
    if (rawPlaceholder?.type !== 'creation') {
      return;
    }

    const { start, end, surfaceType } = computeRange(adapter, next);
    const surfaceTypeToUse = rawPlaceholder.lockSurfaceType
      ? rawPlaceholder.surfaceType
      : surfaceType;

    store.setOccurrencePlaceholder({
      type: 'creation',
      surfaceType: surfaceTypeToUse,
      resourceId: next.resourceId,
      start,
      end,
      lockSurfaceType: rawPlaceholder.lockSurfaceType,
    });
  }

  const createHandleChangeDateOrTimeField =
    (field: keyof ControlledValue) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.currentTarget.value;
      setErrors({});
      const newState = { ...controlled, [field]: value };
      pushPlaceholder(newState);
      setControlled(newState);
    };

  const handleToggleAllDay = (checked: boolean) => {
    const newState = { ...controlled, allDay: checked };
    pushPlaceholder(newState);
    setControlled(newState);
  };

  return (
    <Tabs.Panel value="general" keepMounted>
      <div className="EventPopoverMainContent">
        <div className="EventPopoverDateTimeFields">
          <div className="EventPopoverDateTimeFieldsStartRow">
            <Field.Root className="EventPopoverFieldRoot" name="startDate">
              <Field.Label className="EventPopoverFormLabel">
                {translations.startDateLabel}
                <Input
                  className="EventPopoverInput"
                  type="date"
                  value={controlled.startDate}
                  onChange={createHandleChangeDateOrTimeField('startDate')}
                  aria-describedby="startDate-error"
                  required
                  readOnly={isPropertyReadOnly('start')}
                />
              </Field.Label>
            </Field.Root>
            {!controlled.allDay && (
              <Field.Root className="EventPopoverFieldRoot" name="startTime">
                <Field.Label className="EventPopoverFormLabel">
                  {translations.startTimeLabel}
                  <Input
                    className="EventPopoverInput"
                    type="time"
                    value={controlled.startTime}
                    onChange={createHandleChangeDateOrTimeField('startTime')}
                    aria-describedby="startTime-error"
                    required
                    readOnly={isPropertyReadOnly('start')}
                  />
                </Field.Label>
              </Field.Root>
            )}
          </div>
          <div className="EventPopoverDateTimeFieldsEndRow">
            <Field.Root className="EventPopoverFieldRoot" name="endDate">
              <Field.Label className="EventPopoverFormLabel">
                {translations.endDateLabel}
                <Input
                  className="EventPopoverInput"
                  type="date"
                  value={controlled.endDate}
                  onChange={createHandleChangeDateOrTimeField('endDate')}
                  required
                  readOnly={isPropertyReadOnly('end')}
                />
              </Field.Label>
            </Field.Root>
            {!controlled.allDay && (
              <Field.Root className="EventPopoverFieldRoot" name="endTime">
                <Field.Label className="EventPopoverFormLabel">
                  {translations.endTimeLabel}
                  <Input
                    className="EventPopoverInput"
                    type="time"
                    value={controlled.endTime}
                    onChange={createHandleChangeDateOrTimeField('endTime')}
                    required
                    readOnly={isPropertyReadOnly('end')}
                  />
                </Field.Label>
              </Field.Root>
            )}
          </div>
          <Field.Root
            name="startDate"
            className="EventPopoverDateTimeFieldsError"
            id="startDate-error"
            aria-live="polite"
          >
            <Field.Error />
          </Field.Root>
          <Field.Root
            name="startTime"
            className="EventPopoverDateTimeFieldsError"
            id="startTime-error"
            aria-live="polite"
          >
            <Field.Error />
          </Field.Root>
          <Field.Root className="EventPopoverFieldRoot" name="allDay">
            <Field.Label className="AllDayCheckboxLabel">
              <Checkbox.Root
                className="AllDayCheckboxRoot"
                id="enable-all-day-checkbox"
                checked={controlled.allDay}
                onCheckedChange={handleToggleAllDay}
                readOnly={isPropertyReadOnly('allDay')}
              >
                <Checkbox.Indicator className="AllDayCheckboxIndicator">
                  <CheckIcon className="AllDayCheckboxIcon" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              {translations.allDayLabel}
            </Field.Label>
          </Field.Root>
        </div>
        <Separator className="EventPopoverSeparator" />
        <div>
          <Field.Root className="EventPopoverFieldRoot" name="description">
            <Field.Label className="EventPopoverFormLabel">
              {translations.descriptionLabel}
              <Input
                render={
                  <textarea
                    className="EventPopoverTextarea"
                    defaultValue={occurrence.description}
                    rows={5}
                  />
                }
                readOnly={isPropertyReadOnly('description')}
              />
            </Field.Label>
          </Field.Root>
        </div>
      </div>
    </Tabs.Panel>
  );
}
