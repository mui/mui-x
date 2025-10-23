import * as React from 'react';
import { Popover } from '@base-ui-components/react';
import { X } from 'lucide-react';
import { useTranslations } from '../../../utils/TranslationsContext';

export default function EventPopoverHeader({ children }: React.PropsWithChildren) {
  const translations = useTranslations();

  return (
    <header className="EventPopoverHeader">
      <div className="EventPopoverHeaderContent">{children}</div>
      <Popover.Close
        aria-label={translations.closeButtonAriaLabel}
        className="EventPopoverCloseButton"
      >
        <X size={18} strokeWidth={2} />
      </Popover.Close>
    </header>
  );
}
