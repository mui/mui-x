'use client';
import * as React from 'react';
import clsx from 'clsx';
import { Dialog } from '@base-ui-components/react/dialog';
import { Radio } from '@base-ui-components/react/radio';
import { Form } from '@base-ui-components/react/form';
import { Field } from '@base-ui-components/react/field';
import { RadioGroup } from '@base-ui-components/react/radio-group';
import { RecurringUpdateEventScope } from '@mui/x-scheduler-headless/models';
import {
  RecurringScopeDialogProviderProps,
  ScopeDialogContextValue,
  ScopePopoverProps,
} from './ScopeDialog.types';
import { ScopeDialogContext } from './ScopeDialogContext';
import './ScopeDialog.css';
import { useTranslations } from '../../utils/TranslationsContext';

export const ScopeDialog = React.forwardRef<HTMLDivElement, ScopePopoverProps>(
  function ScopeDialog(props, ref) {
    const { className, onResolve, container, ...other } = props;
    const translations = useTranslations();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const recurrenceScopeValue = form.get('recurrenceScope') as RecurringUpdateEventScope;
      onResolve(recurrenceScopeValue);
    };

    return (
      <div ref={ref} className={clsx('ScopeDialogContainer', className)} {...other}>
        <Dialog.Portal container={container}>
          <Dialog.Backdrop className="ScopeDialogBackdrop" />
          <Dialog.Popup className="ScopeDialogPopup" aria-modal>
            <Dialog.Title className="ScopeDialogTitle">{translations.title}</Dialog.Title>
            <Form onSubmit={handleSubmit}>
              <Field.Root name="recurrenceScope">
                <RadioGroup
                  aria-label={translations.radioGroupAriaLabel}
                  defaultValue={'only-this'}
                >
                  <Field.Label className="RadioItem">
                    {translations.onlyThis}
                    <Radio.Root value="only-this">
                      <Radio.Indicator className="RadioItemIndicator" />
                    </Radio.Root>
                  </Field.Label>
                  <Field.Label className="RadioItem">
                    {translations.thisAndFollowing}
                    <Radio.Root value="this-and-following">
                      <Radio.Indicator className="RadioItemIndicator" />
                    </Radio.Root>
                  </Field.Label>
                  <Field.Label className="RadioItem">
                    {translations.all}
                    <Radio.Root value="all">
                      <Radio.Indicator className="RadioItemIndicator" />
                    </Radio.Root>
                  </Field.Label>
                </RadioGroup>
              </Field.Root>
              <div className="ScopeDialogFooter">
                <Dialog.Close
                  className={clsx('Button', 'Ghost')}
                  type="button"
                  onClick={() => onResolve(null)}
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
    );
  },
);

export function RecurringScopeDialogProvider(props: RecurringScopeDialogProviderProps) {
  const { containerRef, children } = props;

  const [open, setOpen] = React.useState(false);
  const resolverRef = React.useRef<((value: RecurringUpdateEventScope | null) => void) | null>(
    null,
  );

  const resolveAndClose = React.useCallback(
    (value: RecurringUpdateEventScope | null) => {
      resolverRef.current?.(value);
      resolverRef.current = null;
      setOpen(false);
    },
    [setOpen],
  );

  const promptScope = React.useCallback(() => {
    setOpen(true);
    return new Promise<RecurringUpdateEventScope | null>((resolve) => {
      resolverRef.current = resolve;
    });
  }, [setOpen]);

  const handleOpenChange = React.useCallback((next: boolean) => {
    setOpen(next);
  }, []);

  const contextValue = React.useMemo<ScopeDialogContextValue>(
    () => ({ promptScope, isOpen: open }),
    [promptScope, open],
  );

  return (
    <ScopeDialogContext.Provider value={contextValue}>
      {children}
      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <ScopeDialog onResolve={resolveAndClose} container={containerRef.current} />
      </Dialog.Root>
    </ScopeDialogContext.Provider>
  );
}
