import * as React from 'react';
import PropTypes from 'prop-types';
import { SlotComponentProps, useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import {
  getPickersSectionsListUtilityClass,
  PickersSectionsListClasses,
} from './pickersSectionsListClasses';

interface PickersSectionsListSlotsComponent {
  root: React.ElementType;
  section: React.ElementType;
  sectionSeparator: React.ElementType;
  sectionContent: React.ElementType;
}

interface PickersSectionsListSlotsComponentsProps {
  root?: SlotComponentProps<'div', {}, {}>;
  section?: SlotComponentProps<'span', {}, {}>;
  sectionSeparator?: SlotComponentProps<'span', {}, { position: 'before' | 'after' }>;
  sectionContent?: SlotComponentProps<'span', {}, {}>;
}

export interface PickersSectionElement {
  container: React.HTMLAttributes<HTMLSpanElement>;
  content: React.HTMLAttributes<HTMLSpanElement>;
  before: React.HTMLAttributes<HTMLSpanElement>;
  after: React.HTMLAttributes<HTMLSpanElement>;
}

export interface PickersSectionsListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Overridable component slots.
   */
  slots: PickersSectionsListSlotsComponent;
  /**
   * The props used for each component slot.
   */
  slotProps?: PickersSectionsListSlotsComponentsProps;
  sectionsContainerRef?: React.Ref<HTMLDivElement>;
  elements: PickersSectionElement[];
  classes?: Partial<PickersSectionsListClasses>;
}

const useUtilityClasses = (ownerState: PickersSectionsListProps) => {
  const { classes } = ownerState;

  const slots = {
    sectionContent: ['sectionContent'],
  };

  return composeClasses(slots, getPickersSectionsListUtilityClass, classes);
};

interface PickersSectionProps extends Pick<PickersSectionsListProps, 'slots' | 'slotProps'> {
  element: PickersSectionElement;
  sectionContentClassName: string;
}

/**
 * @ignore - internal component.
 */
function PickersSection(props: PickersSectionProps) {
  const { slots, slotProps, element, sectionContentClassName } = props;

  const Section = slots.section;
  const sectionProps = useSlotProps({
    elementType: Section,
    externalSlotProps: slotProps?.section,
    externalForwardedProps: element.container,
    ownerState: {},
  });

  const SectionContent = slots.sectionContent;
  const sectionContentProps = useSlotProps({
    elementType: SectionContent,
    externalSlotProps: slotProps?.sectionContent,
    externalForwardedProps: element.content,
    additionalProps: {
      suppressContentEditableWarning: true,
    },
    className: sectionContentClassName,
    ownerState: {},
  });

  const SectionSeparator = slots.sectionSeparator;
  const sectionSeparatorBeforeProps = useSlotProps({
    elementType: SectionSeparator,
    externalSlotProps: slotProps?.sectionSeparator,
    externalForwardedProps: element.before,
    ownerState: { position: 'before' },
  });
  const sectionSeparatorAfterProps = useSlotProps({
    elementType: SectionSeparator,
    externalSlotProps: slotProps?.sectionSeparator,
    externalForwardedProps: element.after,
    ownerState: { position: 'after' },
  });

  return (
    <Section {...sectionProps}>
      <SectionSeparator {...sectionSeparatorBeforeProps} />
      <SectionContent {...sectionContentProps} />
      <SectionSeparator {...sectionSeparatorAfterProps} />
    </Section>
  );
}

/**
 * @ignore - internal component.
 */

PickersSection.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  element: PropTypes.shape({
    after: PropTypes.object.isRequired,
    before: PropTypes.object.isRequired,
    container: PropTypes.object.isRequired,
    content: PropTypes.object.isRequired,
  }).isRequired,
  sectionContentClassName: PropTypes.string.isRequired,
  /**
   * The props used for each component slot.
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   */
  slots: PropTypes.object.isRequired,
} as any;

function PickersSectionsList(props: PickersSectionsListProps) {
  const { slots, slotProps, sectionsContainerRef, elements, ...other } = props;

  const classes = useUtilityClasses(props);

  const Root = slots.root;
  const rootProps: React.HTMLAttributes<HTMLDivElement> = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: sectionsContainerRef,
      suppressContentEditableWarning: true,
    },
    ownerState: {},
  });

  return (
    <Root {...rootProps}>
      {rootProps.contentEditable ? (
        elements
          .map(
            ({ content, before, after }) =>
              `${before.children}${content.children}${after.children}`,
          )
          .join('')
      ) : (
        <React.Fragment>
          {elements.map((element, elementIndex) => (
            <PickersSection
              key={elementIndex}
              slots={slots}
              slotProps={slotProps}
              element={element}
              sectionContentClassName={classes.sectionContent}
            />
          ))}
        </React.Fragment>
      )}
    </Root>
  );
}

PickersSectionsList.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      after: PropTypes.object.isRequired,
      before: PropTypes.object.isRequired,
      container: PropTypes.object.isRequired,
      content: PropTypes.object.isRequired,
    }),
  ).isRequired,
  sectionsContainerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.object,
    }),
  ]),
  /**
   * The props used for each component slot.
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   */
  slots: PropTypes.object.isRequired,
} as any;

export { PickersSectionsList };
