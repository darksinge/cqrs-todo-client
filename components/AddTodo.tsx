import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Add from '@mui/icons-material/Add'
import { Priority, Todo } from '../pages/api/todos'
import PrioritySelect from './PrioritySelect'

export default function AddTodo({
  onAddTodo,
  todos,
  defaultPriority,
  setDefaultPriority,
}: {
  onAddTodo: Function
  todos: Todo[]
  defaultPriority: Priority
  setDefaultPriority: (p: Priority) => void
}) {
  const [text, setText] = useState('')

  const addTodo = () => {
    if (text) {
      const todo: Todo = {
        id: todos.length,
        text,
        priority: 'low',
        done: false,
      }
      onAddTodo(todo)
      setText('')
    }
  }

  return (
    <>
      <Box sx={{ typography: 'h5', margin: 1 }}>Add TODO</Box>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <TextField
          id="add-todo"
          label="Add TODO"
          variant="outlined"
          sx={{ flex: 1, margin: 1 }}
          onChange={e => setText(e.target.value)}
          value={text}
          placeholder="Add new todo"
        />
        <PrioritySelect
          defaultPriority={defaultPriority}
          setDefaultPriority={setDefaultPriority}
        />
        <IconButton
          sx={theme => ({
            margin: 2,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          })}
          onClick={() => addTodo()}>
          <Add />
        </IconButton>
      </Box>
    </>
  )
}
