import { BasePickerProps } from './basePickerProps';
import { PickerStaticWrapperProps } from '../../components/PickerStaticWrapper';

export type StaticPickerProps<BaseProps extends BasePickerProps<any, any>> = Omit<
  BaseProps,
  'open' | 'onOpen' | 'onClose'
> & {
  /**
   * Force static wrapper inner components to be rendered in mobile or desktop mode.
   * @default 'mobile'
   */
  displayStaticWrapperAs?: PickerStaticWrapperProps['displayStaticWrapperAs'];
};
