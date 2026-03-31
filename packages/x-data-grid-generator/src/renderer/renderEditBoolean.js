'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { useGridApiContext, useGridRootProps, } from '@mui/x-data-grid-premium';
import { useRowEditHandlers } from '../hooks/useRowEditHandlers';
function EditBoolean(props) {
    const { id, value, field, hasFocus } = props;
    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();
    const inputRef = React.useRef(null);
    const { handleTabKeyDown } = useRowEditHandlers({ id, field });
    const handleChange = React.useCallback(async (event) => {
        await apiRef.current.setEditCellValue({ id, field, value: event.target.checked }, event);
    }, [apiRef, field, id]);
    useEnhancedEffect(() => {
        if (hasFocus) {
            inputRef.current?.focus();
        }
    }, [hasFocus]);
    return (_jsx("div", { onKeyDownCapture: handleTabKeyDown, style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
        }, children: _jsx(rootProps.slots.baseCheckbox, { inputRef: inputRef, checked: Boolean(value), onChange: handleChange, size: "small", ...rootProps.slotProps?.baseCheckbox }) }));
}
export function renderEditBoolean(params) {
    return _jsx(EditBoolean, { ...params });
}
