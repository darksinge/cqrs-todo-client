// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const TODO_SERVICE_URI = process.env.TODO_SERVICE_URI
// 'https://qmn7g53xxg.execute-api.us-east-1.amazonaws.com'

export type Priority = 'low' | 'medium' | 'high'

export type Todo = {
  id: string
  text: string
  priority: Priority
  done?: boolean
  archived?: boolean
}

type BadRequestResponse = {
  message: string
}

type GetResponse = {
  todos: Todo[]
}

type CreateResponse = {
  todo?: Todo
}

type Response = GetResponse | CreateResponse | BadRequestResponse

export const todos: Todo[] = [
  {
    text: 'clean bedroom',
    priority: 'low',
  },
  {
    text: 'grocery shopping',
    priority: 'medium',
  },
  {
    text: 'learn Rust',
    priority: 'high',
  },
  {
    text: 'make todo app',
    priority: 'high',
    done: true,
  },
  {
    text: 'sleep',
    priority: 'high',
    done: true,
    archived: true,
  },
].map<Todo>((todo, i) => {
  return {
    id: `${i}`,
    ...todo,
  } as Todo
})

function create(todo: Todo): Promise<Todo> {
  return fetch(`${TODO_SERVICE_URI}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todo),
  })
    .then(res => res.json())
    .then(data => data.event.payload.initialState)
}

function getAll(): Promise<Todo[]> {
  return fetch(`${TODO_SERVICE_URI}/todos`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(res => res.json())
    .then(data => data.todos)
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  switch (req.method) {
    case 'POST': {
      const todo = await create(req.body)
      return res.status(200).json({ todo })
    }
    case 'GET': {
      const todos = await getAll()
      return res.status(200).json({ todos })
    }
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
