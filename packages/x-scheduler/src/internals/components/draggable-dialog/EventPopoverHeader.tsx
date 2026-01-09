import * as React from 'react';
import { Popover } from '@base-ui/react';
import { X } from 'lucide-react';
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
        <X size={18} strokeWidth={2} />
      </Popover.Close>
    </EventPopoverHeaderRoot>
  );
}
