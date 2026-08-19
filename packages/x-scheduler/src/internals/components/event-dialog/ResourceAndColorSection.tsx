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
import {
  useEventEditingOccurrence,
  useEventEditingResourceSelectionMode,
  useEventEditingStyledContext,
} from '../event-editing';
import { SectionFieldset, SectionHeaderTitle } from './SectionFieldset';
import { useEventDialogFormField } from './form/useEventDialogFormField';

// Only meaningful in single-select mode: the sentinel value backing the "no resource"
// MenuItem, so MUI Select's `value=""` always matches a rendered option — otherwise it logs
// an "out-of-range value" dev warning. Multi-select has no such item; clearing every entry
// reaches the empty array directly.
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
  /**
   * Whether the field has a selection at all. Kept separate from `resource` because
   * `resource` is also `null` when the selection references an id that isn't in `resources`
   * (e.g. a deleted resource) — that's an invalid selection, not an empty one, and shouldn't
   * render the "no resource" dashed dot.
   */
  hasSelection: boolean;
}

interface ResourceOptionType {
  label: string;
  value: string;
  eventColor: SchedulerEventColor;
  isGroupRoot: boolean;
  indentLevel: number;
  showDivider: boolean;
  hidden?: boolean;
}

function ResourceSelectAdornment(props: ResourceSelectAdornmentProps) {
  const { resource, hasSelection } = props;

  const store = useSchedulerStoreContext();
  const { classes } = useEventEditingStyledContext();
  const resourceColor = useStore(
    store,
    schedulerResourceSelectors.defaultEventColor,
    resource?.value,
  );

  return (
    <ResourceMenuColorDot
      className={classes.eventDialogResourceMenuColorDot}
      data-palette={resourceColor}
      data-no-resource={!hasSelection}
    />
  );
}

export default function ResourceAndColorSection() {
  // Context hooks
  const occurrence = useEventEditingOccurrence();
  // Whether the picker is single- or multi-select. Derived once by `FormContent`, alongside
  // the form's `initialValues` — the same value also decides what `handleSubmit` writes, so
  // both must read the exact same "captured at mount" answer. See `getResourceSelectionMode`.
  const mode = useEventEditingResourceSelectionMode();
  const { schedulerId, classes, localeText } = useEventEditingStyledContext();
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

  const resourceField = useEventDialogFormField<SchedulerResourceId[]>('resourceIds', {
    validate: (value) =>
      shouldEventRequireResource && value.length === 0 ? localeText.requiredResourceError : null,
  });
  const colorField = useEventDialogFormField<SchedulerEventColor | null>('color');

  const readOnly = isPropertyReadOnly('resource');
  const { value: resourceIds } = resourceField;
  const { value: color } = colorField;
  const error = shouldEventRequireResource ? resourceField.error : undefined;

  const resourcesOptions = React.useMemo((): ResourceOptionType[] => {
    const hasNesting = resources.some(
      (resource) => (childrenIdLookup.get(resource.id)?.length ?? 0) > 0,
    );

    const firstTopLevelIndex = resources.findIndex(
      (resource) => (resourceDepthLookup.get(resource.id) ?? 0) === 0,
    );

    const realOptions = resources.map((resource, index) => {
      const depth = resourceDepthLookup.get(resource.id) ?? 0;
      const hasChildren = (childrenIdLookup.get(resource.id)?.length ?? 0) > 0;
      const isTopLevel = depth === 0;
      const isFirstTopLevel = index === firstTopLevelIndex;
      // In single-select mode, the "no resource" option always precedes the list (even when
      // hidden), so the first top-level group's divider only collapses when
      // `shouldEventRequireResource` hides it. Multi-select never has that pseudo-item.
      const showDivider =
        hasNesting &&
        isTopLevel &&
        (!isFirstTopLevel || (mode === 'single' && !shouldEventRequireResource));
      return {
        label: resource.title,
        value: resource.id,
        eventColor: resource.eventColor ?? eventDefaultColor,
        isGroupRoot: isTopLevel && hasChildren,
        indentLevel: Math.max(0, depth - 1),
        showDivider,
      };
    });

    if (mode !== 'single') {
      return realOptions;
    }

    return [
      {
        label: localeText.labelNoResource,
        value: NO_RESOURCE_VALUE,
        eventColor: eventDefaultColor,
        isGroupRoot: false,
        indentLevel: 0,
        showDivider: false,
        hidden: shouldEventRequireResource,
      },
      ...realOptions,
    ];
  }, [
    resources,
    resourceDepthLookup,
    childrenIdLookup,
    eventDefaultColor,
    mode,
    shouldEventRequireResource,
    localeText.labelNoResource,
  ]);

  const resource = React.useMemo(() => {
    const resourceId = resourceIds[0];
    return resourcesOptions.find((option) => option.value === resourceId) || null;
  }, [resourcesOptions, resourceIds]);

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const { value } = event.target;
    if (mode === 'single') {
      const nextId = value as string;
      resourceField.setValue(nextId === NO_RESOURCE_VALUE ? [] : [nextId as SchedulerResourceId]);
      return;
    }
    resourceField.setValue(
      (typeof value === 'string' ? value.split(',') : value) as SchedulerResourceId[],
    );
  };

  const errorId = `${schedulerId}-resource-error`;

  return (
    <SectionFieldset className={classes.eventDialogSectionFieldset}>
      <SectionHeaderTitle className={classes.eventDialogSectionHeaderTitle}>
        {resources.length > 0 ? localeText.resourceColorSectionLabel : localeText.colorSectionLabel}
      </SectionHeaderTitle>
      {/* Resources are optional; skip the picker entirely when none are configured. */}
      {resources.length > 0 && (
        <FormControl size="small" fullWidth error={!!error}>
          <InputLabel id={`${schedulerId}-resource-select-label`}>
            {localeText.resourceLabel}
          </InputLabel>
          <Select
            labelId={`${schedulerId}-resource-select-label`}
            label={localeText.resourceLabel}
            value={mode === 'multiple' ? resourceIds : (resourceIds[0] ?? NO_RESOURCE_VALUE)}
            multiple={mode === 'multiple'}
            displayEmpty
            onChange={handleChange}
            readOnly={readOnly}
            aria-describedby={error ? errorId : undefined}
            startAdornment={
              <InputAdornment position="start">
                <ResourceSelectAdornment
                  resource={resource}
                  hasSelection={resourceIds.length > 0}
                />
              </InputAdornment>
            }
            renderValue={() => {
              if (resourceIds.length === 0) {
                return localeText.labelNoResource;
              }
              if (mode === 'single') {
                return resource?.label ?? localeText.labelInvalidResource;
              }
              return resourceIds
                .map((id) => {
                  const option = resourcesOptions.find((o) => o.value === id);
                  return option?.label ?? localeText.labelInvalidResource;
                })
                .join(', ');
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
                  key={resourceOption.value}
                  value={resourceOption.value}
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
                      data-no-resource={resourceOption.value === NO_RESOURCE_VALUE}
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
      )}
      <ResourceMenuColorToggleGroup
        value={color ? [color] : []}
        onValueChange={(values) => {
          const next = values[values.length - 1] as SchedulerEventColor | undefined;
          colorField.setValue(next ?? null);
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
