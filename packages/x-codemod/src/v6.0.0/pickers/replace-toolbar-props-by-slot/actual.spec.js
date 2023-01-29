<DatePicker ToolbarComponent={MyToolbar} showToolbar={false} localeText={{ datePickerDefaultToolbarTitle: 'Pick a date' }} />;

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

<DatePicker
  localeText={{
    datePickerDefaultToolbarTitle: 'Pick a Date',
    timePickerDefaultToolbarTitle: 'Pick a Time',
    dateTimePickerDefaultToolbarTitle: 'Pick a Date and Time',
    dateRangePickerDefaultToolbarTitle: 'Pick a Date Range',
  }}
/>;
