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
import { useTranslations } from '../../utils/TranslationsContext';
import { useEventDraggableDialogContext } from '../draggable-dialog';

export const RecurringScopeDialog = React.forwardRef<HTMLDivElement, ScopePopoverProps>(
  function ScopeDialog(props, ref) {
    const { container, ...other } = props;

    // Context hooks
    const translations = useTranslations();
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

    const { subscribe } = useEventDraggableDialogContext();

    React.useEffect(() => {
      // subscribe('close', () => {
      //   console.log('EventDraggableDialog closed');
      // });
      // console.log('MoreEventsPopover subscribe', subscribe);
    }, [subscribe]);
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
          <DialogTitle id="scope-dialog-title">{translations.title}</DialogTitle>
          <DialogContent>
            <FormControl>
              <RadioGroup
                aria-label={translations.radioGroupAriaLabel}
                defaultValue="only-this"
                name="recurrenceScope"
              >
                <FormControlLabel
                  value="only-this"
                  control={<Radio />}
                  label={translations.onlyThis}
                />
                <FormControlLabel
                  value="this-and-following"
                  control={<Radio />}
                  label={translations.thisAndFollowing}
                />
                <FormControlLabel value="all" control={<Radio />} label={translations.all} />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => store.selectRecurringEventUpdateScope(null)} type="button">
              {translations.cancel}
            </Button>
            <Button variant="contained" type="submit">
              {translations.confirm}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  },
);
