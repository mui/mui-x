import * as React from 'react';
import PropTypes from 'prop-types';
import { SlotComponentProps, useSlotProps } from '@mui/base/utils';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import {
  getPickersSectionListUtilityClass,
  PickersSectionListClasses,
} from './pickersSectionListClasses';

interface PickersSectionListSlots {
  root: React.ElementType;
  section: React.ElementType;
  sectionSeparator: React.ElementType;
  sectionContent: React.ElementType;
}

interface PickersSectionListSlotProps {
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

export interface PickersSectionListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Overridable component slots.
   */
  slots: PickersSectionListSlots;
  /**
   * The props used for each component slot.
   */
  slotProps?: PickersSectionListSlotProps;
  /**
   * The elements to render.
   * Each element contains the prop to edit a section of the value.
   */
  elements: PickersSectionElement[];
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<PickersSectionListClasses>;
  /**
   * If true, the whole element is editable.
   * Useful when all the sections are selected.
   */
  contentEditable: boolean;
}

const useUtilityClasses = (ownerState: PickersSectionListProps) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
    section: ['section'],
    sectionContent: ['sectionContent'],
  };

  return composeClasses(slots, getPickersSectionListUtilityClass, classes);
};

interface PickersSectionProps extends Pick<PickersSectionListProps, 'slots' | 'slotProps'> {
  element: PickersSectionElement;
  classes: PickersSectionListClasses;
}

/**
 * Demos:
 *
 * - [Custom field](https://mui.com/x/react-date-pickers/custom-field/)
 *
 * API:
 *
 * - [PickersSectionList API](https://mui.com/x/api/date-pickers/pickers-section-list/)
 */
function PickersSection(props: PickersSectionProps) {
  const { slots, slotProps, element, classes } = props;

  const Section = slots.section;
  const sectionProps = useSlotProps({
    elementType: Section,
    externalSlotProps: slotProps?.section,
    externalForwardedProps: element.container,
    className: classes.section,
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
    className: classes.sectionContent,
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

type PickersSectionListComponent = ((
  props: PickersSectionListProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const PickersSectionList = React.forwardRef(function PickersSectionList(
  props: PickersSectionListProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { slots, slotProps, elements, ...other } = props;

  const classes = useUtilityClasses(props);

  const Root = slots.root;
  const rootProps: React.HTMLAttributes<HTMLDivElement> = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    additionalProps: {
      ref,
      suppressContentEditableWarning: true,
    },
    className: classes.root,
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
              classes={classes}
            />
          ))}
        </React.Fragment>
      )}
    </Root>
  );
}) as PickersSectionListComponent;

PickersSectionList.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * If true, the whole element is editable.
   * Useful when all the sections are selected.
   */
  contentEditable: PropTypes.bool.isRequired,
  /**
   * The elements to render.
   * Each element contains the prop to edit a section of the value.
   */
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      after: PropTypes.object.isRequired,
      before: PropTypes.object.isRequired,
      container: PropTypes.object.isRequired,
      content: PropTypes.object.isRequired,
    }),
  ).isRequired,
  /**
   * The props used for each component slot.
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   */
  slots: PropTypes.object.isRequired,
} as any;

export { PickersSectionList };
