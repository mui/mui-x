import * as React from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { alpha, styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => ({
  justifyContent: 'left',
  padding: '0 2px',
  '& .icon': {
    color: 'inherit',
  },
  '&.Open': {
    color: (theme.vars || theme).palette.info.dark,
    border: `1px solid ${(theme.vars || theme).palette.info.main}`,
    backgroundColor: alpha((theme.vars || theme).palette.info.light, 0.1),
  },
  '&.Filled': {
    color: (theme.vars || theme).palette.success.dark,
    border: `1px solid ${(theme.vars || theme).palette.success.main}`,
    backgroundColor: alpha((theme.vars || theme).palette.success.light, 0.1),
  },
  '&.PartiallyFilled': {
    color: (theme.vars || theme).palette.warning.dark,
    border: `1px solid ${(theme.vars || theme).palette.warning.main}`,
    backgroundColor: alpha((theme.vars || theme).palette.warning.light, 0.1),
  },
  '&.Rejected': {
    color: (theme.vars || theme).palette.error.dark,
    border: `1px solid ${(theme.vars || theme).palette.error.main}`,
    backgroundColor: alpha((theme.vars || theme).palette.error.light, 0.1),
  },
}));

interface StatusProps {
  status: string;
}

const Status = React.memo((props: StatusProps) => {
  const { status } = props;

  let icon: any = null;
  if (status === 'Rejected') {
    icon = <ReportProblemIcon className="icon" />;
  } else if (status === 'Open') {
    icon = <InfoIcon className="icon" />;
  } else if (status === 'PartiallyFilled') {
    icon = <AutorenewIcon className="icon" />;
  } else if (status === 'Filled') {
    icon = <DoneIcon className="icon" />;
  }

  let label: string = status;
  if (status === 'PartiallyFilled') {
    label = 'Partially Filled';
  }

  return (
    <StyledChip className={status} icon={icon} size="small" label={label} variant="outlined" />
  );
});

export function renderStatus(params: GridRenderCellParams<any, string>) {
  if (params.value == null) {
    return '';
  }

  return <Status status={params.value} />;
}
