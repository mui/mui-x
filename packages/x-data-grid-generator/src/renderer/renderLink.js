import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { styled } from '@mui/material/styles';
const Link = styled('a')({
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    color: 'inherit',
});
export const DemoLink = React.memo(function DemoLink(props) {
    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (_jsx(Link, { tabIndex: props.tabIndex, onClick: handleClick, href: props.href, children: props.children }));
});
export function renderLink(params) {
    if (params.value == null) {
        return '';
    }
    return (_jsx(DemoLink, { href: params.value, tabIndex: params.tabIndex, children: params.value }));
}
