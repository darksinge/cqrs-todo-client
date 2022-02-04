import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import Archive from '@mui/icons-material/Archive'
import Redo from '@mui/icons-material/Redo'

import { Priority, Todo } from '../pages/api/todos'
import { priorityChoices } from './PrioritySelect'

export default function DoneTodoList({
  todos,
  deleteTodo,
  onUpdateTodo,
  onArchiveTodo,
  onRedoTodo,
}: {
  todos: Todo[]
  deleteTodo: (todo: Todo) => void
  onUpdateTodo: (todo: Todo) => void
  onArchiveTodo: (todo: Todo) => void
  onRedoTodo: (todo: Todo) => void
}) {
  return (
    <List>
      {todos.map((todo, i) => (
        <ListItem key={todo.id}>
          <ListItemButton
            onClick={() => {
              onUpdateTodo({
                ...todo,
                done: !todo.done,
              })
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
          <IconButton
            color="primary"
            sx={{ margin: 1 }}
            onClick={() => {
              onArchiveTodo({
                ...todo,
                archived: true,
              })
            }}>
            <Redo />
          </IconButton>
          <IconButton
            color="primary"
            sx={{ margin: 1 }}
            onClick={() => {
              onRedoTodo({ ...todo })
            }}>
            <Archive />
          </IconButton>
          <IconButton
            color="primary"
            sx={{ margin: 1 }}
            onClick={() => deleteTodo(todo)}>
            <Delete />
          </IconButton>
        </ListItem>
      ))}
    </List>
  )
}
