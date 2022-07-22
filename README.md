# vite react state presentation

## Master - Notes

- multiple api queries on load for tasks / user 
- must prop drill every function from page > TasksGrid > TaskItem
- Duplicate task state logic on Tasks/Profile
- spirals out of control when adding things to nav

## 2--create-context

Global state pros 
- we can get totals / state into header 
- more efficient with re-queries / re-renders

Global state cons
- Subset lists (user tasks) require a lot of additional work. General task methods cannot be reused.
- if other users are adding tasks, we'll need to build in "refetch timeout" functionality

## 3--zustand

Next steps - hook up functionality

## 4--react-query

Next steps - do things
