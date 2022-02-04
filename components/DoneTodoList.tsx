import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Archive from '@mui/icons-material/Archive'
import Redo from '@mui/icons-material/Redo'
import Check from '@mui/icons-material/Check'

import { Todo } from '../pages/api/todos'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'

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
          <ListItemAvatar>
            <Avatar>
              <Check />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={todo.text}
            secondary={`${todo.priority} priority`}
          />
        </ListItem>
      ))}
    </List>
  )
}
