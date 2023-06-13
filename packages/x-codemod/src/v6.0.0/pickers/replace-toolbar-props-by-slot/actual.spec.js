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
