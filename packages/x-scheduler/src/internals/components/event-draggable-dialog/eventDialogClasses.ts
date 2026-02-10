export interface EventDialogClasses {
  /** Styles applied to the event dialog root element. */
  eventDialog: string;
  /** Styles applied to the event dialog close button element. */
  eventDialogCloseButton: string;
  /** Styles applied to the event dialog header element. */
  eventDialogHeader: string;
  /** Styles applied to the event dialog readonly content element. */
  eventDialogReadonlyContent: string;
  /** Styles applied to the event dialog actions element. */
  eventDialogActions: string;
  /** Styles applied to the event dialog date time container element. */
  eventDialogDateTimeContainer: string;
  /** Styles applied to the event dialog title element. */
  eventDialogTitle: string;
  /** Styles applied to the event dialog resource container element. */
  eventDialogResourceContainer: string;
  /** Styles applied to the event dialog resource legend container element. */
  eventDialogResourceLegendContainer: string;
  /** Styles applied to the event dialog resource legend color element. */
  eventDialogResourceLegendColor: string;
  /** Styles applied to the event dialog resource title element. */
  eventDialogResourceTitle: string;
  /** Styles applied to the event dialog form actions element. */
  eventDialogFormActions: string;
  /** Styles applied to the event dialog content element. */
  eventDialogContent: string;
  /** Styles applied to the event dialog general tab content element. */
  eventDialogGeneralTabContent: string;
  /** Styles applied to the event dialog date time fields container element. */
  eventDialogDateTimeFieldsContainer: string;
  /** Styles applied to the event dialog date time fields row element. */
  eventDialogDateTimeFieldsRow: string;
  /** Styles applied to the event dialog recurrence tab content element. */
  eventDialogRecurrenceTabContent: string;
  /** Styles applied to the event dialog resource menu legend container element. */
  eventDialogResourceMenuLegendContainer: string;
  /** Styles applied to the event dialog resource menu color dot element. */
  eventDialogResourceMenuColorDot: string;
  /** Styles applied to the event dialog resource menu color radio button element. */
  eventDialogResourceMenuColorRadioButton: string;
}

export type EventDialogClassKey = keyof EventDialogClasses;

export const eventDialogClassKeys: EventDialogClassKey[] = [
  'eventDialog',
  'eventDialogCloseButton',
  'eventDialogHeader',
  'eventDialogReadonlyContent',
  'eventDialogActions',
  'eventDialogDateTimeContainer',
  'eventDialogTitle',
  'eventDialogResourceContainer',
  'eventDialogResourceLegendContainer',
  'eventDialogResourceLegendColor',
  'eventDialogResourceTitle',
  'eventDialogFormActions',
  'eventDialogContent',
  'eventDialogGeneralTabContent',
  'eventDialogDateTimeFieldsContainer',
  'eventDialogDateTimeFieldsRow',
  'eventDialogRecurrenceTabContent',
  'eventDialogResourceMenuLegendContainer',
  'eventDialogResourceMenuColorDot',
  'eventDialogResourceMenuColorRadioButton',
];

// Create a slots object for reuse in useUtilityClasses (avoids duplication in EventCalendar.tsx and EventTimelinePremium.tsx)
export const eventDialogSlots: Record<EventDialogClassKey, [EventDialogClassKey]> = {
  eventDialog: ['eventDialog'],
  eventDialogCloseButton: ['eventDialogCloseButton'],
  eventDialogHeader: ['eventDialogHeader'],
  eventDialogReadonlyContent: ['eventDialogReadonlyContent'],
  eventDialogActions: ['eventDialogActions'],
  eventDialogDateTimeContainer: ['eventDialogDateTimeContainer'],
  eventDialogTitle: ['eventDialogTitle'],
  eventDialogResourceContainer: ['eventDialogResourceContainer'],
  eventDialogResourceLegendContainer: ['eventDialogResourceLegendContainer'],
  eventDialogResourceLegendColor: ['eventDialogResourceLegendColor'],
  eventDialogResourceTitle: ['eventDialogResourceTitle'],
  eventDialogFormActions: ['eventDialogFormActions'],
  eventDialogContent: ['eventDialogContent'],
  eventDialogGeneralTabContent: ['eventDialogGeneralTabContent'],
  eventDialogDateTimeFieldsContainer: ['eventDialogDateTimeFieldsContainer'],
  eventDialogDateTimeFieldsRow: ['eventDialogDateTimeFieldsRow'],
  eventDialogRecurrenceTabContent: ['eventDialogRecurrenceTabContent'],
  eventDialogResourceMenuLegendContainer: ['eventDialogResourceMenuLegendContainer'],
  eventDialogResourceMenuColorDot: ['eventDialogResourceMenuColorDot'],
  eventDialogResourceMenuColorRadioButton: ['eventDialogResourceMenuColorRadioButton'],
};
