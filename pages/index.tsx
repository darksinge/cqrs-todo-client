import React, { useState, useEffect, useMemo } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import LinearProgress from '@mui/material/LinearProgress'
import { Priority, Todo } from './api/todos'
import AddTodo from '../components/AddTodo'
import TodoList from '../components/TodoList'
import DoneTodoList from '../components/DoneTodoList'
import ArchivedTodoList from '../components/ArchivedTodoList'
import cuid from 'cuid'

import partition from 'lodash/partition'

const sleep = () => new Promise(resolve => setTimeout(resolve, 3000))

const defaultFetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
}

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [requestCount, setRequestCount] = useState(0)
  const loading = useMemo(() => requestCount > 0, [requestCount])
  const [errors, setErrors] = useState<Error[]>([])
  const [defaultPriority, setDefaultPriority] = useState<Priority>('low')
  const { doneTodos, inProgressTodos, archivedTodos } = useMemo(() => {
    const [done, inProgressTodos] = partition(todos, 'done')

    const [archivedTodos, doneTodos] = partition(done, 'archived')
    return {
      doneTodos,
      inProgressTodos,
      archivedTodos,
    }
  }, [todos])

  const increaseRequestCount = () => {
    // console.log('increasing request count')
    setRequestCount(requestCount + 1)
  }

  const decreaseRequestCount = () => {
    // console.log('decreasing request count')
    setRequestCount(Math.max(0, requestCount - 1))
  }

  useEffect(() => {
    increaseRequestCount()
    fetch('/api/todos', {
      ...defaultFetchConfig,
    })
      .then(res => res.json())
      .then(data => {
        setTodos(data.todos)
      })
      .finally(() => decreaseRequestCount())
  }, [])

  const handleApiError = (e: Error) => {
    console.error(e)
    setErrors([...errors, e])
  }

  const onAddTodo = (payload: Omit<Todo, 'id'>) => {
    const todo: Todo = {
      ...payload,
      id: cuid.slug(),
    }

    increaseRequestCount()
    fetch('/api/todos', {
      ...defaultFetchConfig,
      method: 'POST',
      body: JSON.stringify(todo),
    })
      .then(res => res.json())
      .then(data => data.todo)
      .then(todo => {
        setTodos([...todos, todo])
      })
      .catch(handleApiError)
      .finally(() => decreaseRequestCount())
  }

  const onDeleteTodo = (todo: Todo) => {
    const index = todos.findIndex(t => t.id === todo.id)
    if (index > -1) {
      todos.splice(index, 1)
      setTodos([...todos])
      increaseRequestCount()
      fetch(`/api/todos/${todo.id}`, {
        ...defaultFetchConfig,
        method: 'DELETE',
      })
        .catch(handleApiError)
        .finally(() => decreaseRequestCount())
    }
  }

  const onUpdateTodo = (todo: Todo) => {
    const index = todos.findIndex(t => t.id === todo.id)
    if (index > -1) {
      todos[index] = todo
      setTodos([...todos])
      increaseRequestCount()
      fetch(`/api/todos/${todo.id}`, {
        ...defaultFetchConfig,
        method: 'PUT',
        body: JSON.stringify(todo),
      })
        .then(res => res.json())
        .then(({ todo, revision }) => {
          if (revision) {
            return pollTodoByRevision(todo.id, revision)
          } else {
            todos[index] = todo
            setTodos([...todos])
          }
        })
        .then(todo => {
          if (todo) {
            todos[index] = todo
            setTodos([...todos])
          }
        })
        .finally(() => decreaseRequestCount())
    }
  }

  const pollTodoByRevision = async (
    id: string,
    revision: string | number,
    retryCount: number = 0,
  ): Promise<Todo> => {
    if (retryCount > 10) {
      throw new Error(`Failed to get updated todo by revision: ${revision}`)
    }

    const res = await fetch(`/api/todos/${id}?revision=${revision}`, {
      ...defaultFetchConfig,
      method: 'GET',
    })

    if (res.status === 404) {
      await sleep()
      return pollTodoByRevision(id, revision, retryCount + 1)
    }

    const { todo }: { todo: Todo } = await res.json()
    console.log('todo from polling:', todo)
    return todo
  }

  const onArchiveTodo = (todo: Todo) => {
    const index = todos.findIndex(t => t.id === todo.id)
    const archiveTodo: () => Promise<Todo> = async () => {
      todos[index] = todo
      setTodos([...todos])
      increaseRequestCount()
      const {
        header: { revision },
      } = await fetch(`/api/todos/${todo.id}/archive`, {
        ...defaultFetchConfig,
        method: 'GET',
      })
        .then(res => res.json())
        .then(data => data.event)

      const todo_: Todo = await pollTodoByRevision(todo.id, revision)
      console.log('todo archived:', todo_)
      return todo_
    }

    if (index > -1) {
      archiveTodo()
        .then(todo => {
          todos[index] = todo
          setTodos([...todos])
        })
        .finally(() => decreaseRequestCount())
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
          {errors.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                margin: 1,
                padding: 1,
              }}>
              <Box
                sx={theme => ({
                  typography: 'body1',
                  color: theme.palette.warning.main,
                })}>
                {JSON.stringify(errors, null, 3)}
              </Box>
            </Paper>
          )}
          <Paper
            elevation={3}
            sx={{
              margin: 1,
              padding: 1,
            }}>
            <Stack>
              {loading ? (
                <LinearProgress />
              ) : (
                <Box sx={{ height: '4px', width: '100%' }} />
              )}
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
