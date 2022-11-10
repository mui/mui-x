import { BasePickerProps } from './basePickerProps';
import { ExportedPickerStaticWrapperProps } from '../../components/PickerStaticWrapper';

export type StaticPickerProps<TDate, BaseProps extends BasePickerProps<any, TDate>> = Omit<
  BaseProps,
  'open' | 'onOpen' | 'onClose'
> &
  ExportedPickerStaticWrapperProps;
