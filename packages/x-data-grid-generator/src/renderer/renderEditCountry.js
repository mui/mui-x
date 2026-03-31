'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createElement as _createElement } from "react";
import * as React from 'react';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { COUNTRY_ISO_OPTIONS } from '../services/static-data';
import { useEditDropdownState } from '../hooks/useEditDropdownState';
const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    height: '100%',
    [`& .${autocompleteClasses.inputRoot}`]: {
        ...theme.typography.body2,
        padding: '1px 0',
        height: '100%',
        '& input': {
            padding: '0 16px',
            height: '100%',
        },
    },
}));
function EditCountry(props) {
    const { id, value, field, hasFocus } = props;
    const { open, setOpen, inputRef, shouldAutoOpen, handleAutocompleteInputKeyDown, handleAutocompleteWrapperKeyDown, createAutocompleteChangeHandler, } = useEditDropdownState({ id, field, hasFocus });
    const handleChange = createAutocompleteChangeHandler();
    return (_jsx("div", { onKeyDown: handleAutocompleteWrapperKeyDown, style: { height: '100%', width: '100%' }, children: _jsx(StyledAutocomplete, { value: value, onChange: handleChange, options: COUNTRY_ISO_OPTIONS, getOptionLabel: (option) => option.label, autoHighlight: true, fullWidth: true, open: open, onOpen: () => setOpen(true), onClose: () => setOpen(false), disableClearable: true, renderOption: (optionProps, option) => (_createElement(Box, { component: "li", sx: {
                    '& > img': {
                        mr: 1.5,
                        flexShrink: 0,
                    },
                }, ...optionProps, key: option.code },
                _jsx("img", { loading: "lazy", width: "20", src: `https://flagcdn.com/w20/${option.code.toLowerCase()}.png`, srcSet: `https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`, alt: "" }),
                option.label)), renderInput: (params) => (_jsx(InputBase, { autoFocus: shouldAutoOpen, fullWidth: true, id: params.id, inputRef: inputRef, onKeyDown: handleAutocompleteInputKeyDown, inputProps: {
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                }, ...params.InputProps })) }) }));
}
export function renderEditCountry(params) {
    return _jsx(EditCountry, { ...params });
}
