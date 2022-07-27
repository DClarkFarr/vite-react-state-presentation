# vite react state presentation
A presentation of different state management patterns in React. Change to the following branches
to view examine. Each branch will accomplish the exact same "Todo" list.

## 0--direct-state
Basic State

Highlights 
- must prop drill every function from page > TasksGrid > TaskItem

Pros 
- most direct / easy to understand and implement 

Cons
- multiple api queries on load for tasks / user 
- Duplicate task state logic on Tasks/Profile
- Spirals out of control when adding things to nav, or multiple lists such as "tasks by user" or "completed"

## 1--basic-hook
- better abstraction
- still must use debounce to reduce multiple queries
- still cannot address navbar without crazy prop drilling or mad queries

## 2--create-context
Global State 

Pros 
- we can get totals / state into header 
- more efficient with re-queries / re-renders

Cons
- Subset lists "tasks by user" or "completed" require more work. General task methods cannot be reused.
- If other users are adding tasks, we'll need to build in "refetch timeout" functionality

## 3--zustand
Re-usable stores

Pros
- easy to use 
- good render cycles
- Supports subset lists like "tasks by user" or "completed"

Cons 
- More XHR queries
- Subset lists can become stranded and out of date with each other.


## 4--react-query
Advanced state management

Pros 
- global state / reusable state / both simultaneously 
- everything can be synced all the time 
- best render cycles / optimistic queries / fewer queries 

Cons 
- a little more complex to setup 
- needs an understanding of the whole project's needs to architect successfully
