import * as React from 'react';
import styled from '@mui/system/styled';
import PropTypes from 'prop-types';
import { useSlotProps } from '@mui/base/utils';
import composeClasses from '@mui/utils/composeClasses';
import useForkRef from '@mui/utils/useForkRef';
import {
  getPickersSectionListUtilityClass,
  pickersSectionListClasses,
  PickersSectionListClasses,
} from './pickersSectionListClasses';
import { PickersSectionListProps, PickersSectionElement } from './PickersSectionList.types';

export const PickersSectionListRoot = styled('div', {
  name: 'MuiPickersSectionList',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})({
  direction: 'ltr /*! @noflip */' as any,
  outline: 'none',
});

export const PickersSectionListSection = styled('span', {
  name: 'MuiPickersSectionList',
  slot: 'Section',
  overridesResolver: (props, styles) => styles.section,
})({});

export const PickersSectionListSectionSeparator = styled('span', {
  name: 'MuiPickersSectionList',
  slot: 'SectionSeparator',
  overridesResolver: (props, styles) => styles.sectionSeparator,
})({
  whiteSpace: 'pre',
});

export const PickersSectionListSectionContent = styled('span', {
  name: 'MuiPickersSectionList',
  slot: 'SectionContent',
  overridesResolver: (props, styles) => styles.sectionContent,
})({
  outline: 'none',
});

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

  const Section = slots?.section ?? PickersSectionListSection;
  const sectionProps = useSlotProps({
    elementType: Section,
    externalSlotProps: slotProps?.section,
    externalForwardedProps: element.container,
    className: classes.section,
    ownerState: {},
  });

  const SectionContent = slots?.sectionContent ?? PickersSectionListSectionContent;
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

  const SectionSeparator = slots?.sectionSeparator ?? PickersSectionListSectionSeparator;
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

type PickersSectionListComponent = ((
  props: PickersSectionListProps & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element) & { propTypes?: any };

const PickersSectionList = React.forwardRef(function PickersSectionList(
  props: PickersSectionListProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { slots, slotProps, elements, sectionListRef, ...other } = props;

  const classes = useUtilityClasses(props);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const handleRootRef = useForkRef(ref, rootRef);

  React.useImperativeHandle(sectionListRef, () => ({
    getRoot() {
      if (!rootRef.current) {
        throw new Error(
          'MUI: Cannot call sectionListRef.getRoot before the mount of the component',
        );
      }

      return rootRef.current;
    },
    getSectionContainer(index) {
      if (!rootRef.current) {
        throw new Error(
          'MUI: Cannot call sectionListRef.getSectionContainer before the mount of the component',
        );
      }

      return rootRef.current.querySelector<HTMLSpanElement>(
        `.${pickersSectionListClasses.section}[data-sectionindex="${index}"]`,
      )!;
    },
    getSectionContent(index) {
      if (!rootRef.current) {
        throw new Error(
          'MUI: Cannot call sectionListRef.getSectionContent before the mount of the component',
        );
      }

      return rootRef.current.querySelector<HTMLSpanElement>(
        `.${pickersSectionListClasses.section}[data-sectionindex="${index}"] .${pickersSectionListClasses.sectionContent}`,
      )!;
    },
    getSectionIndexFromDOMElement(element) {
      if (!rootRef.current) {
        throw new Error(
          'MUI: Cannot call sectionListRef.getSectionIndexFromDOMElement before the mount of the component',
        );
      }

      if (element == null) {
        return null;
      }

      if (!rootRef.current.contains(element)) {
        return null;
      }

      let sectionContainer: HTMLSpanElement | null = null;
      if (element.classList.contains(pickersSectionListClasses.section)) {
        sectionContainer = element as HTMLSpanElement;
      } else if (element.classList.contains(pickersSectionListClasses.sectionContent)) {
        sectionContainer = element.parentElement as HTMLSpanElement;
      }

      if (sectionContainer == null) {
        return null;
      }

      return Number(sectionContainer.dataset.sectionindex);
    },
  }));

  const Root = slots?.root ?? PickersSectionListRoot;
  const rootProps: React.HTMLAttributes<HTMLDivElement> = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    externalForwardedProps: other,
    additionalProps: {
      ref: handleRootRef,
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
  sectionListRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.shape({
        getRoot: PropTypes.func.isRequired,
        getSectionContainer: PropTypes.func.isRequired,
        getSectionContent: PropTypes.func.isRequired,
        getSectionIndexFromDOMElement: PropTypes.func.isRequired,
      }),
    }),
  ]),
  /**
   * The props used for each component slot.
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   */
  slots: PropTypes.object,
} as any;

export { PickersSectionList };
