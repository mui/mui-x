import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GridPanel } from '@mui/x-data-grid';
function MyPanel() {
    return (_jsxs("div", { children: [_jsx(GridPanel, { classes: { paper: 'paper' }, open: true, flip: false }), _jsx(GridPanel, { classes: { foo: 'foo' } })] }));
}
