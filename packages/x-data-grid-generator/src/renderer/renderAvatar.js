import { jsx as _jsx } from "react/jsx-runtime";
import Avatar from '@mui/material/Avatar';
export function renderAvatar(params) {
    if (params.value == null) {
        return '';
    }
    return (_jsx(Avatar, { style: { backgroundColor: params.value.color }, children: params.value.name.toUpperCase().substring(0, 1) }));
}
