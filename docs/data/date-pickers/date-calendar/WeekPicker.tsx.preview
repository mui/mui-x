<DateCalendar
  value={value}
  onChange={(newValue) => setValue(newValue)}
  showDaysOutsideCurrentMonth
  displayWeekNumber
  slots={{ day: Day }}
  slotProps={{
    day: (ownerState) =>
      ({
        selectedDay: value,
        hoveredDay,
        onPointerEnter: () => setHoveredDay(ownerState.day),
        onPointerLeave: () => setHoveredDay(null),
      }) as any,
  }}
/>