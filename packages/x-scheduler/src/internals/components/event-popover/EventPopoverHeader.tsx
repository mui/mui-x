import * as React from 'react';
import { Popover } from '@base-ui/react';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useTranslations } from '../../utils/TranslationsContext';

const EventPopoverHeaderRoot = styled('header', {
  name: 'MuiEventPopover',
  slot: 'Header',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  backgroundColor: theme.palette.action.hover,
  padding: theme.spacing(3),
}));

const EventPopoverHeaderContent = styled('div', {
  name: 'MuiEventPopover',
  slot: 'HeaderContent',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  flex: 1,
}));

export default function EventPopoverHeader({ children }: React.PropsWithChildren) {
  const translations = useTranslations();

  return (
    <EventPopoverHeaderRoot>
      <EventPopoverHeaderContent>{children}</EventPopoverHeaderContent>
      <Popover.Close
        aria-label={translations.closeButtonAriaLabel}
        render={<IconButton size="small" />}
      >
        <CloseRounded fontSize="small" />
      </Popover.Close>
    </EventPopoverHeaderRoot>
  );
}
