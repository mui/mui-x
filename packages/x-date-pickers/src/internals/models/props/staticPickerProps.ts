import { BasePickerProps } from './basePickerProps';
import { ExportedPickerStaticWrapperProps } from '../../components/PickerStaticWrapper';

export type StaticPickerProps<TDate, BaseProps extends BasePickerProps<any, any>> = Omit<
  BaseProps,
  'open' | 'onOpen' | 'onClose'
> &
  ExportedPickerStaticWrapperProps<TDate>;
