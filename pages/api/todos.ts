// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export type Priority = 'low' | 'medium' | 'high'

export type Todo = {
  id: number
  text: string
  priority: Priority
  done?: boolean
  archived?: boolean
}

type GetTodoResponse = {
  todos: Todo[]
}

const todos: Todo[] = [
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
    id: i,
    ...todo,
  } as Todo
})

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetTodoResponse>,
) {
  res.status(200).json({ todos })
}
