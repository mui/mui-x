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
  gap: theme.spacing(2),
  flex: 1,
  overflow: 'auto',
  scrollbarWidth: 'thin',
  maxHeight: 450,
  height: 'fit-content',
}));

export { EventDialogTabPanel, EventDialogTabContent };
