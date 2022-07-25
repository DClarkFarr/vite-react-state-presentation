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
Pros
- easy to use 
- good render cycles
- not global, so we can use parallel query sets with same code

Cons 
- more queries
- updating one query state leaves others stranded


## 4--react-query
Pros 
- global state / reusable state / both simultaneously 
- everything can be synced all the time 
- best render cycles / optimistic queries / fewer queries 

Cons 
- a little more complex to setup 
- needs an understanding of the whole project's needs to architect successfully
