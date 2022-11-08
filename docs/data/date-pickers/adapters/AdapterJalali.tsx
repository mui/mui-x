import * as React from 'react'
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Unstable_NextDatePicker as NextDatePicker  } from '@mui/x-date-pickers/NextDatePicker'

export default function AdapterJalali() {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
            <NextDatePicker label="Date Picker" defaultValue={new Date(2022, 1, 1)} />
        </LocalizationProvider>
    )
}