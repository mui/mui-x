import { jsx as _jsx } from "react/jsx-runtime";
import { DemoLink } from './renderLink';
export function renderEmail(params) {
    const email = params.value ?? '';
    return (_jsx(DemoLink, { href: `mailto:${email}`, tabIndex: params.tabIndex, children: email }));
}
