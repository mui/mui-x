'use client';
import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { Dialog } from '@base-ui-components/react/dialog';
import { Radio } from '@base-ui-components/react/radio';
import { Form } from '@base-ui-components/react/form';
import { Field } from '@base-ui-components/react/field';
import { RadioGroup } from '@base-ui-components/react/radio-group';
import { RecurringEventUpdateScope } from '@mui/x-scheduler-headless/models';
import { schedulerOtherSelectors } from '@mui/x-scheduler-headless/scheduler-selectors';
import { useSchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { ScopePopoverProps } from './ScopeDialog.types';
import { useTranslations } from '../../utils/TranslationsContext';
import './ScopeDialog.css';

export const RecurringScopeDialog = React.forwardRef<HTMLDivElement, ScopePopoverProps>(
  function ScopeDialog(props, ref) {
    const { className, containerRef, ...other } = props;

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

    return (
      <Dialog.Root open={open} onOpenChange={handleOpenChange} {...other}>
        <div ref={ref} className={clsx('ScopeDialogContainer', className)}>
          <Dialog.Portal container={containerRef.current}>
            <Dialog.Backdrop className="ScopeDialogBackdrop" />
            <Dialog.Popup className="ScopeDialogPopup" aria-modal>
              <Dialog.Title className="ScopeDialogTitle">{translations.title}</Dialog.Title>
              <Form onSubmit={handleSubmit}>
                <Field.Root name="recurrenceScope">
                  <RadioGroup
                    aria-label={translations.radioGroupAriaLabel}
                    defaultValue={'only-this'}
                  >
                    <Field.Label htmlFor="scope-only-this" className="RadioItem">
                      <Radio.Root value="only-this" id="scope-only-this">
                        <span>{translations.onlyThis}</span>
                        <Radio.Indicator className="RadioItemIndicator" />
                      </Radio.Root>
                    </Field.Label>
                    <Field.Label htmlFor="scope-this-and-following" className="RadioItem">
                      <Radio.Root value="this-and-following" id="scope-this-and-following">
                        <span>{translations.thisAndFollowing}</span>
                        <Radio.Indicator className="RadioItemIndicator" />
                      </Radio.Root>
                    </Field.Label>
                    <Field.Label htmlFor="scope-all" className="RadioItem">
                      <Radio.Root value="all" id="scope-all">
                        <span>{translations.all}</span>
                        <Radio.Indicator className="RadioItemIndicator" />
                      </Radio.Root>
                    </Field.Label>
                  </RadioGroup>
                </Field.Root>
                <div className="ScopeDialogFooter">
                  <Dialog.Close
                    className={clsx('Button', 'Ghost')}
                    type="button"
                    onClick={() => store.selectRecurringEventUpdateScope(null)}
                  >
                    {translations.cancel}
                  </Dialog.Close>
                  <button className={clsx('Button', 'NeutralButton')} type="submit">
                    {translations.confirm}
                  </button>
                </div>
              </Form>
            </Dialog.Popup>
          </Dialog.Portal>
        </div>
      </Dialog.Root>
    );
  },
);
