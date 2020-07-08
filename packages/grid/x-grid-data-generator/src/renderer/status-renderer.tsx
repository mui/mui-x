import * as React from 'react';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import InfoIcon from '@material-ui/icons/Info';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import DoneIcon from '@material-ui/icons/Done';
import Chip from '@material-ui/core/Chip';
import styled from 'styled-components';
import { CellParams } from '@material-ui/x-grid';

const StatusContainer = styled.div`
  justify-content: left !important;

  .status.Open {
    color: #1976d2;
    border: 1px solid #1976d2;
  }
  .status.Open .icon {
    color: #1976d2;
  }
  .status.Rejected {
    color: #d20704;
    border: 1px solid #d20704;
  }
  .status.Rejected .icon {
    color: #d20704;
  }
  .status.Filled {
    color: #008508;
    border: 1px solid #008508;
  }
  .status.Filled .icon {
    color: #008508;
  }
  .status.PartiallyFilled {
    color: #d29f26;
    border: 1px solid #d29f26;
  }
  .status.PartiallyFilled .icon {
    color: #d29f26;
  }
`;

export const Status: React.FC<{ status: string }> = React.memo(({ status }) => {
  let icon: any = null;
  if (status === 'Rejected') {
    icon = <ReportProblemIcon className={'icon'} />;
  } else if (status === 'Open') {
    icon = <InfoIcon className={'icon'} />;
  } else if (status === 'PartiallyFilled') {
    icon = <AutorenewIcon className={'icon'} />;
  } else if (status === 'Filled') {
    icon = <DoneIcon className={'icon'} />;
  }
  let label = status;
  if (status === 'PartiallyFilled') {
    label = 'Partially Filled';
  }
  return (
    <StatusContainer>
      <Chip className={'status ' + status} icon={icon} label={label} variant={'outlined'} />
    </StatusContainer>
  );
});
Status.displayName = 'Status';

export function StatusRenderer(params: CellParams) {
  return <Status status={params.value!.toString()} />;
}
