'use client';
import * as React from 'react';
import clsx from 'clsx';
import { CheckIcon, ChevronDown } from 'lucide-react';
import { Menu } from '@base-ui-components/react/menu';
import { DEFAULT_EVENT_COLOR, EVENT_COLORS } from '@mui/x-scheduler-headless/constants';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { schedulerResourceSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { SchedulerEventColor, SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import { useStore } from '@base-ui-components/utils/store';
import { useTranslations } from '../../utils/TranslationsContext';
import { getColorClassName } from '../../utils/color-utils';

interface ResourceSelectProps {
  readOnly?: boolean;
  resourceId: string | null;
  onResourceChange: (value: SchedulerResourceId) => void;
  onColorChange: (value: SchedulerEventColor) => void;
  color: SchedulerEventColor | null;
}

interface ResourceMenuTriggerContentProps {
  resource: ResourceOptionType | null;
  color: SchedulerEventColor | null;
}

interface ResourceOptionType {
  label: string;
  value: string | null;
  eventColor?: SchedulerEventColor;
}

function ResourceMenuTriggerContent(props: ResourceMenuTriggerContentProps) {
  const { resource, color } = props;

  const resourceColor = resource?.eventColor || DEFAULT_EVENT_COLOR;

  return (
    <div className="EventPopoverResourceLegendContainer">
      <span className={clsx('ResourceLegendColor', getColorClassName(resourceColor))} />

      {color && resourceColor !== color && (
        <span className={clsx('ResourceLegendColor', getColorClassName(color))} />
      )}
    </div>
  );
}

export default function ResourceMenu(props: ResourceSelectProps) {
  const { readOnly, resourceId, onResourceChange, onColorChange, color } = props;

  // Context hooks
  const translations = useTranslations();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const resources = useStore(store, schedulerResourceSelectors.processedResourceFlatList);

  const resourcesOptions = React.useMemo((): ResourceOptionType[] => {
    return [
      { label: translations.labelNoResource, value: null, eventColor: DEFAULT_EVENT_COLOR },
      ...resources.map((resource) => ({
        label: resource.title,
        value: resource.id,
        eventColor: resource.eventColor,
      })),
    ];
  }, [resources, translations.labelNoResource]);

  const resource = React.useMemo(() => {
    return resourcesOptions.find((option) => option.value === resourceId) || null;
  }, [resourcesOptions, resourceId]);

  return (
    <Menu.Root>
      <Menu.Trigger
        className="Button Ghost EventPopoverMenuTrigger"
        aria-label={translations.resourceLabel}
      >
        <ResourceMenuTriggerContent resource={resource} color={color} />
        <span>{resourceId ? resource?.label : translations.labelNoResource}</span>
        <ChevronDown size={14} />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="start" className="EventPopoverSelectPositioner">
          <Menu.Popup className="EventPopoverSelectPopup">
            <Menu.Group>
              <Menu.GroupLabel className="MenuGroupLabel">Resources</Menu.GroupLabel>
              <Menu.RadioGroup
                value={resourceId}
                onValueChange={onResourceChange}
                disabled={readOnly}
              >
                {resourcesOptions.map((currentResource) => (
                  <Menu.RadioItem
                    key={currentResource.value}
                    value={currentResource.value}
                    className="EventPopoverMenuItem"
                    aria-label={currentResource.label}
                  >
                    <div className="EventPopoverMenuItemTitleWrapper">
                      <span
                        className={clsx(
                          'ResourceLegendColor',
                          getColorClassName(currentResource.eventColor ?? DEFAULT_EVENT_COLOR),
                        )}
                      />
                      <span className="EventPopoverSelectItemText">{currentResource.label}</span>
                    </div>
                    <Menu.RadioItemIndicator className="CheckboxIndicator">
                      <CheckIcon size={16} strokeWidth={1.5} />
                    </Menu.RadioItemIndicator>
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Group>
            <Menu.Group>
              <Menu.GroupLabel className="MenuGroupLabel">Colors</Menu.GroupLabel>
              <Menu.RadioGroup
                value={color}
                onValueChange={onColorChange}
                disabled={readOnly}
                className="ColorRadioGroup"
              >
                {EVENT_COLORS.map((currentColor) => (
                  <Menu.RadioItem
                    key={currentColor}
                    value={currentColor}
                    className="EventPopoverColorMenuItem"
                    aria-label={currentColor}
                  >
                    <div
                      className={clsx(
                        'ColorRadioItemCircle',
                        getColorClassName(color ?? DEFAULT_EVENT_COLOR),
                      )}
                    >
                      <Menu.RadioItemIndicator className="CheckboxIndicator">
                        <CheckIcon size={14} strokeWidth={1.5} />
                      </Menu.RadioItemIndicator>
                    </div>
                  </Menu.RadioItem>
                ))}
              </Menu.RadioGroup>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
