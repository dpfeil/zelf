# Design



## Tasks

### Requirements

- If adding a new task for a day which has no tasks, a new list is created for that day.
- You can create a list for the next day as well so that you can add tasks ahead of time
- Need to be able to see all tasks separately
- Ability to add tasks from list of incomplete tasks

- What about recurring tasks?
    - Separate category or make it part of the same system?

- Move incomplete items to next day
- Record of tasks complete and incomplete on each day

### Data structures

`Task`

```json
{
    "task_id": "<string> Task id", 
    "date_created": "<date> Date created",
    "completed": "<bool> Complete flag",
    "days_incomplete": "<number> Days on list and incompleted",
    "task_description": "<string>"
}
```


`List`
```json
{
    "list_id": "<string>",
    "date_created": "<date>",
    "list_title": "<string>"
}
```
