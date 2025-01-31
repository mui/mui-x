import * as React from 'react';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useId from '@mui/utils/useId';

interface GridSidebarCollapsibleSectionProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  children: React.ReactNode;
}

const CollapsibleSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'flex 0.1s ease-in-out',
}));

const CollapsibleSectionTrigger = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: 40,
  padding: theme.spacing(0, 1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
  },
}));

const CollapsibleSectionIcon = styled('svg')<{ open: boolean }>(({ theme, open }) => ({
  color: theme.palette.text.secondary,
  transform: open ? 'none' : 'rotate(-180deg)',
  transition: 'transform 0.1s ease-in-out',
}));

export function GridSidebarCollapsibleSection(props: GridSidebarCollapsibleSectionProps) {
  const { title, children, ...rest } = props;
  const [open, setOpen] = React.useState(true);
  const id = useId();

  return (
    <CollapsibleSection {...rest}>
      <CollapsibleSectionTrigger
        role="button"
        tabIndex={0}
        aria-controls={id}
        aria-expanded={!open}
        onClick={() => setOpen(!open)}
      >
        {title}
        <CollapsibleSectionIcon as={ExpandMoreIcon} open={open} />
      </CollapsibleSectionTrigger>
      <div id={id}>{open ? children : null}</div>
    </CollapsibleSection>
  );
}
