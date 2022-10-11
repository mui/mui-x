import * as React from 'react'
import {PickersActionBarProps} from "@mui/x-date-pickers/PickersActionBar";

export interface PickerViewLayoutSlotsComponent {
    /**
     * Custom component for the action bar, it is placed bellow the picker views.
     * @default PickersActionBar
     */
    ActionBar?: React.ElementType<PickersActionBarProps>;
}

export interface PickerViewLayoutSlotsComponentsProps {
    /**
     * Props passed down to the action bar component.
     */
    actionBar?: Omit<PickersActionBarProps, 'onAccept' | 'onClear' | 'onCancel' | 'onSetToday'>;
}


/**
 * TODO: Add `ActionBar` here once it has been removed from the `PickersPopper`, `PickersModalDialog` and `PickersStaticWrapper`.
 * @constructor
 */
export const PickerViewLayout = () => {
    return (
        <React.Fragment>

        </React.Fragment>
    )
}