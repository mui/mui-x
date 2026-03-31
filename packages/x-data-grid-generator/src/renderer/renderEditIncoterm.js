'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { INCOTERM_OPTIONS } from '../services/static-data';
import { useEditDropdownState } from '../hooks/useEditDropdownState';
function EditIncoterm(props) {
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
        }, autoFocus: shouldAutoOpen, fullWidth: true, open: open, children: INCOTERM_OPTIONS.map((option) => {
            const tooltip = option.slice(option.indexOf('(') + 1, option.indexOf(')'));
            const code = option.slice(0, option.indexOf('(')).trim();
            return (_jsxs(MenuItem, { value: option, children: [_jsx(ListItemIcon, { sx: { minWidth: 36 }, children: code }), _jsx(ListItemText, { primary: tooltip, sx: { overflow: 'hidden' } })] }, option));
        }) }));
}
export function renderEditIncoterm(params) {
    return _jsx(EditIncoterm, { ...params });
}
