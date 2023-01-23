<DateTimePicker
  componentsProps={{
    tabs: {
      dateIcon: <LightModeIcon />,
    },
  }}
/>;

<DateTimePicker
  componentsProps={{
    tabs: {
      hidden: false,
      dateIcon: <LightModeIcon />,
      timeIcon: <AcUnitIcon />,
    },
  }} />;

<DateTimePicker
  componentsProps={{
    actionBar: {
      actions: [],
    },

    tabs: {
      classes: {
        root: 'test',
      },

      dateIcon: <LightModeIcon />,
      hidden: false,
      timeIcon: <AcUnitIcon />,
    },
  }} />;
