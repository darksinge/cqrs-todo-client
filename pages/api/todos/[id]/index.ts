// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { todos, Todo } from '../../todos'

const TODO_SERVICE_URI = process.env.TODO_SERVICE_URI

const headers = {
  'Content-Type': 'application/json',
}

type ErrorResponse = {
  message: string
}

type GetResponse = {
  todo?: Todo
}

type UpdateResponse = {
  todo?: Todo
}

type Response = GetResponse | ErrorResponse | UpdateResponse | undefined

async function update(todo: Todo): Promise<Todo> {
  return fetch(`${TODO_SERVICE_URI}/todos/${todo.id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(todo),
  })
    .then(res => res.json())
    .then(data => data.todo)
}

async function get(id: string, revision?: string): Promise<Todo | undefined> {
  return fetch(
    `${TODO_SERVICE_URI}/todos/${id}?${revision ? `revision=${revision}` : ''}`,
    {
      headers,
    },
  ).then(res => res.json())
}

async function deleteTodo(id: string): Promise<void> {
  await fetch(`${TODO_SERVICE_URI}/todos/${id}`, {
    method: 'DELETE',
    headers,
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const {
    method,
    query: { id, revision },
  } = req

  switch (method) {
    case 'GET': {
      const todo =
        'revision' in req.query
          ? await get(id as string, `${revision}`)
          : await get(id as string)

      if (todo) {
        return res.status(200).json({ todo })
      } else {
        return res.status(404).json({ message: 'Not Found' })
      }
    }
    case 'PUT':
    case 'POST': {
      const todo = await update(req.body)
      return res.status(200).json({ todo })
    }
    case 'DELETE': {
      await deleteTodo(id as string)
      return res.status(204).end()
    }

    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
