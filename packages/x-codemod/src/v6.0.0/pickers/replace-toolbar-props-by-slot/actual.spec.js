<DatePicker ToolbarComponent={MyToolbar} showToolbar={false} />;

<DatePicker
  ToolbarComponent={MyToolbar}
  showToolbar={true}
  components={{
    ActionBar: CustomActionBar,
  }}
  componentsProps={{
    actionBar: {
      actions: [],
    },
  }}
/>;

<DatePicker toolbarPlaceholder="__" toolbarFormat="DD / MM / YYYY" showToolbar />;

<DatePicker showToolbar={isToolbarVisible(x, y)} />;

<DatePicker toolbarTitle="Title" />;

<LocalizationProvider
  localeText={{
    start: 'Check-in',
    datePickerDefaultToolbarTitle: 'Pick a Date',
    timePickerDefaultToolbarTitle: 'Pick a Time',
    dateTimePickerDefaultToolbarTitle: 'Pick a Date and Time',
    dateRangePickerDefaultToolbarTitle: 'Pick a Date Range',
  }}
>
  <DatePicker />
</LocalizationProvider>;
