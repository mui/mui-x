export default () => null;

// import * as React from 'react';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { Unstable_StaticNextDatePicker as StaticNextDatePicker } from '@mui/x-date-pickers/StaticNextDatePicker';
// import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar';
// import {
//   pickersLayoutClasses,
//   PickersLayoutContentWrapper,
//   PickersLayoutProps,
//   PickersLayoutRoot,
//   usePickerLayout,
// } from '@mui/x-date-pickers/PickersLayout';
// import { DateView } from '@mui/x-date-pickers';
// import { Dayjs } from 'dayjs';

// function ActionList(props: PickersActionBarProps) {
//   const { onAccept, onClear, onCancel, onSetToday } = props;
//   const actions = [
//     { text: 'Accept', method: onAccept },
//     { text: 'Clear', method: onClear },
//     { text: 'Cancel', method: onCancel },
//     { text: 'Today', method: onSetToday },
//   ];
//   return (
//     <List>
//       {actions.map(({ text, method }) => (
//         <ListItem key={text} disablePadding>
//           <ListItemButton onClick={method}>
//             <ListItemText primary={text} />
//           </ListItemButton>
//         </ListItem>
//       ))}
//     </List>
//   );
// }

// function CustomLayout(props: PickersLayoutProps<Dayjs | null, DateView>) {
//   const { isLandscape } = props;
//   const { toolbar, tabs, content, actionBar} = usePickerLayout(props);

//   return (
//     <PickersLayoutRoot
//       ownerState={{ isLandscape }}
//       sx={{
//         [`.${pickersLayoutClasses.actionBar}`]: {
//           gridColumn: 1,
//           gridRow: 2,
//         },
//       }}
//     >
//       {toolbar}
//       {actionBar}
//       <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
//         {tabs}
//         {content}
//       </PickersLayoutContentWrapper>
//     </PickersLayoutRoot>
//   );
// }

// export default function MovingActionsReorder() {
//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <StaticNextDatePicker
//         components={{
//           Layout: CustomLayout,
//           ActionBar: ActionList,
//         }}
//       />
//     </LocalizationProvider>
//   );
// }
