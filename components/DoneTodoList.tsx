import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Archive from '@mui/icons-material/Archive'
import Redo from '@mui/icons-material/Redo'
import Check from '@mui/icons-material/Check'
import Checkbox from '@mui/material/Checkbox'
import ListItemIcon from '@mui/material/ListItemIcon'

import { Todo } from '../pages/api/todos'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import { ListItemButton } from '@mui/material'

export default function DoneTodoList({
  todos,
  onArchiveTodo,
  onRedoTodo,
}: {
  todos: Todo[]
  onArchiveTodo: (todo: Todo) => void
  onRedoTodo: (todo: Todo) => void
}) {
  return (
    <List>
      {todos.map((todo, i) => (
        <ListItem
          key={todo.id}
          secondaryAction={
            <>
              <IconButton
                color="primary"
                sx={{ margin: 1 }}
                onClick={() => {
                  onRedoTodo({ ...todo })
                }}>
                <Redo />
              </IconButton>
              <IconButton
                color="primary"
                sx={{ margin: 1 }}
                onClick={() => {
                  onArchiveTodo({ ...todo })
                }}>
                <Archive />
              </IconButton>
            </>
          }>
          <ListItemButton>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={true}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText
              primary={todo.text}
              secondary={`${todo.priority} priority`}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
