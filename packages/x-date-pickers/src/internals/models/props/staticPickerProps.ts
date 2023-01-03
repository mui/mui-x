import { BasePickerProps } from './basePickerProps';
import { ExportedPickerStaticWrapperProps } from '../../components/PickerStaticWrapper';

// TODO v6: Drop with the legacy pickers
export type StaticPickerProps<TDate, BaseProps extends BasePickerProps<any, TDate>> = Omit<
  BaseProps,
  'open' | 'onOpen' | 'onClose'
> &
  ExportedPickerStaticWrapperProps & {
    autoFocus?: boolean;
  };
