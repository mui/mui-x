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
import { RecurringEventScope } from '@mui/x-scheduler-internals/models';
import { schedulerOtherSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventDialogStyledContext } from '@mui/x-scheduler/internals';
import { RecurringScopeDialogProps } from './RecurringScopeDialog.types';

export const RecurringScopeDialog = React.forwardRef<HTMLDivElement, RecurringScopeDialogProps>(
  function RecurringScopeDialog(props, ref) {
    // Context hooks
    const { schedulerId, localeText } = useEventDialogStyledContext();
    const store = useSchedulerStoreContext();

    // Selector hooks
    const open = useStore(store, schedulerOtherSelectors.isRecurringScopeDialogOpen);

    // Feature hooks
    const handleOpenChange = React.useCallback(
      (next: boolean) => {
        if (!next) {
          store.selectRecurringEventScope(null);
        }
      },
      [store],
    );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const recurrenceScopeValue = form.get('recurrenceScope') as RecurringEventScope;
      store.selectRecurringEventScope(recurrenceScopeValue);
    };

    return (
      <Dialog
        open={open}
        ref={ref}
        onClose={() => handleOpenChange(false)}
        aria-labelledby={`${schedulerId}-scope-dialog-title`}
        {...props}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle id={`${schedulerId}-scope-dialog-title`}>{localeText.title}</DialogTitle>
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
            <Button onClick={() => store.selectRecurringEventScope(null)} type="button">
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
