'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { RecurringEventUpdateScope } from '@mui/x-scheduler-headless/models';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { ScopePopoverProps } from './ScopeDialog.types';
import { useEventDialogStyledContext } from '../event-dialog/EventDialogStyledContext';

export const RecurringScopeDialog = React.forwardRef<HTMLDivElement, ScopePopoverProps>(
  function ScopeDialog(props, ref) {
    const { container, ...other } = props;

    // Context hooks
    const { localeText } = useEventDialogStyledContext();
    const store = useSchedulerStoreContext();

    // Selector hooks
    const open = useStore(store, schedulerOtherSelectors.isScopeDialogOpen);

    // Feature hooks
    const handleOpenChange = React.useCallback(
      (next: boolean) => {
        if (!next) {
          store.selectRecurringEventUpdateScope(null);
        }
      },
      [store],
    );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const recurrenceScopeValue = form.get('recurrenceScope') as RecurringEventUpdateScope;
      store.selectRecurringEventUpdateScope(recurrenceScopeValue);
    };

    return (
      <Dialog
        open={open}
        ref={ref}
        onClose={() => handleOpenChange(false)}
        container={container}
        aria-labelledby="scope-dialog-title"
        {...other}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id="scope-dialog-title">{localeText.title}</DialogTitle>
          <DialogContent>
            <FormControl>
              <RadioGroup
                aria-label={localeText.radioGroupAriaLabel}
                defaultValue="only-this"
                name="recurrenceScope"
              >
                <FormControlLabel
                  value="only-this"
                  control={<Radio />}
                  label={localeText.onlyThis}
                />
                <FormControlLabel
                  value="this-and-following"
                  control={<Radio />}
                  label={localeText.thisAndFollowing}
                />
                <FormControlLabel value="all" control={<Radio />} label={localeText.all} />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => store.selectRecurringEventUpdateScope(null)} type="button">
              {localeText.cancel}
            </Button>
            <Button variant="contained" type="submit">
              {localeText.confirm}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  },
);
