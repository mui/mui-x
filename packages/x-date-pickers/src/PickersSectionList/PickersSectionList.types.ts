import * as React from 'react';
import { SlotComponentProps } from '@mui/utils/types';
import { PickersSectionListClasses } from './pickersSectionListClasses';
import { PickerOwnerState } from '../models';
import type { UseFieldDOMGetters } from '../internals/hooks/useField/useField.types';

export interface PickersSectionListSlots {
  root: React.ElementType;
  section: React.ElementType;
  sectionSeparator: React.ElementType;
  sectionContent: React.ElementType;
}

export interface PickerSectionSeparatorOwnerState extends PickerOwnerState {
  /**
   * The position of the separator.
   * `before` if the separator is rendered before the section content.
   * `after` if the separator is rendered after the section content.
   */
  separatorPosition: 'before' | 'after';
}

export interface PickersSectionListSlotProps {
  root?: SlotComponentProps<'div', {}, PickerOwnerState>;
  section?: SlotComponentProps<'span', {}, PickerOwnerState>;
  sectionSeparator?: SlotComponentProps<'span', {}, PickerSectionSeparatorOwnerState>;
  sectionContent?: SlotComponentProps<'span', {}, PickerOwnerState>;
}

export interface PickersSectionElement {
  container: React.HTMLAttributes<HTMLSpanElement>;
  content: React.HTMLAttributes<HTMLSpanElement> & { 'data-range-position': string | undefined };
  before: React.HTMLAttributes<HTMLSpanElement>;
  after: React.HTMLAttributes<HTMLSpanElement>;
}

export interface PickersSectionListRef extends Omit<UseFieldDOMGetters, 'isReady'> {}

export interface ExportedPickersSectionListProps
  extends Pick<React.HTMLAttributes<HTMLDivElement>, 'tabIndex'> {
  /**
   * The elements to render.
   * Each element contains the prop to edit a section of the value.
   */
  elements: PickersSectionElement[];
  sectionListRef: React.Ref<PickersSectionListRef>;
  /**
   * If true, the whole element is editable.
   * Useful when all the sections are selected.
   */
  contentEditable: boolean;
}

export interface PickersSectionListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'contentEditable'>,
    ExportedPickersSectionListProps {
  /**
   * Overridable component slots.
   */
  slots?: PickersSectionListSlots;
  /**
   * The props used for each component slot.
   */
  slotProps?: PickersSectionListSlotProps;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickersSectionListClasses>;
}
