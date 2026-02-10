'use client';
import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { styled } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
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
import { useTranslations } from '../../utils/TranslationsContext';
import { getPaletteVariants, PaletteName } from '../../utils/tokens';
import { useEventDialogClasses } from './EventDialogClassesContext';

const NO_RESOURCE_VALUE = '';

const ResourceMenuLegendContainer = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'ResourceMenuLegendContainer',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const ResourceMenuColorDot = styled('span', {
  name: 'MuiEventDraggableDialog',
  slot: 'ResourceMenuColorDot',
})(({ theme }) => ({
  width: 14,
  height: 14,
  borderRadius: '2px',
  flexShrink: 0,
  backgroundColor: 'var(--event-main)',
  variants: getPaletteVariants(theme),
}));

const ColorSelectionContainer = styled('div', {
  name: 'MuiEventDraggableDialog',
  slot: 'ColorSelectionContainer',
})(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const ResourceMenuColorRadioButton = styled('button', {
  name: 'MuiEventDraggableDialog',
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
  color: SchedulerEventColor | null;
}

interface ResourceOptionType {
  label: string;
  value: string | null;
  eventColor: SchedulerEventColor;
}

function ResourceSelectAdornment(props: ResourceSelectAdornmentProps) {
  const { resource, color } = props;

  const store = useSchedulerStoreContext();
  const classes = useEventDialogClasses();
  const resourceColor = useStore(
    store,
    schedulerResourceSelectors.defaultEventColor,
    resource?.value,
  );

  return (
    <ResourceMenuLegendContainer className={classes.eventDialogResourceMenuLegendContainer}>
      <ResourceMenuColorDot
        className={classes.eventDialogResourceMenuColorDot}
        data-palette={resourceColor}
      />

      {color && resourceColor !== color && (
        <ResourceMenuColorDot
          className={classes.eventDialogResourceMenuColorDot}
          data-palette={color}
        />
      )}
    </ResourceMenuLegendContainer>
  );
}

export default function ResourceAndColorSection(props: ResourceSelectProps) {
  const { readOnly, resourceId, onResourceChange, onColorChange, color } = props;

  // Context hooks
  const translations = useTranslations();
  const store = useSchedulerStoreContext();
  const classes = useEventDialogClasses();

  // Selector hooks
  const resources = useStore(store, schedulerResourceSelectors.processedResourceFlatList);
  const eventDefaultColor = useStore(store, schedulerOtherSelectors.defaultEventColor);

  const resourcesOptions = React.useMemo((): ResourceOptionType[] => {
    return [
      { label: translations.labelNoResource, value: null, eventColor: eventDefaultColor },
      ...resources.map((resource) => ({
        label: resource.title,
        value: resource.id,
        eventColor: resource.eventColor ?? eventDefaultColor,
      })),
    ];
  }, [resources, translations.labelNoResource, eventDefaultColor]);

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
        <InputLabel id="resource-select-label">{translations.resourceLabel}</InputLabel>
        <Select
          labelId="resource-select-label"
          label={translations.resourceLabel}
          value={resourceId ?? NO_RESOURCE_VALUE}
          displayEmpty
          onChange={handleChange}
          readOnly={readOnly}
          startAdornment={
            <InputAdornment position="start">
              <ResourceSelectAdornment resource={resource} color={color} />
            </InputAdornment>
          }
          renderValue={() => (resource ? resource.label : translations.labelInvalidResource)}
        >
          {resourcesOptions.map((resourceOption) => (
            <MenuItem
              key={resourceOption.value ?? NO_RESOURCE_VALUE}
              value={resourceOption.value ?? NO_RESOURCE_VALUE}
              aria-label={resourceOption.label}
            >
              <ListItemIcon>
                <ResourceMenuColorDot
                  className={classes.eventDialogResourceMenuColorDot}
                  data-palette={resourceOption.eventColor}
                />
              </ListItemIcon>
              <ListItemText>{resourceOption.label}</ListItemText>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <ColorSelectionContainer role="radiogroup" aria-label={translations.colorPickerLabel}>
        {EVENT_COLORS.map((colorOption) => (
          <ResourceMenuColorRadioButton
            key={colorOption}
            type="button"
            role="radio"
            aria-checked={color === colorOption}
            disabled={readOnly}
            onClick={() => onColorChange(colorOption)}
            aria-label={colorOption}
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
