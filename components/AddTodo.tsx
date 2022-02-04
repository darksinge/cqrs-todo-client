import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Add from '@mui/icons-material/Add'
import { Todo } from '../pages/api/todos'

export default function AddTodo({
  onAddTodo,
  todos,
}: {
  onAddTodo: Function
  todos: Todo[]
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
        <IconButton
          color="primary"
          sx={{ margin: 1 }}
          onClick={() => addTodo()}>
          <Add />
        </IconButton>
      </Box>
    </>
  )
}
