import * as React from 'react';

import { alpha } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import Typography from '@mui/material/Typography';

import { ConfigSection } from './configuration.type';
import { FormInput } from './FormInput';

type PlaygroundState = Record<string, unknown>;

interface PlaygroundFormProps<Props extends Record<string, unknown>> {
  config: ConfigSection<Props>[];
  state: PlaygroundState;
  onStateChange: (state: PlaygroundState | ((prev: PlaygroundState) => PlaygroundState)) => void;
}

export default function PlaygroundForm<Props extends Record<string, unknown>>({
  config,
  state,
  onStateChange,
}: PlaygroundFormProps<Props>) {
  return (
    <Box
      sx={(theme) => ({
        flexShrink: 0,
        borderLeft: '1px solid',
        borderColor: theme.palette.grey[200],
        background: alpha(theme.palette.grey[50], 0.5),
        minWidth: '250px',
        [`:where(${theme.vars ? '[data-mui-color-scheme="dark"]' : '.mode-dark'}) &`]: {
          borderColor: alpha(theme.palette.grey[900], 0.8),
          backgroundColor: alpha(theme.palette.grey[900], 0.3),
        },
      })}
    >
      {config.map((section) => (
        <Accordion key={section.title} defaultExpanded disableGutters elevation={0} square>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <Typography sx={{ fontWeight: 'bold' }}>{section.title}</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              pb: 2,
            }}
          >
            {section.properties.map((property) => (
              <FormInput
                key={property.title}
                property={property}
                state={state}
                onStateChange={onStateChange}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
