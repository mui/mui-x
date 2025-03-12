import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid/internals';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useId from '@mui/utils/useId';

interface GridSidebarCollapsibleSectionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  children: React.ReactNode;
}

const CollapsibleSection = styled('div')<{ open: boolean }>(({ open }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: vars.radius.base,
  border: `1px solid ${vars.colors.border.base}`,
  flex: open ? '1 0 auto' : '0 0 auto',
}));

const CollapsibleSectionTrigger = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 40,
  padding: vars.spacing(0, 1.5),
  '&:hover': {
    backgroundColor: vars.colors.interactive.hover,
    cursor: 'pointer',
  },
});

const CollapsibleSectionIcon = styled('svg')<{ open: boolean }>(({ open }) => ({
  color: vars.colors.foreground.muted,
  transform: open ? 'none' : 'rotate(180deg)',
  transition: vars.transition(['transform'], {
    duration: vars.transitions.duration.short,
    easing: vars.transitions.easing.easeInOut,
  }),
}));

const CollapsibleSectionContent = styled('div')({
  borderTop: `1px solid ${vars.colors.border.base}`,
  flex: 1,
  overflow: 'hidden',
});

function GridSidebarCollapsibleSection(props: GridSidebarCollapsibleSectionProps) {
  const { title, 'aria-label': ariaLabel, children, ...other } = props;
  const [open, setOpen] = React.useState(true);
  const id = useId();

  return (
    <CollapsibleSection {...other} open={open}>
      <CollapsibleSectionTrigger
        role="button"
        tabIndex={0}
        aria-controls={open ? id : undefined}
        aria-expanded={!open}
        aria-label={ariaLabel}
        onClick={() => setOpen(!open)}
      >
        {title}
        <CollapsibleSectionIcon as={ExpandMoreIcon} open={open} />
      </CollapsibleSectionTrigger>
      {open ? <CollapsibleSectionContent id={id}>{children}</CollapsibleSectionContent> : null}
    </CollapsibleSection>
  );
}

export { GridSidebarCollapsibleSection };
