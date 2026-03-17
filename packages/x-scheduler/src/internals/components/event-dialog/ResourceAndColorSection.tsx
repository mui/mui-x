'use client';
import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { styled } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListSubheader from '@mui/material/ListSubheader';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { EVENT_COLORS } from '@mui/x-scheduler-headless/constants';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import {
  schedulerOtherSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { SchedulerEventColor, SchedulerResourceId } from '@mui/x-scheduler-headless/models';
import { useStore } from '@base-ui/utils/store';
import { getPaletteVariants, PaletteName } from '../../utils/tokens';
import { useEventDialogStyledContext } from './EventDialogStyledContext';

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

const ColorSelectionContainer = styled('div', {
  name: 'MuiEventDialog',
  slot: 'ColorSelectionContainer',
})(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const ResourceMenuColorRadioButton = styled('button', {
  name: 'MuiEventDialog',
  slot: 'ResourceMenuColorRadioButton',
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

interface ResourceSelectProps {
  readOnly?: boolean;
  resourceId: string | null;
  onResourceChange: (value: SchedulerResourceId) => void;
  onColorChange: (value: SchedulerEventColor) => void;
  color: SchedulerEventColor | null;
}

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

export default function ResourceAndColorSection(props: ResourceSelectProps) {
  const { readOnly, resourceId, onResourceChange, onColorChange, color } = props;

  // Context hooks
  const { classes, localeText } = useEventDialogStyledContext();
  const store = useSchedulerStoreContext();

  // Selector hooks
  const resources = useStore(store, schedulerResourceSelectors.processedResourceFlatList);
  const resourceDepthLookup = useStore(store, schedulerResourceSelectors.resourceDepthLookup);
  const childrenIdLookup = useStore(store, schedulerResourceSelectors.childrenIdLookup);
  const eventDefaultColor = useStore(store, schedulerOtherSelectors.defaultEventColor);

  const resourcesOptions = React.useMemo((): ResourceOptionType[] => {
    const hasNesting = resources.some(
      (resource) => (childrenIdLookup.get(resource.id)?.length ?? 0) > 0,
    );

    return [
      {
        label: localeText.labelNoResource,
        value: null,
        eventColor: eventDefaultColor,
        isGroupRoot: false,
        indentLevel: 0,
        showDivider: false,
      },
      ...resources.map((resource) => {
        const depth = resourceDepthLookup.get(resource.id) ?? 0;
        const hasChildren = (childrenIdLookup.get(resource.id)?.length ?? 0) > 0;
        return {
          label: resource.title,
          value: resource.id,
          eventColor: resource.eventColor ?? eventDefaultColor,
          isGroupRoot: depth === 0 && hasChildren,
          indentLevel: Math.max(0, depth - 1),
          showDivider: hasNesting && depth === 0,
        };
      }),
    ];
  }, [
    resources,
    resourceDepthLookup,
    childrenIdLookup,
    localeText.labelNoResource,
    eventDefaultColor,
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
    onResourceChange((value === NO_RESOURCE_VALUE ? null : value) as SchedulerResourceId);
  };

  return (
    <React.Fragment>
      <FormControl size="small" fullWidth>
        <InputLabel id="resource-select-label">{localeText.resourceLabel}</InputLabel>
        <Select
          labelId="resource-select-label"
          label={localeText.resourceLabel}
          value={resourceId ?? NO_RESOURCE_VALUE}
          displayEmpty
          onChange={handleChange}
          readOnly={readOnly}
          startAdornment={
            <InputAdornment position="start">
              <ResourceSelectAdornment resource={resource} />
            </InputAdornment>
          }
          renderValue={() => (resource ? resource.label : localeText.labelInvalidResource)}
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
                style={{ '--resource-indent': resourceOption.indentLevel } as React.CSSProperties}
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
      </FormControl>
      <ColorSelectionContainer role="radiogroup" aria-label={localeText.colorPickerLabel}>
        {EVENT_COLORS.map((colorOption) => (
          <ResourceMenuColorRadioButton
            key={colorOption}
            type="button"
            role="radio"
            aria-checked={color === colorOption}
            disabled={readOnly}
            onClick={() => onColorChange(colorOption)}
            aria-label={`Select ${colorOption} as event color`}
            data-palette={colorOption}
            className={classes.eventDialogResourceMenuColorRadioButton}
          >
            {color === colorOption && <CheckIcon fontSize="small" />}
          </ResourceMenuColorRadioButton>
        ))}
      </ColorSelectionContainer>
    </React.Fragment>
  );
}
