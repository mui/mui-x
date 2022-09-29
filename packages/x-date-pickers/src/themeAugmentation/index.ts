export * from './overrides';
export * from './props';
export * from './components';

declare module '@mui/material/Unstable_TrapFocus' {
    // @ts-ignore
    export type TrapFocusProps = import('@mui/material/Unstable_TrapFocus').FocusTrapProps;
    // @ts-ignore
    export type FocusTrapProps = import('@mui/material/Unstable_TrapFocus').TrapFocusProps;
}