<DateTimePicker
  componentsProps={{
    tabs: {
      dateRangeIcon: <LightModeIcon />,
    },
  }}
/>;

<DateTimePicker hideTabs={false} dateRangeIcon={<LightModeIcon />} timeIcon={<AcUnitIcon />} />;

<DateTimePicker
  hideTabs={false}
  componentsProps={{
    tabs: {
      classes: {
        root: 'test',
      },
      dateRangeIcon: <LightModeIcon />,
    },
    actionBar: {
      actions: [],
    },
  }}
  timeIcon={<AcUnitIcon />}
/>;
