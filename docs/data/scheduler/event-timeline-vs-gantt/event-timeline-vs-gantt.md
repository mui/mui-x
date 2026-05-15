---
productId: x-scheduler
title: React Scheduler component - Event Timeline vs Gantt chart
packageName: '@mui/x-scheduler-premium'
githubLabel: 'scope: scheduler'
components: EventTimelinePremium
---

# Event Timeline vs Gantt chart

<p class="description">Compare the Event Timeline with a Gantt chart to choose the right component for your scheduling use case.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader", "design": false}}

The Event Timeline and Gantt charts both display items on a time axis.
They differ in the data model they represent and in how dates are managed.

## Event Timeline

Use the Event Timeline to display events grouped by resources.
Each event has its own `start`, `end`, and `resource` values.

This model is useful when dates are already defined by your application or backend, and the user needs to view or edit resource allocation.
For example, you can use it for appointments, shifts, reservations, dispatching, rooms, equipment, or team allocation.

{{"demo": "SchedulerTimelineUseCase.js", "bg": "inline", "defaultCodeOpen": false}}

## Gantt chart

Use a Gantt chart to display tasks in a project plan.
Task dates can be calculated from duration, calendars, constraints, and dependencies between tasks.

A Gantt chart is useful when moving one task should update the schedule of related tasks.
For example, you can use it for implementation plans, manufacturing steps, milestones, baselines, or critical path analysis.

## Comparison

| Concern           | Event Timeline                                                                     | Gantt chart                                                                                         |
| :---------------- | :--------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| Main model        | Events assigned to resources                                                       | Tasks in a project plan                                                                             |
| Date management   | Dates are stored on each event                                                     | Dates can be computed from scheduling rules                                                         |
| User interaction  | Moving an event updates that event                                                 | Moving a task can reschedule dependent tasks                                                        |
| Typical use cases | Appointments, reservations, shifts, dispatching, rooms, equipment, team allocation | Project plans, implementation sequences, manufacturing steps, milestones, baselines, critical paths |

## Dependencies

A timeline can display links between events without applying Gantt chart scheduling behavior.
In that case, the links describe a relationship between events, but they don't automatically constrain or reschedule them.

A Gantt chart treats dependencies as part of the scheduling model.
If a predecessor changes, related tasks can be recalculated to keep the project plan consistent.

## Gantt chart support in MUI X

:::warning
The Gantt chart component isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/8732) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::
