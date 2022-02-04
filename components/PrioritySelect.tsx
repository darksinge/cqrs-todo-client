import React, { useState, useEffect } from 'react'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Priority, Todo } from '../pages/api/todos'

export const priorityChoices: Priority[] = ['high', 'medium', 'low']

export default function PrioritySelect({
  defaultPriority,
  setDefaultPriority,
}: {
  defaultPriority: Priority
  setDefaultPriority: (p: Priority) => void
}) {
  return (
    <FormControl sx={{ width: 125, margin: 1 }}>
      <InputLabel id="demo-simple-select-label">Priority</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={defaultPriority}
        label="Priority"
        onChange={v => setDefaultPriority(v.target.value as Priority)}>
        {priorityChoices.map(choice => (
          <MenuItem key={choice} value={choice}>
            {choice}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
