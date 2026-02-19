import { styled } from '@mui/material/styles';

const EventDialogTabPanel = styled('div', {
  name: 'MuiEventDialog',
  slot: 'TabPanel',
})({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  '&[hidden]': {
    display: 'none',
  },
});

const EventDialogTabContent = styled('div', {
  name: 'MuiEventDialog',
  slot: 'TabContent',
})(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.5),
  flex: 1,
  overflow: 'auto',
  scrollbarWidth: 'thin',
}));

export { EventDialogTabPanel, EventDialogTabContent };
