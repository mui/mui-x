import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterMomentHijri } from '@mui/x-date-pickers/AdapterMomentHijri';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';

<>
  <LocalizationProvider dateAdapter={AdapterDateFns} />
  <LocalizationProvider dateAdapter={AdapterDateFnsJalali} />
  <LocalizationProvider dateAdapter={AdapterDayjs} />
  <LocalizationProvider dateAdapter={AdapterLuxon} />
  <LocalizationProvider dateAdapter={AdapterMoment} />
  <LocalizationProvider dateAdapter={AdapterMomentHijri} />
  <LocalizationProvider dateAdapter={AdapterMomentJalaali} />
</>;
