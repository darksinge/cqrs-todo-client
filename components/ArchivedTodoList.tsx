import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteForever from '@mui/icons-material/DeleteForever'
import Unarchive from '@mui/icons-material/Unarchive'
import Inventory2 from '@mui/icons-material/Inventory2'
import Redo from '@mui/icons-material/Redo'
import Check from '@mui/icons-material/Check'

import { Todo } from '../pages/api/todos'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'

export default function DoneTodoList({
  todos,
  onRedoTodo,
  onDeleteTodo,
}: {
  todos: Todo[]
  onRedoTodo: (todo: Todo) => void
  onDeleteTodo: (todo: Todo) => void
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
                onClick={() => {
                  onRedoTodo({ ...todo })
                }}>
                <Unarchive />
              </IconButton>
              <IconButton
                color="warning"
                onClick={() => {
                  onDeleteTodo({ ...todo })
                }}>
                <DeleteForever />
              </IconButton>
            </>
          }>
          <ListItemAvatar>
            <Avatar>
              <Inventory2 />
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
