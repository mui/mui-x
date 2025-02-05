import * as React from 'react';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useId from '@mui/utils/useId';

interface GridSidebarCollapsibleSectionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  children: React.ReactNode;
}

const CollapsibleSection = styled('div')<{ open: boolean }>(({ theme, open }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  flex: open ? '1 0 auto' : '0 0 auto',
}));

const CollapsibleSectionTrigger = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 40,
  padding: theme.spacing(0, 1.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
  },
}));

const CollapsibleSectionIcon = styled('svg')<{ open: boolean }>(({ theme, open }) => ({
  color: theme.palette.text.secondary,
  transform: open ? 'none' : 'rotate(180deg)',
  transition: theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  }),
}));

const CollapsibleSectionContent = styled('div')(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  flex: 1,
  overflow: 'hidden',
}));

export function GridSidebarCollapsibleSection(props: GridSidebarCollapsibleSectionProps) {
  const { title, children, ...rest } = props;
  const [open, setOpen] = React.useState(true);
  const id = useId();

  return (
    <CollapsibleSection {...rest} open={open}>
      <CollapsibleSectionTrigger
        role="button"
        tabIndex={0}
        aria-controls={open ? id : undefined}
        aria-expanded={!open}
        onClick={() => setOpen(!open)}
      >
        {title}
        <CollapsibleSectionIcon as={ExpandMoreIcon} open={open} />
      </CollapsibleSectionTrigger>
      {open ? <CollapsibleSectionContent id={id}>{children}</CollapsibleSectionContent> : null}
    </CollapsibleSection>
  );
}
