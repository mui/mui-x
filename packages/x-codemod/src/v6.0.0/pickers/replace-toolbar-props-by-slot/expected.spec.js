<DatePicker
  components={{
    Toolbar: MyToolbar,
  }} />;

<DatePicker
  componentsProps={{
    toolbar: {
      toolbarPlaceholder: "__",
      toolbarFormat: "DD / MM / YYYY",
      hidden: false,
    },
  }} />;

<DatePicker
  componentsProps={{
    toolbar: {
      hidden: !isToolbarVisible(x, y),
    },
  }} />;

<DatePicker
  localeText={{
    toolbarTitle: "Title",
  }} />;
