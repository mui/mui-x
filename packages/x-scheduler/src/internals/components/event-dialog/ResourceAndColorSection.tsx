'use client';
import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { styled } from '@mui/material/styles';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { EVENT_COLORS } from '@mui/x-scheduler-internals/constants';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import type { SchedulerEventColor, SchedulerResourceId } from '@mui/x-scheduler-internals/models';
import { useStore } from '@base-ui/utils/store';
import type { PaletteName } from '../../utils/tokens';
import { getPaletteVariants } from '../../utils/tokens';
import { useEventDialogStyledContext } from './EventDialogStyledContext';
import type { EventDialogSectionProps } from './utils';
import { SectionFieldset, SectionHeaderTitle } from './SectionFieldset';
import { usePushPlaceholder } from './usePushPlaceholder';

const NO_RESOURCE_VALUE = '';

const ResourceMenuItem = styled(MenuItem, {
  name: 'MuiEventDialog',
  slot: 'ResourceMenuItem',
})(({ theme }) => ({
  paddingLeft: `calc(${theme.spacing(2)} + var(--resource-indent) * ${theme.spacing(2)})`,
}));

const ResourceMenuListSubheader = styled(ListSubheader, {
  name: 'MuiEventDialog',
  slot: 'ResourceMenuListSubheader',
})({});

const ResourceMenuColorDot = styled('span', {
  name: 'MuiEventDialog',
  slot: 'ResourceMenuColorDot',
})(({ theme }) => ({
  width: 14,
  height: 14,
  borderRadius: '2px',
  flexShrink: 0,
  backgroundColor: 'var(--event-main)',
  variants: getPaletteVariants(theme),
  [`&[data-no-resource="true"]`]: {
    backgroundColor: 'var(--event-surface-subtle)',
    border: '1.2px dashed var(--event-main)',
  },
}));

const ResourceMenuColorToggleGroup = styled(ToggleGroup, {
  name: 'MuiEventDialog',
  slot: 'ResourceMenuColorToggleGroup',
})(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const ResourceMenuColorToggle = styled(Toggle, {
  name: 'MuiEventDialog',
  slot: 'ResourceMenuColorToggle',
})<{ palette?: PaletteName }>(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: theme.shape.borderRadius,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--event-main)',
  color: 'white',
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  variants: getPaletteVariants(theme),
}));

interface ResourceSelectAdornmentProps {
  resource: ResourceOptionType | null;
}

interface ResourceOptionType {
  label: string;
  value: string | null;
  eventColor: SchedulerEventColor;
  isGroupRoot: boolean;
  indentLevel: number;
  showDivider: boolean;
  hidden?: boolean;
}

function ResourceSelectAdornment(props: ResourceSelectAdornmentProps) {
  const { resource } = props;

  const store = useSchedulerStoreContext();
  const { classes } = useEventDialogStyledContext();
  const resourceColor = useStore(
    store,
    schedulerResourceSelectors.defaultEventColor,
    resource?.value,
  );

  return (
    <ResourceMenuColorDot
      className={classes.eventDialogResourceMenuColorDot}
      data-palette={resourceColor}
      data-no-resource={Boolean(resource?.value === null)}
    />
  );
}

export default function ResourceAndColorSection(props: EventDialogSectionProps) {
  const { occurrence, controlled, setControlled, errors, setErrors } = props;

  // Context hooks
  const { schedulerId, classes, localeText } = useEventDialogStyledContext();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const resources = useStore(store, schedulerResourceSelectors.processedResourceFlatList);
  const resourceDepthLookup = useStore(store, schedulerResourceSelectors.resourceDepthLookup);
  const childrenIdLookup = useStore(store, schedulerResourceSelectors.childrenIdLookup);
  const eventDefaultColor = useStore(store, schedulerOtherSelectors.defaultEventColor);
  const shouldEventRequireResource = useStore(
    store,
    schedulerOtherSelectors.shouldEventRequireResource,
  );
  const isPropertyReadOnly = useStore(
    store,
    schedulerEventSelectors.isPropertyReadOnly,
    occurrence.id,
  );

  const pushPlaceholder = usePushPlaceholder();

  const readOnly = isPropertyReadOnly('resource');
  const { resourceId, color } = controlled;
  const error =
    shouldEventRequireResource && typeof errors.resource === 'string' ? errors.resource : undefined;

  const handleResourceChange = (newResource: SchedulerResourceId | null) => {
    const nextErrors = { ...errors };
    delete nextErrors.resource;
    setErrors(nextErrors);
    const newState = { ...controlled, resourceId: newResource };
    pushPlaceholder(newState);
    setControlled(newState);
  };

  const handleColorChange = (newColor: SchedulerEventColor | null) => {
    const newState = { ...controlled, color: newColor };
    pushPlaceholder(newState);
    setControlled(newState);
  };

  const resourcesOptions = React.useMemo((): ResourceOptionType[] => {
    const hasNesting = resources.some(
      (resource) => (childrenIdLookup.get(resource.id)?.length ?? 0) > 0,
    );

    const firstTopLevelIndex = resources.findIndex(
      (resource) => (resourceDepthLookup.get(resource.id) ?? 0) === 0,
    );
    return [
      // The no-resource option must stay in the rendered options list so MUI Select's
      // `value=""` keeps matching a MenuItem when an event has no resource yet — otherwise
      // MUI logs an "out-of-range value" warning. It's hidden from the menu when
      // `shouldEventRequireResource` is `true` so the user can't pick it.
      {
        label: localeText.labelNoResource,
        value: null,
        eventColor: eventDefaultColor,
        isGroupRoot: false,
        indentLevel: 0,
        showDivider: false,
        hidden: shouldEventRequireResource,
      },
      ...resources.map((resource, index) => {
        const depth = resourceDepthLookup.get(resource.id) ?? 0;
        const hasChildren = (childrenIdLookup.get(resource.id)?.length ?? 0) > 0;
        const isTopLevel = depth === 0;
        // Skip the divider above the first top-level group when nothing precedes it visually
        // (the no-resource option is hidden).
        const isFirstTopLevel = index === firstTopLevelIndex;
        const showDivider =
          hasNesting && isTopLevel && (!isFirstTopLevel || !shouldEventRequireResource);
        return {
          label: resource.title,
          value: resource.id,
          eventColor: resource.eventColor ?? eventDefaultColor,
          isGroupRoot: isTopLevel && hasChildren,
          indentLevel: Math.max(0, depth - 1),
          showDivider,
        };
      }),
    ];
  }, [
    resources,
    resourceDepthLookup,
    childrenIdLookup,
    localeText.labelNoResource,
    eventDefaultColor,
    shouldEventRequireResource,
  ]);

  const resource = React.useMemo(
    () =>
      resourcesOptions.find((option) =>
        resourceId ? option.value === resourceId : option.value === null,
      ) || null,
    [resourcesOptions, resourceId],
  );

  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    handleResourceChange(value === NO_RESOURCE_VALUE ? null : (value as SchedulerResourceId));
  };

  const errorId = `${schedulerId}-resource-error`;

  return (
    <SectionFieldset className={classes.eventDialogSectionFieldset}>
      <SectionHeaderTitle className={classes.eventDialogSectionHeaderTitle}>
        {localeText.resourceColorSectionLabel}
      </SectionHeaderTitle>
      <FormControl size="small" fullWidth error={!!error}>
        <InputLabel id={`${schedulerId}-resource-select-label`}>
          {localeText.resourceLabel}
        </InputLabel>
        <Select
          labelId={`${schedulerId}-resource-select-label`}
          label={localeText.resourceLabel}
          value={resourceId ?? NO_RESOURCE_VALUE}
          displayEmpty
          onChange={handleChange}
          readOnly={readOnly}
          aria-describedby={error ? errorId : undefined}
          startAdornment={
            <InputAdornment position="start">
              <ResourceSelectAdornment resource={resource} />
            </InputAdornment>
          }
          renderValue={() => {
            if (resource) {
              return resource.label;
            }
            // `resourceId == null` means the resource is unset, not invalid.
            if (resourceId == null) {
              return localeText.labelNoResource;
            }
            return localeText.labelInvalidResource;
          }}
        >
          {resourcesOptions.flatMap((resourceOption) => {
            const items: React.ReactNode[] = [];

            if (resourceOption.showDivider) {
              items.push(<Divider key={`divider-${resourceOption.value}`} />);
            }

            if (resourceOption.isGroupRoot) {
              items.push(
                <ResourceMenuListSubheader
                  key={`header-${resourceOption.value}`}
                  className={classes.eventDialogResourceMenuListSubheader}
                >
                  {resourceOption.label.toUpperCase()}
                </ResourceMenuListSubheader>,
              );
            }

            items.push(
              <ResourceMenuItem
                key={resourceOption.value ?? NO_RESOURCE_VALUE}
                value={resourceOption.value ?? NO_RESOURCE_VALUE}
                aria-label={resourceOption.label}
                className={classes.eventDialogResourceMenuItem}
                style={
                  {
                    '--resource-indent': resourceOption.indentLevel,
                    ...(resourceOption.hidden && { display: 'none' }),
                  } as React.CSSProperties
                }
              >
                <ListItemIcon>
                  <ResourceMenuColorDot
                    className={classes.eventDialogResourceMenuColorDot}
                    data-palette={resourceOption.eventColor}
                    data-no-resource={Boolean(resourceOption.value === null)}
                  />
                </ListItemIcon>
                <ListItemText>{resourceOption.label}</ListItemText>
              </ResourceMenuItem>,
            );

            return items;
          })}
        </Select>
        {error && (
          <FormHelperText id={errorId} role="alert">
            {error}
          </FormHelperText>
        )}
      </FormControl>
      <ResourceMenuColorToggleGroup
        value={color ? [color] : []}
        onValueChange={(values) => {
          const next = values[values.length - 1] as SchedulerEventColor | undefined;
          handleColorChange(next ?? null);
        }}
        aria-label={localeText.colorPickerLabel}
        disabled={readOnly}
        className={classes.eventDialogResourceMenuColorToggleGroup}
      >
        {EVENT_COLORS.map((colorOption) => (
          <ResourceMenuColorToggle
            key={colorOption}
            value={colorOption}
            aria-label={localeText.selectColorAriaLabel(colorOption)}
            data-palette={colorOption}
            className={classes.eventDialogResourceMenuColorToggle}
          >
            {color === colorOption && <CheckIcon fontSize="small" />}
          </ResourceMenuColorToggle>
        ))}
      </ResourceMenuColorToggleGroup>
    </SectionFieldset>
  );
}
