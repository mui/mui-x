'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { Field } from '@base-ui-components/react/field';
import { Form } from '@base-ui-components/react/form';
import { Input } from '@base-ui-components/react/input';
import { Select } from '@base-ui-components/react/select';
import { Separator } from '@base-ui-components/react/separator';
import { ChevronDown } from 'lucide-react';
import {
  CalendarEventOccurrence,
  CalendarEventUpdatedProperties,
  CalendarProcessedDate,
  CalendarResourceId,
  RecurringEventFrequency,
  RecurringEventRecurrenceRule,
} from '@mui/x-scheduler-headless/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { DEFAULT_EVENT_COLOR } from '@mui/x-scheduler-headless/constants';
import {
  schedulerEventSelectors,
  schedulerOccurrencePlaceholderSelectors,
  schedulerRecurringEventSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { Tabs } from '@base-ui-components/react/tabs';
import { useTranslations } from '../../../utils/TranslationsContext';
import { getColorClassName } from '../../../utils/color-utils';
import { computeRange, ControlledValue, isSameRRule, validateRange } from '../utils';

import EventPopoverHeader from '../EventPopoverHeader';
import GeneralTab from './GeneralTab';
import RecurrenceTab from './RecurrenceTab';

interface FormContentProps {
  occurrence: CalendarEventOccurrence;
  onClose: () => void;
}

export default function FormContent(props: FormContentProps) {
  const { occurrence, onClose } = props;

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
  const resources = useStore(store, schedulerResourceSelectors.processedResourceList);
  const recurrencePresets = useStore(
    store,
    schedulerRecurringEventSelectors.presets,
    occurrence.start,
  );
  const defaultRecurrencePresetKey = useStore(
    store,
    schedulerRecurringEventSelectors.defaultPresetKey,
    occurrence.rrule,
    occurrence.start,
  );

  // State hooks
  const [errors, setErrors] = React.useState<Form.Props['errors']>({});
  const [controlled, setControlled] = React.useState<ControlledValue>(() => {
    const fmtDate = (d: CalendarProcessedDate) => adapter.formatByString(d.value, 'yyyy-MM-dd');
    const fmtTime = (d: CalendarProcessedDate) => adapter.formatByString(d.value, 'HH:mm');

    const base = defaultRecurrencePresetKey === 'custom' ? occurrence.rrule : undefined;

    return {
      startDate: fmtDate(occurrence.start),
      endDate: fmtDate(occurrence.end),
      startTime: fmtTime(occurrence.start),
      endTime: fmtTime(occurrence.end),
      resourceId: occurrence.resource ?? null,
      allDay: !!occurrence.allDay,
      recurrenceSelection: defaultRecurrencePresetKey,
      rruleDraft: {
        freq: (base?.freq ?? 'DAILY') as RecurringEventFrequency,
        interval: base?.interval ?? 1,
        byDay: base?.byDay ?? [],
        byMonthDay: base?.byMonthDay ?? [],
        ...(base?.count ? { count: base.count } : {}),
        ...(base?.until ? { until: base.until } : {}),
      },
    };
  });

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

  const handleResourceChange = (value: CalendarResourceId | null) => {
    const newState = { ...controlled, resourceId: value };
    pushPlaceholder(newState);
    setControlled(newState);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { start, end } = computeRange(adapter, controlled);

    const form = new FormData(event.currentTarget);

    setErrors({});
    const err = validateRange(adapter, start, end, controlled.allDay);
    if (err) {
      setErrors({ [err.field]: translations.startDateAfterEndDateError });
      return;
    }

    const metaChanges = {
      title: (form.get('title') as string).trim(),
      description: (form.get('description') as string).trim(),
      allDay: controlled.allDay,
      resource: controlled.resourceId === null ? undefined : controlled.resourceId,
    };

    let rruleToSubmit: RecurringEventRecurrenceRule | undefined;
    if (controlled.recurrenceSelection === null) {
      rruleToSubmit = undefined;
    } else if (controlled.recurrenceSelection === 'custom') {
      rruleToSubmit = {
        ...controlled.rruleDraft,
      };
    } else {
      rruleToSubmit = recurrencePresets[controlled.recurrenceSelection];
    }

    if (rawPlaceholder?.type === 'creation') {
      store.createEvent({
        id: crypto.randomUUID(),
        ...metaChanges,
        start,
        end,
        rrule: rruleToSubmit,
      });
    } else if (occurrence.rrule) {
      const recurrenceModified = !isSameRRule(adapter, occurrence.rrule, rruleToSubmit);
      const changes: CalendarEventUpdatedProperties = {
        ...metaChanges,
        id: occurrence.id,
        start,
        end,
        ...(recurrenceModified ? { rrule: rruleToSubmit } : {}),
      };

      await store.updateRecurringEvent({
        occurrenceStart: occurrence.start.value,
        changes,
        onSubmit: onClose,
      });
    } else {
      store.updateEvent({ id: occurrence.id, ...metaChanges, start, end, rrule: rruleToSubmit });
    }

    onClose();
  };

  const handleDelete = () => {
    store.deleteEvent(occurrence.id);
    onClose();
  };

  const resourcesOptions = React.useMemo(() => {
    return [
      { label: translations.labelNoResource, value: null, eventColor: DEFAULT_EVENT_COLOR },
      ...resources.map((resource) => ({
        label: resource.title,
        value: resource.id,
        eventColor: resource.eventColor,
      })),
    ];
  }, [resources, translations.labelNoResource]);

  return (
    <Form errors={errors} onClearErrors={setErrors} onSubmit={handleSubmit}>
      <EventPopoverHeader>
        <Field.Root className="EventPopoverFieldRoot" name="title">
          <Field.Label className="EventPopoverTitle">
            <Input
              className="EventPopoverTitleInput"
              type="text"
              defaultValue={occurrence.title}
              aria-label={translations.eventTitleAriaLabel}
              required
              readOnly={isPropertyReadOnly('title')}
            />
          </Field.Label>
          <Field.Error className="EventPopoverRequiredFieldError" />
        </Field.Root>
        <Field.Root className="EventPopoverFieldRoot" name="resource">
          <Select.Root
            items={resourcesOptions}
            value={controlled.resourceId}
            onValueChange={handleResourceChange}
            readOnly={isPropertyReadOnly('resource')}
          >
            <Select.Trigger
              className="EventPopoverSelectTrigger Ghost"
              aria-label={translations.resourceLabel}
            >
              <Select.Value>
                {(value: string | null) => {
                  const selected = resourcesOptions.find((option) => option.value === value);

                  return (
                    <div className="EventPopoverSelectItemTitleWrapper">
                      <span
                        className={clsx(
                          'ResourceLegendColor',
                          getColorClassName(selected?.eventColor ?? DEFAULT_EVENT_COLOR),
                        )}
                      />
                      <span>{value ? selected?.label : translations.labelNoResource}</span>
                    </div>
                  );
                }}
              </Select.Value>
              <Select.Icon className="EventPopoverSelectIcon">
                <ChevronDown size={14} />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner
                alignItemWithTrigger={false}
                align="start"
                className="EventPopoverSelectPositioner"
              >
                <Select.Popup className="EventPopoverSelectPopup">
                  {resourcesOptions.map((resource) => (
                    <Select.Item
                      key={resource.value}
                      value={resource.value}
                      className="EventPopoverSelectItem"
                    >
                      <div className="EventPopoverSelectItemTitleWrapper">
                        <span
                          className={clsx(
                            'ResourceLegendColor',
                            getColorClassName(resource.eventColor ?? DEFAULT_EVENT_COLOR),
                          )}
                        />
                        <Select.ItemText className="EventPopoverSelectItemText">
                          {resource.label}
                        </Select.ItemText>
                      </div>
                    </Select.Item>
                  ))}
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </Field.Root>
      </EventPopoverHeader>
      <Tabs.Root defaultValue="general">
        <Tabs.List className="EventPopoverTabsList">
          <Tabs.Tab value="general" className="EventPopoverTabTrigger Ghost">
            {translations.generalTabLabel}
          </Tabs.Tab>
          <Tabs.Tab value="recurrence" className="EventPopoverTabTrigger Ghost">
            {translations.recurrenceTabLabel}
          </Tabs.Tab>
        </Tabs.List>
        <GeneralTab
          occurrence={occurrence}
          setErrors={setErrors}
          controlled={controlled}
          setControlled={setControlled}
        />
        <RecurrenceTab
          occurrence={occurrence}
          controlled={controlled}
          setControlled={setControlled}
        />
      </Tabs.Root>
      <Separator className="EventPopoverSeparator" />
      <div className="EventPopoverActions">
        <button
          className={clsx('SecondaryErrorButton', 'Button')}
          type="button"
          onClick={handleDelete}
        >
          {translations.deleteEvent}
        </button>
        <button className={clsx('NeutralButton', 'Button')} type="submit">
          {translations.saveChanges}
        </button>
      </div>
    </Form>
  );
}
