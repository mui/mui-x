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

The Event Timeline and Gantt charts both display scheduled items on a time axis.
A Gantt chart is a project-management specialization of a scheduling timeline.
The main difference is the project-management layer: task hierarchy, dependencies, milestones, baselines, progress, and critical path analysis.

## Event Timeline

Use the Event Timeline to display events grouped by resources.
Each event has its own `start`, `end`, and `resource` values.

This model is useful when dates are already defined by your application or backend, and the user needs to view or edit resource allocation.
For example, you can use it for appointments, shifts, reservations, dispatching, rooms, equipment, or team allocation.

{{"demo": "SchedulerTimelineUseCase.js", "bg": "inline", "defaultCodeOpen": false}}

## Gantt chart

Use a Gantt chart to display tasks in a project plan.
Task dates can be calculated from duration, calendars, constraints, and dependencies between tasks.

A Gantt chart is useful when you need project-management concepts such as task hierarchy, dependencies, milestones, baselines, progress, or critical path analysis.
For example, you can use it for implementation plans, manufacturing steps, milestones, baselines, or critical path analysis.

## Comparison

| Concern                  | Event Timeline                                                                     | Gantt chart                                                                                                           |
| :----------------------- | :--------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| Main model               | Events assigned to resources                                                       | Tasks in a project plan                                                                                               |
| Project-management layer | Not included                                                                       | Task hierarchy, dependencies, milestones, baselines, progress, and critical path analysis                             |
| Date source              | Dates are provided by the user, application, or backend                            | Dates can be calculated from project scheduling rules                                                                 |
| Dependencies             | Advanced dependency behavior is not available yet                                  | Dependencies are part of the project model                                                                            |
| Typical use cases        | Appointments, reservations, shifts, dispatching, rooms, equipment, team allocation | Project plans, implementation sequences, manufacturing steps, milestones, baselines, progress, and critical path work |

## Dependencies

The Event Timeline doesn't currently support advanced dependency behavior between events.
If you need dependency types such as finish-to-start, finish-to-finish, start-to-start, or start-to-finish without a full Gantt chart, upvote the GitHub issue below.

A scheduling timeline can support this kind of dependency behavior without becoming a Gantt chart.
The difference is the project-management layer: a Gantt chart usually combines dependencies with task hierarchy, milestones, baselines, and other project-planning concepts.

:::warning
Advanced dependency behavior for the Event Timeline isn't available yet, but you can upvote [this GitHub issue](https://github.com/mui/mui-x/issues/21864) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your use case and the dependency types you need.
:::

## Gantt chart support in MUI X

:::warning
The Gantt chart component isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/8732) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::
