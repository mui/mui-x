import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
const StyledChip = styled(Chip)(({ theme }) => ({
    justifyContent: 'left',
    '& .icon': {
        color: 'inherit',
    },
    '&.Open': {
        color: (theme.vars || theme).palette.info.dark,
        border: `1px solid ${(theme.vars || theme).palette.info.main}`,
    },
    '&.Filled': {
        color: (theme.vars || theme).palette.success.dark,
        border: `1px solid ${(theme.vars || theme).palette.success.main}`,
    },
    '&.PartiallyFilled': {
        color: (theme.vars || theme).palette.warning.dark,
        border: `1px solid ${(theme.vars || theme).palette.warning.main}`,
    },
    '&.Rejected': {
        color: (theme.vars || theme).palette.error.dark,
        border: `1px solid ${(theme.vars || theme).palette.error.main}`,
    },
}));
const Status = React.memo((props) => {
    const { status } = props;
    let icon = null;
    if (status === 'Rejected') {
        icon = _jsx(ReportProblemIcon, { className: "icon" });
    }
    else if (status === 'Open') {
        icon = _jsx(InfoIcon, { className: "icon" });
    }
    else if (status === 'Partially Filled') {
        icon = _jsx(AutorenewIcon, { className: "icon" });
    }
    else if (status === 'Filled') {
        icon = _jsx(DoneIcon, { className: "icon" });
    }
    const className = status.replace(' ', '');
    return (_jsx(StyledChip, { className: className, icon: icon, size: "small", label: status, variant: "outlined" }));
});
export function renderStatus(params) {
    if (params.value == null) {
        return '';
    }
    return _jsx(Status, { status: params.value });
}
