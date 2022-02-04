import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Delete from '@mui/icons-material/Delete'

import { Priority, Todo } from '../pages/api/todos'
import { priorityChoices } from './PrioritySelect'

export default function TodoList({
  todos,
  onDeleteTodo,
  onUpdateTodo,
}: {
  todos: Todo[]
  onDeleteTodo: (todo: Todo) => void
  onUpdateTodo: (todo: Todo) => void
}) {
  return (
    <List>
      {todos.map((todo, i) => (
        <ListItem key={todo.id}>
          <ListItemButton
            onClick={() => {
              todo.done = !todo.done
              onUpdateTodo(todo)
            }}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={todo?.done ?? false}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText id={`${todo.id}`}>{todo.text}</ListItemText>
          </ListItemButton>
          <FormControl sx={{ width: 125 }}>
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Select
              labelId="priority-select-label"
              id="priority-select"
              value={todo.priority}
              label="Priority"
              onChange={e => {
                onUpdateTodo({
                  ...todo,
                  priority: e.target.value as Priority,
                })
              }}>
              {priorityChoices.map(choice => (
                <MenuItem key={choice} value={choice}>
                  {choice}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton
            color="primary"
            sx={{ margin: 1 }}
            onClick={() => onDeleteTodo(todo)}>
            <Delete />
          </IconButton>
        </ListItem>
      ))}
    </List>
  )
}
