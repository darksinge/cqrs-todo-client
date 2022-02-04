import React, { useState, useEffect, useMemo } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { Priority, Todo } from './api/todos'
import AddTodo from '../components/AddTodo'
import TodoList from '../components/TodoList'
import DoneTodoList from '../components/DoneTodoList'
import ArchivedTodoList from '../components/ArchivedTodoList'

import partition from 'lodash/partition'

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [defaultPriority, setDefaultPriority] = useState<Priority>('low')
  const { doneTodos, inProgressTodos, archivedTodos } = useMemo(() => {
    const [done, inProgressTodos] = partition(todos, 'done')

    const [archivedTodos, doneTodos] = partition(done, 'archived')
    console.log('doneTodos', doneTodos)
    console.log('archivedTodos', archivedTodos)
    console.log('inProgressTodos', inProgressTodos)
    return {
      doneTodos,
      inProgressTodos,
      archivedTodos,
    }
  }, [todos])

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => {
        setTodos(data.todos)
      })
  }, [])

  const onAddTodo = (todo: Omit<Todo, 'id'>) => {
    setTodos([
      ...todos,
      {
        ...todo,
        id: todos.length,
      } as Todo,
    ])
  }

  const onDeleteTodo = (todo: Todo) => {
    const index = todos.findIndex(t => t.id === todo.id)
    if (index > -1) {
      todos.splice(index, 1)
      setTodos([...todos])
    }
  }

  const onUpdateTodo = (todo: Todo) => {
    const index = todos.findIndex(t => t.id === todo.id)
    if (index > -1) {
      todos[index] = todo
      setTodos([...todos])
    }
  }

  const onArchiveTodo = (todo: Todo) => {
    const index = todos.findIndex(t => t.id === todo.id)
    if (index > -1) {
      todos[index] = {
        ...todo,
        archived: true,
      }
      setTodos([...todos])
    }
  }

  const onRedoTodo = (todo: Todo) => {
    onUpdateTodo({
      ...todo,
      archived: false,
      done: false,
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Container>
          <Paper
            elevation={3}
            sx={{
              margin: 1,
              padding: 1,
            }}>
            <Stack>
              <AddTodo
                todos={todos}
                onAddTodo={onAddTodo}
                defaultPriority={defaultPriority}
                setDefaultPriority={setDefaultPriority}
              />
              <TodoList
                todos={inProgressTodos}
                onDeleteTodo={onDeleteTodo}
                onUpdateTodo={onUpdateTodo}
              />
            </Stack>
          </Paper>
          {doneTodos.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                marginY: 8,
                marginX: 1,
                padding: 1,
              }}>
              <Stack>
                <Box sx={{ typography: 'h5', margin: 1 }}>Completed</Box>
                <DoneTodoList
                  todos={doneTodos}
                  onArchiveTodo={onArchiveTodo}
                  onRedoTodo={onRedoTodo}
                />
              </Stack>
            </Paper>
          )}

          {archivedTodos.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                marginY: 8,
                marginX: 1,
                padding: 1,
              }}>
              <Stack>
                <Box sx={{ typography: 'h5', margin: 1 }}>Archived</Box>
                <ArchivedTodoList
                  todos={archivedTodos}
                  onDeleteTodo={onDeleteTodo}
                  onRedoTodo={onRedoTodo}
                />
              </Stack>
            </Paper>
          )}
        </Container>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  )
}

export default Home
