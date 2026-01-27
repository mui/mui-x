'use client';
import * as React from 'react';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import CheckIcon from '@mui/icons-material/Check';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Box from '@mui/material/Box';
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
})<{ palette?: PaletteName }>({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-color-9)',
  variants: getPaletteVariants(),
});

const ResourceMenuColorRadioButton = styled('button', {
  name: 'MuiEventDraggableDialog',
  slot: 'ResourceMenuColorRadioButton',
})<{ palette?: PaletteName }>({
  width: 24,
  height: 24,
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'var(--event-color-9)',
  color: 'var(--event-color-1)',
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  variants: getPaletteVariants(),
});

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
  eventColor: SchedulerEventColor;
}

function ResourceMenuTriggerContent(props: ResourceMenuTriggerContentProps) {
  const { resource, color } = props;

  const store = useSchedulerStoreContext();
  const resourceColor = useStore(
    store,
    schedulerResourceSelectors.defaultEventColor,
    resource?.value,
  );

  return (
    <ResourceMenuLegendContainer>
      <ResourceMenuColorDot className="ResourceLegendColor" palette={resourceColor} />

      {color && resourceColor !== color && (
        <ResourceMenuColorDot className="ResourceLegendColor" palette={color} />
      )}
    </ResourceMenuLegendContainer>
  );
}

export default function ResourceMenu(props: ResourceSelectProps) {
  const { readOnly, resourceId, onResourceChange, onColorChange, color } = props;

  // Context hooks
  const translations = useTranslations();
  const store = useSchedulerStoreContext();

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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Button
        onClick={handleClick}
        aria-label={translations.resourceLabel}
        aria-controls={open ? 'resource-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        endIcon={<ExpandMoreRounded fontSize="small" />}
      >
        <ResourceMenuTriggerContent resource={resource} color={color} />
        <span>{resource ? resource.label : translations.labelInvalidResource}</span>
      </Button>
      <Menu
        id="resource-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <ListSubheader>Resources</ListSubheader>
        {resourcesOptions.map((resourceOption) => (
          <MenuItem
            key={resourceOption.value}
            disabled={readOnly}
            selected={resourceId === resourceOption.value}
            onClick={() => {
              onResourceChange(resourceOption.value as SchedulerResourceId);
              handleClose();
            }}
            aria-label={resourceOption.label}
          >
            <ListItemIcon>
              <ResourceMenuColorDot
                className="ResourceLegendColor"
                palette={resourceOption.eventColor}
              />
            </ListItemIcon>
            <ListItemText>{resourceOption.label}</ListItemText>
            {resourceId === resourceOption.value && (
              <ListItemIcon sx={{ justifyContent: 'flex-end' }}>
                <CheckIcon fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
        <ListSubheader>Colors</ListSubheader>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 2, pb: 1 }}>
          {EVENT_COLORS.map((colorOption) => (
            <ResourceMenuColorRadioButton
              key={colorOption}
              type="button"
              disabled={readOnly}
              onClick={() => {
                onColorChange(colorOption);
                handleClose();
              }}
              aria-label={colorOption}
              palette={colorOption}
            >
              {color === colorOption && <CheckIcon fontSize="small" />}
            </ResourceMenuColorRadioButton>
          ))}
        </Box>
      </Menu>
    </React.Fragment>
  );
}
