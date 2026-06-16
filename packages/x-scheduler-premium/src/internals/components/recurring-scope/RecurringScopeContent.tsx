'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { RecurringEventScope } from '@mui/x-scheduler-internals/models';
import { useSchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { useEventEditingStyledContext } from '@mui/x-scheduler/internals';

/**
 * The recurring scope confirmation content (title, scope choices and the cancel/confirm actions),
 * shared by both shells: the desktop `RecurringScopeDialog` and the compact `RecurringScopeDrawer`.
 * The shell only provides the surface around this content, so the choices stay identical on both
 * platforms.
 */
export function RecurringScopeContent() {
  const { schedulerId, localeText } = useEventEditingStyledContext();
  const store = useSchedulerStoreContext();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const recurrenceScopeValue = form.get('recurrenceScope') as RecurringEventScope;
    store.selectRecurringEventScope(recurrenceScopeValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle id={`${schedulerId}-scope-dialog-title`}>{localeText.title}</DialogTitle>
      <DialogContent>
        <FormControl>
          <RadioGroup
            aria-label={localeText.radioGroupAriaLabel}
            defaultValue="only-this"
            name="recurrenceScope"
          >
            <FormControlLabel value="only-this" control={<Radio />} label={localeText.onlyThis} />
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
  );
}
