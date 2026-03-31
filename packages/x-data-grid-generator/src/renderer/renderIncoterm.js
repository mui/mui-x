import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import InfoIcon from '@mui/icons-material/Info';
const Incoterm = React.memo(function Incoterm(props) {
    const { value } = props;
    if (!value) {
        return null;
    }
    const valueStr = value.toString();
    const tooltip = valueStr.slice(valueStr.indexOf('(') + 1, valueStr.indexOf(')'));
    const code = valueStr.slice(0, valueStr.indexOf('(')).trim();
    return (_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsx("span", { children: code }), _jsx(Tooltip, { title: tooltip, children: _jsx(InfoIcon, { sx: { color: '#2196f3', alignSelf: 'center', ml: '8px' } }) })] }));
});
export function renderIncoterm(params) {
    return _jsx(Incoterm, { value: params.value });
}
