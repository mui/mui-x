import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
const Value = styled('div')(({ theme }) => ({
    width: '100%',
    fontVariantNumeric: 'tabular-nums',
    '&.positive': {
        color: theme.palette.success.light,
        ...theme.applyStyles('light', {
            color: theme.palette.success.dark,
        }),
    },
    '&.negative': {
        color: theme.palette.error.light,
        ...theme.applyStyles('light', {
            color: theme.palette.error.dark,
        }),
    },
}));
function pnlFormatter(value) {
    return value < 0 ? `(${Math.abs(value).toLocaleString()})` : value.toLocaleString();
}
const Pnl = React.memo(function Pnl(props) {
    const { value } = props;
    return (_jsx(Value, { className: clsx({
            positive: value > 0,
            negative: value < 0,
        }), children: pnlFormatter(value) }));
});
export function renderPnl(params) {
    if (params.value == null) {
        return '';
    }
    return _jsx(Pnl, { value: params.value });
}
