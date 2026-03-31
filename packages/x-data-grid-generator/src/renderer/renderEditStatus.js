'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import { STATUS_OPTIONS } from '../services/static-data';
import { useEditDropdownState } from '../hooks/useEditDropdownState';
function EditStatus(props) {
    const { id, value, field, hasFocus } = props;
    const { open, setOpen, inputRef, shouldAutoOpen, handleSelectKeyDown, handleSelectMenuClose, handleSelectMenuListKeyDown, createSelectChangeHandler, } = useEditDropdownState({ id, field, hasFocus });
    const handleChange = createSelectChangeHandler((event) => event.target.value);
    return (_jsx(Select, { value: value, onChange: handleChange, onKeyDown: handleSelectKeyDown, onOpen: () => setOpen(true), inputRef: inputRef, MenuProps: {
            onClose: handleSelectMenuClose,
            MenuListProps: {
                onKeyDown: handleSelectMenuListKeyDown,
            },
        }, sx: {
            height: '100%',
            '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                pl: 1,
            },
        }, autoFocus: shouldAutoOpen, fullWidth: true, open: open, children: STATUS_OPTIONS.map((option) => {
            let IconComponent = null;
            if (option === 'Rejected') {
                IconComponent = ReportProblemIcon;
            }
            else if (option === 'Open') {
                IconComponent = InfoIcon;
            }
            else if (option === 'Partially Filled') {
                IconComponent = AutorenewIcon;
            }
            else if (option === 'Filled') {
                IconComponent = DoneIcon;
            }
            return (_jsxs(MenuItem, { value: option, children: [_jsx(ListItemIcon, { sx: { minWidth: 36 }, children: _jsx(IconComponent, { fontSize: "small" }) }), _jsx(ListItemText, { primary: option, sx: { overflow: 'hidden' } })] }, option));
        }) }));
}
export function renderEditStatus(params) {
    return _jsx(EditStatus, { ...params });
}
