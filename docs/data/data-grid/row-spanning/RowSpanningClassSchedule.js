import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const rows = [
  {
    id: 0,
    day: 'Monday',
    time: '9:00 AM - 10:30 AM',
    course: 'Advanced Mathematics',
    instructor: 'Dr. Smith',
    room: 'Room 101',
    notes: 'Midterm exam',
  },
  {
    id: 1,
    day: 'Monday',
    time: '10:30 AM - 12:00 PM',
    course: 'Advanced Mathematics',
    instructor: 'Dr. Smith',
    room: 'Room 101',
    notes: 'Midterm exam',
  },
  {
    id: 2,
    day: 'Tuesday',
    time: '9:00 AM - 10:30 AM',
    course: 'Advanced Mathematics',
    instructor: 'Dr. Smith',
    room: 'Room 101',
    notes: 'Practical and lab work',
  },
  {
    id: 3,
    day: 'Tuesday',
    time: '10:30 AM - 12:00 PM',
    course: 'Introduction to Biology',
    instructor: 'Dr. Johnson',
    room: 'Room 107',
    notes: 'Lab session',
  },
  {
    id: 4,
    day: 'Wednesday',
    time: '9:00 AM - 10:30 AM',
    course: 'Computer Science 101',
    instructor: 'Dr. Lee',
    room: 'Room 303',
    notes: 'Class',
  },
  {
    id: 5,
    day: 'Wednesday',
    time: '10:30 AM - 12:00 PM',
    course: 'Computer Science 101',
    instructor: 'Dr. Lee',
    room: 'Room 303',
    notes: 'Lab session',
  },
  {
    id: 6,
    day: 'Thursday',
    time: '9:00 AM - 11:00 AM',
    course: 'Physics II',
    instructor: 'Dr. Carter',
    room: 'Room 104',
    notes: 'Project Discussion',
  },
  {
    id: 7,
    day: 'Thursday',
    time: '11:00 AM - 12:30 PM',
    course: 'Physics II',
    instructor: 'Dr. Carter',
    room: 'Room 104',
    notes: 'Project Discussion',
  },
  {
    id: 8,
    day: 'Friday',
    time: '9:00 AM - 11:00 AM',
    course: 'Physics II',
    instructor: 'Dr. Carter',
    room: 'Room 104',
    notes: 'Project Submission',
  },
  {
    id: 9,
    day: 'Friday',
    time: '11:00 AM - 12:30 PM',
    course: 'Literature & Composition',
    instructor: 'Prof. Adams',
    room: 'Lecture Hall 1',
    notes: 'Reading Assignment',
  },
];

const columns = [
  {
    field: 'day',
    headerName: 'Day',
  },
  {
    field: 'time',
    headerName: 'Time',
    minWidth: 160,
  },
  {
    field: 'course',
    headerName: 'Course',
    minWidth: 140,
    colSpan: 2,
    valueGetter: (_, row) => `${row?.course} (${row?.instructor})`,
    cellClassName: 'course-instructor--cell',
  },
  {
    field: 'instructor',
    headerName: 'Instructor',
    minWidth: 140,
    hideable: false,
  },
  {
    field: 'room',
    headerName: 'Room',
    minWidth: 120,
  },
  {
    field: 'notes',
    headerName: 'Notes',
    minWidth: 180,
  },
];

export default function RowSpanningClassSchedule() {
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <DataGrid
        columns={columns}
        rows={rows}
        rowSpanning
        disableRowSelectionOnClick
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'transparent',
          },
          [`& .course-instructor--cell`]: {
            textAlign: 'center',
            fontWeight: 'bold',
          },
        }}
      />
    </Box>
  );
}
