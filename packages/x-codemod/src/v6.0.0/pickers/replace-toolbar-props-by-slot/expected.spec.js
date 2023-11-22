<DatePicker
  components={{
    Toolbar: MyToolbar,
  }}
  componentsProps={{
    toolbar: {
      hidden: true,
    },
  }} />;

<DatePicker
  components={{
    ActionBar: CustomActionBar,
    Toolbar: MyToolbar,
  }}
  componentsProps={{
    actionBar: {
      actions: [],
    },

    toolbar: {
      hidden: false,
    },
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
