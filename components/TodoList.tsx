import React, { useState } from 'react'
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

const priorityChoices: Priority[] = ['high', 'medium', 'low']

export default function TodoList({
  todos,
  setTodos,
}: {
  todos: Todo[]
  setTodos: (todos: Todo[]) => void
}) {
  return (
    <List>
      {todos.map((todo, i) => (
        <ListItem key={todo.id}>
          <ListItemButton
            onClick={() => {
              const todos_ = JSON.parse(JSON.stringify(todos))
              todos_[i].done = !todos_[i].done
              setTodos(todos_)
            }}
            dense>
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
            <InputLabel id="demo-simple-select-label">Priority</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={todo.priority}
              label="Priority"
              onChange={v => {
                const todos_ = JSON.parse(JSON.stringify(todos))
                todos_[i].priority = v.target.value as Priority
                setTodos(todos_)
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
            onClick={() => {
              const todos_: Todo[] = JSON.parse(JSON.stringify(todos))
              todos_.splice(i, 1)
              setTodos(todos_)
            }}>
            <Delete />
          </IconButton>
        </ListItem>
      ))}
    </List>
  )
}
